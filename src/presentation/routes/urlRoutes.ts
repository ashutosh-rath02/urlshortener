import { Router } from "express";
import { UrlRepository } from "../../domain/repositories/UrlRepository";
import {
  createUrlController,
  getUrlInfoController,
  redirectController,
  getAnalyticsController,
} from "../controllers/urlController";

/**
 * Creates and returns the URL-related API routes.
 * @param urlRepository - The URL repository implementation.
 * @returns {Router} Express router with all URL endpoints.
 */
export const createUrlRoutes = (urlRepository: UrlRepository) => {
  const router = Router();

  /**
   * @route POST /api/urls
   * @summary Create a new short URL.
   * @body { originalUrl: string, userId?: string, customShortCode?: string, expiresAt?: string }
   * @returns 201 { success: true, data: { ... } } on success
   * @returns 400,409,500 { success: false, error: string } on error
   */
  router.post("/urls", createUrlController(urlRepository));

  /**
   * @route GET /api/urls/:shortCode/info
   * @summary Get information about a short URL.
   * @param {string} shortCode - The short code to look up.
   * @returns 200 { success: true, data: { ... } } on success
   * @returns 404,500 { success: false, error: string } on error
   */
  router.get("/urls/:shortCode/info", getUrlInfoController(urlRepository));

  /**
   * @route GET /api/urls/:shortCode
   * @summary Redirect to the original URL for the given short code.
   * @param {string} shortCode - The short code to redirect.
   * @returns 302 Redirects to the original URL
   * @returns 404,410,500 { success: false, error: string } on error
   */
  router.get("/urls/:shortCode", redirectController(urlRepository));

  /**
   * @route GET /api/analytics
   * @summary Get analytics data for URLs.
   * @query {number} days - Number of days to analyze (default: 30)
   * @returns 200 { success: true, data: { ... } } on success
   * @returns 500 { success: false, error: string } on error
   */
  router.get("/analytics", getAnalyticsController(urlRepository));

  return router;
};
