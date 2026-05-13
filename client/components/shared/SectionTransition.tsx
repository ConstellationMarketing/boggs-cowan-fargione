type Direction = "light-to-dark" | "dark-to-light";

interface Props {
  direction: Direction;
  className?: string;
}

export default function SectionTransition({ direction, className = "" }: Props) {
  return (
    <div
      className={`h-[120px] md:h-[180px] pointer-events-none ${
        direction === "light-to-dark"
          ? "bg-gradient-to-b from-white to-black"
          : "bg-gradient-to-b from-black to-white"
      } ${className}`}
      aria-hidden="true"
    />
  );
}
