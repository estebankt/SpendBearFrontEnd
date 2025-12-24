'use client';

export default function FAB() {
  return (
    <button
      className="fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/25 hover:scale-110 transition-transform group"
      onClick={() => {
        // TODO: Open transaction modal
        console.log('Add transaction clicked');
      }}
    >
      <span className="material-symbols-outlined text-[24px] group-hover:rotate-90 transition-transform">
        add
      </span>
    </button>
  );
}
