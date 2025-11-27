# Manual Testing Flow App - Walkthrough

This application allows you to manage manual testing flows, organizing them by modules and test cases with detailed steps and actors.

## Getting Started

1.  **Install Dependencies**:
    ```bash
    pnpm install
    ```

2.  **Run the Application**:
    ```bash
    pnpm run dev
    ```
    Open your browser at `http://localhost:5173`.

## Features Implemented

### 1. Module Management
-   **View All Modules**: Navigate to "Modules" to see all modules in a card layout
-   **Create Module**: Click "New Module" and enter name and description
-   **View Module Details**: Click on any module card to see details and associated test cases
-   **Edit Module**: Use the edit (pencil) icon on the module details page
-   **Delete Module**: Use the delete (trash) icon on the module details page

### 2. Test Case Management
-   **View All Test Cases**: Navigate to "Test Cases" to see all test cases across modules
-   **Search Test Cases**: Use the search bar to filter by title or module name
-   **Create Test Case**:
    -   From a Module page, click "New Test Case"
    -   Or go to "Test Cases" > "New Test Case"
    -   Select a Module
    -   Enter Title, Description, Preconditions, Postconditions, and Expected Result
-   **Edit Test Case**: Click on any test case to view and edit all details
-   **Delete Test Case**: Use the delete button on the test case edit page

### 3. Dynamic Test Steps Editor
-   **Add Steps**: Click "Add Step" to add new test steps
-   **Configure Steps**: For each step, enter:
    -   Action (what the user does)
    -   Type (Normal, Alternative, or Exception)
    -   Expected Result for that step
-   **Remove Steps**: Click the trash icon on any step to remove it
-   **Auto-numbering**: Steps are automatically numbered sequentially

### 4. Actor Management
-   **Add Actors**: Click "Add Actor" to add actors to a test case
-   **Enter Actor Names**: Type actor names (e.g., "Admin", "User", "Guest")
-   **Remove Actors**: Click the trash icon to remove an actor

## Database
The application uses a local SQLite database (`sqlite.db`).
-   **Schema**: Defined in `src/lib/server/db/schema.js`
-   **ORM**: Drizzle ORM for type-safe database interactions
-   **Tables**: `modules`, `test_cases`, `test_steps`, `test_case_actors`

## Technology Stack
-   **Framework**: SvelteKit with Svelte 5 runes
-   **Language**: JavaScript with JSDoc type annotations
-   **Package Manager**: pnpm
-   **Styling**: TailwindCSS with custom dark theme
-   **Database**: SQLite with Drizzle ORM
-   **Icons**: lucide-svelte

## Next Steps
To further enhance the application, consider:
1.  **Test Execution**: Add functionality to execute tests and record results
2.  **Test Reports**: Generate reports showing test execution history
3.  **Export/Import**: Export test cases to PDF or import from CSV
4.  **User Authentication**: Add user accounts and permissions
5.  **Test Suites**: Group test cases into test suites for batch execution
