export default function PrivacySection() {
  const features = [
    {
      title: 'End-to-End Encrypted',
      description: 'Your financial data is encrypted on your device before it ever touches our servers.',
    },
    {
      title: 'No Ads, No Selling Data',
      description: 'We make money from subscriptions, not by selling your financial life to advertisers.',
    },
    {
      title: 'Keyboard Optimized',
      description: 'Navigate your entire dashboard without lifting your hands from the keyboard.',
    },
  ];

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-surface-dark border border-white/10 p-8 sm:p-16">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-black text-white sm:text-4xl mb-6">
                Built for Privacy &amp; Speed
              </h2>
              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-accent-green mt-1">check_circle</span>
                    <div>
                      <h4 className="font-bold text-white">{feature.title}</h4>
                      <p className="text-text-muted text-sm mt-1">{feature.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:w-1/2 w-full">
              <div className="relative aspect-video w-full rounded-xl bg-background-dark border border-white/10 p-6 flex flex-col justify-center items-center shadow-2xl">
                <div className="w-full font-mono text-sm text-text-muted space-y-2">
                  <div className="flex gap-2">
                    <span className="text-primary">const</span>{' '}
                    <span className="text-accent-yellow">budget</span> ={' '}
                    <span className="text-accent-blue">calculateRemaining</span>();
                  </div>
                  <div className="flex gap-2">
                    <span className="text-primary">if</span> (budget{' '}
                    <span className="text-primary">&lt;</span>{' '}
                    <span className="text-accent-blue">500</span>) {'{'}
                  </div>
                  <div className="pl-4 flex gap-2">
                    <span className="text-accent-green">alertUser</span>(
                    <span className="text-accent-yellow">&quot;Approaching Limit&quot;</span>);
                  </div>
                  <div className="flex gap-2">{'}'}</div>
                  <div className="flex gap-2 opacity-50">// Your finances, simplified logically.</div>
                </div>
                <div className="absolute bottom-6 right-6">
                  <span className="material-symbols-outlined text-6xl text-white/5 rotate-12">terminal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
