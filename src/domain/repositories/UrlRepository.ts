import { Url, UrlId, ShortCode } from "../entities/Url";

// Domain repository interface - defines the contract
export interface UrlRepository {
  save: (url: {
    originalUrl: string;
    shortCode: ShortCode;
    userId?: string;
    isActive: boolean;
    expiresAt?: Date;
    clickCount: number;
  }) => Promise<Url>;
  findById: (id: UrlId) => Promise<Url | null>;
  findByShortCode: (shortCode: ShortCode) => Promise<Url | null>;
  findByUserId: (userId: string) => Promise<Url[]>;
  update: (url: Url) => Promise<Url>;
  delete: (id: UrlId) => Promise<void>;
  existsByShortCode: (shortCode: ShortCode) => Promise<boolean>;
  findActiveUrls: () => Promise<Url[]>;
  findExpiredUrls: () => Promise<Url[]>;
}
