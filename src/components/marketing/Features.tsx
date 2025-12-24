export default function Features() {
  const features = [
    {
      icon: 'pie_chart',
      title: 'Smart Budgeting',
      description: 'Set limits that actually stick. Our intuitive envelopes system makes sure you never overspend on the things that matter less.',
    },
    {
      icon: 'monitoring',
      title: 'Real-time Analytics',
      description: 'Visualize your spending habits with high-contrast, beautiful charts that update instantly as you spend.',
    },
    {
      icon: 'label',
      title: 'Auto Categorization',
      description: 'Stop manually sorting transactions. SpendBear learns from your history and categorizes purchases automatically.',
    },
  ];

  return (
    <section id="features" className="py-24 bg-white dark:bg-surface-dark/30 border-y border-slate-200 dark:border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Minimalist Features
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-text-muted">
            Everything you need to stay on top of your finances, nothing you don&apos;t. We stripped away the complexity.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-surface-dark p-8 hover:border-primary/50 dark:hover:border-primary/50 transition-colors"
            >
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[24px]">{feature.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-600 dark:text-text-muted leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
