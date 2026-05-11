"use client"

import { useState } from "react"
import { useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import {
  Briefcase,
  Link2,
  Send,
  Zap,
  Shield,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Mail,
  Github,
  Linkedin,
  ExternalLink,
  Moon,
  Sun,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const features = [
  {
    icon: Link2,
    title: "Track Any Career Page",
    description:
      "Add URLs from any company's career page - we'll monitor them 24/7 for new job postings.",
  },
  {
    icon: Zap,
    title: "Real-time Detection",
    description:
      "Our scraper engine detects new jobs within minutes of posting, not hours or days.",
  },
  {
    icon: Send,
    title: "Telegram Alerts",
    description:
      "Get instant notifications directly in Telegram with job details and apply links.",
  },
  {
    icon: Shield,
    title: "Smart Deduplication",
    description:
      "Never see the same job twice. Our system ensures you only get fresh, unique listings.",
  },
]

const stats = [
  { value: "10K+", label: "Jobs Tracked Daily" },
  { value: "500+", label: "Career Pages Monitored" },
  { value: "< 5min", label: "Average Alert Time" },
  { value: "99.9%", label: "Uptime" },
]

const companies = [
  "Google",
  "Meta",
  "Microsoft",
  "Apple",
  "Amazon",
  "Netflix",
  "Stripe",
  "OpenAI",
]

const founder = {
  name: "Ridhwanur Rahman Khan",
  title: "Founder & Builder",
  location: "Dhaka, Bangladesh",
  summary:
    "Analytical and results-driven professional with a strong blend of software engineering, business operations, and strategic problem-solving experience. Skilled in backend development, secure systems, data analytics, and cross-functional execution with the adaptability to contribute across technical, management, and growth-focused roles.",
  links: [
    { label: "Email", href: "mailto:ridhwankhan03@gmail.com", icon: Mail },
    { label: "LinkedIn", href: "https://linkedin.com/in/ridhwan1", icon: Linkedin },
    { label: "GitHub", href: "https://github.com/ridhwankhan", icon: Github },
    { label: "Portfolio", href: "https://ridhwank-portfolio.vercel.app", icon: ExternalLink },
  ],
}

const contributor = {
  name: "Intisar Rahman Khan",
  title: "Contributor",
  summary:
    "I’m a Software Engineering student passionate about full-stack development, AI-powered applications, and scalable software systems. I have experience with C++, Java, Python, Django, Flutter, FastAPI, and modern web technologies to build efficient and user-focused applications. Alongside software development, I also work with photography, photo editing, and video editing, combining creativity with technology to create impactful digital experiences.",
  links: [
    { label: "Portfolio", href: "https://intisarrahmankhan.github.io/", icon: ExternalLink },
    { label: "GitHub", href: "https://github.com/intisarrahmankhan", icon: Github },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/intisar-rahman-khan-909044372/", icon: Linkedin },
  ],
}

export default function LandingPage() {
  const [email, setEmail] = useState("")
  const [grayscaleMode, setGrayscaleMode] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = window.localStorage.getItem("landing_grayscale")
    setGrayscaleMode(saved === "true")
  }, [])

  useEffect(() => {
    if (mounted) {
      window.localStorage.setItem("landing_grayscale", String(grayscaleMode))
    }
  }, [grayscaleMode, mounted])

  return (
    <div className={`min-h-screen bg-background ${grayscaleMode ? "grayscale" : ""}`}>
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-sm"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Briefcase className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">KAIRO</span>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              How it Works
            </a>
            <a href="#about-team" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              About
            </a>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              title="Toggle theme"
              disabled={!mounted}
            >
              {!mounted ? null : theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button
              variant={grayscaleMode ? "default" : "ghost"}
              size="sm"
              onClick={() => setGrayscaleMode((prev) => !prev)}
              title="Toggle grayscale mode"
            >
              Gray
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/dashboard">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="mr-1 h-3 w-3" />
              AI-Powered Job Monitoring
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl text-balance"
          >
            Never Miss a Job Opportunity{" "}
            <span className="text-primary">Again</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-lg text-muted-foreground text-pretty"
          >
            Monitor career pages from your dream companies and get instant
            Telegram alerts when new positions are posted. Be the first to apply.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Button size="lg" asChild>
              <Link href="/dashboard">
                Start Monitoring Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#how-it-works">
                See How It Works
              </a>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Company Logos */}
      <section className="border-y border-border bg-card/50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground mb-6">
            Track jobs from top companies
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            {companies.map((company) => (
              <span
                key={company}
                className="text-lg font-semibold text-muted-foreground/50"
              >
                {company}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-foreground sm:text-4xl"
            >
              Everything You Need to Land Your Dream Job
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-lg text-muted-foreground"
            >
              Powerful features to keep you ahead of the competition
            </motion.p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/50"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-foreground sm:text-4xl"
            >
              How It Works
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-lg text-muted-foreground"
            >
              Get started in minutes, not hours
            </motion.p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Add Career URLs",
                description:
                  "Simply paste the URLs of career pages you want to monitor. We support most major job platforms.",
              },
              {
                step: "02",
                title: "Connect Telegram",
                description:
                  "Link your Telegram account with one click. Our bot will send you instant notifications.",
              },
              {
                step: "03",
                title: "Get Alerts",
                description:
                  "Receive instant notifications when new jobs matching your criteria are posted. Apply before anyone else!",
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="rounded-xl border border-border bg-card p-6">
                  <span className="text-5xl font-bold text-primary/20">
                    {item.step}
                  </span>
                  <h3 className="mt-4 text-xl font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-muted-foreground">{item.description}</p>
                </div>
                {index < 2 && (
                  <ChevronRight className="absolute -right-4 top-1/2 hidden h-8 w-8 -translate-y-1/2 text-border md:block" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About & Team */}
      <section id="about-team" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-foreground sm:text-4xl"
            >
              About The Team
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-lg text-muted-foreground"
            >
              Built by engineers who care about practical, secure, and user-friendly job discovery.
            </motion.p>
          </div>

          <div className="space-y-12">
            <div>
              <h3 className="mb-6 text-center text-2xl font-semibold text-foreground">Contributor</h3>
              <div className="grid gap-6 lg:grid-cols-2">
                {[contributor].map((person, index) => (
                  <motion.div
                    key={person.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="rounded-2xl border border-border bg-card p-6"
                  >
                    <h3 className="text-xl font-semibold text-foreground">{person.name}</h3>
                    <p className="mt-1 text-sm text-primary">{person.title}</p>
                    {"location" in person && person.location && (
                      <p className="mt-2 text-sm text-muted-foreground">{person.location}</p>
                    )}
                    <p className="mt-4 text-sm leading-6 text-muted-foreground">{person.summary}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {person.links.map((item) => (
                        <a
                          key={item.label}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                        >
                          <item.icon className="h-3.5 w-3.5" />
                          {item.label}
                        </a>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-6 text-center text-2xl font-semibold text-foreground">Founder</h3>
              <div className="grid gap-6 lg:grid-cols-2">
                {[founder].map((person, index) => (
                  <motion.div
                    key={person.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="rounded-2xl border border-border bg-card p-6"
                  >
                    <h3 className="text-xl font-semibold text-foreground">{person.name}</h3>
                    <p className="mt-1 text-sm text-primary">{person.title}</p>
                    {"location" in person && person.location && (
                      <p className="mt-2 text-sm text-muted-foreground">{person.location}</p>
                    )}
                    <p className="mt-4 text-sm leading-6 text-muted-foreground">{person.summary}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {person.links.map((item) => (
                        <a
                          key={item.label}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                        >
                          <item.icon className="h-3.5 w-3.5" />
                          {item.label}
                        </a>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center sm:p-12"
        >
          <h2 className="text-3xl font-bold text-foreground">
            Ready to Find Your Dream Job?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Join thousands of job seekers who never miss an opportunity. Start
            monitoring for free today.
          </p>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="max-w-xs"
            />
            <Button size="lg" asChild>
              <Link href="/dashboard">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              No credit card required
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Free forever plan
            </span>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Briefcase className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold text-foreground">
                KAIRO
              </span>
            </div>

            <p className="text-sm text-muted-foreground">
              © 2026 KAIRO. All rights reserved.
            </p>

            <div className="flex items-center gap-6">
              <a
                href="/privacy"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy
              </a>
              <a
                href="/terms"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms
              </a>
              <a
                href="/contact"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
