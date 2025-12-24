import Button from '@/components/ui/Button';

export default function CTASection() {
  return (
    <section className="border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-surface-dark/50 py-24">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Ready to take control?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-text-muted">
          Join SpendBear today and start your journey to financial clarity. No credit card required for the free tier.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button href="/auth/login" variant="primary" size="md" className="hover:scale-[1.02]">
            Join SpendBear
          </Button>
          <Button variant="secondary" size="md">
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
}
