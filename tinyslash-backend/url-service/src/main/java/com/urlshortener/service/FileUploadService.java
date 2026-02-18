package com.urlshortener.service;

import com.urlshortener.model.UploadedFile;
import com.urlshortener.model.User;
import com.urlshortener.repository.UploadedFileRepository;
import com.urlshortener.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;
import java.util.zip.GZIPOutputStream;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import javax.imageio.ImageIO;
import java.io.ByteArrayOutputStream;

@Service
public class FileUploadService {

    private static final Logger logger = LoggerFactory.getLogger(FileUploadService.class);

    private final UploadedFileRepository uploadedFileRepository;
    private final UserRepository userRepository;
    private final StorageService storageService;
    private final CacheService cacheService;
    private final SubscriptionService subscriptionService;

    @Value("${app.shorturl.domain:https://tinyslash.com}")
    private String shortUrlDomain;

    @Autowired
    public FileUploadService(UploadedFileRepository uploadedFileRepository,
            UserRepository userRepository,
            StorageService storageService,
            CacheService cacheService,
            SubscriptionService subscriptionService) {
        this.uploadedFileRepository = uploadedFileRepository;
        this.userRepository = userRepository;
        this.storageService = storageService;
        this.cacheService = cacheService;
        this.subscriptionService = subscriptionService;
    }

    private static final long MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
    private static final String[] ALLOWED_TYPES = {
            // Images
            "image/jpeg", "image/png", "image/gif", "image/webp",
            // Documents
            "application/pdf", "text/plain",
            "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOC,
                                                                                                             // DOCX
            "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // XLS,
                                                                                                             // XLSX
            "application/vnd.ms-powerpoint",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation", // PPT, PPTX
            // Archives (Optional, but useful)
            "application/zip", "application/x-zip-compressed"
            // EXPLICITLY BLOCKED: .exe, .apk, .js, .jar, .html, .docm, .xlsm via Whitelist
    };

    public UploadedFile uploadFile(MultipartFile file, String userId, String title,
            String description, String password, Integer expirationDays,
            boolean isPublic) throws IOException {

        // Validate file
        validateFile(file);

        // Create file metadata
        UploadedFile uploadedFile = new UploadedFile(
                file.getOriginalFilename(),
                file.getContentType(),
                file.getSize(),
                userId);

        // Set the complete file URL with frontend domain
        String fullFileUrl = shortUrlDomain + "/" + uploadedFile.getFileCode();
        uploadedFile.setFileUrl(fullFileUrl);

        // Set additional properties
        uploadedFile.setTitle(title);
        uploadedFile.setDescription(description);
        uploadedFile.setPublic(isPublic);

        // Set password protection
        if (password != null && !password.trim().isEmpty()) {
            uploadedFile.setPassword(password);
            uploadedFile.setRequiresPassword(true);
        }

        // Set expiration
        if (expirationDays != null && expirationDays > 0) {
            uploadedFile.setExpiresAt(LocalDateTime.now().plusDays(expirationDays));
        }

        // Extract file extension
        String originalFilename = file.getOriginalFilename();
        if (originalFilename != null && originalFilename.contains(".")) {
            String extension = originalFilename.substring(originalFilename.lastIndexOf(".") + 1);
            uploadedFile.setFileExtension(extension.toLowerCase());
        }

        try {
            // We are NOT compressing files here anymore because StorageService handles the
            // stream directly
            // and we want to keep it simple. If compression is needed, it should be done
            // before
            // passing to StorageService or inside an implementation if specific to storage.
            // For now, removing the local compression logic to streamline abstraction.
            // If the user wants compression back, we can add it as a utility before upload.

            // Upload via StorageService
            // We use fileCode as the path/key
            String storageId = storageService.uploadFile(file, uploadedFile.getFileCode());

            uploadedFile.setGridFsFileId(storageId); // Reusing this field to store Storage ID/Key
            uploadedFile.setStoredFileName(uploadedFile.getFileCode());

            // Check if public access URL is available
            String publicUrl = storageService.getPublicUrl(uploadedFile.getFileCode());
            if (publicUrl != null) {
                // If R2/S3 public access is enabled, use that URL
                uploadedFile.setFileUrl(publicUrl);
                logger.info("Using public URL for file: {}", publicUrl);
            }

            // Save metadata to database
            UploadedFile saved = uploadedFileRepository.save(uploadedFile);

            // Update user statistics
            if (userId != null) {
                updateUserStats(userId);
                subscriptionService.incrementFileUsage(userId);
                // Invalidate user files cache
                cacheService.clearCache("userFiles", userId);
            }

            logger.info("Uploaded file: {} for user: {}", saved.getFileCode(), userId);

            return saved;

        } catch (IOException e) {
            throw new RuntimeException("Failed to store file: " + e.getMessage());
        }
    }

    public Optional<UploadedFile> getFileByCode(String fileCode) {
        return uploadedFileRepository.findByFileCode(fileCode);
    }

