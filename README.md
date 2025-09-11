# Accessibility Scanner API

A backend service to perform accessibility scans on URLs using **Puppeteer** and **axe-core**, with user authentication and CSV export support.

## Features

- Run accessibility scans for multiple URLs.
- Store scan results in **MongoDB** with violation details.
- User authentication with JWT (login/logout).
- CRUD operations for scans.
- Export scan results as a CSV file.
- Pagination support for fetching scans.
- Built-in schema validation using **Zod**.

## Tech Stack

- **Bun** (JavaScript/TypeScript runtime)
- **MongoDB**
- **Puppeteer** (Headless Chromium)
- **axe-core** (Accessibility testing)
- **JWT** for authentication
- **Zod** for schema validation
- **CSV export** via Node streams

---

## Getting Started

### Prerequisites

- Docker installed
- Environment variables configured (see `.env.example`)

### Installation

```bash
git clone https://github.com/holubba/Accesibility-Checker-Bun
cd Accesibility-Checker-Bun
cp env.example ./.env
docker-compose up -d --build
```

### Running test suite

- A MongoDB Docker container must be running, as it is required for executing the tests.

```bash
bun run test
```

Tests are made following some guidelines seen in: <https://github.com/goldbergyoni/nodejs-testing-best-practices>

---

## API Endpoints

### Authentication

- POST /auth/login – Login a user and return JWT.

- POST /auth/logout – Logout a user, invalidate the JWT.

### Users

- POST /users – Create a new user.

### Scans

- POST /scans/scan-url – Run accessibility scans on one or multiple URLs.

- GET /scans – Get all scans (supports pagination: limit & offset).

- GET /scans/:id – Get a scan by its ID.

- PUT /scans/:id – Re-run an accessibility scan for a specific scan.

- DELETE /scans/:id – Delete a scan by its ID.

- GET /scans/export – Export all scans as a CSV file.

---

## Tests Coverage

```
-------------------------------------------|---------|---------|-------------------
File                                       | % Funcs | % Lines | Uncovered Line #s
-------------------------------------------|---------|---------|-------------------
All files                                  |   99.15 |   99.62 |
 src/config/environment-variables.ts       |  100.00 |  100.00 |
 src/config/index.ts                       |  100.00 |  100.00 |
 src/controllers/auth/login.controller.ts  |  100.00 |  100.00 |
 src/controllers/auth/logout.controller.ts |  100.00 |  100.00 |
 src/controllers/scan/scan.controller.ts   |  100.00 |  100.00 |
 src/controllers/users/users.controller.ts |  100.00 |  100.00 |
 src/errors/errors.ts                      |  100.00 |  100.00 |
 src/middleware/auth.middleware.ts         |  100.00 |  100.00 |
 src/routes/auth.routes.ts                 |  100.00 |  100.00 |
 src/routes/scan.routes.ts                 |  100.00 |  100.00 |
 src/routes/users.routes.ts                |  100.00 |  100.00 |
 src/schemas/auth/auth.schemas.ts          |  100.00 |  100.00 |
 src/schemas/config/env.schema.ts          |  100.00 |  100.00 |
 src/schemas/scans/delete-by-id.schema.ts  |  100.00 |  100.00 |
 src/schemas/scans/export-scans.schema.ts  |  100.00 |  100.00 |
 src/schemas/scans/get-all.schema.ts       |  100.00 |  100.00 |
 src/schemas/scans/get-by-id.schema.ts     |  100.00 |  100.00 |
 src/schemas/scans/scan-urls.schema.ts     |  100.00 |  100.00 |
 src/schemas/scans/update-by-id.schema.ts  |  100.00 |  100.00 |
 src/schemas/users/login-user.schema.ts    |  100.00 |  100.00 |
 src/schemas/users/logout.schema.ts        |  100.00 |  100.00 |
 src/schemas/users/users.schemas.ts        |  100.00 |  100.00 |
 src/services/auth/auth.service.ts         |  100.00 |  100.00 |
 src/services/auth/login.service.ts        |  100.00 |  100.00 |
 src/services/auth/logout.service.ts       |  100.00 |  100.00 |
 src/services/db/mongo-connect.ts          |  100.00 |  100.00 |
 src/services/scan/delete-by-id.ts         |  100.00 |  100.00 |
 src/services/scan/export-scans.service.ts |  100.00 |  100.00 |
 src/services/scan/get-all.service.ts      |  100.00 |  100.00 |
 src/services/scan/get-by-id.ts            |  100.00 |  100.00 |
 src/services/scan/scan.ts                 |   66.67 |   97.50 |
 src/services/users/create.ts              |  100.00 |   95.83 |
 src/utils/db.ts                           |  100.00 |   91.67 |
 src/utils/errors.utils.ts                 |  100.00 |  100.00 |
 src/utils/handler-adapter.ts              |  100.00 |  100.00 |
 src/utils/http-responses.ts               |  100.00 |  100.00 |
 src/utils/pagination.ts                   |  100.00 |  100.00 |
 src/utils/parser.utils.ts                 |  100.00 |  100.00 |
 src/utils/stream-adapter.ts               |  100.00 |  100.00 |
-------------------------------------------|---------|---------|-------------------
```

---

## License

### MIT License
