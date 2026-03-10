# Agent Instructions for Link Shortener Project

This document outlines the coding standards and best practices that all AI agents and developers **MUST** follow when working on the Link Shortener project. Deviating from these standards will result in inconsistent, unmaintainable code. Always read the relevant guideline document **before** writing any code.

## Project Overview

**Link Shortener** is a Next.js application that provides URL shortening functionality. It uses:
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Database**: Neon Serverless Postgres with Drizzle ORM
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI / shadcn
- **Authentication**: Clerk
- **Deployment**: Vercel-ready

## Core Guidelines by Category

> **CRITICAL**: You **MUST** read the relevant guideline document before implementing any related code. Do not rely on memory or assumptions — open the file and follow it exactly.

## Quick Reference

### File Extensions
- React components: `.tsx`
- Type definitions: `.ts` or `.d.ts`
- Styles: Use Tailwind classes in components (no separate `.css` files)
- Config files: `.ts`, `.mjs`, `.json` as appropriate

### TypeScript Configuration
- **Target**: ES2017
- **JSX**: react-jsx
- **Module**: ESM
- **Strict Mode**: Enabled
- **Path Aliases**: `@/*` maps to project root

### ESLint Configuration
- Extends: `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`
- Run with: `npm run lint`

### Development Workflow
```bash
npm run dev      # Start development server (port 3000)
npm run build    # Build for production
npm run lint     # Run ESLint checks
npm start        # Start production server
```

## Important Notes

> **WARNING**: Violating any of the rules below will introduce bugs, security issues, or inconsistencies. Treat every item as a hard requirement.

- **No CSS Files**: All styling **must** use Tailwind CSS utility classes within components — never create separate `.css` files
- **Strict TypeScript**: `any` types are **forbidden**; use proper typing throughout
- **Authentication**: Clerk is the **ONLY** authentication provider — never implement custom auth
- **Protected Routes**: `/dashboard` **must** require authentication via Clerk; always redirect authenticated users from `/`
- **Sign In/Up**: **Always** use Clerk modals, **never** full-page navigation
- **UI Components**: **All** UI components **must** come from shadcn/ui — never create custom component implementations
- **Server Components**: Use server components by default; add `'use client'` **only** when necessary
- **Environmental Variables**: Use `.env.local` for local development; sensitive keys **must never** be committed

## Support Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [Clerk Documentation](https://clerk.com/docs)
- [Neon Documentation](https://neon.tech/docs)

## Updates and Maintenance

These agent instructions are living documents. When adding new standards or changing existing ones:
1. Update the relevant file
2. Update the links in this main AGENTS.md if categories change
3. Document any deprecations clearly
4. Notify the team of significant changes
