package com.urlshortener.event;

import org.springframework.context.ApplicationEvent;
import com.urlshortener.model.User;

public class UserRegisteredEvent extends ApplicationEvent {
  private final User user;

  public UserRegisteredEvent(Object source, User user) {
    super(source);
    this.user = user;
  }

  public User getUser() {
    return user;
  }
}
