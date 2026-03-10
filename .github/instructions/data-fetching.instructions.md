---
description: Read this file to understand how to fetch data in the project.
---
# Data Fetching Guidelines
In this project, we use the `fetch` API for all data fetching needs. Below are the guidelines to follow when implementing data fetching in your code.
## 1. Use server components for Data Fetching
Whenever possible, perform data fetching in server components. This allows you to take advantage of Next.js's server-side rendering capabilities and improves performance. NEVER use client components for data fetching unless you have a specific reason to do so (e.g., real-time updates, client-side interactions). Always prefer server components for static data fetching and rendering.

## 2. Data Fetching Methods

ALWAYS use the helper functions provided in the `data` directory for data fetching. These functions are designed to handle common patterns and ensure consistency across the codebase.

All helper functions in the /data directory should use Drizzle ORM for database interactions. This ensures that all database queries are consistent and optimized for performance.