import Button from '@/components/ui/Button';

export default function Hero() {
  return (
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
              <Button href="/auth/login" variant="primary" size="md">
                Start Tracking Free
              </Button>
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
  );
}
