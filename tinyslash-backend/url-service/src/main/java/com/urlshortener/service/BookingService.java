package com.urlshortener.service;

import com.urlshortener.model.Booking;
import com.urlshortener.model.CreatorSchedule;
import com.urlshortener.repository.BookingRepository;
import com.urlshortener.repository.CreatorScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import com.urlshortener.event.BookingConfirmedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class BookingService {

  private static final Logger logger = LoggerFactory.getLogger(BookingService.class);

  @Autowired
  private CreatorScheduleRepository scheduleRepository;

  @Autowired
  private BookingRepository bookingRepository;

  @Autowired
  private ApplicationEventPublisher eventPublisher;

  @Cacheable(value = "creator_schedule", key = "#creatorId")
  public CreatorSchedule getCreatorSchedule(String creatorId) {
    return scheduleRepository.findByUserId(creatorId).orElseGet(() -> {
      CreatorSchedule empty = new CreatorSchedule();
      empty.setUserId(creatorId);
      return empty;
    });
  }

  @CacheEvict(value = "creator_schedule", key = "#creatorId")
  public CreatorSchedule saveCreatorSchedule(String creatorId, CreatorSchedule schedule) {
    CreatorSchedule existing = scheduleRepository.findByUserId(creatorId).orElse(new CreatorSchedule());

    existing.setUserId(creatorId);
    existing.setTimezone(schedule.getTimezone());
    existing.setWeeklyHours(schedule.getWeeklyHours());
    existing.setBlockedDates(schedule.getBlockedDates());
    existing.setUpdatedAt(LocalDateTime.now());

    return scheduleRepository.save(existing);
  }

  public List<String> getAvailableSlots(String creatorId, String dateStr, int durationMinutes) {
    logger.info("Generating slots for creator: {}, date: {}, duration: {}", creatorId, dateStr, durationMinutes);
    CreatorSchedule schedule = getCreatorSchedule(creatorId);

    if (schedule.getTimezone() == null || schedule.getWeeklyHours() == null) {
      logger.info("Schedule unconfigured. Timezone: {}, WeeklyHours: {}", schedule.getTimezone(),
          schedule.getWeeklyHours());
      return new ArrayList<>(); // Unconfigured
    }

    // Check blocked dates
    if (schedule.getBlockedDates() != null && schedule.getBlockedDates().contains(dateStr)) {
      logger.info("Date {} is explicitly blocked by creator {}", dateStr, creatorId);
      return new ArrayList<>();
    }

    ZoneId creatorZoneId = ZoneId.of(schedule.getTimezone());
    LocalDate targetDate;
    try {
      targetDate = LocalDate.parse(dateStr);
    } catch (Exception e) {
      logger.warn("Invalid date format requested for slots: {}", dateStr);
      return new ArrayList<>();
    }

    String dayOfWeek = targetDate.getDayOfWeek().name();
    logger.info("Target date {} is a {}", dateStr, dayOfWeek);

    List<CreatorSchedule.TimeWindow> windows = schedule.getWeeklyHours().get(dayOfWeek);
    if (windows == null || windows.isEmpty()) {
      logger.info("No time windows configured for {}", dayOfWeek);
      return new ArrayList<>();
    }

    // Generate synthetic slots
    List<Slot> potentialSlots = new ArrayList<>();

    // Elite Architecture: Hooks ready for padding logic. Set to 0 for now.
    int bufferMinutes = 0;

    for (CreatorSchedule.TimeWindow window : windows) {
      LocalTime windowStart;
      LocalTime windowEnd;
      try {
        windowStart = LocalTime.parse(window.getStart());
        windowEnd = LocalTime.parse(window.getEnd());
      } catch (Exception e) {
        logger.error("Failed to parse TimeWindow {}-{} for creator {}", window.getStart(), window.getEnd(), creatorId);
        continue;
      }

      LocalTime currentSlotStart = windowStart;

      // Loop until adding the duration pushes us past the window end
      while (!currentSlotStart.plusMinutes(durationMinutes).isAfter(windowEnd)) {
        LocalTime currentSlotEnd = currentSlotStart.plusMinutes(durationMinutes);

        ZonedDateTime zonedDateTimeStart = ZonedDateTime.of(targetDate, currentSlotStart, creatorZoneId);
        ZonedDateTime zonedDateTimeEnd = ZonedDateTime.of(targetDate, currentSlotEnd, creatorZoneId);

        potentialSlots.add(new Slot(zonedDateTimeStart.toInstant(), zonedDateTimeEnd.toInstant()));
        currentSlotStart = currentSlotEnd.plusMinutes(bufferMinutes); // Advance
      }
    }

    // Fetch DB Bookings for overlaps utilizing Compound Index
    List<Booking> existingBookings = bookingRepository.findByCreatorIdAndBookingDateAndStatusIn(
        creatorId, dateStr, Arrays.asList("PENDING", "CONFIRMED"));

    // Filter overlaps
    List<String> availableSlotUtcStrings = new ArrayList<>();
    Instant now = Instant.now();

    for (Slot slot : potentialSlots) {
      // Notice Period is temporarily disabled for testing so creators can immediately
      // book slots
      if (slot.startUtc.isBefore(now)) {
        continue; // Only block slots strictly in the past
      }

      boolean isOverlapping = false;
      for (Booking b : existingBookings) {
        // overlap check: math_max(start1, start2) < math_min(end1, end2)
        Instant maxStart = slot.startUtc.isAfter(b.getBookingStartUtc()) ? slot.startUtc : b.getBookingStartUtc();
        Instant minEnd = slot.endUtc.isBefore(b.getBookingEndUtc()) ? slot.endUtc : b.getBookingEndUtc();

        if (maxStart.isBefore(minEnd)) {
          isOverlapping = true;
          break;
        }
      }

      if (!isOverlapping) {
        availableSlotUtcStrings.add(slot.startUtc.toString()); // Returns UTC formatted string
      }
    }

    return availableSlotUtcStrings;
  }

  private static class Slot {
    Instant startUtc;
    Instant endUtc;

    public Slot(Instant start, Instant end) {
      this.startUtc = start;
      this.endUtc = end;
    }
  }

  public Booking createPendingBooking(String creatorId, String pageId, String blockId, String customerOrderId,
      String customerName,
      String customerEmail, String bookingDate, Instant startUtc, Instant endUtc) {
    CreatorSchedule schedule = getCreatorSchedule(creatorId);

    Booking booking = new Booking();
    booking.setCreatorId(creatorId);
    booking.setPageId(pageId);
    booking.setBlockId(blockId);
    booking.setCustomerOrderId(customerOrderId); // This is the Razorpay order ID
    booking.setCustomerName(customerName);
    booking.setCustomerEmail(customerEmail);
    booking.setBookingDate(bookingDate);
    booking.setBookingStartUtc(startUtc);
    booking.setBookingEndUtc(endUtc);
    booking.setCreatorTimezone(schedule.getTimezone() != null ? schedule.getTimezone() : "UTC");

    // Synthetic lock key: creatorId_date_startTimeUtc
    String lockKey = creatorId + "_" + bookingDate + "_" + startUtc.toEpochMilli();
    booking.setSlotLockKey(lockKey);

    booking.setStatus("PENDING");
    booking.setExpiresAt(Instant.now().plus(Duration.ofMinutes(10)));

    // Save to DB (Unique Index on slotLockKey handles atomic concurrency checks)
    return bookingRepository.save(booking);
  }

  public void confirmBooking(String customerOrderId) {
    bookingRepository.findByCustomerOrderId(customerOrderId).ifPresent(booking -> {
      booking.setStatus("CONFIRMED");
      booking.setExpiresAt(null); // Remove TTL eviction timer

      Booking savedBooking = bookingRepository.save(booking);
      eventPublisher.publishEvent(new BookingConfirmedEvent(this, savedBooking));
    });
  }
}
