import { Url, UrlId, ShortCode } from "../../domain/entities/Url";
import { UrlRepository } from "../../domain/repositories/UrlRepository";
import { UrlDataSource } from "../datasources/UrlDataSource";
import { toDomainEntity } from "../entities/UrlEntity";

// Repository implementation - bridges domain and data layers
export class UrlRepositoryImpl implements UrlRepository {
  constructor(private urlDataSource: UrlDataSource) {}

  async save(url: {
    originalUrl: string;
    shortCode: ShortCode;
    userId?: string;
    isActive: boolean;
    expiresAt?: Date;
    clickCount: number;
  }): Promise<Url> {
    const dataEntity = await this.urlDataSource.create({
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      userId: url.userId || null,
      isActive: url.isActive,
      expiresAt: url.expiresAt || null,
      clickCount: url.clickCount,
    });

    const domainData = toDomainEntity(dataEntity);
    return new Url(
      domainData.id,
      domainData.originalUrl,
      domainData.shortCode,
      domainData.userId,
      domainData.isActive,
      domainData.expiresAt,
      domainData.createdAt,
      domainData.updatedAt,
      domainData.clickCount
    );
  }

  async findById(id: UrlId): Promise<Url | null> {
    const dataEntity = await this.urlDataSource.findById(id);
    if (!dataEntity) return null;

    const domainData = toDomainEntity(dataEntity);
    return new Url(
      domainData.id,
      domainData.originalUrl,
      domainData.shortCode,
      domainData.userId,
      domainData.isActive,
      domainData.expiresAt,
      domainData.createdAt,
      domainData.updatedAt,
      domainData.clickCount
    );
  }

  async findByShortCode(shortCode: ShortCode): Promise<Url | null> {
    const dataEntity = await this.urlDataSource.findByShortCode(shortCode);
    if (!dataEntity) return null;

    const domainData = toDomainEntity(dataEntity);
    return new Url(
      domainData.id,
      domainData.originalUrl,
      domainData.shortCode,
      domainData.userId,
      domainData.isActive,
      domainData.expiresAt,
      domainData.createdAt,
      domainData.updatedAt,
      domainData.clickCount
    );
  }

  async findByUserId(userId: string): Promise<Url[]> {
    const dataEntities = await this.urlDataSource.findByUserId(userId);

    return dataEntities.map((dataEntity) => {
      const domainData = toDomainEntity(dataEntity);
      return new Url(
        domainData.id,
        domainData.originalUrl,
        domainData.shortCode,
        domainData.userId,
        domainData.isActive,
        domainData.expiresAt,
        domainData.createdAt,
        domainData.updatedAt,
        domainData.clickCount
      );
    });
  }

  async update(url: Url): Promise<Url> {
    const dataEntity = await this.urlDataSource.update(url.id, {
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      userId: url.userId || null,
      isActive: url.isActive,
      expiresAt: url.expiresAt || null,
      clickCount: url.clickCount,
    });

    const domainData = toDomainEntity(dataEntity);
    return new Url(
      domainData.id,
      domainData.originalUrl,
      domainData.shortCode,
      domainData.userId,
      domainData.isActive,
      domainData.expiresAt,
      domainData.createdAt,
      domainData.updatedAt,
      domainData.clickCount
    );
  }

  async delete(id: UrlId): Promise<void> {
    await this.urlDataSource.delete(id);
  }

  async existsByShortCode(shortCode: ShortCode): Promise<boolean> {
    return await this.urlDataSource.existsByShortCode(shortCode);
  }

  async findActiveUrls(): Promise<Url[]> {
    const dataEntities = await this.urlDataSource.findActiveUrls();

    return dataEntities.map((dataEntity) => {
      const domainData = toDomainEntity(dataEntity);
      return new Url(
        domainData.id,
        domainData.originalUrl,
        domainData.shortCode,
        domainData.userId,
        domainData.isActive,
        domainData.expiresAt,
        domainData.createdAt,
        domainData.updatedAt,
        domainData.clickCount
      );
    });
  }

  async findExpiredUrls(): Promise<Url[]> {
    const dataEntities = await this.urlDataSource.findExpiredUrls();

    return dataEntities.map((dataEntity) => {
      const domainData = toDomainEntity(dataEntity);
      return new Url(
        domainData.id,
        domainData.originalUrl,
        domainData.shortCode,
        domainData.userId,
        domainData.isActive,
        domainData.expiresAt,
        domainData.createdAt,
        domainData.updatedAt,
        domainData.clickCount
      );
    });
  }

  // Analytics methods
  async getTotalUrls(): Promise<number> {
    return await this.urlDataSource.getTotalUrls();
  }

  async getTotalClicks(): Promise<number> {
    return await this.urlDataSource.getTotalClicks();
  }

  async getTopUrls(limit: number): Promise<Url[]> {
    const dataEntities = await this.urlDataSource.getTopUrls(limit);

    return dataEntities.map((dataEntity) => {
      const domainData = toDomainEntity(dataEntity);
      return new Url(
        domainData.id,
        domainData.originalUrl,
        domainData.shortCode,
        domainData.userId,
        domainData.isActive,
        domainData.expiresAt,
        domainData.createdAt,
        domainData.updatedAt,
        domainData.clickCount
      );
    });
  }

  async getUrlsByDateRange(startDate: Date, endDate: Date): Promise<Url[]> {
    const dataEntities = await this.urlDataSource.getUrlsByDateRange(
      startDate,
      endDate
    );

    return dataEntities.map((dataEntity) => {
      const domainData = toDomainEntity(dataEntity);
      return new Url(
        domainData.id,
        domainData.originalUrl,
        domainData.shortCode,
        domainData.userId,
        domainData.isActive,
        domainData.expiresAt,
        domainData.createdAt,
        domainData.updatedAt,
        domainData.clickCount
      );
    });
  }

  async getClicksByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<{ date: string; clicks: number }[]> {
    return await this.urlDataSource.getClicksByDateRange(startDate, endDate);
  }
}
