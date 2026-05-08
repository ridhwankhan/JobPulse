import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-foreground">Privacy Policy</h1>
          <p className="text-muted-foreground">
            We respect your privacy. This page explains what JobPulse stores and how it is used.
          </p>
          <Link href="/" className="text-sm text-primary hover:underline">
            ← Back to Home
          </Link>
        </div>

        <div className="space-y-6 rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">What we collect</h2>
            <p>
              JobPulse stores account email, hashed password, tracked URLs, user preferences, optional Telegram chat ID,
              and generated job listing records.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">How we use data</h2>
            <p>
              Data is used only to authenticate users, scrape tracked career pages, filter job results based on user
              preferences, and send notifications to connected channels.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">Security</h2>
            <p>
              Passwords are hashed, sessions are signed, OTP codes are short-lived, and abuse protection/rate limits are
              enforced on APIs.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">Control and deletion</h2>
            <p>
              Users can delete their accounts with OTP verification. Deletion removes account-linked data through cascade
              cleanup in the database.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
