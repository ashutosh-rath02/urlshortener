// Unmock nanoid for utility tests
jest.unmock("nanoid");

jest.mock("nanoid", () => ({
  nanoid: (length = 6) => "x".repeat(length),
}));

import { isValidUrl, isValidShortCode, generateShortCode } from "../urlUtils";

describe("URL Utils", () => {
  describe("isValidUrl", () => {
    it("should return true for valid HTTP URLs", () => {
      expect(isValidUrl("http://example.com")).toBe(true);
      expect(isValidUrl("http://www.example.com")).toBe(true);
      expect(isValidUrl("http://example.com/path")).toBe(true);
      expect(isValidUrl("http://example.com/path?param=value")).toBe(true);
    });

    it("should return true for valid HTTPS URLs", () => {
      expect(isValidUrl("https://example.com")).toBe(true);
      expect(isValidUrl("https://www.example.com")).toBe(true);
      expect(isValidUrl("https://example.com/path")).toBe(true);
      expect(isValidUrl("https://example.com/path?param=value")).toBe(true);
    });

    it("should return false for invalid URLs", () => {
      expect(isValidUrl("invalid-url")).toBe(false);
      expect(isValidUrl("ftp://example.com")).toBe(false);
      expect(isValidUrl("example.com")).toBe(false);
      expect(isValidUrl("")).toBe(false);
      expect(isValidUrl("http://")).toBe(false);
      expect(isValidUrl("https://")).toBe(false);
    });

    it("should return false for non-string inputs", () => {
      expect(isValidUrl(null as any)).toBe(false);
      expect(isValidUrl(undefined as any)).toBe(false);
      expect(isValidUrl(123 as any)).toBe(false);
    });
  });

  describe("isValidShortCode", () => {
    it("should return true for valid short codes", () => {
      expect(isValidShortCode("abc")).toBe(true);
      expect(isValidShortCode("abc123")).toBe(true);
      expect(isValidShortCode("abc-123")).toBe(true);
      expect(isValidShortCode("abc_123")).toBe(true);
      expect(isValidShortCode("123abc")).toBe(true);
      expect(isValidShortCode("a-b_c")).toBe(true);
    });

    it("should return false for short codes that are too short", () => {
      expect(isValidShortCode("ab")).toBe(false);
      expect(isValidShortCode("a")).toBe(false);
      expect(isValidShortCode("")).toBe(false);
    });

    it("should return false for short codes that are too long", () => {
      expect(isValidShortCode("abcdefghijk")).toBe(false); // 11 characters
      expect(isValidShortCode("abcdefghijklmnop")).toBe(false); // 16 characters
    });

    it("should return false for short codes with invalid characters", () => {
      expect(isValidShortCode("abc@123")).toBe(false);
      expect(isValidShortCode("abc#123")).toBe(false);
      expect(isValidShortCode("abc$123")).toBe(false);
      expect(isValidShortCode("abc%123")).toBe(false);
      expect(isValidShortCode("abc 123")).toBe(false);
      expect(isValidShortCode("abc.123")).toBe(false);
    });

    it("should return false for non-string inputs", () => {
      expect(isValidShortCode(null as any)).toBe(false);
      expect(isValidShortCode(undefined as any)).toBe(false);
      expect(isValidShortCode(123 as any)).toBe(false);
    });
  });

  describe("generateShortCode", () => {
    it("should generate a short code with default length", () => {
      const shortCode = generateShortCode();
      expect(typeof shortCode).toBe("string");
      expect(shortCode.length).toBe(6);
      expect(isValidShortCode(shortCode)).toBe(true);
    });

    it("should generate a short code with custom length", () => {
      const shortCode = generateShortCode(8);
      expect(typeof shortCode).toBe("string");
      expect(shortCode.length).toBe(8);
      expect(isValidShortCode(shortCode)).toBe(true);
    });

    it("should generate valid short codes", () => {
      for (let i = 0; i < 100; i++) {
        const shortCode = generateShortCode();
        expect(isValidShortCode(shortCode)).toBe(true);
      }
    });

    it("should handle different lengths correctly", () => {
      expect(generateShortCode(3).length).toBe(3);
      expect(generateShortCode(5).length).toBe(5);
      expect(generateShortCode(10).length).toBe(10);
    });
  });
});
