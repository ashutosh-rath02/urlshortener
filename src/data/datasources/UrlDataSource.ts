import { PrismaClient } from "@prisma/client";
import { UrlEntity, toDomainEntity, toDataEntity } from "../entities/UrlEntity";

// Data source - handles all database interactions
export interface UrlDataSource {
  create: (
    data: Omit<UrlEntity, "id" | "createdAt" | "updatedAt">
  ) => Promise<UrlEntity>;
  findById: (id: string) => Promise<UrlEntity | null>;
  findByShortCode: (shortCode: string) => Promise<UrlEntity | null>;
  findByUserId: (userId: string) => Promise<UrlEntity[]>;
  update: (
    id: string,
    data: Partial<Omit<UrlEntity, "id" | "createdAt" | "updatedAt">>
  ) => Promise<UrlEntity>;
  delete: (id: string) => Promise<void>;
  existsByShortCode: (shortCode: string) => Promise<boolean>;
  findActiveUrls: () => Promise<UrlEntity[]>;
  findExpiredUrls: () => Promise<UrlEntity[]>;
  // Analytics methods
  getTotalUrls: () => Promise<number>;
  getTotalClicks: () => Promise<number>;
  getTopUrls: (limit: number) => Promise<UrlEntity[]>;
  getUrlsByDateRange: (startDate: Date, endDate: Date) => Promise<UrlEntity[]>;
  getClicksByDateRange: (
    startDate: Date,
    endDate: Date
  ) => Promise<{ date: string; clicks: number }[]>;
}

export class PrismaUrlDataSource implements UrlDataSource {
  constructor(private prisma: PrismaClient) {}

  async create(
    data: Omit<UrlEntity, "id" | "createdAt" | "updatedAt">
  ): Promise<UrlEntity> {
    const createData: any = {
      originalUrl: data.originalUrl,
      shortCode: data.shortCode,
      isActive: data.isActive,
      clickCount: data.clickCount,
    };

    if (data.userId) createData.userId = data.userId;
    if (data.expiresAt) createData.expiresAt = data.expiresAt;

    const savedUrl = await this.prisma.url.create({ data: createData });

    return {
      id: savedUrl.id,
      originalUrl: savedUrl.originalUrl,
      shortCode: savedUrl.shortCode,
      userId: savedUrl.userId,
      isActive: savedUrl.isActive,
      expiresAt: savedUrl.expiresAt,
      createdAt: savedUrl.createdAt,
      updatedAt: savedUrl.updatedAt,
      clickCount: savedUrl.clickCount,
    };
  }

  async findById(id: string): Promise<UrlEntity | null> {
    const url = await this.prisma.url.findUnique({ where: { id } });
    if (!url) return null;

    return {
      id: url.id,
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      userId: url.userId,
      isActive: url.isActive,
      expiresAt: url.expiresAt,
      createdAt: url.createdAt,
      updatedAt: url.updatedAt,
      clickCount: url.clickCount,
    };
  }

  async findByShortCode(shortCode: string): Promise<UrlEntity | null> {
    const url = await this.prisma.url.findUnique({ where: { shortCode } });
    if (!url) return null;

    return {
      id: url.id,
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      userId: url.userId,
      isActive: url.isActive,
      expiresAt: url.expiresAt,
      createdAt: url.createdAt,
      updatedAt: url.updatedAt,
      clickCount: url.clickCount,
    };
  }

  async findByUserId(userId: string): Promise<UrlEntity[]> {
    const urls = await this.prisma.url.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return urls.map((url) => ({
      id: url.id,
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      userId: url.userId,
      isActive: url.isActive,
      expiresAt: url.expiresAt,
      createdAt: url.createdAt,
      updatedAt: url.updatedAt,
      clickCount: url.clickCount,
    }));
  }

  async update(
    id: string,
    data: Partial<Omit<UrlEntity, "id" | "createdAt" | "updatedAt">>
  ): Promise<UrlEntity> {
    const updateData: any = {
      originalUrl: data.originalUrl,
      shortCode: data.shortCode,
      isActive: data.isActive,
      clickCount: data.clickCount,
    };

    if (data.userId !== undefined) updateData.userId = data.userId;
    if (data.expiresAt !== undefined) updateData.expiresAt = data.expiresAt;

    const updatedUrl = await this.prisma.url.update({
      where: { id },
      data: updateData,
    });

    return {
      id: updatedUrl.id,
      originalUrl: updatedUrl.originalUrl,
      shortCode: updatedUrl.shortCode,
      userId: updatedUrl.userId,
      isActive: updatedUrl.isActive,
      expiresAt: updatedUrl.expiresAt,
      createdAt: updatedUrl.createdAt,
      updatedAt: updatedUrl.updatedAt,
      clickCount: updatedUrl.clickCount,
    };
  }

  async delete(id: string): Promise<void> {
    await this.prisma.url.delete({ where: { id } });
  }

  async existsByShortCode(shortCode: string): Promise<boolean> {
    const count = await this.prisma.url.count({ where: { shortCode } });
    return count > 0;
  }

  async findActiveUrls(): Promise<UrlEntity[]> {
    const urls = await this.prisma.url.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    return urls.map((url) => ({
      id: url.id,
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      userId: url.userId,
      isActive: url.isActive,
      expiresAt: url.expiresAt,
      createdAt: url.createdAt,
      updatedAt: url.updatedAt,
      clickCount: url.clickCount,
    }));
  }

  async findExpiredUrls(): Promise<UrlEntity[]> {
    const urls = await this.prisma.url.findMany({
      where: {
        expiresAt: {
          not: null,
          lt: new Date(),
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return urls.map((url) => ({
      id: url.id,
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      userId: url.userId,
      isActive: url.isActive,
      expiresAt: url.expiresAt,
      createdAt: url.createdAt,
      updatedAt: url.updatedAt,
      clickCount: url.clickCount,
    }));
  }

  async getTotalUrls(): Promise<number> {
    const count = await this.prisma.url.count();
    return count;
  }

  async getTotalClicks(): Promise<number> {
    const sum = await this.prisma.url.aggregate({
      _sum: {
        clickCount: true,
      },
    });
    return sum._sum.clickCount || 0;
  }

  async getTopUrls(limit: number): Promise<UrlEntity[]> {
    const urls = await this.prisma.url.findMany({
      orderBy: {
        clickCount: "desc",
      },
      take: limit,
    });

    return urls.map((url) => ({
      id: url.id,
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      userId: url.userId,
      isActive: url.isActive,
      expiresAt: url.expiresAt,
      createdAt: url.createdAt,
      updatedAt: url.updatedAt,
      clickCount: url.clickCount,
    }));
  }

  async getUrlsByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<UrlEntity[]> {
    const urls = await this.prisma.url.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return urls.map((url) => ({
      id: url.id,
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      userId: url.userId,
      isActive: url.isActive,
      expiresAt: url.expiresAt,
      createdAt: url.createdAt,
      updatedAt: url.updatedAt,
      clickCount: url.clickCount,
    }));
  }

  async getClicksByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<{ date: string; clicks: number }[]> {
    const clicks = await this.prisma.url.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        createdAt: true,
        clickCount: true,
      },
    });

    return clicks.map((click) => ({
      date: click.createdAt.toISOString().split("T")[0] || "",
      clicks: click.clickCount,
    }));
  }
}
