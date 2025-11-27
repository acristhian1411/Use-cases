# Implementation Plan - Manual Testing Flow App

We will build a SvelteKit application to manage manual testing flows based on the provided ER diagram.

## User Review Required
> [!IMPORTANT]
> I am proposing to use **SQLite** with **Drizzle ORM** for the database. This allows for a self-contained, easy-to-setup local database without needing a separate server process (like PostgreSQL or MySQL). Please confirm if this is acceptable or if you prefer a different database.

## Proposed Tech Stack
-   **Framework**: SvelteKit (Svelte 5 if available/stable, otherwise Svelte 4)
-   **Language**: JavaScript (No TypeScript as requested)
-   **Styling**: TailwindCSS (for modern, premium aesthetics)
-   **Database**: SQLite (via `better-sqlite3`)
-   **ORM**: Drizzle ORM
-   **Icons**: Lucide-Svelte

## Proposed Changes

### Project Setup
#### [NEW] SvelteKit Project
-   Initialize using `pnpm create svelte@latest`
-   Configure TailwindCSS
-   Install `drizzle-orm`, `drizzle-kit`, `better-sqlite3` using `pnpm`

### Database Schema
#### [NEW] `src/lib/server/db/schema.js`
-   Define `modules` table
-   Define `test_cases` table
-   Define `test_steps` table
-   Define `test_case_actors` table
-   Define relationships

### Backend Logic
#### [NEW] `src/lib/server/db/index.js`
-   Database connection setup

### Frontend Components
#### [NEW] Layout
-   Main navigation sidebar/header
-   Modern, dark-mode capable theme

#### [NEW] Pages
-   `/modules`: List and manage modules
-   `/modules/[id]`: View module details and associated test cases
-   `/tests/new`: Create a new test case (wizard style or single form)
-   `/tests/[id]`: View/Edit test case

## Verification Plan
### Automated Tests
-   We will run `pnpm run check` to verify code.
-   We will use the browser tool to navigate through the app and verify CRUD operations.

### Manual Verification
-   Create a Module "Auth".
-   Create a Test Case "Login Success" under "Auth".
-   Add steps: "Open App", "Enter Creds", "Click Login".
-   Verify data persistence.
