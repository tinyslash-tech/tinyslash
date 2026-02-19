package com.urlshortener;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
@ActiveProfiles("test")
public abstract class AbstractIntegrationTest {

  @Container
  static MongoDBContainer mongoDBContainer = new MongoDBContainer(DockerImageName.parse("mongo:6.0"));

  @Container
  static GenericContainer<?> redisContainer = new GenericContainer<>(DockerImageName.parse("redis:7.0"))
      .withExposedPorts(6379);

  @DynamicPropertySource
  static void dynamicProperties(DynamicPropertyRegistry registry) {
    // Mongo
    registry.add("spring.data.mongodb.uri", mongoDBContainer::getReplicaSetUrl);

    // Redis
    registry.add("spring.data.redis.host", redisContainer::getHost);
    registry.add("spring.data.redis.port", () -> redisContainer.getMappedPort(6379));
  }
}
