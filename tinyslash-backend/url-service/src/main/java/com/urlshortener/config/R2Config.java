package com.urlshortener.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;

import java.net.URI;

@Configuration
public class R2Config {

  @Value("${R2_ACCESS_KEY_ID:}")
  private String accessKeyId;

  @Value("${R2_SECRET_ACCESS_KEY:}")
  private String secretAccessKey;

  @Value("${R2_ENDPOINT:}")
  private String endpoint;

  @Bean
  public S3Client s3Client() {
    if (accessKeyId == null || accessKeyId.isEmpty() ||
        secretAccessKey == null || secretAccessKey.isEmpty() ||
        endpoint == null || endpoint.isEmpty()) {
      return null; // Return null if not configured, handle gracefully in service
    }

    AwsBasicCredentials credentials = AwsBasicCredentials.create(accessKeyId, secretAccessKey);

    return S3Client.builder()
        .endpointOverride(URI.create(endpoint))
        .credentialsProvider(StaticCredentialsProvider.create(credentials))
        .region(Region.US_EAST_1) // R2 uses auto/us-east-1 strictly for API compatibility
        .serviceConfiguration(S3Configuration.builder()
            .pathStyleAccessEnabled(true)
            .build())
        .build();
  }
}
