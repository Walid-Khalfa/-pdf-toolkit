# PDF Toolkit

A free, privacy-first PDF toolkit with client-side and server-side processing. No sign-up required.

## Table of Contents

- [Features](#features)
  - [Client-Side (Privacy-First)](#client-side-privacy-first)
  - [Server-Side (Advanced Processing)](#server-side-advanced-processing)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Security Features](#security-features)
- [Testing](#testing)
- [CI/CD](#cicd)
- [Contributing](#contributing)
- [License](#license)

## Features

### Client-Side (Privacy-First)

These tools run entirely in your browser - your files never leave your device.

| Tool              | Description                                                     |
| ----------------- | --------------------------------------------------------------- |
| **Merge PDFs**    | Combine multiple PDFs into one. Drag to reorder before merging. |
| **Split PDF**     | Split into individual pages or extract a custom page range.     |
| **Images to PDF** | Convert JPG, PNG, or WebP images to a PDF with layout options.  |

### Server-Side (Advanced Processing)

| Tool              | Description                                                     |
| ----------------- | --------------------------------------------------------------- |
| **Compress PDF**  | Reduce PDF file size with Ghostscript (low/medium/high quality) |
| **Protect PDF**   | Add password protection and permissions with qpdf encryption    |
| **Unlock PDF**    | Remove password protection from encrypted PDFs                  |
| **PDF to Images** | Convert PDF pages to JPG/PNG images at configurable DPI         |

## Tech Stack

- **Frontend**: React 19 + Vite 6 + TypeScript + Tailwind CSS 3
- **Backend**: Express + TypeScript
- **PDF Processing**: pdf-lib (client), Ghostscript + qpdf (server)
- **Drag & Drop**: @dnd-kit/core + @dnd-kit/sortable
- **Validation**: Zod
- **Security**: Helmet + express-rate-limit
- **Testing**: Vitest + Testing Library
- **CI/CD**: GitHub Actions

## Prerequisites

For full server-side functionality, install these CLI tools:

- **Ghostscript** (`gs`) - PDF compression
- **qpdf** - PDF encryption/decryption

```bash
# macOS
brew install ghostscript qpdf

# Ubuntu/Debian
sudo apt install ghostscript qpdf

# Windows (with Chocolatey)
choco install ghostscript qpdf
```

> Note: The server will still run without these tools, falling back to basic pdf-lib processing with reduced functionality.

## Getting Started

```bash
# Install all dependencies
npm install

# Start both client and server in development mode
npm run dev

# Build for production
npm run build
```

The client runs on `http://localhost:5173`  
The server runs on `http://localhost:3001`

## Available Scripts

| Command              | Description                                 |
| -------------------- | ------------------------------------------- |
| `npm run dev`        | Start client and server in development mode |
| `npm run build`      | Build client for production                 |
| `npm run lint`       | Run ESLint on all workspaces                |
| `npm run typecheck`  | Run TypeScript type checking                |
| `npm run test`       | Run all tests                               |
| `npm run test:watch` | Run tests in watch mode                     |
| `npm run format`     | Format code with Prettier                   |

## Environment Variables

Copy `.env.example` to `.env` in the server directory:

```bash
cp server/.env.example server/.env
```

| Variable                  | Default                 | Description                               |
| ------------------------- | ----------------------- | ----------------------------------------- |
| `PORT`                    | `3001`                  | Server port                               |
| `NODE_ENV`                | `development`           | Environment (development/production/test) |
| `CORS_ORIGIN`             | `http://localhost:5173` | Allowed CORS origins (comma-separated)    |
| `RATE_LIMIT_WINDOW_MS`    | `900000`                | Rate limit window (15 min)                |
| `RATE_LIMIT_MAX_REQUESTS` | `100`                   | Max requests per window                   |
| `MAX_FILE_SIZE_MB`        | `50`                    | Max file upload size                      |
| `LOG_LEVEL`               | `info`                  | Logging level (error/warn/info/debug)     |

## Project Structure

```
pdf-toolkit/
├── .github/
│   ├── workflows/
│   │   └── ci.yml              # GitHub Actions CI/CD
│   ├── ISSUE_TEMPLATE/         # Issue templates
│   └── dependabot.yml          # Dependency updates
├── client/                     # React + Vite frontend
│   ├── src/
│   │   ├── __tests__/          # Test files
│   │   ├── components/         # UI + layout + tool components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # PDF processing & API utilities
│   │   ├── pages/              # Route-level page components
│   │   ├── test/               # Test setup
│   │   └── types/              # TypeScript interfaces
│   ├── eslint.config.js
│   └── vite.config.ts
├── server/                     # Express backend
│   ├── src/
│   │   ├── __tests__/          # Test files
│   │   ├── middleware/         # Express middleware
│   │   ├── routes/             # API routes
│   │   ├── services/           # Business logic
│   │   ├── types/              # TypeScript interfaces
│   │   └── utils/              # Utility functions
│   ├── .env.example
│   ├── eslint.config.js
│   └── vitest.config.ts
├── shared/                     # Shared TypeScript types
│   └── index.ts
├── .husky/                     # Git hooks
├── .prettierrc                 # Prettier config
└── package.json                # Root package with workspaces
```

## API Endpoints

| Method | Endpoint             | Description           |
| ------ | -------------------- | --------------------- |
| `GET`  | `/api/health`        | Health check          |
| `POST` | `/api/compress`      | Compress PDF          |
| `POST` | `/api/protect`       | Password protect PDF  |
| `POST` | `/api/unlock`        | Remove PDF password   |
| `POST` | `/api/pdf-to-images` | Convert PDF to images |

## Security Features

- **Helmet** - Security HTTP headers
- **Rate Limiting** - Prevent abuse (100 req/15min, 20 uploads/min)
- **CORS** - Configurable allowed origins
- **Input Validation** - Zod schema validation on all endpoints
- **File Validation** - PDF-only uploads with size limits

## Testing

The project includes comprehensive tests:

```bash
# Run all tests
npm run test

# Run with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

Current coverage: **45 tests** across client and server.

## CI/CD

GitHub Actions workflow runs on every push and pull request:

1. **Lint** - ESLint on all workspaces
2. **TypeCheck** - TypeScript validation
3. **Test** - Run all tests
4. **Build** - Build client and server

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (pre-commit hooks will run linting)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT
