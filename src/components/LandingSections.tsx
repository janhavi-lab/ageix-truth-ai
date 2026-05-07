import { motion } from "framer-motion";
import {
  ShieldCheck,
  Link2,
  MessageSquareWarning,
  Newspaper,
  PhoneCall,
  Brain,
  Lock,
  Zap,
  Check,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const fade = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: "easeOut" },
};

const FEATURES = [
  { icon: Link2, title: "Phishing links", desc: "Detects shortened, spoofed and lookalike URLs in real time." },
  { icon: MessageSquareWarning, title: "Spam & scams", desc: "Catches OTP, prize and bank impersonation tactics." },
  { icon: Newspaper, title: "Fake news", desc: "Flags sensational, manipulated and misleading articles." },
  { icon: PhoneCall, title: "Scam calls", desc: "Analyzes call recordings for known fraud patterns." },
  { icon: Brain, title: "AI reasoning", desc: "Explains why something looks risky in plain language." },
  { icon: Lock, title: "Privacy-first", desc: "Your content is analyzed in-session, never sold or shared." },
];

const STEPS = [
  { n: "01", t: "Paste or upload", d: "Drop a link, message, headline or audio file." },
  { n: "02", t: "AI analyzes", d: "Multi-signal models score the input across risk dimensions." },
  { n: "03", t: "Get the verdict", d: "Clear Real / Fake answer with reasoning and next steps." },
];

const EXAMPLES = [
  { title: "Bank OTP scam", body: "“Your account will be suspended. Click bit.ly/secure-kyc to verify now.”", tag: "Phishing" },
  { title: "Lottery message", body: "“Congratulations! You have won $5000. Send your details to claim.”", tag: "Spam" },
  { title: "Fake headline", body: "“SHOCKING: Doctors hate this 1 trick — government tries to ban it.”", tag: "Misinformation" },
];

const TESTIMONIALS = [
  { q: "Saved my mom from a fake ‘bank’ link in seconds.", a: "Aarav S.", r: "Product Designer" },
  { q: "Finally a tool I can send to non-tech relatives.", a: "Priya K.", r: "Journalist" },
  { q: "The reasoning makes me actually trust the verdict.", a: "Marcus L.", r: "Security Engineer" },
];

const PRICING = [
  { name: "Free", price: "$0", desc: "For everyday use", features: ["50 checks / day", "Text + URL scanning", "Plain-language results"], cta: "Get started" },
  { name: "Pro", price: "$9", desc: "For power users", features: ["Unlimited checks", "Audio analysis", "Share & export results", "Priority AI models"], cta: "Upgrade", featured: true },
  { name: "Team", price: "Custom", desc: "For organizations", features: ["Team workspace", "API access", "SSO + audit logs", "Dedicated support"], cta: "Contact us" },
];

const FAQ = [
  ["Is Ageix free to use?", "Yes — the core one-click detector is free with generous daily limits. Pro unlocks unlimited checks and audio analysis."],
  ["Do you store the content I check?", "No. Inputs are analyzed in-session and discarded by default. We never sell or share your content."],
  ["How accurate is it?", "Ageix combines several heuristic and AI signals. It’s designed to be a fast second opinion — always verify high-stakes decisions with the official source."],
  ["Can I use it on my phone?", "Yes. Ageix is fully responsive with a native-feeling mobile experience and bottom navigation."],
];

