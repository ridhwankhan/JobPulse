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
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const requestOtp = async (e: React.FormEvent) => {
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
      setError(data.error || "Failed to send OTP.");
      return;
    }
    setOtpRequested(true);
    if (data.devOtp) {
      setOtp(data.devOtp);
      toast.success(`Dev OTP generated: ${data.devOtp}`);
    } else {
      toast.success("Password reset OTP sent to your email.");
    }
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/verify-password-reset-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, newPassword }),
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
            {otpRequested ? "Enter OTP and set a new password." : "Request an OTP to reset your password."}
          </CardDescription>
        </CardHeader>
        <form onSubmit={otpRequested ? resetPassword : requestOtp}>
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
                disabled={otpRequested}
              />
            </div>
            {otpRequested && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="otp">OTP</Label>
                  <Input id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} required />
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
              {loading ? "Please wait..." : otpRequested ? "Verify OTP & Reset Password" : "Send Reset OTP"}
            </Button>
            {otpRequested && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setOtpRequested(false);
                  setOtp("");
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
