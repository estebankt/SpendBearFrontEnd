import Logo from '@/components/ui/Logo';
import Button from '@/components/ui/Button';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-white/10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo variant="header" />

        <nav className="hidden md:flex items-center gap-8">
          <a className="text-sm font-medium text-slate-600 hover:text-primary dark:text-text-muted dark:hover:text-primary transition-colors" href="#features">
            Features
          </a>
          <a className="text-sm font-medium text-slate-600 hover:text-primary dark:text-text-muted dark:hover:text-primary transition-colors" href="#pricing">
            Pricing
          </a>
          <a className="text-sm font-medium text-slate-600 hover:text-primary dark:text-text-muted dark:hover:text-primary transition-colors" href="#about">
            About
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <a href="/auth/login" className="hidden text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-text-main dark:hover:text-white sm:block">
            Log In
          </a>
          <Button href="/auth/login" variant="primary" size="sm">
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
}
