import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bell,
  Check,
  CircleUserRound,
  Database,
  Download,
  Gauge,
  Layers3,
  LockKeyhole,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { useState, type CSSProperties, type FormEvent } from "react";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CleanRoom — Data Quality Command Center" },
      {
        name: "description",
        content: "Monitor data quality, pipeline health, and anomalies from one secure command center.",
      },
      { property: "og:title", content: "CleanRoom — Data Quality Command Center" },
      {
        property: "og:description",
        content: "Monitor data quality, pipeline health, and anomalies from one secure command center.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const volume = [40, 55, 45, 70, 65, 85, 60, 90, 100, 80, 50, 68, 58, 76, 92, 64];

const navItems = [
  { label: "Overview", icon: Gauge },
  { label: "Pipelines", icon: Layers3 },
  { label: "Monitoring", icon: Activity },
  { label: "Analytics", icon: BarChart3 },
];

function Index() {
  const [signedUp, setSignedUp] = useState(false);

  function scrollToSignup() {
    document.getElementById("signup")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSignedUp(true);
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/30">
      <aside className="fixed inset-x-0 bottom-0 z-50 flex h-16 items-center justify-around border-t border-border bg-card px-3 md:inset-y-0 md:left-0 md:right-auto md:h-full md:w-20 md:flex-col md:justify-start md:border-r md:border-t-0 md:py-7">
        <div className="hidden size-11 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground shadow-[0_0_24px_var(--primary-glow)] md:flex">
          CR
        </div>
        <nav className="flex w-full items-center justify-around md:mt-12 md:flex-col md:gap-5" aria-label="Primary navigation">
          {navItems.map(({ label, icon: Icon }, index) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              title={label}
              className={`flex size-10 cursor-pointer items-center justify-center rounded-md transition-colors ${index === 0 ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
            >
              <Icon className="size-4" />
            </button>
          ))}
        </nav>
        <button
          type="button"
          aria-label="Settings"
          title="Settings"
          className="hidden size-10 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground md:mt-auto md:flex"
        >
          <Settings className="size-4" />
        </button>
        <div className="hidden size-9 items-center justify-center rounded-full border border-border bg-secondary text-xs font-semibold md:mt-5 md:flex">AC</div>
      </aside>

      <main className="pb-20 md:pl-20 md:pb-0">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur-xl md:px-8">
          <div className="flex items-center gap-3 md:gap-10">
            <div className="flex items-center gap-2 md:hidden">
              <span className="flex size-8 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">CR</span>
              <span className="text-sm font-semibold">CleanRoom</span>
            </div>
            <p className="hidden text-xs font-semibold uppercase tracking-[0.16em] text-foreground md:block">Command Center</p>
            <nav className="hidden items-center gap-7 text-xs font-medium lg:flex">
              {navItems.map((item, index) => (
                <a key={item.label} href={`#${index === 0 ? "overview" : item.label.toLowerCase()}`} className={index === 0 ? "border-b-2 border-primary py-6 text-primary" : "py-6 text-muted-foreground transition-colors hover:text-foreground"}>
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="Notifications" title="Notifications" className="text-muted-foreground">
              <Bell />
            </Button>
            <Button onClick={scrollToSignup} className="bg-primary text-primary-foreground shadow-none hover:bg-primary/90">
              Sign up free <ArrowRight />
            </Button>
          </div>
        </header>

        <div id="overview" className="mx-auto max-w-7xl px-4 py-7 md:px-8 md:py-9">
          <section className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-primary">Live workspace / ACME-01</p>
              <h1 className="text-3xl font-light text-foreground md:text-4xl">Welcome back, <span className="font-semibold">Operator</span></h1>
              <p className="mt-2 text-sm text-muted-foreground">System pulse is stable. Four active ingestions are running smoothly.</p>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-success/20 bg-success/10 px-3 py-1.5 text-[10px] font-bold uppercase text-success">
              <span className="size-1.5 animate-pulse rounded-full bg-success" /> Network secure
            </span>
          </section>

          <section className="grid grid-cols-12 gap-4 md:gap-6" aria-label="CleanRoom overview metrics">
            <article className="col-span-12 rounded-lg border border-border bg-card p-5 md:p-6 lg:col-span-8">
              <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-sm font-medium text-muted-foreground">Data Volume Trend</h2>
                  <p className="mt-1 text-2xl font-semibold text-foreground">14.8M <span className="text-sm font-normal text-muted-foreground">records/hr</span></p>
                </div>
                <Button variant="outline" size="sm" className="border-primary/20 bg-transparent text-[10px] uppercase text-primary hover:bg-primary/10 hover:text-primary">
                  <Download /> Export report
                </Button>
              </div>
              <div className="flex h-48 items-end gap-1.5 border-b border-border/70 px-1">
                {volume.map((height, index) => (
                  <div key={`${height}-${index}`} className="group flex h-full flex-1 items-end">
                    <div className="data-bar w-full rounded-t-[2px] bg-primary transition-all duration-500 group-hover:brightness-125" style={{ "--bar-height": `${height}%`, opacity: 0.24 + index * 0.045 } as CSSProperties} />
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-between font-mono text-[9px] text-muted-foreground"><span>00:00 UTC</span><span>06:00</span><span>12:00</span><span>18:00</span><span>23:59</span></div>
            </article>

            <article className="col-span-12 flex flex-col rounded-lg border border-border bg-card p-6 lg:col-span-4">
              <div className="flex items-start justify-between">
                <div><h2 className="text-sm font-medium text-muted-foreground">Data Quality Score</h2><p className="mt-1 font-mono text-[10px] text-success">+2.4% this week</p></div>
                <span className="rounded-full border border-border px-2 py-1 font-mono text-[9px] text-muted-foreground">STABLE</span>
              </div>
              <div className="flex flex-1 items-center justify-center py-6">
                <div className="quality-ring flex size-40 items-center justify-center rounded-full">
                  <div className="flex size-28 flex-col items-center justify-center rounded-full bg-card"><strong className="text-4xl text-foreground">98.4</strong><span className="mt-1 text-[9px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Percentile</span></div>
                </div>
              </div>
              <div className="grid grid-cols-2 border-t border-border pt-5"><div><p className="text-[10px] uppercase text-muted-foreground">Healthy</p><p className="mt-1 font-semibold">14.2M</p></div><div><p className="text-[10px] uppercase text-muted-foreground">Anomalies</p><p className="mt-1 font-semibold text-primary">0.6M</p></div></div>
            </article>

            <article id="pipelines" className="col-span-12 rounded-lg border border-border bg-card p-5 md:p-6 lg:col-span-7">
              <div className="mb-5 flex items-center justify-between"><h2 className="text-sm font-medium text-muted-foreground">Active Data Pipelines</h2><span className="font-mono text-[10px] text-primary">4 CONNECTED</span></div>
              <div className="space-y-3">
                {[{ code: "SF", name: "Salesforce CRM", status: "Real-time syncing", progress: "w-3/4" }, { code: "ST", name: "Stripe Payments", status: "Batch processing · hourly", progress: "w-2/5" }, { code: "SG", name: "Segment Stream", status: "Event stream · live", progress: "w-5/6" }].map((pipeline) => (
                  <div key={pipeline.code} className="flex items-center justify-between rounded-md border border-border bg-background/70 p-3">
                    <div className="flex items-center gap-3"><div className="flex size-9 items-center justify-center rounded bg-secondary font-mono text-[10px] text-muted-foreground">{pipeline.code}</div><div><p className="text-sm font-semibold text-foreground">{pipeline.name}</p><p className="text-[10px] text-muted-foreground">{pipeline.status}</p></div></div>
                    <div className="text-right"><p className="text-[10px] text-success">Running</p><div className="mt-2 h-1 w-20 overflow-hidden rounded-full bg-secondary"><div className={`h-full bg-primary ${pipeline.progress}`} /></div></div>
                  </div>
                ))}
              </div>
            </article>

            <article id="monitoring" className="col-span-12 rounded-lg border border-border bg-card p-5 md:p-6 lg:col-span-5">
              <div className="mb-5 flex items-center justify-between"><h2 className="text-sm font-medium text-muted-foreground">Integrity Log</h2><Activity className="size-4 text-primary" /></div>
              <div className="space-y-4 font-mono text-[10px]">
                {[{ time: "14:20:05", level: "WARN", color: "text-primary", text: "Schema mismatch detected in Pipeline-B" }, { time: "14:18:22", level: "INFO", color: "text-success", text: "Successfully ingested 1.2M records" }, { time: "14:15:00", level: "SYS", color: "text-info", text: "Automatic backup completed" }, { time: "14:10:12", level: "INFO", color: "text-success", text: "New source Marketing_Alpha connected" }].map((log) => (
                  <div key={log.time} className="grid grid-cols-[58px_42px_1fr] gap-2"><span className="text-muted-foreground">{log.time}</span><span className={log.color}>[{log.level}]</span><span className="text-foreground/70">{log.text}</span></div>
                ))}
              </div>
            </article>
          </section>

          <section id="signup" className="relative mt-8 overflow-hidden rounded-lg bg-primary p-6 text-primary-foreground md:p-10 lg:p-12">
            <div className="signup-grid pointer-events-none absolute inset-0 opacity-20" />
            <div className="relative grid items-center gap-9 lg:grid-cols-[1fr_0.88fr] lg:gap-16">
              <div>
                <p className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.18em]">Enterprise control plane</p>
                <h2 className="max-w-lg text-3xl font-bold leading-tight md:text-4xl">Build on data you can trust.</h2>
                <p className="mt-4 max-w-md text-sm font-medium text-primary-foreground/70">Create a secure CleanRoom workspace with production-grade monitoring from day one.</p>
                <ul className="mt-7 grid gap-3 text-sm font-semibold sm:grid-cols-2 lg:grid-cols-1">
                  {[{ icon: ShieldCheck, text: "Dedicated security infrastructure" }, { icon: Database, text: "Unlimited monitored datasets" }, { icon: LockKeyhole, text: "Private team workspaces" }].map(({ icon: Icon, text }) => <li key={text} className="flex items-center gap-3"><span className="flex size-6 items-center justify-center rounded-full border border-primary-foreground/30"><Check className="size-3.5" /></span>{text}</li>)}
                </ul>
              </div>
              <div className="rounded-lg border border-foreground/10 bg-background p-6 text-foreground shadow-2xl md:p-8">
                {signedUp ? (
                  <div className="flex min-h-72 flex-col items-center justify-center text-center"><span className="flex size-12 items-center justify-center rounded-full bg-success/10 text-success"><Check /></span><h3 className="mt-5 text-xl font-bold">Workspace request received</h3><p className="mt-2 max-w-xs text-sm text-muted-foreground">We’ll send your secure setup link shortly.</p></div>
                ) : (
                  <form onSubmit={handleSignup}>
                    <div className="mb-6 flex items-center justify-between"><div><p className="text-lg font-bold">Create your workspace</p><p className="mt-1 text-xs text-muted-foreground">Start with a secure operator account.</p></div><CircleUserRound className="size-6 text-primary" /></div>
                    <label className="mb-4 block"><span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Work email</span><input required type="email" placeholder="name@company.com" className="h-11 w-full rounded-md border border-input bg-secondary px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15" /></label>
                    <label className="mb-5 block"><span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Organization</span><input required type="text" placeholder="Acme Corp" className="h-11 w-full rounded-md border border-input bg-secondary px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15" /></label>
                    <Button type="submit" className="h-11 w-full bg-primary font-bold text-primary-foreground hover:bg-primary/90">Initialize workspace <ArrowRight /></Button>
                    <p className="mt-4 text-center text-[10px] text-muted-foreground">By continuing, you agree to the Terms and Privacy Policy.</p>
                  </form>
                )}
              </div>
            </div>
          </section>
        </div>

        <footer className="border-t border-border px-6 py-8 text-center text-xs text-muted-foreground">
          <p>© 2026 CleanRoom Data Systems · Security · Compliance · Privacy</p>
        </footer>
      </main>
    </div>
  );
}
