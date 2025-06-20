// Data entity - represents the database model
export interface UrlEntity {
  id: string;
  originalUrl: string;
  shortCode: string;
  userId?: string | null;
  isActive: boolean;
  expiresAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  clickCount: number;
}

// Mapper functions to convert between domain and data entities
export const toDomainEntity = (dataEntity: UrlEntity) => {
  return {
    id: dataEntity.id,
    originalUrl: dataEntity.originalUrl,
    shortCode: dataEntity.shortCode,
    userId: dataEntity.userId || undefined,
    isActive: dataEntity.isActive,
    expiresAt: dataEntity.expiresAt || undefined,
    createdAt: dataEntity.createdAt,
    updatedAt: dataEntity.updatedAt,
    clickCount: dataEntity.clickCount,
  };
};

export const toDataEntity = (domainEntity: {
  originalUrl: string;
  shortCode: string;
  userId?: string;
  isActive: boolean;
  expiresAt?: Date;
  clickCount: number;
}): Omit<UrlEntity, "id" | "createdAt" | "updatedAt"> => {
  return {
    originalUrl: domainEntity.originalUrl,
    shortCode: domainEntity.shortCode,
    userId: domainEntity.userId || null,
    isActive: domainEntity.isActive,
    expiresAt: domainEntity.expiresAt || null,
    clickCount: domainEntity.clickCount,
  };
};
