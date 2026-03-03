# UI Components Guide

## Overview

This project uses **shadcn/ui** exclusively for all user interface components. shadcn/ui provides a collection of accessible, reusable components built on top of Radix UI and Tailwind CSS. **No custom components should be created**—always use shadcn/ui components as the foundation.

## Core Principles

- **shadcn/ui First**: All UI components must come from shadcn/ui
- **No Custom Components**: Do not create custom component implementations
- **Accessibility**: All shadcn/ui components are built with accessibility standards (WCAG) in mind
- **Compose Over Create**: Build complex UIs by composing multiple shadcn/ui components
- **Type Safety**: All components have full TypeScript support

## Installation & Setup

### Adding Components

Use the shadcn/ui CLI to add components to the project:

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add dialog
```

Components are copied into the project's component library, typically in `components/ui/` directory. After adding a component, it can be imported and used directly.

### Available Components

Common shadcn/ui components for this project include:

- **Layout**: `card`, `separator`, `container`
- **Input**: `button`, `input`, `textarea`, `select`, `checkbox`, `radio-group`
- **Feedback**: `alert`, `toast`, `dialog`, `popover`, `tooltip`
- **Navigation**: `tabs`, `dropdown-menu`, `navigation-menu`
- **Data Display**: `table`, `badge`, `progress`, `skeleton`
- **Form**: `form` (React Hook Form integration), `label`

For a complete list, visit [shadcn/ui components](https://ui.shadcn.com/docs/components).

## Component Usage

### Basic Button Usage

```typescript
// components/MyComponent.tsx
"use client";

import { Button } from "@/components/ui/button";

export function MyComponent() {
  return (
    <div className="space-y-4">
      <Button>Default Button</Button>
      <Button variant="secondary">Secondary Button</Button>
      <Button variant="destructive">Delete</Button>
      <Button disabled>Disabled Button</Button>
    </div>
  );
}
```

### Form with Input Components

```typescript
// components/FormExample.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function FormExample() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          required
        />
      </div>
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

### Dialog Component

```typescript
// components/ConfirmDialog.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function ConfirmDialog() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
              Are you sure you want to proceed?
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Confirm</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
```

## Styling Components

### Variants and Customization

shadcn/ui components support variants through props:

```typescript
<Button variant="primary" size="lg" />
<Button variant="secondary" size="sm" disabled />
<Button variant="outline" />
<Button variant="ghost" />
<Button variant="destructive" />
```

### Tailwind CSS Integration

Components use Tailwind CSS classes. Apply additional styling through the `className` prop:

```typescript
<Button className="w-full mt-4 shadow-lg">
  Full Width Button
</Button>

<Input className="placeholder:text-gray-400" placeholder="Custom styling" />
```

### Custom Theme Extensions

Theme customization is handled through `components.json` and `globals.css`. Do not modify component internals—extend through CSS variables or Tailwind theme configuration.

## Form Handling with shadcn/ui

### React Hook Form Integration

shadcn/ui provides a `form` component that integrates seamlessly with React Hook Form:

```typescript
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

type FormValues = z.infer<typeof formSchema>;

export function ProfileForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
    },
  });

  function onSubmit(values: FormValues) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="johndoe" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

## Client vs Server Components

### Client Components

Most UI components require the `"use client"` directive since they handle user interactions:

```typescript
// ✓ Good - Client component for interactive UI
"use client";

import { Button } from "@/components/ui/button";

export function InteractiveButton() {
  const handleClick = () => {
    console.log("Clicked!");
  };

  return <Button onClick={handleClick}>Click me</Button>;
}
```

### Server Components

Use server components to wrap UI components when you need server-side logic:

```typescript
// ✓ Good - Server component fetching data, then rendering UI
import { getData } from "@/lib/data";
import { Card } from "@/components/ui/card";

export default async function DataDisplay() {
  const data = await getData();

  return (
    <Card className="p-4">
      <p>{data.title}</p>
    </Card>
  );
}
```

## Accessibility Standards

All shadcn/ui components follow WCAG 2.1 AA guidelines:

- **Semantic HTML**: Components use proper HTML semantics
- **ARIA Labels**: Include `aria-label` or `aria-describedby` where needed
- **Keyboard Navigation**: All interactive components are keyboard accessible
- **Focus Management**: Proper focus indicators and management

### Example with Accessibility

```typescript
<Button aria-label="Close dialog">
  <X className="h-4 w-4" />
</Button>

<Input
  aria-label="Search links"
  placeholder="Search..."
  aria-describedby="search-description"
/>
<p id="search-description" className="text-sm text-gray-500">
  Enter a URL or keyword to search
</p>
```

## Common Component Patterns

### Card Container

```typescript
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function InfoCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Card content goes here</p>
      </CardContent>
    </Card>
  );
}
```

### Alert Messages

```typescript
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function ErrorAlert() {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>Something went wrong. Please try again.</AlertDescription>
    </Alert>
  );
}
```

### Badge for Status

```typescript
import { Badge } from "@/components/ui/badge";

export function StatusBadge() {
  return (
    <>
      <Badge>Active</Badge>
      <Badge variant="secondary">Pending</Badge>
      <Badge variant="destructive">Inactive</Badge>
    </>
  );
}
```

## Icon Integration

Use the `lucide-react` library for icons, which complements shadcn/ui:

```typescript
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

export function CopyButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button onClick={handleCopy} size="sm">
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </Button>
  );
}
```

## Best Practices

### ✓ Do

- Import components directly from `@/components/ui/`
- Use `"use client"` when handling state or events
- Compose multiple shadcn/ui components to build complex UIs
- Follow the component's props API from shadcn/ui documentation
- Use TypeScript for component props
- Leverage Tailwind CSS for additional styling via `className` prop

### ✗ Don't

- Create custom component implementations
- Import UI components from external libraries (other than shadcn/ui)
- Modify shadcn/ui component source code directly
- Use inline styles instead of Tailwind classes
- Ignore accessibility attributes
- Hardcode component values that should be configurable via props

## Resources

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [shadcn/ui Components](https://ui.shadcn.com/docs/components)
- [Radix UI Documentation](https://www.radix-ui.com/docs/primitives/overview/introduction)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [lucide-react Icons](https://lucide.dev)
