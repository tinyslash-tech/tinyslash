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

    @Autowired
    private com.urlshortener.repository.QrCodeRepository qrCodeRepository;

    // In-memory OTP store for Demo (Production should use Redis)
    private final Map<String, String> otpStore = new ConcurrentHashMap<>();

    // --- Short Link Methods ---

    public void initiateUnlock(String shortCode, LeadCaptureRequest request) {
        ShortenedUrl url = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new RuntimeException("Link not found: " + shortCode));

        if (url.getLeadLockConfig() == null || !url.getLeadLockConfig().isEnabled()) {
            throw new RuntimeException("Lead Lock not enabled for this link");
        }

        generateAndSendOtp(getKey(shortCode, request));
    }

    public String verifyUnlock(String shortCode, LeadVerifyRequest request, String ipAddress, String userAgent) {
        ShortenedUrl url = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new RuntimeException("Link not found"));

        if (!url.getLeadLockConfig().isOtpEnabled()) {
            saveLead(url, request, ipAddress, userAgent, true);
            return getRedirectUrl(url);
        }

        String key = getKey(shortCode, request);
        verifyOtp(key, request.getOtp());

        saveLead(url, request, ipAddress, userAgent, true);
        return getRedirectUrl(url);
    }

    // --- QR Code Methods ---

    public void initiateQrUnlock(String qrCodeId, LeadCaptureRequest request) {
        com.urlshortener.model.QrCode qrCode = qrCodeRepository.findById(qrCodeId) // Or findByQrCode check?
                .or(() -> qrCodeRepository.findByQrCode(qrCodeId))
                .orElseThrow(() -> new RuntimeException("QR Code not found: " + qrCodeId));

        if (qrCode.getLeadLockConfig() == null || !qrCode.getLeadLockConfig().isEnabled()) {
            throw new RuntimeException("Lead Lock not enabled for this QR Code");
        }

        generateAndSendOtp(getKey(qrCodeId, request));
    }

    public String verifyQrUnlock(String qrCodeId, LeadVerifyRequest request, String ipAddress, String userAgent) {
        com.urlshortener.model.QrCode qrCode = qrCodeRepository.findById(qrCodeId)
                .or(() -> qrCodeRepository.findByQrCode(qrCodeId))
                .orElseThrow(() -> new RuntimeException("QR Code not found"));

        if (!qrCode.getLeadLockConfig().isOtpEnabled()) {
            saveLead(qrCode, request, ipAddress, userAgent, true);
            return getRedirectUrl(qrCode);
        }

        String key = getKey(qrCodeId, request);
        verifyOtp(key, request.getOtp());

        saveLead(qrCode, request, ipAddress, userAgent, true);
        return getRedirectUrl(qrCode);
    }

    // --- Helper Methods ---

    private void generateAndSendOtp(String key) {
        // Generate OTP (Mock 1234 for now)
        String otp = "1234";
        otpStore.put(key, otp);
        // In production: Send OTP via SMS/WhatsApp/Email
        System.out.println("Generated OTP for " + key + ": " + otp);
    }

    private void verifyOtp(String key, String otp) {
        String validOtp = otpStore.get(key);
        if (validOtp == null || !validOtp.equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }
        otpStore.remove(key);
    }

    private void saveLead(ShortenedUrl url, LeadVerifyRequest request, String ip, String userAgent, boolean verified) {
        Lead lead = new Lead();
        lead.setLinkId(url.getId());
        lead.setOwnerUserId(url.getUserId());
        lead.setEmail(request.getEmail());
        lead.setWhatsapp(request.getWhatsapp());
        lead.setLeadType(request.getEmail() != null ? "EMAIL" : (request.getWhatsapp() != null ? "WHATSAPP" : "BOTH"));
        if (request.getEmail() != null && request.getWhatsapp() != null)
            lead.setLeadType("BOTH");
        lead.setVerified(verified);
        lead.setIp(ip);
        lead.setUserAgent(userAgent);
        lead.setCreatedAt(LocalDateTime.now());
        lead.setCountry("IN");
        lead.setSource("LINK");
        leadRepository.save(lead);
    }

    private void saveLead(com.urlshortener.model.QrCode qrCode, LeadVerifyRequest request, String ip, String userAgent,
            boolean verified) {
        Lead lead = new Lead();
        lead.setQrCodeId(qrCode.getId());
        lead.setOwnerUserId(qrCode.getUserId());
        lead.setEmail(request.getEmail());
        lead.setWhatsapp(request.getWhatsapp());
        lead.setLeadType(request.getEmail() != null ? "EMAIL" : (request.getWhatsapp() != null ? "WHATSAPP" : "BOTH"));
        if (request.getEmail() != null && request.getWhatsapp() != null)
            lead.setLeadType("BOTH");
        lead.setVerified(verified);
        lead.setIp(ip);
        lead.setUserAgent(userAgent);
        lead.setCreatedAt(LocalDateTime.now());
        lead.setCountry("IN");
        lead.setSource("QR");
        leadRepository.save(lead);
    }

    private String getKey(String id, LeadCaptureRequest req) {
        return id + ":" + (req.getWhatsapp() != null ? req.getWhatsapp() : req.getEmail());
    }

    private String getKey(String id, LeadVerifyRequest req) {
        return id + ":" + (req.getWhatsapp() != null ? req.getWhatsapp() : req.getEmail());
    }

    private String getRedirectUrl(ShortenedUrl url) {
        if (url.getLeadLockConfig().getRedirectUrl() != null && !url.getLeadLockConfig().getRedirectUrl().isEmpty()) {
            return url.getLeadLockConfig().getRedirectUrl();
        }
        return url.getOriginalUrl();
    }

    private String getRedirectUrl(com.urlshortener.model.QrCode qrCode) {
        if (qrCode.getLeadLockConfig() != null && qrCode.getLeadLockConfig().getRedirectUrl() != null
                && !qrCode.getLeadLockConfig().getRedirectUrl().isEmpty()) {
            return qrCode.getLeadLockConfig().getRedirectUrl();
        }
        return qrCode.getDestinationUrl();
    }

    public List<Lead> getLeadsForUser(String userId) {
        return leadRepository.findByOwnerUserId(userId);
    }

    public List<Lead> getLeadsForLink(String linkId) {
        return leadRepository.findByLinkId(linkId);
    }

    public List<Lead> getLeadsForQrCode(String qrCodeId) {
        return leadRepository.findByQrCodeId(qrCodeId);
    }

    public List<Lead> getLeadsForPage(String pageId) {
        return leadRepository.findByPageId(pageId);
    }

    public void savePageLead(String pageId, String ownerUserId, Map<String, String> data, String ip, String userAgent) {
        Lead lead = new Lead();
        lead.setPageId(pageId);
        lead.setOwnerUserId(ownerUserId);
        lead.setEmail(data.get("email"));
        // Store other data if needed, or mapped to specific fields
        lead.setLeadType(data.get("type") != null ? data.get("type") : "FORM");
        lead.setVerified(true); // Direct submission, no OTP for now unless requested
        lead.setIp(ip);
        lead.setUserAgent(userAgent);
        lead.setCreatedAt(LocalDateTime.now());
        lead.setCountry("IN");
        lead.setSource("PAGE");
        leadRepository.save(lead);
    }
}
