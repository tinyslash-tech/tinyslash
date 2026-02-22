package com.urlshortener.service;

import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@Service
public class WhatsAppTemplateService {

  public String render(String template, String ownerName, String linkName, String pageName, String pageUrl,
      String city) {
    if (template == null || template.isEmpty()) {
      template = "Hi {owner_name}, I saw your link {link_name} on {page_name}.";
    }

    String message = template
        .replace("{owner_name}", ownerName != null ? ownerName : "")
        .replace("{link_name}", linkName != null ? linkName : "")
        .replace("{page_name}", pageName != null ? pageName : "")
        .replace("{page_url}", pageUrl != null ? pageUrl : "")
        .replace("{city}", city != null ? city : "");

    if (message.length() > 500) {
      message = message.substring(0, 497) + "...";
    }

    return message;
  }

  public String buildDeepLink(String phone, String encodedMessage) {
    String cleanPhone = phone.replaceAll("[^0-9]", "");

    // Validation: Length 10-15 and basic check
    if (cleanPhone.length() < 10 || cleanPhone.length() > 15) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid phone number");
    }

    return "https://wa.me/" + cleanPhone + "?text=" + encodedMessage;
  }
}
