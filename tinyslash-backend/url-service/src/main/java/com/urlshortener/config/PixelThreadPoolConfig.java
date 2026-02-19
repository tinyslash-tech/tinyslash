package com.urlshortener.config;

import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;
import java.util.concurrent.ThreadPoolExecutor;

@Configuration
@EnableAsync
public class PixelThreadPoolConfig {

  @Autowired
  private MeterRegistry meterRegistry;

  @Bean(name = "pixelExecutor")
  public Executor pixelExecutor() {
    ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
    executor.setCorePoolSize(10); // Always-ready threads
    executor.setMaxPoolSize(50); // Burst capacity
    executor.setQueueCapacity(1000); // Queue pending pixel fires
    executor.setThreadNamePrefix("pixel-firing-");

    // AbortPolicy: reject excess tasks rather than silently block main thread
    executor.setRejectedExecutionHandler(new ThreadPoolExecutor.AbortPolicy());

    executor.initialize();

    // P3: Queue depth monitoring — exposes backpressure to Micrometer/Actuator
    // Detects: thread starvation, silent overload, queue saturation
    ThreadPoolExecutor tpe = executor.getThreadPoolExecutor();

    meterRegistry.gauge("pixel.executor.queue.size",
        tpe,
        e -> (double) e.getQueue().size());

    meterRegistry.gauge("pixel.executor.active.count",
        tpe,
        e -> (double) e.getActiveCount());

    meterRegistry.gauge("pixel.executor.pool.size",
        tpe,
        e -> (double) e.getPoolSize());

    meterRegistry.gauge("pixel.executor.completed.tasks",
        tpe,
        e -> (double) e.getCompletedTaskCount());

    return executor;
  }
}
