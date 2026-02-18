package com.urlshortener.service;

import com.maxmind.geoip2.DatabaseReader;
import com.maxmind.geoip2.exception.GeoIp2Exception;
import com.maxmind.geoip2.model.CityResponse;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.*;
import java.net.InetAddress;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.*;
import java.util.HashMap;
import java.util.Map;

/**
 * GeoIP Service using MaxMind GeoLite2 City Database.
 *
 * Resolves IP addresses to country, region (state), and city.
 * Returns data like: India / Maharashtra / Mumbai
 *
 * Setup:
 * 1. Sign up at https://www.maxmind.com/en/geolite2/signup
 * 2. Generate a license key from your MaxMind account
 * 3. Set MAXMIND_ACCOUNT_ID and MAXMIND_LICENSE_KEY in your .env
 * 4. Download GeoLite2-City.mmdb and place at ./data/GeoLite2-City.mmdb
 * OR let the service auto-download on startup
 */
@Service
public class GeoIPService {

  private static final Logger logger = LoggerFactory.getLogger(GeoIPService.class);

  @Value("${maxmind.license-key:}")
  private String licenseKey;

  @Value("${maxmind.account-id:}")
  private String accountId;

  @Value("${maxmind.database-path:./data/GeoLite2-City.mmdb}")
  private String databasePath;

  @Value("${maxmind.enabled:true}")
  private boolean enabled;

  private DatabaseReader databaseReader;

  @PostConstruct
  public void init() {
    if (!enabled) {
      logger.info("🌍 GeoIP service is disabled (maxmind.enabled=false)");
      return;
    }

    if (licenseKey == null || licenseKey.isEmpty() || licenseKey.equals("your_license_key_here")) {
      logger.warn("⚠️  MaxMind license key not configured. GeoIP lookups will be disabled.");
      logger.warn("   To enable, set these environment variables:");
      logger.warn("     MAXMIND_ACCOUNT_ID=<your_account_id>");
      logger.warn("     MAXMIND_LICENSE_KEY=<your_license_key>");
      logger.warn("   Sign up free: https://www.maxmind.com/en/geolite2/signup");
      return;
    }

    try {
      File dbFile = new File(databasePath);

      // Auto-download the database if it doesn't exist
      if (!dbFile.exists()) {
        logger.info("📥 GeoLite2-City.mmdb not found at {}. Attempting download...", databasePath);
        downloadDatabase(dbFile);
      }

      if (dbFile.exists()) {
        databaseReader = new DatabaseReader.Builder(dbFile).build();
        logger.info("✅ GeoIP service initialized — database: {}", dbFile.getAbsolutePath());
      } else {
        logger.warn("⚠️  GeoLite2 database not available. GeoIP lookups disabled.");
        logger.warn("   Download manually: https://dev.maxmind.com/geoip/geolite2-free-geolocation-data");
        logger.warn("   Place the .mmdb file at: {}", new File(databasePath).getAbsolutePath());
      }
    } catch (Exception e) {
      logger.error("❌ Failed to initialize GeoIP: {}", e.getMessage());
      logger.warn("   Continuing without geolocation. Analytics will not have geo data.");
    }
  }

  /**
   * Downloads the GeoLite2-City.mmdb using the MaxMind permalink API.
   * The API returns a tar.gz. We extract the .mmdb from it.
   */
  private void downloadDatabase(File targetFile) {
    try {
      targetFile.getParentFile().mkdirs();

      // MaxMind GeoLite2 download permalink
      String downloadUrl = String.format(
          "https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-City&license_key=%s&suffix=tar.gz",
          licenseKey);

      logger.info("📥 Downloading GeoLite2-City database from MaxMind...");

      HttpClient client = HttpClient.newHttpClient();
      HttpRequest request = HttpRequest.newBuilder()
          .uri(URI.create(downloadUrl))
          .build();

      Path tempTarGz = Files.createTempFile("geolite2-", ".tar.gz");
      HttpResponse<Path> response = client.send(request, HttpResponse.BodyHandlers.ofFile(tempTarGz));

      if (response.statusCode() == 200) {
        // Extract .mmdb from tar.gz using built-in GZIPInputStream + manual tar parsing
        extractMmdbFromTarGz(tempTarGz, targetFile.toPath());
        Files.deleteIfExists(tempTarGz);

        if (targetFile.exists()) {
          logger.info("✅ GeoLite2-City.mmdb downloaded to: {}", targetFile.getAbsolutePath());
        }
      } else {
        logger.error("❌ MaxMind download failed with HTTP {}", response.statusCode());
        logger.warn("   Verify your MAXMIND_LICENSE_KEY is correct");
        Files.deleteIfExists(tempTarGz);
      }
    } catch (Exception e) {
      logger.error("❌ Download failed: {}", e.getMessage());
      logger.warn("   Download manually from: https://dev.maxmind.com/geoip/geolite2-free-geolocation-data");
      logger.warn("   Place the GeoLite2-City.mmdb at: {}", targetFile.getAbsolutePath());
    }
  }

