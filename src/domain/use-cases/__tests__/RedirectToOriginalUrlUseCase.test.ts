import {
  RedirectToOriginalUrlUseCase,
  RedirectRequest,
} from "../RedirectToOriginalUrlUseCase";
import { UrlRepository } from "../../repositories/UrlRepository";
import { Url } from "../../entities/Url";
import { AppException } from "../../../core/exceptions/AppException";

describe("RedirectToOriginalUrlUseCase", () => {
  let useCase: RedirectToOriginalUrlUseCase;
  let mockRepository: jest.Mocked<UrlRepository>;

  const mockUrl = new Url(
    "test-id",
    "https://example.com",
    "abc123",
    "user123",
    true,
    new Date("2025-12-31T23:59:59.000Z"),
    new Date("2024-01-01T00:00:00.000Z"),
    new Date("2024-01-01T00:00:00.000Z"),
    5
  );

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByShortCode: jest.fn(),
      findByUserId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      existsByShortCode: jest.fn(),
      findActiveUrls: jest.fn(),
      findExpiredUrls: jest.fn(),
    };

    useCase = new RedirectToOriginalUrlUseCase(mockRepository);

    // Reset all mocks
    jest.clearAllMocks();
  });

  describe("execute", () => {
    const validRequest: RedirectRequest = {
      shortCode: "abc123",
    };

    it("should redirect successfully when URL is active and not expired", async () => {
      // Arrange
      mockRepository.findByShortCode.mockResolvedValue(mockUrl);
      mockRepository.update.mockResolvedValue(mockUrl);

      // Act
      const result = await useCase.execute(validRequest);

      // Assert
      expect(mockRepository.findByShortCode).toHaveBeenCalledWith("abc123");
      expect(mockRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "test-id",
          clickCount: 6, // Incremented from 5
        })
      );

      expect(result).toEqual({
        originalUrl: "https://example.com",
        isActive: true,
        isExpired: false,
      });
    });

    it("should throw error when short code is missing", async () => {
      // Arrange
      const invalidRequest: RedirectRequest = {
        shortCode: "",
      };

      // Act & Assert
      await expect(useCase.execute(invalidRequest)).rejects.toThrow(
        new AppException("Short code is required", 400)
      );
    });

    it("should throw error when URL is not found", async () => {
      // Arrange
      mockRepository.findByShortCode.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(validRequest)).rejects.toThrow(
        new AppException("URL not found", 404)
      );
    });

    it("should throw error when URL is inactive", async () => {
      // Arrange
      const inactiveUrl = new Url(
        "test-id",
        "https://example.com",
        "abc123",
        "user123",
        false, // inactive
        undefined,
        new Date("2024-01-01T00:00:00.000Z"),
        new Date("2024-01-01T00:00:00.000Z"),
        5
      );

      mockRepository.findByShortCode.mockResolvedValue(inactiveUrl);

      // Act & Assert
      await expect(useCase.execute(validRequest)).rejects.toThrow(
        new AppException("URL is not active", 404)
      );
    });

    it("should throw error when URL is expired", async () => {
      // Arrange
      const pastDate = new Date();
      pastDate.setFullYear(pastDate.getFullYear() - 1);

      const expiredUrl = new Url(
        "test-id",
        "https://example.com",
        "abc123",
        "user123",
        true,
        pastDate, // expired
        new Date("2024-01-01T00:00:00.000Z"),
        new Date("2024-01-01T00:00:00.000Z"),
        5
      );

      mockRepository.findByShortCode.mockResolvedValue(expiredUrl);

      // Act & Assert
      await expect(useCase.execute(validRequest)).rejects.toThrow(
        new AppException("URL has expired", 410)
      );
    });

    it("should increment click count and update the URL", async () => {
      // Arrange
      const urlWithZeroClicks = new Url(
        "test-id",
        "https://example.com",
        "abc123",
        "user123",
        true,
        undefined,
        new Date("2024-01-01T00:00:00.000Z"),
        new Date("2024-01-01T00:00:00.000Z"),
        0
      );

      mockRepository.findByShortCode.mockResolvedValue(urlWithZeroClicks);
      mockRepository.update.mockResolvedValue(urlWithZeroClicks);

      // Act
      await useCase.execute(validRequest);

      // Assert
      expect(mockRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "test-id",
          clickCount: 1,
        })
      );
    });

    it("should handle URL without expiration date", async () => {
      // Arrange
      const urlWithoutExpiration = new Url(
        "test-id",
        "https://example.com",
        "abc123",
        "user123",
        true,
        undefined, // no expiration
        new Date("2024-01-01T00:00:00.000Z"),
        new Date("2024-01-01T00:00:00.000Z"),
        5
      );

      mockRepository.findByShortCode.mockResolvedValue(urlWithoutExpiration);
      mockRepository.update.mockResolvedValue(urlWithoutExpiration);

      // Act
      const result = await useCase.execute(validRequest);

      // Assert
      expect(result.isExpired).toBe(false);
      expect(result.originalUrl).toBe("https://example.com");
      expect(result.isActive).toBe(true);
    });

    it("should handle URL with future expiration date", async () => {
      // Arrange
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);

      const urlWithFutureExpiration = new Url(
        "test-id",
        "https://example.com",
        "abc123",
        "user123",
        true,
        futureDate, // future expiration
        new Date("2024-01-01T00:00:00.000Z"),
        new Date("2024-01-01T00:00:00.000Z"),
        5
      );

      mockRepository.findByShortCode.mockResolvedValue(urlWithFutureExpiration);
      mockRepository.update.mockResolvedValue(urlWithFutureExpiration);

      // Act
      const result = await useCase.execute(validRequest);

      // Assert
      expect(result.isExpired).toBe(false);
      expect(result.originalUrl).toBe("https://example.com");
      expect(result.isActive).toBe(true);
    });

    it("should handle URL with current expiration date", async () => {
      // Arrange
      const pastDate = new Date();
      pastDate.setMilliseconds(pastDate.getMilliseconds() - 1000); // 1 second ago

      const urlWithCurrentExpiration = new Url(
        "test-id",
        "https://example.com",
        "abc123",
        "user123",
        true,
        pastDate, // past expiration
        new Date("2024-01-01T00:00:00.000Z"),
        new Date("2024-01-01T00:00:00.000Z"),
        5
      );

      mockRepository.findByShortCode.mockResolvedValue(
        urlWithCurrentExpiration
      );

      // Act & Assert
      await expect(useCase.execute(validRequest)).rejects.toThrow(
        new AppException("URL has expired", 410)
      );
    });
  });
});
