'use client';

export default function LoginButton() {
  return (
    <a
      href="/auth/login"
      className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-base font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:-translate-y-0.5"
    >
      Log in
    </a>
  );
}