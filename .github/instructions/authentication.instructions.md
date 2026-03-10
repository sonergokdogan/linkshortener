---
description:  Read this before implementing or modifying authentication in the project.
---

# Authentication Guidelines


**Clerk** is the exclusive authentication and authorization provider for this project. No other authentication method should be implemented. Clerk provides user management, sign-in/sign-up flows, and session management out of the box.

## Clerk Setup

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
```

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Frontend public key (safe to expose)
- `CLERK_SECRET_KEY` - Backend secret key (never expose)
- `CLERK_WEBHOOK_SECRET` - For webhook signature verification

### Root Layout Setup

```typescript
// app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

## Protected Routes

### Dashboard as Protected Route

The `/dashboard` page and all child routes must be protected and require user authentication.

```typescript
// app/dashboard/layout.tsx
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return <div className="dashboard-layout">{children}</div>;
}
```

### Protecting Specific Pages

```typescript
// app/dashboard/settings/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return (
    <div>
      <h1>Settings</h1>
      {/* Settings content */}
    </div>
  );
}
```

## Authentication Checks

### Server-Side Authentication

```typescript
// ✓ Good - Check authentication in server components
import { auth, currentUser } from "@clerk/nextjs/server";

export default async function UserProfile() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    return <div>Not authenticated</div>;
  }

  return (
    <div>
      <h1>{user.fullName}</h1>
      <p>{user.primaryEmailAddress?.emailAddress}</p>
    </div>
  );
}
```

### Client-Side Authentication

```typescript
// ✓ Good - Client-side authentication check
"use client";

import { useAuth, useUser } from "@clerk/nextjs";

export default function ClientComponent() {
  const { userId, isLoaded } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();

  if (!isLoaded || !userLoaded) {
    return <div>Loading...</div>;
  }

  if (!userId || !user) {
    return <div>Not authenticated</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.fullName}</h1>
    </div>
  );
}
```

## Sign In & Sign Up

### Modal Implementation (Required)

Sign in and sign up must always launch as modals, not full-page navigations.

```typescript
// ✓ Good - Modal sign in
import { SignInButton, SignUpButton } from "@clerk/nextjs";

export default function HomePage() {
  return (
    <div>
      <h1>Welcome</h1>
      <div className="flex gap-4">
        <SignInButton mode="modal">
          <button>Sign In</button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button>Sign Up</button>
        </SignUpButton>
      </div>
    </div>
  );
}
```

### Custom Modal Styling

```typescript
// ✓ Good - Customize modal appearance
import { SignInButton } from "@clerk/nextjs";

export default function AuthButton() {
  return (
    <SignInButton
      mode="modal"
      forceRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
    >
      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Sign In
      </button>
    </SignInButton>
  );
}
```

## Redirects & Navigation

### Logged-In User Redirect

If a logged-in user tries to access the homepage, they should be redirected to `/dashboard`.

```typescript
// ✓ Good - Homepage with redirect
// app/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const { userId } = await auth();

  // Redirect logged-in users to dashboard
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div>
      <h1>Welcome to Link Shortener</h1>
      {/* Public content */}
    </div>
  );
}
```

### Post-Login Redirect

```typescript
// ✓ Good - Redirect after successful sign-in
import { SignInButton } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <SignInButton
      mode="modal"
      forceRedirectUrl="/dashboard"
      fallbackRedirectUrl="/dashboard"
    >
      <button>Sign In</button>
    </SignInButton>
  );
}
```

## Protected API Routes

### Protecting Endpoints

```typescript
// ✓ Good - Protected API route
// app/api/links/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";

export async function POST(request: NextRequest) {
  // Check authentication
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    // Create link associated with authenticated user
    const result = await db
      .insert(shortLinks)
      .values({
        id: crypto.randomUUID(),
        userId: userId, // Always associate with authenticated user
        originalUrl: body.originalUrl,
        title: body.title,
      })
      .returning();

    return NextResponse.json(
      { data: result[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create link:", error);
    return NextResponse.json(
      { error: "Failed to create link" },
      { status: 500 }
    );
  }
}
```

### Getting Authenticated User Data

```typescript
// ✓ Good - Use userId in API operations
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const userLinks = await db.query.shortLinks.findMany({
    where: eq(shortLinks.userId, userId),
  });

  return NextResponse.json({ data: userLinks });
}
```

## User Properties

### Accessing User Information

```typescript
import { currentUser } from "@clerk/nextjs/server";

const user = await currentUser();

// Available properties:
// user.id - User ID
// user.fullName - Full name
// user.firstName - First name
// user.lastName - Last name
// user.primaryEmailAddress?.emailAddress - Email
// user.imageUrl - Profile image
// user.created_at - Account creation date
// user.updated_at - Last update date
```

## User Metadata (Optional)

Store additional user data with Clerk:

```typescript
// ✓ Good - Set user metadata
import { auth, currentUser } from "@clerk/nextjs/server";

export async function updateUserPreferences(preferences: UserPreferences) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  // Update user's public metadata
  const user = await currentUser();
  
  // Metadata would typically be set via Clerk Dashboard
  // or through management API for more complex operations
}
```

## Webhooks

### Listening to Auth Events

