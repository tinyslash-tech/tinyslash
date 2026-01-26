package com.urlshortener.service;

import com.urlshortener.dto.LeadCaptureRequest;
import com.urlshortener.dto.LeadVerifyRequest;
import com.urlshortener.model.Lead;
import com.urlshortener.model.ShortenedUrl;
import com.urlshortener.repository.LeadRepository;
import com.urlshortener.repository.ShortenedUrlRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

@Service
public class LeadService {

    @Autowired
    private LeadRepository leadRepository;

    @Autowired
    private ShortenedUrlRepository urlRepository;

    // In-memory OTP store for Demo (Production should use Redis)
    private final Map<String, String> otpStore = new ConcurrentHashMap<>();

    public void initiateUnlock(String shortCode, LeadCaptureRequest request) {
        ShortenedUrl url = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new RuntimeException("Link not found: " + shortCode));

        if (url.getLeadLockConfig() == null || !url.getLeadLockConfig().isEnabled()) {
            throw new RuntimeException("Lead Lock not enabled for this link");
        }

        // Generate OTP (Mock 1234 for now)
        String otp = "1234";
        String key = getKey(shortCode, request);
        otpStore.put(key, otp);

        // In production: Send OTP via SMS/WhatsApp/Email using request.getWhatsapp() or
        // request.getEmail()
        System.out.println("Generated OTP for " + key + ": " + otp);
    }

    public String verifyUnlock(String shortCode, LeadVerifyRequest request, String ipAddress, String userAgent) {
        ShortenedUrl url = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new RuntimeException("Link not found"));

        if (!url.getLeadLockConfig().isOtpEnabled()) {
            // If OTP disabled, just save and return
            saveLead(url, request, ipAddress, userAgent, true);
            return getRedirectUrl(url);
        }

        String key = getKey(shortCode, request);
        String validOtp = otpStore.get(key);

        if (validOtp != null && validOtp.equals(request.getOtp())) {
            otpStore.remove(key);
            saveLead(url, request, ipAddress, userAgent, true);
            return getRedirectUrl(url);
        } else {
            throw new RuntimeException("Invalid OTP");
        }
    }

    private void saveLead(ShortenedUrl url, LeadVerifyRequest request, String ip, String userAgent, boolean verified) {
        // Check if lead exists to avoid duplicates if "Ask Once" is enabled?
        // Logic: For now, we log every unlock as a lead or update existing.

        Lead lead = new Lead();
        lead.setLinkId(url.getId());
        lead.setOwnerUserId(url.getUserId());
        lead.setEmail(request.getEmail());
        lead.setWhatsapp(request.getWhatsapp());
        lead.setLeadType(request.getEmail() != null ? "EMAIL" : "WHATSAPP"); // Simplified
        if (request.getEmail() != null && request.getWhatsapp() != null)
            lead.setLeadType("BOTH");

        lead.setVerified(verified);
        lead.setIp(ip);
        lead.setUserAgent(userAgent);
        lead.setCreatedAt(LocalDateTime.now());

        // Enrich location later (GeoIP)
        lead.setCountry("IN"); // Mock

        leadRepository.save(lead);
    }

    // Helper to handle LeadCaptureRequest -> LeadVerifyRequest mapping helper if
    // needed
    // But for verification we use VerifyRequest which has same fields + OTP.
    private void saveLead(ShortenedUrl url, LeadCaptureRequest request, String ip, String userAgent, boolean verified) {
        Lead lead = new Lead();
        lead.setLinkId(url.getId());
        lead.setOwnerUserId(url.getUserId());
        lead.setEmail(request.getEmail());
        lead.setWhatsapp(request.getWhatsapp());
        lead.setLeadType(request.getLeadType());

        lead.setVerified(verified);
        lead.setIp(ip);
        lead.setUserAgent(userAgent);
        lead.setCreatedAt(LocalDateTime.now());
        lead.setCountry("IN");

        leadRepository.save(lead);
    }

    private String getKey(String shortCode, LeadCaptureRequest req) {
        return shortCode + ":" + (req.getWhatsapp() != null ? req.getWhatsapp() : req.getEmail());
    }

    private String getKey(String shortCode, LeadVerifyRequest req) {
        return shortCode + ":" + (req.getWhatsapp() != null ? req.getWhatsapp() : req.getEmail());
    }

    private String getRedirectUrl(ShortenedUrl url) {
        if (url.getLeadLockConfig().getRedirectUrl() != null && !url.getLeadLockConfig().getRedirectUrl().isEmpty()) {
            return url.getLeadLockConfig().getRedirectUrl();
        }
        return url.getOriginalUrl();
    }

    public List<Lead> getLeadsForUser(String userId) {
        return leadRepository.findByOwnerUserId(userId);
    }

    public List<Lead> getLeadsForLink(String linkId) {
        return leadRepository.findByLinkId(linkId);
    }
}
