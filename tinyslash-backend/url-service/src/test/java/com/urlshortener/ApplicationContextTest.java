package com.urlshortener;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import static org.junit.jupiter.api.Assertions.assertNotNull;

public class ApplicationContextTest extends AbstractIntegrationTest {

  @Autowired
  private ApplicationContext context;

  @Test
  void contextLoads() {
    assertNotNull(context, "Application Context should not be null");
  }
}