  /**
   * Extracts the .mmdb file from a tar.gz archive.
   * Uses only JDK built-in classes (GZIPInputStream + manual tar header parsing).
   */
  private void extractMmdbFromTarGz(Path tarGzPath, Path targetMmdb) throws IOException {
    try (java.util.zip.GZIPInputStream gzis = new java.util.zip.GZIPInputStream(
        new BufferedInputStream(Files.newInputStream(tarGzPath)))) {

      // Tar file format: 512-byte headers followed by file content
      byte[] header = new byte[512];
      while (gzis.read(header) == 512) {
        // File name is in first 100 bytes of header
        String fileName = new String(header, 0, 100).trim().replace("\0", "");
        if (fileName.isEmpty())
          break;

        // File size is at offset 124, 12 bytes, octal
        String sizeStr = new String(header, 124, 12).trim().replace("\0", "");
        long fileSize = 0;
        if (!sizeStr.isEmpty()) {
          try {
            fileSize = Long.parseLong(sizeStr, 8);
          } catch (NumberFormatException e) {
            break;
          }
        }

        if (fileName.endsWith(".mmdb") && fileSize > 0) {
          // Found the .mmdb — read it out
          byte[] content = gzis.readNBytes((int) fileSize);
          Files.write(targetMmdb, content, StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
          logger.info("📦 Extracted {} ({} bytes)", fileName, fileSize);
          return;
        } else {
          // Skip this entry's content (padded to 512-byte boundary)
          long skipBytes = fileSize > 0 ? ((fileSize + 511) / 512) * 512 : 0;
          gzis.skipNBytes(skipBytes);
        }
      }
      logger.warn("⚠️  No .mmdb file found in the downloaded archive.");
    }
  }

  /**
   * Resolves an IP address to geographic location.
   *
   * @return Map with keys: country, countryCode, region, regionCode, city
   *         Returns empty map if lookup fails or service is unavailable
   */
  public Map<String, String> resolveLocation(String ipAddress) {
    Map<String, String> location = new HashMap<>();

    if (databaseReader == null || ipAddress == null || ipAddress.isEmpty()) {
      return location;
    }

    // Skip localhost / private IPs
    if (isPrivateIP(ipAddress)) {
      logger.debug("Skipping GeoIP for private IP: {}", ipAddress);
      return location;
    }

    try {
      InetAddress inetAddress = InetAddress.getByName(ipAddress);
      CityResponse response = databaseReader.city(inetAddress);

      // Country (e.g., "India", "IN")
      if (response.getCountry() != null) {
        if (response.getCountry().getName() != null)
          location.put("country", response.getCountry().getName());
        if (response.getCountry().getIsoCode() != null)
          location.put("countryCode", response.getCountry().getIsoCode());
      }

      // Region / State (e.g., "Maharashtra", "MH")
      if (response.getMostSpecificSubdivision() != null) {
        if (response.getMostSpecificSubdivision().getName() != null)
          location.put("region", response.getMostSpecificSubdivision().getName());
        if (response.getMostSpecificSubdivision().getIsoCode() != null)
          location.put("regionCode", response.getMostSpecificSubdivision().getIsoCode());
      }

      // City (e.g., "Mumbai", "Bangalore", "Delhi")
      if (response.getCity() != null && response.getCity().getName() != null) {
        location.put("city", response.getCity().getName());
      }

      logger.debug("🌍 {} → {}/{}/{}", ipAddress,
          location.getOrDefault("country", "?"),
          location.getOrDefault("region", "?"),
          location.getOrDefault("city", "?"));

    } catch (GeoIp2Exception e) {
      // Address not in database (e.g., private IP) — normal, just debug
      logger.debug("GeoIP miss for {}: {}", ipAddress, e.getMessage());
    } catch (Exception e) {
      logger.warn("GeoIP error for {}: {}", ipAddress, e.getMessage());
    }

    return location;
  }

  /**
   * Check if IP is private / loopback / not routable.
   */
  private boolean isPrivateIP(String ip) {
    return ip.equals("127.0.0.1")
        || ip.equals("0:0:0:0:0:0:0:1")
        || ip.equals("::1")
        || ip.startsWith("10.")
        || ip.startsWith("172.16.") || ip.startsWith("172.17.") || ip.startsWith("172.18.")
        || ip.startsWith("172.19.") || ip.startsWith("172.20.") || ip.startsWith("172.21.")
        || ip.startsWith("172.22.") || ip.startsWith("172.23.") || ip.startsWith("172.24.")
        || ip.startsWith("172.25.") || ip.startsWith("172.26.") || ip.startsWith("172.27.")
        || ip.startsWith("172.28.") || ip.startsWith("172.29.") || ip.startsWith("172.30.")
        || ip.startsWith("172.31.")
        || ip.startsWith("192.168.");
  }

  /**
   * Whether the GeoIP database is loaded and ready.
   */
  public boolean isAvailable() {
    return databaseReader != null;
  }

  @PreDestroy
  public void cleanup() {
    if (databaseReader != null) {
      try {
        databaseReader.close();
        logger.info("GeoIP database reader closed.");
      } catch (Exception e) {
        logger.warn("Error closing GeoIP reader: {}", e.getMessage());
      }
    }
  }
}
