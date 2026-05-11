import Link from "next/link";
import { Mail, Github, Linkedin, ExternalLink } from "lucide-react";

const founders = [
  {
    person: "Ridhwanur Rahman Khan",
    role: "Founder & Builder",
    links: [
      { label: "Email", href: "mailto:ridhwankhan03@gmail.com", icon: Mail },
      { label: "LinkedIn", href: "https://linkedin.com/in/ridhwan1", icon: Linkedin },
      { label: "GitHub", href: "https://github.com/ridhwankhan", icon: Github },
      { label: "Portfolio", href: "https://ridhwank-portfolio.vercel.app", icon: ExternalLink },
    ],
  },
]

const contributors = [
  {
    person: "Intisar Rahman Khan",
    role: "Contributor",
    links: [
      { label: "Portfolio", href: "https://intisarrahmankhan.github.io/", icon: ExternalLink },
      { label: "GitHub", href: "https://github.com/intisarrahmankhan", icon: Github },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/intisar-rahman-khan-909044372/", icon: Linkedin },
    ],
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-foreground">Contact</h1>
          <p className="text-muted-foreground">
            For collaborations, product feedback, internship opportunities, or technical discussions, reach out through
            any of the channels below.
          </p>
          <Link href="/" className="text-sm text-primary hover:underline">
            ← Back to Home
          </Link>
        </div>

        <div className="space-y-10">
          <div className="space-y-5">
            <h2 className="text-2xl font-semibold text-foreground">Founder</h2>
            <div className="grid gap-5 md:grid-cols-2">
              {founders.map((entry) => (
                <div key={entry.person} className="rounded-xl border border-border bg-card p-5">
                  <h2 className="text-lg font-semibold text-foreground">{entry.person}</h2>
                  <p className="mt-1 text-sm text-primary">{entry.role}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {entry.links.map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-xs text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                      >
                        <item.icon className="h-3.5 w-3.5" />
                        {item.label}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <h2 className="text-2xl font-semibold text-foreground">Contributor</h2>
            <div className="grid gap-5 md:grid-cols-2">
              {contributors.map((entry) => (
                <div key={entry.person} className="rounded-xl border border-border bg-card p-5">
                  <h2 className="text-lg font-semibold text-foreground">{entry.person}</h2>
                  <p className="mt-1 text-sm text-primary">{entry.role}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {entry.links.map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-xs text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                      >
                        <item.icon className="h-3.5 w-3.5" />
                        {item.label}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
