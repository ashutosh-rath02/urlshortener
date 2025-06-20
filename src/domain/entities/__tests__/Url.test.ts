import { Url } from "../Url";

describe("Url Domain Entity", () => {
  const mockUrlData = {
    id: "test-id",
    originalUrl: "https://example.com",
    shortCode: "abc123",
    userId: "user123",
    isActive: true,
    expiresAt: new Date("2024-12-31T23:59:59.000Z"),
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z"),
    clickCount: 5,
  };

  describe("Constructor", () => {
    it("should create a Url instance with all properties", () => {
      const url = new Url(
        mockUrlData.id,
        mockUrlData.originalUrl,
        mockUrlData.shortCode,
        mockUrlData.userId,
        mockUrlData.isActive,
        mockUrlData.expiresAt,
        mockUrlData.createdAt,
        mockUrlData.updatedAt,
        mockUrlData.clickCount
      );

      expect(url.id).toBe(mockUrlData.id);
      expect(url.originalUrl).toBe(mockUrlData.originalUrl);
      expect(url.shortCode).toBe(mockUrlData.shortCode);
      expect(url.userId).toBe(mockUrlData.userId);
      expect(url.isActive).toBe(mockUrlData.isActive);
      expect(url.expiresAt).toBe(mockUrlData.expiresAt);
      expect(url.createdAt).toBe(mockUrlData.createdAt);
      expect(url.updatedAt).toBe(mockUrlData.updatedAt);
      expect(url.clickCount).toBe(mockUrlData.clickCount);
    });

    it("should create a Url instance with optional properties", () => {
      const url = new Url(
        mockUrlData.id,
        mockUrlData.originalUrl,
        mockUrlData.shortCode
      );

      expect(url.id).toBe(mockUrlData.id);
      expect(url.originalUrl).toBe(mockUrlData.originalUrl);
      expect(url.shortCode).toBe(mockUrlData.shortCode);
      expect(url.userId).toBeUndefined();
      expect(url.isActive).toBe(true);
      expect(url.expiresAt).toBeUndefined();
      expect(url.clickCount).toBe(0);
      expect(url.createdAt).toBeInstanceOf(Date);
      expect(url.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe("isExpired", () => {
    it("should return false when expiresAt is undefined", () => {
      const url = new Url(
        mockUrlData.id,
        mockUrlData.originalUrl,
        mockUrlData.shortCode
      );

      expect(url.isExpired()).toBe(false);
    });

    it("should return false when expiresAt is in the future", () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);

      const url = new Url(
        mockUrlData.id,
        mockUrlData.originalUrl,
        mockUrlData.shortCode,
        undefined,
        true,
        futureDate
      );

      expect(url.isExpired()).toBe(false);
    });

    it("should return true when expiresAt is in the past", () => {
      const pastDate = new Date();
      pastDate.setFullYear(pastDate.getFullYear() - 1);

      const url = new Url(
        mockUrlData.id,
        mockUrlData.originalUrl,
        mockUrlData.shortCode,
        undefined,
        true,
        pastDate
      );

      expect(url.isExpired()).toBe(true);
    });

    it("should return true when expiresAt is now", () => {
      const pastDate = new Date();
      pastDate.setMilliseconds(pastDate.getMilliseconds() - 1000); // 1 second ago

      const url = new Url(
        mockUrlData.id,
        mockUrlData.originalUrl,
        mockUrlData.shortCode,
        undefined,
        true,
        pastDate
      );

      expect(url.isExpired()).toBe(true);
    });
  });

  describe("canBeAccessed", () => {
    it("should return true when URL is active and not expired", () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);

      const url = new Url(
        mockUrlData.id,
        mockUrlData.originalUrl,
        mockUrlData.shortCode,
        undefined,
        true,
        futureDate
      );

      expect(url.canBeAccessed()).toBe(true);
    });

    it("should return false when URL is inactive", () => {
      const url = new Url(
        mockUrlData.id,
        mockUrlData.originalUrl,
        mockUrlData.shortCode,
        undefined,
        false
      );

      expect(url.canBeAccessed()).toBe(false);
    });

    it("should return false when URL is expired", () => {
      const pastDate = new Date();
      pastDate.setFullYear(pastDate.getFullYear() - 1);

      const url = new Url(
        mockUrlData.id,
        mockUrlData.originalUrl,
        mockUrlData.shortCode,
        undefined,
        true,
        pastDate
      );

      expect(url.canBeAccessed()).toBe(false);
    });

    it("should return false when URL is inactive and expired", () => {
      const pastDate = new Date();
      pastDate.setFullYear(pastDate.getFullYear() - 1);

      const url = new Url(
        mockUrlData.id,
        mockUrlData.originalUrl,
        mockUrlData.shortCode,
        undefined,
        false,
        pastDate
      );

      expect(url.canBeAccessed()).toBe(false);
    });
  });

  describe("incrementClickCount", () => {
    it("should increment click count and update updatedAt", () => {
      const url = new Url(
        mockUrlData.id,
        mockUrlData.originalUrl,
        mockUrlData.shortCode,
        undefined,
        true,
        undefined,
        mockUrlData.createdAt,
        mockUrlData.updatedAt,
        5
      );

      const updatedUrl = url.incrementClickCount();

      expect(updatedUrl.clickCount).toBe(6);
      expect(updatedUrl.updatedAt.getTime()).toBeGreaterThan(
        mockUrlData.updatedAt.getTime()
      );
      expect(updatedUrl.id).toBe(url.id);
      expect(updatedUrl.originalUrl).toBe(url.originalUrl);
      expect(updatedUrl.shortCode).toBe(url.shortCode);
    });
  });

  describe("deactivate", () => {
    it("should set isActive to false and update updatedAt", () => {
      const url = new Url(
        mockUrlData.id,
        mockUrlData.originalUrl,
        mockUrlData.shortCode,
        undefined,
        true,
        undefined,
        mockUrlData.createdAt,
        mockUrlData.updatedAt,
        5
      );

      const deactivatedUrl = url.deactivate();

      expect(deactivatedUrl.isActive).toBe(false);
      expect(deactivatedUrl.updatedAt.getTime()).toBeGreaterThan(
        mockUrlData.updatedAt.getTime()
      );
      expect(deactivatedUrl.id).toBe(url.id);
      expect(deactivatedUrl.originalUrl).toBe(url.originalUrl);
      expect(deactivatedUrl.shortCode).toBe(url.shortCode);
      expect(deactivatedUrl.clickCount).toBe(url.clickCount);
    });
  });

  describe("activate", () => {
    it("should set isActive to true and update updatedAt", () => {
      const url = new Url(
        mockUrlData.id,
        mockUrlData.originalUrl,
        mockUrlData.shortCode,
        undefined,
        false,
        undefined,
        mockUrlData.createdAt,
        mockUrlData.updatedAt,
        5
      );

      const activatedUrl = url.activate();

      expect(activatedUrl.isActive).toBe(true);
      expect(activatedUrl.updatedAt.getTime()).toBeGreaterThan(
        mockUrlData.updatedAt.getTime()
      );
      expect(activatedUrl.id).toBe(url.id);
      expect(activatedUrl.originalUrl).toBe(url.originalUrl);
      expect(activatedUrl.shortCode).toBe(url.shortCode);
      expect(activatedUrl.clickCount).toBe(url.clickCount);
    });
  });

  describe("create factory method", () => {
    it("should create URL data with required fields", () => {
      const urlData = Url.create({
        originalUrl: "https://example.com",
        shortCode: "abc123",
      });

      expect(urlData.originalUrl).toBe("https://example.com");
      expect(urlData.shortCode).toBe("abc123");
      expect(urlData.isActive).toBe(true);
      expect(urlData.clickCount).toBe(0);
      expect(urlData.userId).toBeUndefined();
      expect(urlData.expiresAt).toBeUndefined();
    });

    it("should create URL data with optional fields", () => {
      const expiresAt = new Date("2024-12-31T23:59:59.000Z");
      const urlData = Url.create({
        originalUrl: "https://example.com",
        shortCode: "abc123",
        userId: "user123",
        expiresAt,
      });

      expect(urlData.originalUrl).toBe("https://example.com");
      expect(urlData.shortCode).toBe("abc123");
      expect(urlData.userId).toBe("user123");
      expect(urlData.expiresAt).toBe(expiresAt);
      expect(urlData.isActive).toBe(true);
      expect(urlData.clickCount).toBe(0);
    });

    it("should handle undefined optional fields correctly", () => {
      const urlData = Url.create({
        originalUrl: "https://example.com",
        shortCode: "abc123",
      });

      expect(urlData.userId).toBeUndefined();
      expect(urlData.expiresAt).toBeUndefined();
    });
  });
});
