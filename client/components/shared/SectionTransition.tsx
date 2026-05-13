type Direction = "light-to-dark" | "dark-to-light";

interface Props {
  direction: Direction;
  className?: string;
}

export default function SectionTransition({ direction, className = "" }: Props) {
  return (
    <div
      className={`h-[60px] md:h-[80px] pointer-events-none ${
        direction === "light-to-dark"
          ? "bg-gradient-to-b from-white to-black"
          : "bg-gradient-to-b from-black to-white"
      } ${className}`}
      aria-hidden="true"
    />
  );
}
