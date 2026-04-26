interface Props {
  onSelect: (query: string) => void;
}

const EXAMPLES = [
  "ICU in Bihar",
  "Dialysis near me",
  "Blood bank Delhi",
  "Oxygen cylinder Mumbai",
  "Cancer hospital Chennai",
  "बच्चों का अस्पताल पटना",
  "சென்னையில் ஐசியு",
];

export function ExampleChips({ onSelect }: Props) {
  return (
    <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
      {EXAMPLES.map((q) => (
        <button
          key={q}
          type="button"
          onClick={() => onSelect(q)}
          className="shrink-0 rounded-full bg-cyan-300 px-4 py-1.5 text-sm font-medium text-slate-800 shadow-sm transition-colors hover:bg-cyan-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 dark:bg-cyan-400/20 dark:text-cyan-100 dark:hover:bg-cyan-400/40"
        >
          {q}
        </button>
      ))}
    </div>
  );
}
