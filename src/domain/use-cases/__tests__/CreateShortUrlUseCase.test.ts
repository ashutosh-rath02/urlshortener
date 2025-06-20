import {
  CreateShortUrlUseCase,
  CreateShortUrlRequest,
} from "../CreateShortUrlUseCase";
import { UrlRepository } from "../../repositories/UrlRepository";
import { Url } from "../../entities/Url";
import { AppException } from "../../../core/exceptions/AppException";

// Mock the URL utils
jest.mock("../../../core/utils/urlUtils", () => ({
  isValidUrl: jest.fn(),
  isValidShortCode: jest.fn(),
  generateShortCode: jest.fn(),
}));

import {
  isValidUrl,
  isValidShortCode,
  generateShortCode,
} from "../../../core/utils/urlUtils";

const mockIsValidUrl = isValidUrl as jest.MockedFunction<typeof isValidUrl>;
const mockIsValidShortCode = isValidShortCode as jest.MockedFunction<
  typeof isValidShortCode
>;
const mockGenerateShortCode = generateShortCode as jest.MockedFunction<
  typeof generateShortCode
>;

describe("CreateShortUrlUseCase", () => {
  let useCase: CreateShortUrlUseCase;
  let mockRepository: jest.Mocked<UrlRepository>;

  const mockUrl = new Url(
    "test-id",
    "https://example.com",
    "abc123",
    "user123",
    true,
    new Date("2024-12-31T23:59:59.000Z"),
    new Date("2024-01-01T00:00:00.000Z"),
    new Date("2024-01-01T00:00:00.000Z"),
    0
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

    useCase = new CreateShortUrlUseCase(mockRepository);

    // Reset all mocks
    jest.clearAllMocks();
  });

  describe("execute", () => {
    const validRequest: CreateShortUrlRequest = {
      originalUrl: "https://example.com",
      userId: "user123",
      customShortCode: "abc123",
      expiresAt: new Date("2024-12-31T23:59:59.000Z"),
    };

    it("should create a short URL successfully with custom short code", async () => {
      // Arrange
      mockIsValidUrl.mockReturnValue(true);
      mockIsValidShortCode.mockReturnValue(true);
      mockRepository.existsByShortCode.mockResolvedValue(false);
      mockRepository.save.mockResolvedValue(mockUrl);

      // Act
      const result = await useCase.execute(validRequest);

      // Assert
      expect(mockIsValidUrl).toHaveBeenCalledWith("https://example.com");
      expect(mockIsValidShortCode).toHaveBeenCalledWith("abc123");
      expect(mockRepository.existsByShortCode).toHaveBeenCalledWith("abc123");
      expect(mockRepository.save).toHaveBeenCalledWith({
        originalUrl: "https://example.com",
        shortCode: "abc123",
        userId: "user123",
        isActive: true,
        expiresAt: new Date("2024-12-31T23:59:59.000Z"),
        clickCount: 0,
      });

      expect(result).toEqual({
        id: "test-id",
        originalUrl: "https://example.com",
        shortCode: "abc123",
        shortUrl: "http://localhost:3000/abc123",
        userId: "user123",
        expiresAt: new Date("2024-12-31T23:59:59.000Z"),
        createdAt: new Date("2024-01-01T00:00:00.000Z"),
      });
    });

    it("should create a short URL successfully with auto-generated short code", async () => {
      // Arrange
      const requestWithoutCustomCode: CreateShortUrlRequest = {
        originalUrl: "https://example.com",
        userId: "user123",
      };

      mockIsValidUrl.mockReturnValue(true);
      mockGenerateShortCode.mockReturnValue("xyz789");
      mockRepository.existsByShortCode.mockResolvedValue(false);
      mockRepository.save.mockResolvedValue(mockUrl);

      // Act
      const result = await useCase.execute(requestWithoutCustomCode);

      // Assert
      expect(mockGenerateShortCode).toHaveBeenCalled();
      expect(mockRepository.existsByShortCode).toHaveBeenCalledWith("xyz789");
      expect(result.shortCode).toBe("abc123");
    });

    it("should throw error when original URL is missing", async () => {
      // Arrange
      const invalidRequest: CreateShortUrlRequest = {
        originalUrl: "",
        userId: "user123",
      };

      // Act & Assert
      await expect(useCase.execute(invalidRequest)).rejects.toThrow(
        new AppException("Original URL is required", 400)
      );
    });

    it("should throw error when original URL is invalid", async () => {
      // Arrange
      mockIsValidUrl.mockReturnValue(false);

      // Act & Assert
      await expect(useCase.execute(validRequest)).rejects.toThrow(
        new AppException("Invalid URL format", 400)
      );
    });

    it("should throw error when custom short code is invalid", async () => {
      // Arrange
      mockIsValidUrl.mockReturnValue(true);
      mockIsValidShortCode.mockReturnValue(false);

      // Act & Assert
      await expect(useCase.execute(validRequest)).rejects.toThrow(
        new AppException(
          "Invalid short code format. Use 3-10 alphanumeric characters, hyphens, or underscores.",
          400
        )
      );
    });

    it("should throw error when custom short code already exists", async () => {
      // Arrange
      mockIsValidUrl.mockReturnValue(true);
      mockIsValidShortCode.mockReturnValue(true);
      mockRepository.existsByShortCode.mockResolvedValue(true);

      // Act & Assert
      await expect(useCase.execute(validRequest)).rejects.toThrow(
        new AppException("Short code already exists", 409)
      );
    });

    it("should throw error when unable to generate unique short code", async () => {
      // Arrange
      const requestWithoutCustomCode: CreateShortUrlRequest = {
        originalUrl: "https://example.com",
      };

      mockIsValidUrl.mockReturnValue(true);
      mockGenerateShortCode.mockReturnValue("xyz789");
      mockRepository.existsByShortCode.mockResolvedValue(true); // Always exists

      // Act & Assert
      await expect(useCase.execute(requestWithoutCustomCode)).rejects.toThrow(
        new AppException("Unable to generate unique short code", 500)
      );
    });

    it("should handle optional fields correctly", async () => {
      // Arrange
      const minimalRequest: CreateShortUrlRequest = {
        originalUrl: "https://example.com",
      };

      const mockUrlWithoutOptionalFields = new Url(
        "test-id",
        "https://example.com",
        "xyz789",
        undefined, // no userId
        true,
        undefined, // no expiresAt
        new Date("2024-01-01T00:00:00.000Z"),
        new Date("2024-01-01T00:00:00.000Z"),
        0
      );

      mockIsValidUrl.mockReturnValue(true);
      mockGenerateShortCode.mockReturnValue("xyz789");
      mockRepository.existsByShortCode.mockResolvedValue(false);
      mockRepository.save.mockResolvedValue(mockUrlWithoutOptionalFields);

      // Act
      const result = await useCase.execute(minimalRequest);

      // Assert
      expect(mockRepository.save).toHaveBeenCalledWith({
        originalUrl: "https://example.com",
        shortCode: "xyz789",
        isActive: true,
        clickCount: 0,
      });

      expect(result.userId).toBeUndefined();
      expect(result.expiresAt).toBeUndefined();
    });

    it("should use custom BASE_URL from environment", async () => {
      // Arrange
      const originalBaseUrl = process.env.BASE_URL;
      process.env.BASE_URL = "https://myshortener.com";

      mockIsValidUrl.mockReturnValue(true);
      mockIsValidShortCode.mockReturnValue(true);
      mockRepository.existsByShortCode.mockResolvedValue(false);
      mockRepository.save.mockResolvedValue(mockUrl);

      // Act
      const result = await useCase.execute(validRequest);

      // Assert
      expect(result.shortUrl).toBe("https://myshortener.com/abc123");

      // Cleanup
      process.env.BASE_URL = originalBaseUrl;
    });
  });
});
