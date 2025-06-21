import { Request, Response } from "express";
import { CreateShortUrlUseCase } from "../../domain/use-cases/CreateShortUrlUseCase";
import { RedirectToOriginalUrlUseCase } from "../../domain/use-cases/RedirectToOriginalUrlUseCase";
import { UrlRepository } from "../../domain/repositories/UrlRepository";
import { AppException } from "../../core/exceptions/AppException";

export const createUrlController = (urlRepository: UrlRepository) => {
  const createShortUrlUseCase = new CreateShortUrlUseCase(urlRepository);

  return async (req: Request, res: Response) => {
    try {
      const request = {
        originalUrl: req.body.originalUrl,
        userId: req.body.userId,
        customShortCode: req.body.customShortCode,
        ...(req.body.expiresAt && {
          expiresAt: new Date(req.body.expiresAt) as Date,
        }),
      };

      const result = await createShortUrlUseCase.execute(request);

      return res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      if (error instanceof AppException) {
        return res.status(error.statusCode).json({
          success: false,
          error: error.message,
        });
      } else {
        console.error("Unexpected error:", error);
        return res.status(500).json({
          success: false,
          error: "Internal server error",
        });
      }
    }
  };
};

export const redirectController = (urlRepository: UrlRepository) => {
  const redirectToOriginalUrlUseCase = new RedirectToOriginalUrlUseCase(
    urlRepository
  );

  return async (req: Request, res: Response) => {
    try {
      const shortCode = req.params.shortCode;

      if (!shortCode) {
        return res.status(400).json({
          success: false,
          error: "Short code is required",
        });
      }

      const request = { shortCode };
      const result = await redirectToOriginalUrlUseCase.execute(request);

      // Redirect to original URL
      return res.redirect(result.originalUrl);
    } catch (error) {
      if (error instanceof AppException) {
        if (error.statusCode === 404) {
          return res.status(404).json({
            success: false,
            error: "URL not found",
          });
        }
        if (error.statusCode === 410) {
          return res.status(410).json({
            success: false,
            error: "URL has expired",
          });
        }
        return res.status(error.statusCode).json({
          success: false,
          error: error.message,
        });
      } else {
        console.error("Unexpected error:", error);
        return res.status(500).json({
          success: false,
          error: "Internal server error",
        });
      }
    }
  };
};

export const getUrlInfoController = (urlRepository: UrlRepository) => {
  return async (req: Request, res: Response) => {
    try {
      const shortCode = req.params.shortCode;

      if (!shortCode) {
        return res.status(400).json({
          success: false,
          error: "Short code is required",
        });
      }

      const url = await urlRepository.findByShortCode(shortCode);

      if (!url) {
        return res.status(404).json({
          success: false,
          error: "URL not found",
        });
      }

      const baseUrl = process.env.BASE_URL || "http://localhost:3000";
      const shortUrl = `${baseUrl}/${url.shortCode}`;

      return res.json({
        success: true,
        data: {
          shortCode: url.shortCode,
          originalUrl: url.originalUrl,
          shortUrl,
          isActive: url.isActive,
          isExpired: url.isExpired(),
          clickCount: url.clickCount,
          createdAt: url.createdAt,
          expiresAt: url.expiresAt,
        },
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      return res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  };
};

export const getAnalyticsController = (urlRepository: UrlRepository) => {
  return async (req: Request, res: Response) => {
    try {
      // Get date range from query parameters (default to last 30 days)
      const days = parseInt(req.query.days as string) || 30;
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Get analytics data
      const [
        totalUrls,
        totalClicks,
        topUrls,
        urlsByDateRange,
        clicksByDateRange,
      ] = await Promise.all([
        urlRepository.getTotalUrls(),
        urlRepository.getTotalClicks(),
        urlRepository.getTopUrls(10),
        urlRepository.getUrlsByDateRange(startDate, endDate),
        urlRepository.getClicksByDateRange(startDate, endDate),
      ]);

      // Calculate additional metrics
      const activeUrls = await urlRepository.findActiveUrls();
      const expiredUrls = await urlRepository.findExpiredUrls();

      const averageClicksPerUrl = totalUrls > 0 ? totalClicks / totalUrls : 0;
      const activeUrlCount = activeUrls.length;
      const expiredUrlCount = expiredUrls.length;

      // Format top URLs for response
      const baseUrl = process.env.BASE_URL || "http://localhost:3000";
      const formattedTopUrls = topUrls.map((url) => ({
        shortCode: url.shortCode,
        originalUrl: url.originalUrl,
        shortUrl: `${baseUrl}/${url.shortCode}`,
        clickCount: url.clickCount,
        createdAt: url.createdAt,
      }));

      return res.json({
        success: true,
        data: {
          summary: {
            totalUrls,
            totalClicks,
            activeUrlCount,
            expiredUrlCount,
            averageClicksPerUrl: Math.round(averageClicksPerUrl * 100) / 100,
          },
          topUrls: formattedTopUrls,
          clicksByDateRange,
          dateRange: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            days,
          },
        },
      });
    } catch (error) {
      console.error("Analytics error:", error);
      return res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  };
};
