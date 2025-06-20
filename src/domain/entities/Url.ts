// Domain URL entity with business logic
export type UrlId = string;
export type ShortCode = string;
export type OriginalUrl = string;

export class Url {
  constructor(
    public readonly id: UrlId,
    public readonly originalUrl: OriginalUrl,
    public readonly shortCode: ShortCode,
    public readonly userId?: string,
    public readonly isActive: boolean = true,
    public readonly expiresAt?: Date,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
    public readonly clickCount: number = 0
  ) {}

  // Business logic methods
  isExpired(): boolean {
    if (!this.expiresAt) return false;
    return new Date() > this.expiresAt;
  }

  canBeAccessed(): boolean {
    return this.isActive && !this.isExpired();
  }

  incrementClickCount(): Url {
    return new Url(
      this.id,
      this.originalUrl,
      this.shortCode,
      this.userId,
      this.isActive,
      this.expiresAt,
      this.createdAt,
      new Date(),
      this.clickCount + 1
    );
  }

  deactivate(): Url {
    return new Url(
      this.id,
      this.originalUrl,
      this.shortCode,
      this.userId,
      false,
      this.expiresAt,
      this.createdAt,
      new Date(),
      this.clickCount
    );
  }

  activate(): Url {
    return new Url(
      this.id,
      this.originalUrl,
      this.shortCode,
      this.userId,
      true,
      this.expiresAt,
      this.createdAt,
      new Date(),
      this.clickCount
    );
  }

  // Factory method
  static create(data: {
    originalUrl: OriginalUrl;
    shortCode: ShortCode;
    userId?: string;
    expiresAt?: Date;
  }): {
    originalUrl: OriginalUrl;
    shortCode: ShortCode;
    userId?: string;
    isActive: boolean;
    expiresAt?: Date;
    clickCount: number;
  } {
    const result: {
      originalUrl: OriginalUrl;
      shortCode: ShortCode;
      userId?: string;
      isActive: boolean;
      expiresAt?: Date;
      clickCount: number;
    } = {
      originalUrl: data.originalUrl,
      shortCode: data.shortCode,
      isActive: true,
      clickCount: 0,
    };

    if (data.userId !== undefined) result.userId = data.userId;
    if (data.expiresAt !== undefined) result.expiresAt = data.expiresAt;

    return result;
  }
}
