export default function AppearanceSettings() {
  return (
    <div className="max-w-[600px]">
      <h2 className="font-display font-bold text-2xl text-ink mb-6">APPEARANCE</h2>
      <div className="cf-card">
        <h3 className="font-display font-semibold text-ink mb-4">THEME</h3>
        <div className="flex gap-3">
          {['Light', 'Dark', 'System'].map(theme => (
            <button key={theme} className={`flex-1 py-4 border-2 border-border rounded font-display font-bold text-sm ${theme === 'Light' ? 'bg-accent text-white border-accent' : 'bg-surface text-ink-secondary hover:bg-muted'}`}>
              {theme.toUpperCase()}
            </button>
          ))}
        </div>
        <p className="text-meta text-ink-muted mt-4">Dark mode retains the Minimal Brutalist design language.</p>
      </div>
    </div>
  );
}
