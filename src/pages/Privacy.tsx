const Privacy = () => (
  <section className="container py-16 max-w-3xl prose prose-invert">
    <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
    <div className="space-y-4 text-muted-foreground leading-relaxed">
      <p>
        AGEIX is a cybersecurity platform built on transparency. This policy explains what we
        process when you use our One Click Truth Detector, how we store it, and why.
      </p>

      <h2 className="text-foreground text-xl font-semibold mt-6">What we process</h2>
      <p>
        When you submit text, links, or audio for analysis, that content is processed by our AI
        detection systems. We may also collect minimal technical metadata such as device type,
        timestamp, and approximate region to secure the service and prevent abuse.
      </p>

      <h2 className="text-foreground text-xl font-semibold mt-6">What we store</h2>
      <p>
        Submitted scans, their results, and associated metadata may be securely retained to power:
      </p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Your scan history (available to authenticated users)</li>
        <li>Aggregate analytics and product improvement</li>
        <li>Scam, phishing and misinformation trend detection</li>
        <li>Continuous training and improvement of our AI detection models</li>
      </ul>

      <h2 className="text-foreground text-xl font-semibold mt-6">How it’s secured</h2>
      <p>
        Sensitive content is encrypted in transit and at rest, access is strictly role-limited,
        and we apply standard cybersecurity controls across our infrastructure.
      </p>

      <h2 className="text-foreground text-xl font-semibold mt-6">What we never do</h2>
      <p>
        We never sell your data to advertisers and we never share identifiable scan content with
        third parties for marketing. Anonymous, aggregated metrics may be published or shared to
        advance threat intelligence research.
      </p>

      <h2 className="text-foreground text-xl font-semibold mt-6">Your account &amp; history</h2>
      <p>
        Authenticated users will be able to view, export, and delete their scan history from their
        account at any time. Deletion requests for unauthenticated submissions can be made by
        contacting us with the relevant reference details.
      </p>

      <h2 className="text-foreground text-xl font-semibold mt-6">Contact</h2>
      <p>For privacy questions or data requests, reach us at privacy@ageix.app.</p>
    </div>
  </section>
);
export default Privacy;
