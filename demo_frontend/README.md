# Frontend – Run & Docs Guide (Windows)

This guide shows how to run the Next.js frontend locally on Windows and how to lint/build, plus where interactive and generated docs would live.

Stack: Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS 4.

## Prerequisites

- Node.js 18+ (LTS recommended)
- pnpm or npm (examples use npm); PowerShell as your shell

## Environment variables

Only one environment variable is required by the frontend:

- NEXT_PUBLIC_API_BASE_URL – base URL of the backend API (used for HTTP and the price event stream)

PowerShell example:

```powershell
$env:NEXT_PUBLIC_API_BASE_URL = 'http://localhost:8000'
```

## Run the app

Development (with Fast Refresh):

```powershell
npm run dev
```

Open http://localhost:3000 to view the app.

Production build and start:

```powershell
npm run build
npm run start
```

## Quality checks

ESLint:

```powershell
npm run lint
```

TypeScript typecheck is executed during `next build`.

## Project notes

- Co-located Client components live under `src/app/<route>/Client.tsx`.
- Shared UI is under `src/components/**`, hooks under `src/hooks/**`, and API clients in `src/lib/api/**`.
- Status messaging uses a single `StatusMessage` instance per form/page; it defaults to `type="error"`.
- Responsive behavior relies on Tailwind classes (we avoid a custom breakpoints file).

## Generated documentation (TypeDoc)

We generate API/reference docs from TSDoc comments using TypeDoc. Output is written to `/docs`.

Install (one-time):

```powershell
npm i -D typedoc typedoc-plugin-markdown
```

Generate docs:

```powershell
npm run docs
npm run docs:html
```

Configuration: `typedoc.json` (entry points: `src/components`, `src/hooks`, `src/contexts`, `src/lib/api`, `src/types`).

Authoring guidelines:

- Add TSDoc to exported functions/components/hooks. Example:
  ```ts
  /**
   * Renders a single status message.
   * @param message The text to show.
   * @param type Render style, defaults to "error".
   */
  export default function StatusMessage(...) {}
  ```

## Troubleshooting

- If the frontend can’t reach the backend, verify `NEXT_PUBLIC_API_BASE_URL` matches your backend URL (e.g., `http://localhost:8000`).
- If you see CORS issues, make sure the backend allows the frontend origin.
- If `next build` fails on types, resolve the TypeScript errors or run `npm run lint` for hints.
- If `npm run docs` fails, ensure `typedoc` is installed and `typedoc.json` entry points exist.