    public Resource getFileContent(String fileCode) {
        Optional<UploadedFile> fileOpt = uploadedFileRepository.findByFileCode(fileCode);

        if (fileOpt.isEmpty()) {
            throw new RuntimeException("File not found");
        }

        UploadedFile file = fileOpt.get();

        // Check if file is expired
        if (file.getExpiresAt() != null && file.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("File has expired");
        }

        try {
            // Get file content from StorageService
            // Using fileCode as key because that's what we used on upload
            byte[] content = storageService.downloadFile(fileCode);

            return new ByteArrayResource(content);
        } catch (IOException e) {
            throw new RuntimeException("Failed to retrieve file content: " + e.getMessage());
        }
    }

    @Cacheable(value = "userFiles", key = "#userId")
    public List<UploadedFile> getUserFiles(String userId) {
        logger.debug("Fetching files for user: {}", userId);
        return uploadedFileRepository.findByUserIdAndIsActiveTrue(userId);
    }

    public List<UploadedFile> getAllFiles() {
        logger.debug("Fetching all files for admin");
        return uploadedFileRepository.findAll();
    }

    public UploadedFile updateFile(String fileCode, String userId, UploadedFile updates) {
        Optional<UploadedFile> existingOpt = uploadedFileRepository.findByFileCode(fileCode);

        if (existingOpt.isEmpty()) {
            throw new RuntimeException("File not found");
        }

        UploadedFile existing = existingOpt.get();

        // Check ownership
        if (!existing.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized to update this file");
        }

        // Update fields
        if (updates.getTitle() != null)
            existing.setTitle(updates.getTitle());
        if (updates.getDescription() != null)
            existing.setDescription(updates.getDescription());
        if (updates.getPassword() != null) {
            existing.setPassword(updates.getPassword());
            existing.setRequiresPassword(!updates.getPassword().trim().isEmpty());
        }
        if (updates.getExpiresAt() != null)
            existing.setExpiresAt(updates.getExpiresAt());
        if (updates.getCategory() != null)
            existing.setCategory(updates.getCategory());
        if (updates.getShortUrl() != null) {
            existing.setShortUrl(updates.getShortUrl());
            existing.setHasShortUrl(true);
        }

        existing.setUpdatedAt(LocalDateTime.now());

        UploadedFile updated = uploadedFileRepository.save(existing);

        // Invalidate relevant caches
        cacheService.clearCache("userFiles", userId);

        logger.info("Updated file: {} for user: {}", fileCode, userId);

        return updated;
    }

    public void deleteFile(String fileCode, String userId) {
        Optional<UploadedFile> existingOpt = uploadedFileRepository.findByFileCode(fileCode);

        if (existingOpt.isEmpty()) {
            throw new RuntimeException("File not found");
        }

        UploadedFile existing = existingOpt.get();

        // Check ownership
        if (!existing.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized to delete this file");
        }

        // Delete from Storage
        storageService.deleteFile(fileCode);

        // Hard delete from database - actually remove the record
        uploadedFileRepository.delete(existing);

        // Invalidate relevant caches
        cacheService.clearCache("userFiles", userId);

        logger.info("Permanently deleted file: {} for user: {}", fileCode, userId);
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new RuntimeException("File size exceeds maximum limit of 50MB");
        }

        String contentType = file.getContentType();
        if (contentType == null) {
            throw new RuntimeException("Unable to determine file type");
        }

        boolean isAllowed = false;
        for (String allowedType : ALLOWED_TYPES) {
            if (contentType.equals(allowedType)) {
                isAllowed = true;
                break;
            }
        }

        if (!isAllowed) {
            throw new com.urlshortener.exception.SecurityViolationException(
                    "blocked_file_type_" + contentType,
                    100,
                    "TS-BLOCK-002");
        }
    }

    private void updateUserStats(String userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setTotalFiles(user.getTotalFiles() + 1);
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);
        }
    }

    private void updateFileStats(UploadedFile file) {
        file.setTotalDownloads(file.getTotalDownloads() + 1);
        file.setLastAccessedAt(LocalDateTime.now());
        uploadedFileRepository.save(file);
    }

    public void recordDownload(String fileCode, String ipAddress, String userAgent,
            String country, String city, String deviceType) {
        Optional<UploadedFile> fileOpt = uploadedFileRepository.findByFileCode(fileCode);

        if (fileOpt.isPresent()) {
            UploadedFile file = fileOpt.get();

            // Update download statistics
            file.setTotalDownloads(file.getTotalDownloads() + 1);
            file.setLastAccessedAt(LocalDateTime.now());

            // Update geographic data
            if (country != null) {
                file.getDownloadsByCountry().merge(country, 1, Integer::sum);
            }
            if (city != null) {
                file.getDownloadsByCity().merge(city, 1, Integer::sum);
            }

            // Update device data
            if (deviceType != null) {
                file.getDownloadsByDevice().merge(deviceType, 1, Integer::sum);
            }

            // Update time-based data
            LocalDateTime now = LocalDateTime.now();
            String hourKey = String.valueOf(now.getHour());
            String dayKey = now.getDayOfWeek().toString();

            file.getDownloadsByHour().merge(hourKey, 1, Integer::sum);
            file.getDownloadsByDay().merge(dayKey, 1, Integer::sum);

            uploadedFileRepository.save(file);

            // Invalidate user analytics cache
            cacheService.invalidateUserAnalytics(file.getUserId());

            logger.debug("Recorded download for file: {}", fileCode);
        }
    }
}