```typescript
// ✓ Good - Webhook for user events
// app/api/webhooks/clerk/route.ts
import { Webhook } from "svix";
import { NextResponse, NextRequest } from "next/server";

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  const payloadString = await req.text();
  const headerPayload = req.headers;

  const svixHeaders = {
    "svix-id": headerPayload.get("svix-id"),
    "svix-timestamp": headerPayload.get("svix-timestamp"),
    "svix-signature": headerPayload.get("svix-signature"),
  };

  const wh = new Webhook(webhookSecret);

  let evt: any;

  try {
    evt = wh.verify(payloadString, svixHeaders as any) as any;
  } catch (err) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = evt.data;
  const eventType: string = evt.type;

  if (eventType === "user.created") {
    // Handle new user
    console.log(`User ${id} signed up`);
  }

  if (eventType === "user.updated") {
    // Handle user update
    console.log(`User ${id} was updated`);
  }

  return NextResponse.json({ message: "Received" });
}
```

## Sign Out

### User Sign Out

```typescript
// ✓ Good - Sign out flow
"use client";

import { SignOutButton } from "@clerk/nextjs";

export default function UserMenu() {
  return (
    <SignOutButton redirectUrl="/">
      <button>Sign Out</button>
    </SignOutButton>
  );
}
```

### Sign Out in API

```typescript
// ✓ Good - Sign out via API (less common)
import { auth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  // Clerk handles session termination automatically
  // Just redirect user to home page
  return NextResponse.json({ message: "Signed out" });
}
```

## Authorization Patterns

### Role-Based Access Control (RBAC)

While Clerk handles authentication, you can implement authorization using user metadata or database roles.

```typescript
// ✓ Good - Simple role checking
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { eq } from "drizzle-orm";

export default async function AdminPage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    redirect("/");
  }

  // Check user's role in database or Clerk metadata
  const userRole = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (userRole?.role !== "admin") {
    return <div>Access denied. Admin only.</div>;
  }

  return <div>Admin panel</div>;
}
```

### Protected Wrapper Component

```typescript
// ✓ Good - Authorization wrapper component
"use client";

import { useAuth } from "@clerk/nextjs";
import { ReactNode } from "react";

interface ProtectedProps {
  children: ReactNode;
  requiredRole?: string;
}

export function ProtectedComponent({
  children,
  requiredRole,
}: ProtectedProps) {
  const { userId, isLoaded } = useAuth();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!userId) {
    return <div>Not authenticated</div>;
  }

  // Add role checking logic if needed
  if (requiredRole) {
    // Check user's role and return conditional content
  }

  return <>{children}</>;
}
```

## Session & Tokens

### Accessing Session Info

```typescript
// ✓ Good - Session information
import { auth } from "@clerk/nextjs/server";

export default async function Component() {
  const { userId, sessionId, sessionClaims } = await auth();

  return (
    <div>
      <p>User ID: {userId}</p>
      <p>Session ID: {sessionId}</p>
    </div>
  );
}
```

### Passing Session to External APIs

```typescript
// ✓ Good - Include session token in external API calls
import { auth } from "@clerk/nextjs/server";

export async function callExternalAPI() {
  const { getToken } = await auth();
  const token = await getToken();

  const response = await fetch("https://api.example.com/data", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
}
```

## Common Patterns

### Auth Guard Hook

```typescript
// ✓ Good - Custom hook for auth checking
// hooks/useProtected.ts
"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useProtected() {
  const { userId, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !userId) {
      router.push("/");
    }
  }, [isLoaded, userId, router]);

  return { isLoaded, userId, isAuthenticated: !!userId };
}

// Usage in client component
export default function ProtectedPage() {
  const { isLoaded, isAuthenticated } = useProtected();

  if (!isLoaded) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Redirecting...</div>;

  return <div>Protected content</div>;
}
```

### Admin-Only Route

```typescript
// ✓ Good - Middleware approach
// app/admin/layout.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { eq } from "drizzle-orm";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  // Check if user is admin
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (user?.role !== "admin") {
    redirect("/dashboard");
  }

  return <div className="admin-layout">{children}</div>;
}
```

## Important Rules

1. **Clerk is mandatory** - Never implement custom authentication
2. **Modals only** - Sign in/sign up must launch as Clerk modals
3. **Protect /dashboard** - Always require authentication for dashboard routes
4. **Redirect logic** - Logged-in users on `/` should redirect to `/dashboard`
5. **userId association** - Always link data to `userId` from Clerk
6. **Never store secrets** - Use environment variables for all sensitive keys
7. **Validate on backend** - Always verify authentication on API routes

## Summary Checklist

- [ ] Clerk environment variables configured
- [ ] ClerkProvider wraps entire app
- [ ] `/dashboard` layout checks `auth()`
- [ ] `/dashboard` redirects unauthenticated users
- [ ] Homepage redirects authenticated users to `/dashboard`
- [ ] Sign in/sign up use Clerk modals
- [ ] All API routes check `auth()` before operations
- [ ] User data associated with `userId`
- [ ] No custom authentication implemented
- [ ] Webhooks configured for user events (if needed)
- [ ] Session tokens used for external API calls
- [ ] Authorization logic implemented for admin/special routes
