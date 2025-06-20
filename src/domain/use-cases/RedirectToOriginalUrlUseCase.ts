import { ShortCode } from "../entities/Url";
import { UrlRepository } from "../repositories/UrlRepository";
import { AppException } from "../../core/exceptions/AppException";

// Request/Response DTOs
export interface RedirectRequest {
  shortCode: ShortCode;
}

export interface RedirectResponse {
  originalUrl: string;
  isActive: boolean;
  isExpired: boolean;
}

export class RedirectToOriginalUrlUseCase {
  constructor(private urlRepository: UrlRepository) {}

  async execute(request: RedirectRequest): Promise<RedirectResponse> {
    const { shortCode } = request;

    if (!shortCode) {
      throw new AppException("Short code is required", 400);
    }

    // Find URL by short code
    const url = await this.urlRepository.findByShortCode(shortCode);
    if (!url) {
      throw new AppException("URL not found", 404);
    }

    // Check if URL is accessible
    const isExpired = url.isExpired();
    const isActive = url.canBeAccessed();

    if (!isActive) {
      throw new AppException(
        isExpired ? "URL has expired" : "URL is not active",
        isExpired ? 410 : 404
      );
    }

    // Increment click count
    const updatedUrl = url.incrementClickCount();
    await this.urlRepository.update(updatedUrl);

    return {
      originalUrl: url.originalUrl,
      isActive: url.isActive,
      isExpired,
    };
  }
}
