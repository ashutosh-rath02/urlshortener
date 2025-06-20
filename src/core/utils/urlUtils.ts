import { nanoid } from "nanoid";
import { ShortCode } from "../../domain/entities/Url";

// URL validation
export const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch {
    return false;
  }
};

// Short code validation
export const isValidShortCode = (code: string): boolean => {
  if (typeof code !== "string") return false;
  return code.length >= 3 && code.length <= 10 && /^[a-zA-Z0-9_-]+$/.test(code);
};

// Generate unique short code
export const generateShortCode = (length: number = 6): ShortCode => {
  return nanoid(length);
};
