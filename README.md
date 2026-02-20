# PDF Toolkit

A free, privacy-first PDF toolkit that runs entirely in your browser. No file uploads, no sign-up required.

## Features (Phase 1 – MVP)

| Tool | Description |
|---|---|
| **Merge PDFs** | Combine multiple PDFs into one. Drag to reorder before merging. |
| **Split PDF** | Split into individual pages or extract a custom page range. |
| **Images to PDF** | Convert JPG, PNG, or WebP images to a PDF with layout options. |

All processing is 100% client-side via [pdf-lib](https://pdf-lib.js.org/). Your files never leave your device.

## Tech Stack

- **Frontend**: React 19 + Vite 6 + TypeScript + Tailwind CSS 3
- **Drag & drop**: `@dnd-kit/core` + `@dnd-kit/sortable`
- **PDF processing**: `pdf-lib`
- **Backend** (Phase 2 placeholder): Express + TypeScript

## Getting Started

```bash
# Install all dependencies (root + workspaces)
npm install

# Start both client and server in development mode
npm run dev

# Build the client for production
npm run build
```

The client dev server runs on `http://localhost:5173`.  
The server (Phase 2) runs on `http://localhost:3001`.

## Project Structure

```
pdf-toolkit/
├── client/                 # React + Vite frontend
│   └── src/
│       ├── components/     # UI + layout + tool components
│       ├── hooks/          # useFileUpload hook
│       ├── lib/            # PDF processing utilities
│       ├── pages/          # Route-level page components
│       └── types/          # TypeScript interfaces
│
└── server/                 # Express backend (Phase 2)
    └── src/
        └── index.ts        # Health-check only in Phase 1
```

## Phase 2 Roadmap

- Compress PDF (requires server-side Ghostscript)
- Protect / Unlock PDF (requires server-side processing)
- PDF to Images (requires server-side rendering)
