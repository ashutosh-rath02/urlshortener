import { UrlRepositoryImpl } from "../UrlRepositoryImpl";
import { UrlDataSource } from "../../datasources/UrlDataSource";
import { Url } from "../../../domain/entities/Url";

describe("UrlRepositoryImpl", () => {
  let repository: UrlRepositoryImpl;
  let mockDataSource: jest.Mocked<UrlDataSource>;

  const mockDataEntity = {
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

  beforeEach(() => {
    mockDataSource = {
      create: jest.fn(),
      findById: jest.fn(),
      findByShortCode: jest.fn(),
      findByUserId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      existsByShortCode: jest.fn(),
      findActiveUrls: jest.fn(),
      findExpiredUrls: jest.fn(),
    };

    repository = new UrlRepositoryImpl(mockDataSource);

    // Reset all mocks
    jest.clearAllMocks();
  });

  describe("save", () => {
    it("should save URL data and return domain entity", async () => {
      // Arrange
      const urlData = {
        originalUrl: "https://example.com",
        shortCode: "abc123",
        userId: "user123",
        isActive: true,
        expiresAt: new Date("2024-12-31T23:59:59.000Z"),
        clickCount: 0,
      };

      mockDataSource.create.mockResolvedValue(mockDataEntity);

      // Act
      const result = await repository.save(urlData);

      // Assert
      expect(mockDataSource.create).toHaveBeenCalledWith({
        originalUrl: "https://example.com",
        shortCode: "abc123",
        userId: "user123",
        isActive: true,
        expiresAt: new Date("2024-12-31T23:59:59.000Z"),
        clickCount: 0,
      });

      expect(result).toBeInstanceOf(Url);
      expect(result.id).toBe("test-id");
      expect(result.originalUrl).toBe("https://example.com");
      expect(result.shortCode).toBe("abc123");
      expect(result.userId).toBe("user123");
      expect(result.isActive).toBe(true);
      expect(result.clickCount).toBe(5);
    });

    it("should handle null userId and expiresAt from database", async () => {
      // Arrange
      const urlData = {
        originalUrl: "https://example.com",
        shortCode: "abc123",
        isActive: true,
        clickCount: 0,
      };

      const dataEntityWithNulls = {
        ...mockDataEntity,
        userId: null,
        expiresAt: null,
      };

      mockDataSource.create.mockResolvedValue(dataEntityWithNulls);

      // Act
      const result = await repository.save(urlData);

      // Assert
      expect(result.userId).toBeUndefined();
      expect(result.expiresAt).toBeUndefined();
    });
  });

  describe("findById", () => {
    it("should find URL by ID and return domain entity", async () => {
      // Arrange
      mockDataSource.findById.mockResolvedValue(mockDataEntity);

      // Act
      const result = await repository.findById("test-id");

      // Assert
      expect(mockDataSource.findById).toHaveBeenCalledWith("test-id");
      expect(result).toBeInstanceOf(Url);
      expect(result?.id).toBe("test-id");
    });

    it("should return null when URL is not found", async () => {
      // Arrange
      mockDataSource.findById.mockResolvedValue(null);

      // Act
      const result = await repository.findById("non-existent");

      // Assert
      expect(result).toBeNull();
    });
  });

  describe("findByShortCode", () => {
    it("should find URL by short code and return domain entity", async () => {
      // Arrange
      mockDataSource.findByShortCode.mockResolvedValue(mockDataEntity);

      // Act
      const result = await repository.findByShortCode("abc123");

      // Assert
      expect(mockDataSource.findByShortCode).toHaveBeenCalledWith("abc123");
      expect(result).toBeInstanceOf(Url);
      expect(result?.shortCode).toBe("abc123");
    });

    it("should return null when short code is not found", async () => {
      // Arrange
      mockDataSource.findByShortCode.mockResolvedValue(null);

      // Act
      const result = await repository.findByShortCode("non-existent");

      // Assert
      expect(result).toBeNull();
    });
  });

  describe("findByUserId", () => {
    it("should find URLs by user ID and return domain entities", async () => {
      // Arrange
      const dataEntities = [
        mockDataEntity,
        { ...mockDataEntity, id: "test-id-2" },
      ];
      mockDataSource.findByUserId.mockResolvedValue(dataEntities);

      // Act
      const result = await repository.findByUserId("user123");

      // Assert
      expect(mockDataSource.findByUserId).toHaveBeenCalledWith("user123");
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Url);
      expect(result[1]).toBeInstanceOf(Url);
    });

    it("should return empty array when no URLs found for user", async () => {
      // Arrange
      mockDataSource.findByUserId.mockResolvedValue([]);

      // Act
      const result = await repository.findByUserId("user123");

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe("update", () => {
    it("should update URL and return updated domain entity", async () => {
      // Arrange
      const url = new Url(
        "test-id",
        "https://example.com",
        "abc123",
        undefined, // no userId
        true,
        undefined,
        new Date("2024-01-01T00:00:00.000Z"),
        new Date("2024-01-01T00:00:00.000Z"),
        5
      );

      const updatedDataEntity = {
        ...mockDataEntity,
        clickCount: 6,
      };

      mockDataSource.update.mockResolvedValue(updatedDataEntity);

      // Act
      const result = await repository.update(url);

      // Assert
      expect(mockDataSource.update).toHaveBeenCalledWith("test-id", {
        originalUrl: "https://example.com",
        shortCode: "abc123",
        userId: null,
        isActive: true,
        expiresAt: null,
        clickCount: 5,
      });

      expect(result).toBeInstanceOf(Url);
      expect(result.clickCount).toBe(6);
    });
  });

  describe("delete", () => {
    it("should delete URL by ID", async () => {
      // Arrange
      mockDataSource.delete.mockResolvedValue();

      // Act
      await repository.delete("test-id");

      // Assert
      expect(mockDataSource.delete).toHaveBeenCalledWith("test-id");
    });
  });

  describe("existsByShortCode", () => {
    it("should return true when short code exists", async () => {
      // Arrange
      mockDataSource.existsByShortCode.mockResolvedValue(true);

      // Act
      const result = await repository.existsByShortCode("abc123");

      // Assert
      expect(mockDataSource.existsByShortCode).toHaveBeenCalledWith("abc123");
      expect(result).toBe(true);
    });

    it("should return false when short code does not exist", async () => {
      // Arrange
      mockDataSource.existsByShortCode.mockResolvedValue(false);

      // Act
      const result = await repository.existsByShortCode("non-existent");

      // Assert
      expect(result).toBe(false);
    });
  });

  describe("findActiveUrls", () => {
    it("should find active URLs and return domain entities", async () => {
      // Arrange
      const dataEntities = [
        mockDataEntity,
        { ...mockDataEntity, id: "test-id-2" },
      ];
      mockDataSource.findActiveUrls.mockResolvedValue(dataEntities);

      // Act
      const result = await repository.findActiveUrls();

      // Assert
      expect(mockDataSource.findActiveUrls).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Url);
      expect(result[1]).toBeInstanceOf(Url);
    });
  });

  describe("findExpiredUrls", () => {
    it("should find expired URLs and return domain entities", async () => {
      // Arrange
      const dataEntities = [
        mockDataEntity,
        { ...mockDataEntity, id: "test-id-2" },
      ];
      mockDataSource.findExpiredUrls.mockResolvedValue(dataEntities);

      // Act
      const result = await repository.findExpiredUrls();

      // Assert
      expect(mockDataSource.findExpiredUrls).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Url);
      expect(result[1]).toBeInstanceOf(Url);
    });
  });
});
