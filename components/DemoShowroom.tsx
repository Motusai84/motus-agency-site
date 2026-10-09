import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { demoCatalog, getDemoEnquiryHref } from "@/lib/demo-catalog";
import styles from "@/app/demos/page.module.css";

export default function DemoShowroom() {
  const readyExamples = demoCatalog.filter((example) => example.status === "ready" && example.url);

  if (!readyExamples.length) {
    return (
      <div className={styles.emptyState}>
        <h3>More examples are on the way.</h3>
        <p>Tell us what you need and we can talk through what would help your business.</p>
        <Link id="empty-showroom-enquiry-link" href="/#contact">Tell us what you need</Link>
      </div>
    );
  }

  return (
    <>
      <nav className={styles.quickLinks} aria-label="Jump to an example">
        {readyExamples.map((example) => (
          <a id={`demo-jump-${example.slug}`} key={example.slug} href={`#example-${example.slug}`}>
            {example.category === "Customer enquiries" ? "Enquiries" : example.category ?? example.title}
          </a>
        ))}
      </nav>
      <p className={styles.resultSummary}>{readyExamples.length} examples · Try one that fits your business.</p>
      <div className={styles.exampleList}>
        {readyExamples.map((example) => (
          <article className={styles.example} id={`example-${example.slug}`} key={example.slug}>
            <div className={styles.exampleBody}>
              <div className={styles.exampleMeta}>
                <span>{example.name ?? example.title}</span><span>Demo you can try</span>
              </div>
              <h3>{example.category ?? example.title}</h3>
              <p>{example.demoSummary ?? example.interfaceSummary}</p>
            </div>
            <div className={styles.exampleState}>
              <Link id={`launch-demo-${example.slug}`} href={example.url!}>
                {example.ctaLabel ?? "Try this example"} <ArrowRight size={15} aria-hidden="true" />
              </Link>
              <Link id={`ask-about-demo-${example.slug}`} className={styles.askLink} href={getDemoEnquiryHref(example.slug)}>
                Ask about this for your business
              </Link>
            </div>
            <details className={styles.exampleDetails}>
              <summary id={`demo-details-${example.slug}`}>What this example shows</summary>
              <div className={styles.exampleDetailGrid}>
                <div>
                  <h4>Try it yourself</h4>
                  <p>{example.interfaceSummary}</p>
                  <ul>{example.views.map((view) => <li key={view}>{view}</li>)}</ul>
                </div>
                <div>
                  <h4>What it could help you do</h4>
                  <ul>{example.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}</ul>
                </div>
              </div>
              {example.scopeLabel && <p className={styles.scopeLabel}>{example.scopeLabel}</p>}
              {example.boundary && <p className={styles.exampleBoundary}>{example.boundary}</p>}
            </details>
          </article>
        ))}
      </div>
    </>
  );
}
