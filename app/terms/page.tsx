import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-foreground">Terms of Use</h1>
          <p className="text-muted-foreground">
            By using KAIRO, you agree to the following terms and responsible-use expectations.
          </p>
          <Link href="/" className="text-sm text-primary hover:underline">
            ← Back to Home
          </Link>
        </div>

        <div className="space-y-6 rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">Service scope</h2>
            <p>
              KAIRO helps users track public career pages and receive job alerts. We do not guarantee job availability,
              hiring outcomes, or uninterrupted third-party website access.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">User responsibilities</h2>
            <p>
              Users are responsible for maintaining account security, using lawful tracking URLs, and avoiding abusive
              behavior (spam, scraping abuse, or unauthorized access attempts).
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">Admin moderation</h2>
            <p>
              The platform admin may restrict or ban accounts that violate rules or threaten service stability/security.
              Signup can be paused during maintenance windows.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">Updates</h2>
            <p>
              These terms may be updated as features evolve. Continued use of the service after updates implies acceptance
              of the revised terms.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
