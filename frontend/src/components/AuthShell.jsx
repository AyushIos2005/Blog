import Logo from "./Logo";

export default function AuthShell({ eyebrow, title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen bg-[var(--color-app)] flex flex-col">
      <div className="px-6 py-5">
        <Logo />
      </div>
      <div className="flex-1 flex items-center justify-center px-4 pb-10">
        <div className="w-full max-w-md bg-white rounded-2xl border border-[var(--color-border)] card-shadow p-8">
          <div className="text-center mb-6">
            <span className="inline-flex w-12 h-12 rounded-2xl brand-gradient items-center justify-center mb-3">
              <span className="text-white text-xl font-bold">{eyebrow}</span>
            </span>
            <h1 className="text-xl font-bold">{title}</h1>
            {subtitle && <p className="text-sm text-[var(--color-ink-soft)] mt-1">{subtitle}</p>}
          </div>
          {children}
          {footer && <div className="mt-6 text-center text-sm">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
