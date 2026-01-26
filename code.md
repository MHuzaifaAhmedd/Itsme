<section
          ref={projectsSectionRef}
          id="projects"
          className="relative z-10 min-h-screen md:min-h-[300vh] border-t border-neutral-900 bg-neutral-950 overflow-hidden"
        >
          <div className="relative flex w-full flex-col gap-12 py-24 pl-4 pr-4 md:flex-row md:items-start md:gap-16 lg:gap-20 md:pl-6 md:pr-6 lg:pl-12 lg:pr-12">
            {/* Left Column - Stacking project cards (scroll‑animated) */}
            <div className="hidden md:block md:flex-[0.55] lg:flex-[0.6] md:sticky md:top-24 md:self-start">
              <ProjectCardsLeft sectionRef={projectsSectionRef} />
            </div>

            {/* Right Column - Text Content (~45%) - Right aligned */}
            <div className="flex flex-1 flex-col gap-6 md:max-w-[70ch] md:flex-[0.45] md:ml-auto">
              {/* Section Label */}
              <p className="text-xs uppercase tracking-[0.5em] text-neutral-500 opacity-60 text-left">
                Projects
              </p>

              {/* Headline - Matching About section font sizes */}
              <h2 className="text-left text-4xl font-semibold leading-[1.1] text-neutral-100 md:text-5xl lg:text-6xl">
                Signature projects that blend craft with measurable outcomes.
              </h2>

              {/* Body Paragraph - Matching About section font sizes */}
              <p className="text-left max-w-[60ch] text-base leading-relaxed text-neutral-300 md:text-lg -mt-2">
                Each engagement is grounded in research, elevated design systems,
                and performance-driven engineering. I partner with teams that
                want their digital presence to feel quietly iconic.
              </p>

              {/* Projects Grid */}
              <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 mt-4">
                {[
                  "Luxury wellness platform",
                  "Fintech onboarding redesign",
                  "Architectural studio identity",
                  "SaaS dashboard & analytics",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-3xl border border-neutral-900 bg-neutral-900/40 p-6 text-neutral-300"
                  >
                    <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
                      Case study
                    </p>
                    <h3 className="mt-4 text-lg font-medium text-neutral-100">
                      {item}
                    </h3>
                    <p className="mt-3 text-sm text-neutral-400">
                      Strategy, brand systems, and immersive UI that lifts
                      conversion and retention.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>