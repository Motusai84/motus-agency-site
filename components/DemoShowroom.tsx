"use client";

import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { DemoSector, DemoSolution } from "@/lib/demo-catalog";
import { demoCatalog } from "@/lib/demo-catalog";
import styles from "@/app/demos/page.module.css";

type SectorFilter = "All sectors" | DemoSector;
type SolutionFilter = "All solutions" | DemoSolution;

export default function DemoShowroom() {
  const [sector, setSector] = useState<SectorFilter>("All sectors");
  const [solution, setSolution] = useState<SolutionFilter>("All solutions");
  const readyExamples = useMemo(
    () => demoCatalog.filter((example) => example.status === "ready" && example.url),
    [],
  );
  const availableSectors = useMemo(
    () => ["All sectors", ...new Set(readyExamples.map((example) => example.sector))] as SectorFilter[],
    [readyExamples],
  );
  const availableSolutions = useMemo(
    () =>
      ["All solutions", ...new Set(readyExamples.flatMap((example) => example.solutions))] as SolutionFilter[],
    [readyExamples],
  );

  const visibleExamples = useMemo(
    () =>
      readyExamples.filter((example) => {
        const matchesSector = sector === "All sectors" || example.sector === sector;
        const matchesSolution = solution === "All solutions" || example.solutions.includes(solution);
        return matchesSector && matchesSolution;
      }),
    [readyExamples, sector, solution],
  );

  if (readyExamples.length === 0) {
    return (
      <div className={styles.emptyState}>
        <span>Demonstrations are built separately</span>
        <h3>The showroom opens one useful interface at a time.</h3>
        <p>
          Each sector demonstration is its own fictional project, designed around what a customer, employee or owner
          would actually use. Motus will link it here only after the experience has been built and reviewed.
        </p>
        <Link id="empty-showroom-enquiry-link" href="/#contact">
          Tell us what your business needs <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className={styles.filters} aria-label="Filter demonstrations">
        <fieldset>
          <legend>Browse by sector</legend>
          <div className={styles.filterOptions}>
            {availableSectors.map((item) => (
              <button
                id={`demo-sector-${item.toLowerCase().replaceAll(" ", "-")}`}
                key={item}
                type="button"
                aria-pressed={sector === item}
                onClick={() => setSector(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>Browse by solution</legend>
          <div className={styles.filterOptions}>
            {availableSolutions.map((item) => (
              <button
                id={`demo-solution-${item.toLowerCase().replaceAll(" ", "-")}`}
                key={item}
                type="button"
                aria-pressed={solution === item}
                onClick={() => setSolution(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className={styles.resultSummary} aria-live="polite">
        <span>{visibleExamples.length} sector {visibleExamples.length === 1 ? "example" : "examples"}</span>
        <span>Only built and reviewed demonstrations appear</span>
      </div>

      <div className={styles.exampleList}>
        {visibleExamples.map((example) => (
          <article className={styles.example} key={example.slug}>
            <div className={styles.exampleBody}>
              <div className={styles.exampleMeta}>
                <span>{example.sector}</span>
                <span>{example.solutions.join(" · ")}</span>
              </div>
              <h3>{example.title}</h3>
              <p>{example.problem}</p>

              <div className={styles.exampleDetailGrid}>
                <div>
                  <span>What the visitor would use</span>
                  <p>{example.interfaceSummary}</p>
                  <ul aria-label={`${example.title} interface views`}>
                    {example.views.map((view) => <li key={view}>{view}</li>)}
                  </ul>
                </div>
                <div>
                  <span>What the business would see</span>
                  <ul aria-label={`${example.title} owner outcomes`}>
                    {example.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}
                  </ul>
                </div>
              </div>

              <p className={styles.workflowFamily}>
                <span>Related Motus solution</span>
                {example.workflowFamily}
              </p>
              {example.scopeLabel && <p className={styles.scopeLabel}>{example.scopeLabel}</p>}
              {example.boundary && <p className={styles.exampleBoundary}>{example.boundary}</p>}
            </div>

            <div className={styles.exampleState}>
              <a id={`launch-demo-${example.slug}`} href={example.url!}>
                {example.ctaLabel ?? "Explore demonstration"} <ArrowRight size={15} aria-hidden="true" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
