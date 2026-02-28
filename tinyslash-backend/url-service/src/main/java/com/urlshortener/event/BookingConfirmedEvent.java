package com.urlshortener.event;

import org.springframework.context.ApplicationEvent;
import com.urlshortener.model.Booking;

public class BookingConfirmedEvent extends ApplicationEvent {
  private final Booking booking;

  public BookingConfirmedEvent(Object source, Booking booking) {
    super(source);
    this.booking = booking;
  }

  public Booking getBooking() {
    return booking;
  }
}
