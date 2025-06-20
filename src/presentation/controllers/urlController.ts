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
