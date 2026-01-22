package com.urlshortener.service;

import org.springframework.stereotype.Component;

/**
 * Utility for Base62 encoding/decoding.
 * Used to convert the randomized 64-bit integer from Feistel Cipher into a
 * URL-safe string.
 */
@Component
public class Base62Encoder {

  private static final String ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  private static final int BASE = ALPHABET.length();

  /**
   * Encodes a number to a Base62 string.
   * Guaranteed to return a 7-character string by left-padding with '0'.
   *
   * @param number The number to encode (from Feistel Cipher)
   * @return 7-character Base62 string
   */
  public String encode(long number) {
    if (number < 0) {
      throw new IllegalArgumentException("Number must be non-negative: " + number);
    }

    StringBuilder sb = new StringBuilder();

    if (number == 0) {
      sb.append(ALPHABET.charAt(0));
    }

    while (number > 0) {
      int remainder = (int) (number % BASE);
      sb.append(ALPHABET.charAt(remainder));
      number /= BASE;
    }

    // Reverse to get correct endianness (though logic works either way as long as
    // decode matches)
    // Standard is typically big-endian (most significant digit left), our loop
    // builds little-endian.
    sb.reverse();

    // Pad to 7 characters with '0' (index 0 of alphabet)
    while (sb.length() < 7) {
      sb.insert(0, ALPHABET.charAt(0));
    }

    return sb.toString();
  }

  /**
   * Decodes a Base62 string back to a number.
   *
   * @param str The Base62 string
   * @return The decoded number (to be passed to Feistel Decrypt)
   */
  public long decode(String str) {
    if (str == null || str.isEmpty()) {
      throw new IllegalArgumentException("String must not be empty");
    }

    long result = 0;
    for (int i = 0; i < str.length(); i++) {
      char c = str.charAt(i);
      int digit = ALPHABET.indexOf(c);

      if (digit == -1) {
        throw new IllegalArgumentException("Invalid character in Base62 string: " + c);
      }

      result = result * BASE + digit;
    }

    return result;
  }
}
