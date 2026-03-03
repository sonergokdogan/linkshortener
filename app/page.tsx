import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link, BarChart2, Zap, Shield } from "lucide-react";

const features = [
  {
    icon: Link,
    title: "Shorten Any URL",
    description:
      "Instantly turn long, unwieldy links into clean, shareable short URLs that are easy to remember and share.",
  },
  {
    icon: BarChart2,
    title: "Track Every Click",
    description:
      "Get detailed analytics on your links — see how many times each link was clicked and monitor performance over time.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Built on a modern, serverless infrastructure so your short links resolve in milliseconds, every time.",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description:
      "Your links are protected with industry-standard authentication and hosted on a globally distributed platform.",
  },
];

export default async function Home() {
  const { userId } = await auth();

  // Redirect logged-in users to dashboard
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-background py-24 px-4 text-center">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-6">
          <h1 className="text-5xl font-bold tracking-tight">
            Shorten links.
            <br />
            Share smarter.
          </h1>
          <p className="text-xl text-muted-foreground max-w-xl">
            Link Shortener transforms long URLs into clean, trackable short links
            — so you can share with confidence and measure what matters.
          </p>
          <div className="flex gap-4 mt-2">
            <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
              <Button size="lg">Get started for free</Button>
            </SignUpButton>
            <SignInButton mode="modal" forceRedirectUrl="/dashboard">
              <Button size="lg" variant="outline">
                Sign in
              </Button>
            </SignInButton>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/40 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything you need to manage your links
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map(({ icon: Icon, title, description }) => (
              <Card key={title}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Icon className="size-6 text-primary" aria-hidden="true" />
                    <CardTitle>{title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-xl mx-auto flex flex-col items-center gap-6">
          <h2 className="text-3xl font-bold">Ready to get started?</h2>
          <p className="text-muted-foreground text-lg">
            Create a free account and start shortening links in seconds.
          </p>
          <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
            <Button size="lg">Create your free account</Button>
          </SignUpButton>
        </div>
      </section>
    </main>
  );
}
