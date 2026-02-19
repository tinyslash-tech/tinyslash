package com.urlshortener.model;

public enum PixelType {
  FACEBOOK_CAPI, // Meta Conversions API
  GOOGLE_ADS, // Google Ads Conversion Tracking
  GA4, // Google Analytics 4
  WEBHOOK // Any platform — POST to custom URL
}
