"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Trash2 } from "lucide-react";

interface ShortLink {
  id: string;
  originalUrl: string;
  shortCode: string;
  title: string | null;
  clickCount: number;
  createdAt: Date | string;
}

interface ApiResponse {
  data?: ShortLink;
  error?: string;
}


interface Props {
  initialLinks: ShortLink[];
}

export function LinksManager({ initialLinks }: Props) {
  const [links, setLinks] = useState<ShortLink[]>(initialLinks);
  const [originalUrl, setOriginalUrl] = useState("");
  const [title, setTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const baseUrl =
    typeof window !== "undefined" ? window.location.origin : "";

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsCreating(true);

    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalUrl, title: title || undefined }),
      });

      const json: ApiResponse = await res.json();

      if (!res.ok) {
        setError(json.error ?? "Failed to create link");
        return;
      }

      if (json.data) {
        const newLink = json.data;
        setLinks((prev) => [newLink, ...prev]);
      }
      setOriginalUrl("");
      setTitle("");
    } finally {
      setIsCreating(false);
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/links/${id}`, { method: "DELETE" });
    if (res.ok) {
      setLinks((prev) => prev.filter((l) => l.id !== id));
    }
  }

  function handleCopy(shortCode: string, id: string) {
    navigator.clipboard.writeText(`${baseUrl}/${shortCode}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="space-y-8">
      {/* Create form */}
      <Card>
        <CardHeader>
          <CardTitle>Shorten a new URL</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="original-url">Destination URL</Label>
              <Input
                id="original-url"
                type="url"
                placeholder="https://example.com/very/long/url"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link-title">Title (optional)</Label>
              <Input
                id="link-title"
                type="text"
                placeholder="My awesome link"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <Button type="submit" disabled={isCreating}>
              {isCreating ? "Creating…" : "Create short link"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Links table */}
      <Card>
        <CardHeader>
          <CardTitle>Your links</CardTitle>
        </CardHeader>
        <CardContent>
          {links.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No links yet. Create your first one above!
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Short link</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Clicks</TableHead>
                  <TableHead className="sr-only">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {links.map((link) => (
                  <TableRow key={link.id}>
                    <TableCell>
                      <div className="space-y-0.5">
                        <span className="font-mono text-sm">
                          {baseUrl}/{link.shortCode}
                        </span>
                        {link.title && (
                          <p className="text-xs text-muted-foreground">
                            {link.title}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                      {link.originalUrl}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{link.clickCount}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          aria-label="Copy short link"
                          onClick={() => handleCopy(link.shortCode, link.id)}
                        >
                          {copiedId === link.id ? (
                            <Check className="size-4" />
                          ) : (
                            <Copy className="size-4" />
                          )}
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          aria-label="Delete link"
                          onClick={() => handleDelete(link.id)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
