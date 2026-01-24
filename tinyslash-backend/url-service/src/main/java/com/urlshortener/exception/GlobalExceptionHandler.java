package com.urlshortener.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

/**
 * Global exception handler for plan validation and other exceptions
 * Provides consistent error responses that match frontend expectations
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /**
     * Handle plan limit exceptions
     * Returns 403 Forbidden with upgrade information
     */
    @ExceptionHandler(PlanLimitException.class)
    public ResponseEntity<Map<String, Object>> handlePlanLimitException(PlanLimitException e) {
        logger.warn("Plan limit exceeded: {}", e.getMessage());

        Map<String, Object> response = new HashMap<>();
        response.put("error", "Plan limit exceeded");
        response.put("message", e.getMessage());
        response.put("type", "PLAN_LIMIT_EXCEEDED");

        // Add additional context if available
        if (e.getFeature() != null) {
            response.put("feature", e.getFeature());
            response.put("planName", e.getPlanName());
            response.put("currentCount", e.getCurrentCount());
            response.put("limit", e.getLimit());
        }

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
    }

    /**
     * Handle general runtime exceptions
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(RuntimeException e) {
        logger.error("Runtime exception occurred: {}", e.getMessage(), e);

        Map<String, Object> response = new HashMap<>();
        response.put("error", "Internal server error");
        response.put("message", "An unexpected error occurred");
        response.put("type", "INTERNAL_ERROR");

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    /**
     * Handle illegal argument exceptions
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgumentException(IllegalArgumentException e) {
        logger.warn("Invalid argument: {}", e.getMessage());

        Map<String, Object> response = new HashMap<>();
        response.put("error", "Invalid request");
        response.put("message", e.getMessage());
        response.put("type", "INVALID_ARGUMENT");

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(org.springframework.security.access.AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleAccessDeniedException(
            org.springframework.security.access.AccessDeniedException e) {
        logger.warn("Access denied: {}", e.getMessage());

        Map<String, Object> response = new HashMap<>();
        response.put("error", "Access Denied");
        response.put("message", "You do not have permission to access this resource");
        response.put("type", "ACCESS_DENIED");

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
    }

    /**
     * Handle Security Violation Exceptions (Tinyslash Precheck Engine)
     */
    @ExceptionHandler(SecurityViolationException.class)
    public ResponseEntity<com.urlshortener.dto.SecurityUiResponse> handleSecurityViolationException(
            SecurityViolationException e) {
        logger.warn("Security Violation: {} (Score: {})", e.getReason(), e.getRiskScore());

        // Reconstruct decision context for the mapper
        // We assume BLOCK because the exception was thrown
        com.urlshortener.dto.SecurityDecision decision = new com.urlshortener.dto.SecurityDecision(
                com.urlshortener.dto.SecurityDecision.Decision.BLOCK,
                e.getReason(),
                null,
                e.getRiskScore(),
                null);

        com.urlshortener.dto.SecurityUiResponse uiResponse = com.urlshortener.util.SecurityMessageMapper
                .mapToUserMessage(decision);

        // Return 422 Unprocessable Entity (Content is dangerous) or 400
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(uiResponse);
    }
}