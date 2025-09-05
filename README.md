# Accessibility Scanner API

A backend service to perform accessibility scans on URLs using **Puppeteer** and **axe-core**, with user authentication and CSV export support.

---

## Features

- Run accessibility scans for multiple URLs.
- Store scan results in **MongoDB** with violation details.
- User authentication with JWT (login/logout).
- CRUD operations for scans.
- Export scan results as a CSV file.
- Pagination support for fetching scans.
- Built-in schema validation using **Zod**.

---

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

---

### Installation

```bash
git clone <repo-url>
cd accessibility-scanner-api
docker-compose up -d -build
```

---

### Running test suites

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

## License

### MIT License
