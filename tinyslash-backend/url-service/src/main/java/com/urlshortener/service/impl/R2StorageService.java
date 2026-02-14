package com.urlshortener.service.impl;

import com.urlshortener.service.StorageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;

@Service("r2StorageService")
@ConditionalOnProperty(name = "FILE_STORAGE_TYPE", havingValue = "r2")
public class R2StorageService implements StorageService {

  private static final Logger logger = LoggerFactory.getLogger(R2StorageService.class);

  @Autowired(required = false)
  private S3Client s3Client;

  @Value("${R2_BUCKET_NAME}")
  private String bucketName;

  @Value("${R2_PUBLIC_DOMAIN:}")
  private String publicDomain;

  @Override
  public String uploadFile(MultipartFile file, String path) throws IOException {
    if (s3Client == null) {
      throw new IllegalStateException("R2 S3Client is not configured. Check your credentials.");
    }

    try {
      PutObjectRequest putOb = PutObjectRequest.builder()
          .bucket(bucketName)
          .key(path)
          .contentType(file.getContentType())
          .build();

      s3Client.putObject(putOb, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

      logger.info("Uploaded file to R2: {}", path);
      return path;
    } catch (Exception e) {
      logger.error("Error uploading file to R2: {}", e.getMessage());
      throw new IOException("Failed to upload file to storage", e);
    }
  }

  @Override
  public void deleteFile(String path) {
    if (s3Client == null)
      return;

    try {
      DeleteObjectRequest deleteOb = DeleteObjectRequest.builder()
          .bucket(bucketName)
          .key(path)
          .build();

      s3Client.deleteObject(deleteOb);
      logger.info("Deleted file from R2: {}", path);
    } catch (Exception e) {
      logger.error("Error deleting file from R2: {}", e.getMessage());
    }
  }

  @Override
  public byte[] downloadFile(String path) throws IOException {
    if (s3Client == null) {
      throw new IllegalStateException("R2 S3Client is not configured.");
    }

    try {
      GetObjectRequest getOb = GetObjectRequest.builder()
          .bucket(bucketName)
          .key(path)
          .build();

      return s3Client.getObject(getOb).readAllBytes();
    } catch (Exception e) {
      logger.error("Error downloading file from R2: {}", e.getMessage());
      throw new IOException("Failed to download file from storage", e);
    }
  }

  @Override
  public String getPublicUrl(String path) {
    if (publicDomain != null && !publicDomain.isEmpty()) {
      String domain = publicDomain.endsWith("/") ? publicDomain.substring(0, publicDomain.length() - 1) : publicDomain;
      return domain + "/" + path;
    }
    return null;
  }
}
