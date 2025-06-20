import { config } from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { PrismaClient } from "@prisma/client";
import { createUrlRoutes } from "./src/presentation/routes/urlRoutes";
import { UrlRepositoryImpl } from "./src/data/repositories/UrlRepositoryImpl";
import { PrismaUrlDataSource } from "./src/data/datasources/UrlDataSource";
import { UrlRepository } from "./src/domain/repositories/UrlRepository";
import { redirectController } from "./src/presentation/controllers/urlController";
import { AppException } from "./src/core/exceptions/AppException";

// Load environment variables
config();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

async function startServer() {
  const app = express();
  const prisma = new PrismaClient();

  // Initialize data layer
  const urlDataSource = new PrismaUrlDataSource(prisma);
  const urlRepository: UrlRepository = new UrlRepositoryImpl(urlDataSource);

  // Middleware
  app.use(helmet());
  app.use(cors());
  app.use(morgan("combined"));
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get("/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
  });

  // API routes
  app.use("/api", createUrlRoutes(urlRepository));

  // Root-level redirect for clean URLs
  app.get("/:shortCode", redirectController(urlRepository));

  // 404 handler
  app.use("*", (req, res) => {
    res.status(404).json({
      success: false,
      error: "Route not found",
    });
  });

  // Global error handler
  app.use(
    (
      error: any,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      console.error("Global error handler:", error);

      if (error instanceof AppException) {
        return res.status(error.statusCode).json({
          success: false,
          error: error.message,
        });
      }

      if (error.type === "entity.parse.failed") {
        return res.status(400).json({
          success: false,
          error: "Invalid JSON format",
        });
      }

      return res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  );

  try {
    // Test database connection
    await prisma.$connect();
    console.log("Database connected successfully");

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log(`API base: http://localhost:${PORT}/api`);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      console.log(`Received ${signal}. Starting graceful shutdown...`);

      server.close(async () => {
        console.log("HTTP server closed");

        try {
          await prisma.$disconnect();
          console.log("Database disconnected");
          process.exit(0);
        } catch (error) {
          console.error("Error during shutdown:", error);
          process.exit(1);
        }
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error("Forced shutdown after timeout");
        process.exit(1);
      }, 10000);
    };

    // Handle shutdown signals
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));

    // Handle uncaught exceptions
    process.on("uncaughtException", (error) => {
      console.error("Uncaught Exception:", error);
      gracefulShutdown("uncaughtException");
    });

    process.on("unhandledRejection", (reason, promise) => {
      console.error("Unhandled Rejection at:", promise, "reason:", reason);
      gracefulShutdown("unhandledRejection");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