export const LandingSections = () => (
  <>
    {/* Trust strip */}
    <motion.section {...fade} className="container py-10">
      <div className="glass-card p-5 flex flex-wrap items-center justify-around gap-6 text-xs uppercase tracking-widest text-muted-foreground">
        <span className="flex items-center gap-2"><ShieldCheck className="size-4 text-neon-cyan" /> Privacy-first</span>
        <span className="flex items-center gap-2"><Zap className="size-4 text-neon-purple" /> Sub-second results</span>
        <span className="flex items-center gap-2"><Brain className="size-4 text-neon-cyan" /> Multi-signal AI</span>
        <span className="flex items-center gap-2"><Lock className="size-4 text-neon-purple" /> No content stored</span>
      </div>
    </motion.section>

    {/* Features */}
    <section id="features" className="container py-20 scroll-mt-24">
      <motion.div {...fade} className="text-center max-w-2xl mx-auto mb-12">
        <div className="text-xs uppercase tracking-widest text-neon-cyan mb-3">Features</div>
        <h2 className="text-3xl sm:text-4xl font-bold">Everything you need to spot a scam</h2>
        <p className="mt-3 text-muted-foreground">
          One unified detector. Six layers of protection. Zero learning curve.
        </p>
      </motion.div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            whileHover={{ y: -4 }}
            className="glass-card p-6 group hover:border-[hsl(var(--neon-cyan)/0.4)] transition-colors"
          >
            <div className="size-11 rounded-xl bg-gradient-to-br from-[hsl(var(--neon-purple)/0.2)] to-[hsl(var(--neon-cyan)/0.2)] flex items-center justify-center text-neon-cyan group-hover:scale-110 transition-transform">
              <f.icon className="size-5" />
            </div>
            <div className="mt-4 font-semibold">{f.title}</div>
            <div className="mt-1 text-sm text-muted-foreground">{f.desc}</div>
          </motion.div>
        ))}
      </div>
    </section>

    {/* How it works */}
    <section id="how" className="container py-20 scroll-mt-24">
      <motion.div {...fade} className="text-center mb-12">
        <div className="text-xs uppercase tracking-widest text-neon-purple mb-3">How it works</div>
        <h2 className="text-3xl sm:text-4xl font-bold">Three steps to the truth</h2>
      </motion.div>
      <div className="grid md:grid-cols-3 gap-4 relative">
        {STEPS.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="glass-card p-6 relative overflow-hidden"
          >
            <div className="text-5xl font-bold text-gradient opacity-80">{s.n}</div>
            <div className="mt-3 font-semibold">{s.t}</div>
            <div className="mt-1 text-sm text-muted-foreground">{s.d}</div>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Real-world examples */}
    <section className="container py-20">
      <motion.div {...fade} className="text-center mb-12">
        <div className="text-xs uppercase tracking-widest text-neon-cyan mb-3">In the wild</div>
        <h2 className="text-3xl sm:text-4xl font-bold">Real scams Ageix catches</h2>
      </motion.div>
      <div className="grid md:grid-cols-3 gap-4">
        {EXAMPLES.map((e) => (
          <motion.div
            key={e.title}
            {...fade}
            whileHover={{ y: -4 }}
            className="glass-card p-6 ring-1 ring-destructive/20"
          >
            <div className="text-[10px] uppercase tracking-widest text-destructive mb-2">{e.tag}</div>
            <div className="font-semibold">{e.title}</div>
            <div className="mt-3 text-sm text-muted-foreground italic">{e.body}</div>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Testimonials */}
    <section className="container py-20">
      <motion.div {...fade} className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold">Loved by careful people</h2>
      </motion.div>
      <div className="grid md:grid-cols-3 gap-4">
        {TESTIMONIALS.map((t) => (
          <motion.div key={t.a} {...fade} className="glass-card p-6">
            <div className="text-foreground/90">“{t.q}”</div>
            <div className="mt-4 text-xs text-muted-foreground">
              <span className="text-foreground font-medium">{t.a}</span> · {t.r}
            </div>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Pricing */}
    <section id="pricing" className="container py-20 scroll-mt-24">
      <motion.div {...fade} className="text-center mb-12">
        <div className="text-xs uppercase tracking-widest text-neon-purple mb-3">Pricing</div>
        <h2 className="text-3xl sm:text-4xl font-bold">Simple, honest plans</h2>
      </motion.div>
      <div className="grid md:grid-cols-3 gap-4">
        {PRICING.map((p) => (
          <motion.div
            key={p.name}
            {...fade}
            whileHover={{ y: -4 }}
            className={`glass-card p-7 relative ${p.featured ? "ring-1 ring-[hsl(var(--neon-purple)/0.6)]" : ""}`}
            style={p.featured ? { boxShadow: "0 0 50px hsl(var(--neon-purple)/0.25)" } : undefined}
          >
            {p.featured && (
              <div className="absolute top-3 right-3 text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-gradient-to-r from-[hsl(var(--neon-purple))] to-[hsl(var(--neon-cyan))] text-white">
                Popular
              </div>
            )}
            <div className="font-semibold">{p.name}</div>
            <div className="mt-2 text-3xl font-bold">
              {p.price}
              {p.price.startsWith("$") && p.price !== "$0" && (
                <span className="text-sm text-muted-foreground font-normal">/mo</span>
              )}
            </div>
            <div className="text-sm text-muted-foreground">{p.desc}</div>
            <ul className="mt-5 space-y-2 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check className="size-4 text-neon-cyan" /> {f}
                </li>
              ))}
            </ul>
            <Link
              to="/"
              className={`mt-6 block text-center px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                p.featured
                  ? "text-white bg-gradient-to-r from-[hsl(var(--neon-purple))] to-[hsl(var(--neon-cyan))] hover:scale-[1.02]"
                  : "border border-border hover:border-neon-cyan/60"
              }`}
            >
              {p.cta}
            </Link>
          </motion.div>
        ))}
      </div>
    </section>

    {/* FAQ */}
    <section id="faq" className="container py-20 max-w-3xl scroll-mt-24">
      <motion.div {...fade} className="text-center mb-10">
        <div className="text-xs uppercase tracking-widest text-neon-cyan mb-3">FAQ</div>
        <h2 className="text-3xl sm:text-4xl font-bold">Questions, answered</h2>
      </motion.div>
      <Accordion type="single" collapsible className="glass-card px-6">
        {FAQ.map(([q, a], i) => (
          <AccordionItem key={q} value={`i-${i}`} className="border-border/60">
            <AccordionTrigger className="text-left">{q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  </>
);
