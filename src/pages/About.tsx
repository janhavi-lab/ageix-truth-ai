const About = () => (
  <section className="container py-16 max-w-3xl">
    <h1 className="text-4xl font-bold mb-4">About <span className="text-gradient">Ageix</span></h1>
    <p className="text-muted-foreground leading-relaxed">
      Ageix is a one-click truth detector. Paste any suspicious content — a link,
      a forwarded WhatsApp message, a news headline, or upload a call recording —
      and Ageix routes it to the right detection model behind the scenes.
    </p>
    <div className="mt-8 grid sm:grid-cols-2 gap-4">
      {[
        ["Unified input", "No dropdowns, no toggles. We figure out what you pasted."],
        ["Plain language", "We tell you what to do, not what model fired."],
        ["Privacy-first", "We don’t store your content unless you ask us to."],
        ["Built for trust", "Designed with calm, high-contrast UI to reduce panic decisions."],
      ].map(([t, d]) => (
        <div key={t} className="glass-card p-5">
          <div className="font-semibold">{t}</div>
          <div className="text-sm text-muted-foreground mt-1">{d}</div>
        </div>
      ))}
    </div>
  </section>
);
export default About;
