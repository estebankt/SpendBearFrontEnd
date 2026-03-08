export default function AboutSection() {
  return (
    <section id="about" className="py-24 border-t border-slate-200 dark:border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24 items-center">

          {/* Text */}
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Built by someone who got tired of <span className="text-primary">overpaying for complexity</span>
            </h2>
            <div className="mt-6 space-y-4 text-slate-600 dark:text-text-muted leading-relaxed">
              <p>
                SpendBear started as a personal frustration. Every finance app I tried was either bloated with features I never used, locked behind a paywall, or required connecting my bank account to some third-party I barely trusted.
              </p>
              <p>
                So I built the tool I actually wanted — one that&apos;s fast, private, and gets out of your way. No subscriptions. No syncing your credentials anywhere. Just a clean place to log what you spend and understand where your money goes.
              </p>
              <p>
                SpendBear is a solo project, built and maintained with care. If it helps you, that&apos;s the whole point.
              </p>
            </div>
          </div>

          {/* Values cards */}
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                icon: 'person',
                title: 'Solo-built',
                description: 'One developer, no VC pressure, no roadmap driven by investor demands.',
              },
              {
                icon: 'lock',
                title: 'Privacy-first',
                description: 'Your data lives on our servers — not sold, not shared, not used for ads.',
              },
              {
                icon: 'sprint',
                title: 'Stays simple',
                description: 'We add features only when they genuinely solve a real problem.',
              },
              {
                icon: 'favorite',
                title: 'Free to use',
                description: 'No paywalls today. When that changes, you\'ll be the first to know.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-surface-dark p-6"
              >
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-slate-500 dark:text-text-muted leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
