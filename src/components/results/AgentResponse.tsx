import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  markdown: string;
}

export function AgentResponse({ markdown }: Props) {
  return (
    <div className="prose prose-slate max-w-none dark:prose-invert prose-headings:font-heading prose-strong:text-cyan-400 prose-blockquote:border-l-cyan-400 prose-blockquote:bg-cyan-100/50 prose-blockquote:py-1 prose-blockquote:not-italic prose-code:rounded prose-code:bg-cyan-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-cyan-700 prose-code:before:content-none prose-code:after:content-none dark:prose-blockquote:bg-cyan-400/10 dark:prose-code:bg-slate-800 dark:prose-code:text-cyan-300">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </div>
  );
}
