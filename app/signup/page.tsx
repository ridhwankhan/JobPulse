"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [otpRequested, setOtpRequested] = useState(false)
  const [sendingOtp, setSendingOtp] = useState(false)
  const [verifyingOtp, setVerifyingOtp] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required")
      return
    }
    setSendingOtp(true)
    const res = await fetch("/api/auth/request-signup-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    setSendingOtp(false)
    if (res.ok) {
      setOtpRequested(true)
      if (data.devOtp) {
        setOtp(data.devOtp)
        toast.success(`Dev OTP generated: ${data.devOtp}`)
      } else {
        toast.success("OTP sent to your email.")
      }
    } else {
      setError(data.error || "Failed to send OTP")
    }
  }

  const handleVerifyAndSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!otp.trim()) {
      setError("Enter the OTP from your email")
      return
    }
    setVerifyingOtp(true)
    const res = await fetch("/api/auth/verify-signup-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, otp }),
    })
    setVerifyingOtp(false)
    if (res.ok) {
      router.push("/dashboard")
      router.refresh()
    } else {
      const data = await res.json()
      setError(data.error || "Failed to verify OTP")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 pb-2">
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription className="leading-6">Create an account to start tracking jobs.</CardDescription>
        </CardHeader>
        <form onSubmit={otpRequested ? handleVerifyAndSignup : handleRequestOtp}>
          <CardContent className="space-y-5">
            {error && <div className="text-red-500 text-sm font-medium">{error}</div>}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={otpRequested} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={otpRequested} />
            </div>
            {otpRequested && (
              <div className="space-y-2">
                <Label htmlFor="otp">Email OTP</Label>
                <Input
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit code"
                  required
                />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-2">
            <Button type="submit" className="w-full" disabled={sendingOtp || verifyingOtp}>
              {otpRequested ? (verifyingOtp ? "Verifying..." : "Verify OTP & Sign Up") : (sendingOtp ? "Sending OTP..." : "Send OTP")}
            </Button>
            {otpRequested && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={sendingOtp}
                onClick={() => {
                  setOtp("")
                  setOtpRequested(false)
                }}
              >
                Change Email / Password
              </Button>
            )}
            <div className="text-sm text-center text-muted-foreground">
              Already have an account? <Link href="/login" className="text-primary hover:underline">Sign In</Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
