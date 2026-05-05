const Privacy = () => (
  <section className="container py-16 max-w-3xl prose prose-invert">
    <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
    <div className="space-y-4 text-muted-foreground leading-relaxed">
      <p>Ageix is built around a simple principle: analyze, don’t archive.</p>
      <h2 className="text-foreground text-xl font-semibold mt-6">What we process</h2>
      <p>We process the text or audio you submit only for the duration of the analysis. We do not require an account.</p>
      <h2 className="text-foreground text-xl font-semibold mt-6">What we store</h2>
      <p>By default, no submitted content is persisted. Anonymous, aggregated metrics (e.g. number of checks per day) may be retained to improve detection quality.</p>
      <h2 className="text-foreground text-xl font-semibold mt-6">Third parties</h2>
      <p>Submitted content may be passed to our internal ML services for classification. It is not sold or shared with advertisers.</p>
      <h2 className="text-foreground text-xl font-semibold mt-6">Contact</h2>
      <p>Questions? Reach out at privacy@ageix.app.</p>
    </div>
  </section>
);
export default Privacy;
