interface LegalHighlightProps {
  children: React.ReactNode;
}

export default function LegalHighlight({
  children,
}: LegalHighlightProps) {
  return (
    <blockquote
      className="
        my-8
        rounded-3xl
        border
        border-primary/20
        bg-primary/5
        px-8
        py-6
        text-lg
        italic
        leading-8
      "
    >
      {children}
    </blockquote>
  );
}