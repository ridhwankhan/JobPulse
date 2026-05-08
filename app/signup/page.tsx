"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [recoveryPrompt1, setRecoveryPrompt1] = useState("What is your favorite food?")
  const [recoveryPrompt2, setRecoveryPrompt2] = useState("What city were you born in?")
  const [recoveryAnswer1, setRecoveryAnswer1] = useState("")
  const [recoveryAnswer2, setRecoveryAnswer2] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!email.trim() || !password.trim() || !recoveryAnswer1.trim() || !recoveryAnswer2.trim()) {
      setError("Please fill all required fields.")
      return
    }

    setIsSubmitting(true)
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        recoveryPrompt1,
        recoveryPrompt2,
        recoveryAnswer1,
        recoveryAnswer2,
      }),
    })
    const data = await res.json()
    setIsSubmitting(false)
    if (res.ok) {
      router.push("/dashboard")
      router.refresh()
    } else {
      setError(data.error || "Failed to sign up")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 pb-2">
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription className="leading-6">Create an account to start tracking jobs.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSignup}>
          <CardContent className="space-y-5">
            {error && <div className="text-red-500 text-sm font-medium">{error}</div>}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recoveryPrompt1">Recovery Prompt 1</Label>
              <Input
                id="recoveryPrompt1"
                value={recoveryPrompt1}
                onChange={(e) => setRecoveryPrompt1(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recoveryAnswer1">Recovery Answer 1</Label>
              <Input
                id="recoveryAnswer1"
                value={recoveryAnswer1}
                onChange={(e) => setRecoveryAnswer1(e.target.value)}
                placeholder="Your answer"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recoveryPrompt2">Recovery Prompt 2</Label>
              <Input
                id="recoveryPrompt2"
                value={recoveryPrompt2}
                onChange={(e) => setRecoveryPrompt2(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recoveryAnswer2">Recovery Answer 2</Label>
              <Input
                id="recoveryAnswer2"
                value={recoveryAnswer2}
                onChange={(e) => setRecoveryAnswer2(e.target.value)}
                placeholder="Your answer"
                required
              />
            </div>
            <div className="rounded-md border border-border bg-secondary/20 p-3 text-xs text-muted-foreground">
              Keep these answers memorable. You will need both to reset your password.
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-2">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>
            <div className="text-sm text-center text-muted-foreground">
              Already have an account? <Link href="/login" className="text-primary hover:underline">Sign In</Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
