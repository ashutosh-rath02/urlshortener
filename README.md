# URL Shortener System Design & API Documentation

## System Design

### Architecture Overview

This project follows **Clean Architecture** principles, ensuring a clear separation of concerns and maintainability. The main layers are:

- **Domain Layer**: Contains business logic, entities, repository interfaces, and use cases. No dependencies on frameworks or external libraries.
- **Data Layer**: Handles database interaction, data entities, data sources, and repository implementations. Responsible for mapping between domain and persistence models.
- **Presentation Layer**: Contains HTTP controllers and route definitions. Handles request/response formatting and validation.
- **Core Layer**: Contains cross-cutting concerns such as exceptions and utility functions.

### Flow of a Request

1. **HTTP Request** hits a route in the Presentation Layer.
2. The **Controller** parses input and calls the appropriate **Use Case** from the Domain Layer.
3. The **Use Case** interacts with the **Repository Interface** (Domain Layer).
4. The **Repository Implementation** (Data Layer) uses a **Data Source** to interact with the database.
5. The **Data Source** returns data, which is mapped back to a **Domain Entity**.
6. The **Use Case** returns a result to the **Controller**, which formats the HTTP response.

### Key Technologies

- **Express.js** for HTTP server and routing
- **Prisma** for database ORM
- **TypeScript** for type safety
- **dotenv** for environment configuration

---

## API Documentation

### Base URL

```
http://localhost:{PORT}/api
```

### Endpoints

#### 1. Create Short URL

- **URL:** `/api/urls`
- **Method:** `POST`
- **Description:** Create a new short URL for a given original URL.
- **Request Body:**
  ```json
  {
    "originalUrl": "string", // Required. The URL to shorten.
    "userId": "string", // Optional. User identifier.
    "customShortCode": "string", // Optional. Custom short code (3-10 alphanumeric, hyphens, underscores).
    "expiresAt": "ISO8601 string" // Optional. Expiration date.
  }
  ```
- **Response:**
  - `201 Created`
  ```json
  {
    "success": true,
    "data": {
      "id": "string",
      "originalUrl": "string",
      "shortCode": "string",
      "shortUrl": "string",
      "userId": "string",
      "expiresAt": "string",
      "createdAt": "string"
    }
  }
  ```
- **Errors:**
  - `400 Bad Request` (missing/invalid input)
  - `409 Conflict` (short code already exists)
  - `500 Internal Server Error`

---

#### 2. Get URL Info

- **URL:** `/api/urls/:shortCode/info`
- **Method:** `GET`
- **Description:** Retrieve information about a short URL.
- **Response:**
  - `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "shortCode": "string",
      "originalUrl": "string",
      "shortUrl": "string",
      "isActive": true,
      "isExpired": false,
      "clickCount": 0,
      "createdAt": "string",
      "expiresAt": "string"
    }
  }
  ```
- **Errors:**
  - `404 Not Found` (short code does not exist)
  - `500 Internal Server Error`

---

#### 3. Redirect to Original URL

- **URL:** `/api/urls/:shortCode`
- **Method:** `GET`
- **Description:** Redirects to the original URL for the given short code.
- **Response:**
  - `302 Found` (redirects to the original URL)
- **Errors:**
  - `404 Not Found` (short code does not exist)
  - `410 Gone` (URL has expired)
  - `500 Internal Server Error`

---

#### 4. Health Check

- **URL:** `/health`
- **Method:** `GET`
- **Description:** Returns service status and timestamp.
- **Response:**
  - `200 OK`
  ```json
  {
    "status": "OK",
    "timestamp": "string"
  }
  ```

---

## Testing

### Postman Collection

A comprehensive Postman collection is included in `postman_collection.json` with the following test scenarios:

- **Health Check**: Validates service status
- **Create Short URL**: Tests URL creation with custom short code
- **Create Short URL - Auto Generated**: Tests automatic short code generation
- **Create Short URL - Invalid URL**: Tests validation for invalid URLs
- **Get URL Info**: Retrieves and validates URL information
- **Get URL Info - Not Found**: Tests 404 handling
- **Redirect to Original URL**: Tests redirect functionality
- **Redirect to Original URL - Not Found**: Tests 404 handling for redirects
- **Create Short URL - Duplicate Code**: Tests conflict handling for duplicate short codes

**To use the collection:**

1. Import `postman_collection.json` into Postman
2. Set the `baseUrl` environment variable to your server URL (default: `http://localhost:3000`)
3. Run the tests in sequence to validate all endpoints

---

## Error Handling

- All errors return a JSON object with `success: false` and an `error` message.
- Validation and business errors use appropriate HTTP status codes.

---

## Example Usage

**Create Short URL:**

```bash
curl -X POST http://localhost:3000/api/urls \
  -H "Content-Type: application/json" \
  -d '{
    "originalUrl": "https://example.com",
    "customShortCode": "mycode"
  }'
```

**Get URL Info:**

```bash
curl http://localhost:3000/api/urls/mycode/info
```

**Redirect:**

```bash
curl -v http://localhost:3000/api/urls/mycode
```
