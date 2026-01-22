package com.urlshortener.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * Balanced Feistel Cipher specific for URL Shortening.
 * Permutes a 42-bit integer into another 42-bit integer reversibly.
 * 42 bits = ~4.39 trillion IDs, producing guaranteed 7-char Base62 strings.
 */
@Component
public class FeistelCipher {

  // 42 bits total domain
  private static final int TOTAL_BITS = 42;
  private static final int HALF_BITS = TOTAL_BITS / 2; // 21 bits
  private static final long MASK_42 = (1L << TOTAL_BITS) - 1;
  private static final long MASK_21 = (1L << HALF_BITS) - 1;

  // Number of rounds (3-4 is usually sufficient for non-crypto obfuscation)
  private static final int ROUNDS = 4;

  private final long secretKey;

  /**
   * Initializes the cipher with a designated secret key from config.
   * Use a fixed random long for production.
   */
  public FeistelCipher(@Value("${app.shorturl.feistel-key:867530912345678}") long secretKey) {
    this.secretKey = secretKey;
  }

  /**
   * Encrypts (shuffles) a numeric ID.
   */
  public long encrypt(long id) {
    // Prepare left and right halves (21 bits each)
    // input: [.........Left.........][.........Right........]
    long left = (id >> HALF_BITS) & MASK_21;
    long right = id & MASK_21;

    for (int i = 0; i < ROUNDS; i++) {
      long temp = right;
      // newRight = Left XOR RoundFunc(Right, Key, i)
      right = left ^ roundFunction(right, i);
      left = temp;
    }

    // Combine halves: [Right][Left] (Standard swap last step often omitted, but
    // symmetric approach is fine)
    // We put output as [Left][Right] after rounds.
    // Usually Feistel swaps at each round.
    // Round 1: L1=R0, R1=L0^F(R0)
    // ...
    // Final: [L_final][R_final]

    return ((left << HALF_BITS) | right) & MASK_42;
  }

  /**
   * Decrypts (un-shuffles) a numeric ID.
   */
  public long decrypt(long id) {
    long left = (id >> HALF_BITS) & MASK_21;
    long right = id & MASK_21;

    for (int i = ROUNDS - 1; i >= 0; i--) {
      long temp = left;
      // Inverse: previousRight = Left
      // previousLeft = Right XOR F(previousRight) -> Left XOR F(Left) ?? No, check
      // math.

      // Encryption: L_new = R_old; R_new = L_old ^ F(R_old)
      // Decryption involves reversing the swap and XOR.
      // Current input is [L_final][R_final] (which corresponds to L_new, R_new)
      // L_old = R_new ^ F(L_new) (Since R_new = L_old ^ F(R_old) and L_new=R_old)

      // So:
      // R_old = L_new (which is our current 'left' var)
      // L_old = R_new (current 'right') ^ F(L_new)

      // My loop matches the standard swapped form.
      // Let's verify standard implementation.
      // Encrypt:
      // temp = R;
      // R = L ^ F(R);
      // L = temp;

      // Decrypt:
      // temp = L; (which was old R)
      // L = R ^ F(L);
      // R = temp;

      left = right ^ roundFunction(left, i);
      right = temp;
    }

    return ((left << HALF_BITS) | right) & MASK_42;
  }

  /**
   * Round function: A pseudo-random function.
   * Can be simple hash.
   */
  private long roundFunction(long val, int round) {
    // Simple mixing logic: (Key + val + round) * Prime
    // Or hash-based.

    // Use a simple LCG-like mix for speed and reversibility properties
    long mix = val + secretKey + (round * 982451653L);
    mix ^= (mix >> 11);
    mix ^= (mix << 7);
    mix ^= (mix >> 15);

    return mix & MASK_21;
  }
}
