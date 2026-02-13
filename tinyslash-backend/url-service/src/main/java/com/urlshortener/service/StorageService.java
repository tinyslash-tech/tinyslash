package com.urlshortener.service;

import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

public interface StorageService {
  String uploadFile(MultipartFile file, String path) throws IOException;

  void deleteFile(String path);

  byte[] downloadFile(String path) throws IOException;

  String getPublicUrl(String path);
}
