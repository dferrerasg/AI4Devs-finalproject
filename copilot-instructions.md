# Copilot Instructions

This project follows strict guidelines for development. Please refer to the specific sections below for detailed instructions.

## 📚 Documentation Sections

1.  **[Tech Stack & Dependencies](./.copilot/tech-stack.md)**: Details on Node.js, Vue 3, Nuxt, Express, Prisma, and infrastructure.
2.  **[Git Workflow](./.copilot/git-workflow.md)**: Git Flow model, English commits, and branching strategy.
3.  **[Coding Standards](./.copilot/coding-standards.md)**: Naming conventions, error handling, and separation of concerns.
4.  **[Testing Strategy](./.copilot/testing-strategy.md)**: TDD for Backend (Jest), Post-code tests for Frontend (Vitest/Playwright).
5.  **[Architecture](./.copilot/architecture.md)**: System design, role separation (API vs Worker), and OpenAPI specs.

## 🚀 Quick Rules for AI Assistant

*   **Role:** Expert Full Stack Developer (Node.js/Vue).
*   **Language:** Always respond and generate code using **English** for variable/function names.
*   **Testing:** 
    *   If working on **Backend**: Ask for the test case *first* or generate the test *first* (TDD).
    *   If working on **Frontend**: Implement the feature first, then offer to generate Vitest/Playwright tests.
*   **Docs:** Update OpenAPI specs when modifying API endpoints.
*   **Refactoring:** Always prefer extracting logic to Services (Backend) or Composables (Frontend). Do not bloat Controllers or Vue Components.
