'use client';

import { useEffect } from 'react';

export default function PricingSection() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js';
    script.setAttribute('data-name', 'bmc-button');
    script.setAttribute('data-slug', 'iamguillenm');
    script.setAttribute('data-color', '#FFDD00');
    script.setAttribute('data-emoji', '');
    script.setAttribute('data-font', 'Cookie');
    script.setAttribute('data-text', 'Buy me a coffee');
    script.setAttribute('data-outline-color', '#000000');
    script.setAttribute('data-font-color', '#000000');
    script.setAttribute('data-coffee-color', '#ffffff');
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <section id="pricing" className="py-24 bg-white dark:bg-surface-dark/30">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Pricing
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-text-muted">
          SpendBear is completely free to use — no credit card, no hidden fees, no catch.
        </p>

        <div className="mt-12 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-surface-dark p-10 flex flex-col items-center gap-6">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <span className="material-symbols-outlined text-[28px]">volunteer_activism</span>
          </div>

          <div>
            <p className="text-5xl font-black text-slate-900 dark:text-white">$0</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-text-muted">forever</p>
          </div>

          <ul className="space-y-3 text-left w-full max-w-sm">
            {[
              'Unlimited transactions',
              'Budget tracking & alerts',
              'Real-time analytics',
              'Category management',
              'Bank statement imports',
              'All future features',
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-slate-700 dark:text-text-main">
                <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                {item}
              </li>
            ))}
          </ul>

          <p className="text-sm text-slate-500 dark:text-text-muted max-w-sm">
            We&apos;re building something worth paying for. When we get there, we&apos;ll introduce a paid tier — but existing users will always be grandfathered in generously.
          </p>
        </div>

        <div className="mt-16 border-t border-slate-200 dark:border-white/10 pt-16">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Love SpendBear? Buy us a coffee.
          </h3>
          <p className="mt-3 text-slate-600 dark:text-text-muted max-w-md mx-auto">
            SpendBear is a passion project. If it&apos;s helping you manage your money better, a coffee goes a long way to keep it running and improving.
          </p>
          <div className="mt-8 flex justify-center">
            <a
              href="https://www.buymeacoffee.com/iamguillenm"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=iamguillenm&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff"
                alt="Buy Me A Coffee"
                style={{ height: '51px', width: '217px' }}
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
