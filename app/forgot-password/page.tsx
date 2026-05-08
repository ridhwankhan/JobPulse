"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [prompt1, setPrompt1] = useState("");
  const [prompt2, setPrompt2] = useState("");
  const [answer1, setAnswer1] = useState("");
  const [answer2, setAnswer2] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [promptsLoaded, setPromptsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadPrompts = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/request-password-reset-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Failed to load recovery prompts.");
      return;
    }
    setPrompt1(data.prompts?.[0] || "Recovery prompt 1 is not set.");
    setPrompt2(data.prompts?.[1] || "Recovery prompt 2 is not set.");
    setPromptsLoaded(true);
    toast.success("Recovery prompts loaded.");
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/verify-password-reset-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, answer1, answer2, newPassword }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Failed to reset password.");
      return;
    }
    toast.success("Password reset successful. Please sign in.");
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 pb-2">
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription className="leading-6">
            {promptsLoaded ? "Answer your recovery prompts to set a new password." : "Load your recovery prompts first."}
          </CardDescription>
        </CardHeader>
        <form onSubmit={promptsLoaded ? resetPassword : loadPrompts}>
          <CardContent className="space-y-5">
            {error && <div className="text-sm font-medium text-red-500">{error}</div>}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={promptsLoaded}
              />
            </div>
            {promptsLoaded && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="answer1">{prompt1}</Label>
                  <Input id="answer1" value={answer1} onChange={(e) => setAnswer1(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="answer2">{prompt2}</Label>
                  <Input id="answer2" value={answer2} onChange={(e) => setAnswer2(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-2">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Please wait..." : promptsLoaded ? "Verify Answers & Reset Password" : "Load Recovery Prompts"}
            </Button>
            {promptsLoaded && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setPromptsLoaded(false);
                  setAnswer1("");
                  setAnswer2("");
                  setNewPassword("");
                }}
              >
                Change Email
              </Button>
            )}
            <div className="text-center text-sm text-muted-foreground">
              Remembered your password?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Back to Sign In
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
