import { Url, ShortCode } from "../entities/Url";
import { UrlRepository } from "../repositories/UrlRepository";
import { AppException } from "../../core/exceptions/AppException";
import {
  isValidUrl,
  isValidShortCode,
  generateShortCode,
} from "../../core/utils/urlUtils";

// Request/Response DTOs
export interface CreateShortUrlRequest {
  originalUrl: string;
  userId?: string;
  customShortCode?: ShortCode;
  expiresAt?: Date;
}

export interface CreateShortUrlResponse {
  id: string;
  originalUrl: string;
  shortCode: ShortCode;
  shortUrl: string;
  userId?: string;
  expiresAt?: Date;
  createdAt: Date;
}

export class CreateShortUrlUseCase {
  constructor(private urlRepository: UrlRepository) {}

  async execute(
    request: CreateShortUrlRequest
  ): Promise<CreateShortUrlResponse> {
    // Validate input
    if (!request.originalUrl) {
      throw new AppException("Original URL is required", 400);
    }

    if (!isValidUrl(request.originalUrl)) {
      throw new AppException("Invalid URL format", 400);
    }

    // Handle custom short code
    let shortCode = request.customShortCode;

    if (shortCode) {
      if (!isValidShortCode(shortCode)) {
        throw new AppException(
          "Invalid short code format. Use 3-10 alphanumeric characters, hyphens, or underscores.",
          400
        );
      }

      const exists = await this.urlRepository.existsByShortCode(shortCode);
      if (exists) {
        throw new AppException("Short code already exists", 409);
      }
    } else {
      // Generate unique short code
      let attempts = 0;
      const maxAttempts = 10;

      do {
        shortCode = generateShortCode();
        const exists = await this.urlRepository.existsByShortCode(shortCode);
        if (!exists) break;
        attempts++;
      } while (attempts < maxAttempts);

      if (attempts >= maxAttempts) {
        throw new AppException("Unable to generate unique short code", 500);
      }
    }

    // Create URL data
    const urlData = Url.create({
      originalUrl: request.originalUrl,
      shortCode,
      ...(request.userId && { userId: request.userId }),
      ...(request.expiresAt && { expiresAt: request.expiresAt }),
    });

    // Save to repository
    const savedUrl = await this.urlRepository.save(urlData);

    // Build response
    const baseUrl = process.env.BASE_URL || "http://localhost:3000";
    const shortUrl = `${baseUrl}/${savedUrl.shortCode}`;

    const response: CreateShortUrlResponse = {
      id: savedUrl.id,
      originalUrl: savedUrl.originalUrl,
      shortCode: savedUrl.shortCode,
      shortUrl,
      createdAt: savedUrl.createdAt,
    };

    if (savedUrl.userId) response.userId = savedUrl.userId;
    if (savedUrl.expiresAt) response.expiresAt = savedUrl.expiresAt;

    return response;
  }
}
