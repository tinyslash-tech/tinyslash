package com.urlshortener.event;

import org.springframework.context.ApplicationEvent;
import com.urlshortener.model.CustomerOrder;

public class OrderCompletedEvent extends ApplicationEvent {
  private final CustomerOrder order;

  public OrderCompletedEvent(Object source, CustomerOrder order) {
    super(source);
    this.order = order;
  }

  public CustomerOrder getOrder() {
    return order;
  }
}
