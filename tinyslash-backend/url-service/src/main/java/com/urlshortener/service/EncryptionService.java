package com.urlshortener.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.security.MessageDigest;
import java.util.Arrays;

@Service
public class EncryptionService {

  private static final String ALGORITHM = "AES";

  @Value("${AES_SECRET_KEY:default_dev_secret_key_change_in_prod}")
  private String secretKey;

  public String encrypt(String value) {
    if (value == null)
      return null;
    try {
      SecretKeySpec secretKeySpec = getKey(secretKey);
      Cipher cipher = Cipher.getInstance(ALGORITHM);
      cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec);
      byte[] encrypted = cipher.doFinal(value.getBytes(StandardCharsets.UTF_8));
      return Base64.getEncoder().encodeToString(encrypted);
    } catch (Exception e) {
      throw new RuntimeException("Error while encrypting: " + e.toString(), e);
    }
  }

  public String decrypt(String encrypted) {
    if (encrypted == null)
      return null;
    try {
      SecretKeySpec secretKeySpec = getKey(secretKey);
      Cipher cipher = Cipher.getInstance(ALGORITHM);
      cipher.init(Cipher.DECRYPT_MODE, secretKeySpec);
      byte[] original = cipher.doFinal(Base64.getDecoder().decode(encrypted));
      return new String(original, StandardCharsets.UTF_8);
    } catch (Exception e) {
      throw new RuntimeException("Error while decrypting: " + e.toString(), e);
    }
  }

  private SecretKeySpec getKey(String myKey) {
    try {
      byte[] key = myKey.getBytes(StandardCharsets.UTF_8);
      MessageDigest sha = MessageDigest.getInstance("SHA-256");
      key = sha.digest(key);
      key = Arrays.copyOf(key, 16); // Use 128 bit key for simple AES
      return new SecretKeySpec(key, ALGORITHM);
    } catch (Exception e) {
      throw new RuntimeException("Error while generating key: " + e.toString(), e);
    }
  }
}
