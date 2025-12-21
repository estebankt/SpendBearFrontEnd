import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-white/10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
              <span className="material-symbols-outlined text-[20px]">pets</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">SpendBear</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a className="text-sm font-medium text-slate-600 hover:text-primary dark:text-text-muted dark:hover:text-primary transition-colors" href="#features">Features</a>
            <a className="text-sm font-medium text-slate-600 hover:text-primary dark:text-text-muted dark:hover:text-primary transition-colors" href="#pricing">Pricing</a>
            <a className="text-sm font-medium text-slate-600 hover:text-primary dark:text-text-muted dark:hover:text-primary transition-colors" href="#about">About</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/api/auth/login" className="hidden text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-text-main dark:hover:text-white sm:block">
              Log In
            </Link>
            <Link href="/api/auth/login" className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-bold text-white shadow-sm transition-transform hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16 pb-24 lg:pt-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
              <div className="max-w-2xl">
                <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-6xl mb-6">
                  Master Your Money <br className="hidden lg:block"/>
                  <span className="text-primary">without the Noise</span>
                </h1>
                <p className="mt-4 text-lg text-slate-600 dark:text-text-muted max-w-lg mb-8 leading-relaxed">
                  Stop wondering where your money went. SpendBear is the minimalist tracker designed for clarity, built for modern spenders who value data over clutter.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/api/auth/login" className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-base font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:-translate-y-0.5">
                    Start Tracking Free
                  </Link>
                  <button className="inline-flex h-12 items-center justify-center rounded-lg border border-slate-200 dark:border-white/10 bg-transparent px-8 text-base font-bold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                    View Live Demo
                  </button>
                </div>
                <div className="mt-10 flex items-center gap-4 text-sm text-slate-500 dark:text-text-muted">
                  <div className="flex -space-x-2">
                    <div className="h-8 w-8 rounded-full border-2 border-white dark:border-background-dark bg-gray-300"></div>
                    <div className="h-8 w-8 rounded-full border-2 border-white dark:border-background-dark bg-gray-400"></div>
                    <div className="h-8 w-8 rounded-full border-2 border-white dark:border-background-dark bg-gray-500"></div>
                  </div>
                  <p>Trusted by 10,000+ minimalists</p>
                </div>
              </div>

              {/* Dashboard Preview */}
              <div className="relative mt-12 lg:mt-0">
                <div className="absolute -inset-4 rounded-xl bg-gradient-to-r from-primary to-accent-blue opacity-20 blur-2xl"></div>
                <div className="relative rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-surface-dark shadow-2xl overflow-hidden">
                  <div className="flex items-center gap-2 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-[#1E1F1C] px-4 py-3">
                    <div className="flex gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-[#ff5f56]"></div>
                      <div className="h-3 w-3 rounded-full bg-[#ffbd2e]"></div>
                      <div className="h-3 w-3 rounded-full bg-[#27c93f]"></div>
                    </div>
                    <div className="ml-4 h-2 w-20 rounded-full bg-slate-200 dark:bg-white/10"></div>
                  </div>
                  <div className="p-6">
                    <div className="mb-6 flex justify-between items-end">
                      <div>
                        <div className="text-xs font-medium text-slate-400 dark:text-text-muted mb-1">Total Balance</div>
                        <div className="text-3xl font-bold text-slate-900 dark:text-white">$12,450.00</div>
                      </div>
                      <div className="px-2 py-1 rounded bg-accent-green/10 text-accent-green text-xs font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">trending_up</span>
                        +2.4%
                      </div>
                    </div>
                    <div className="h-48 w-full flex items-end justify-between gap-2">
                      <div className="w-full bg-primary/20 rounded-t-sm h-[40%] group relative hover:bg-primary/40 transition-colors"></div>
                      <div className="w-full bg-primary/20 rounded-t-sm h-[60%] group relative hover:bg-primary/40 transition-colors"></div>
                      <div className="w-full bg-primary/20 rounded-t-sm h-[35%] group relative hover:bg-primary/40 transition-colors"></div>
                      <div className="w-full bg-primary rounded-t-sm h-[85%] relative shadow-[0_0_15px_rgba(249,36,114,0.5)]"></div>
                      <div className="w-full bg-primary/20 rounded-t-sm h-[55%] group relative hover:bg-primary/40 transition-colors"></div>
                      <div className="w-full bg-primary/20 rounded-t-sm h-[70%] group relative hover:bg-primary/40 transition-colors"></div>
                      <div className="w-full bg-primary/20 rounded-t-sm h-[45%] group relative hover:bg-primary/40 transition-colors"></div>
                    </div>
                    <div className="mt-6 space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-default">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-blue/10 text-accent-blue">
                            <span className="material-symbols-outlined text-[16px]">shopping_cart</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-900 dark:text-white">Groceries</div>
                            <div className="text-xs text-slate-500 dark:text-text-muted">Today, 2:30 PM</div>
                          </div>
                        </div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white">-$124.50</div>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-default">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-yellow/10 text-accent-yellow">
                            <span className="material-symbols-outlined text-[16px]">movie</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-900 dark:text-white">Netflix</div>
                            <div className="text-xs text-slate-500 dark:text-text-muted">Yesterday</div>
                          </div>
                        </div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white">-$15.99</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-white dark:bg-surface-dark/30 border-y border-slate-200 dark:border-white/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">Minimalist Features</h2>
              <p className="mt-4 text-lg text-slate-600 dark:text-text-muted">Everything you need to stay on top of your finances, nothing you don&apos;t. We stripped away the complexity.</p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="group relative rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-surface-dark p-8 hover:border-primary/50 dark:hover:border-primary/50 transition-colors">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-[24px]">pie_chart</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Smart Budgeting</h3>
                <p className="text-slate-600 dark:text-text-muted leading-relaxed">
                  Set limits that actually stick. Our intuitive envelopes system makes sure you never overspend on the things that matter less.
                </p>
              </div>
              <div className="group relative rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-surface-dark p-8 hover:border-primary/50 dark:hover:border-primary/50 transition-colors">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-[24px]">monitoring</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Real-time Analytics</h3>
                <p className="text-slate-600 dark:text-text-muted leading-relaxed">
                  Visualize your spending habits with high-contrast, beautiful charts that update instantly as you spend.
                </p>
              </div>
              <div className="group relative rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-surface-dark p-8 hover:border-primary/50 dark:hover:border-primary/50 transition-colors">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-[24px]">label</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Auto Categorization</h3>
                <p className="text-slate-600 dark:text-text-muted leading-relaxed">
                  Stop manually sorting transactions. SpendBear learns from your history and categorizes purchases automatically.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy & Speed Section */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl bg-surface-dark border border-white/10 p-8 sm:p-16">
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="md:w-1/2">
                  <h2 className="text-3xl font-black text-white sm:text-4xl mb-6">Built for Privacy &amp; Speed</h2>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-accent-green mt-1">check_circle</span>
                      <div>
                        <h4 className="font-bold text-white">End-to-End Encrypted</h4>
                        <p className="text-text-muted text-sm mt-1">Your financial data is encrypted on your device before it ever touches our servers.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-accent-green mt-1">check_circle</span>
                      <div>
                        <h4 className="font-bold text-white">No Ads, No Selling Data</h4>
                        <p className="text-text-muted text-sm mt-1">We make money from subscriptions, not by selling your financial life to advertisers.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-accent-green mt-1">check_circle</span>
                      <div>
                        <h4 className="font-bold text-white">Keyboard Optimized</h4>
                        <p className="text-text-muted text-sm mt-1">Navigate your entire dashboard without lifting your hands from the keyboard.</p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="md:w-1/2 w-full">
                  <div className="relative aspect-video w-full rounded-xl bg-background-dark border border-white/10 p-6 flex flex-col justify-center items-center shadow-2xl">
                    <div className="w-full font-mono text-sm text-text-muted space-y-2">
                      <div className="flex gap-2"><span className="text-primary">const</span> <span className="text-accent-yellow">budget</span> = <span className="text-accent-blue">calculateRemaining</span>();</div>
                      <div className="flex gap-2"><span className="text-primary">if</span> (budget <span className="text-primary">&lt;</span> <span className="text-accent-blue">500</span>) {'{'}</div>
                      <div className="pl-4 flex gap-2"><span className="text-accent-green">alertUser</span>(<span className="text-accent-yellow">&quot;Approaching Limit&quot;</span>);</div>
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

        {/* Final CTA Section */}
        <section className="border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-surface-dark/50 py-24">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">Ready to take control?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-text-muted">
              Join SpendBear today and start your journey to financial clarity. No credit card required for the free tier.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/api/auth/login" className="inline-flex h-12 min-w-[160px] items-center justify-center rounded-lg bg-primary px-8 text-base font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:scale-[1.02]">
                Join SpendBear
              </Link>
              <button className="inline-flex h-12 min-w-[160px] items-center justify-center rounded-lg border border-slate-300 dark:border-white/20 bg-transparent px-8 text-base font-bold text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-white/10 bg-background-light dark:bg-background-dark py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-white">
                <span className="material-symbols-outlined text-[14px]">pets</span>
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">SpendBear</span>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              <a className="text-sm text-slate-500 hover:text-primary dark:text-text-muted dark:hover:text-primary transition-colors" href="#privacy">Privacy Policy</a>
              <a className="text-sm text-slate-500 hover:text-primary dark:text-text-muted dark:hover:text-primary transition-colors" href="#terms">Terms of Service</a>
              <a className="text-sm text-slate-500 hover:text-primary dark:text-text-muted dark:hover:text-primary transition-colors" href="#support">Support</a>
            </div>
            <div className="flex gap-4">
              <a className="text-slate-400 hover:text-primary transition-colors" href="#twitter">
                <span className="sr-only">Twitter</span>
                <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a className="text-slate-400 hover:text-primary transition-colors" href="#github">
                <span className="sr-only">GitHub</span>
                <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" fillRule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-600">
            © 2023 SpendBear Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
