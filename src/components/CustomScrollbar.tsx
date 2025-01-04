import { useRef, CSSProperties } from "react";

type CustomScrollbarProps = {
  children: React.ReactNode;
  containerClassName?: string;
  style?: CSSProperties; // Added style property
};

const CustomScrollbar = ({
  children,
  containerClassName = "",
  style = { backgroundColor: "transparent" }, // Set default background to transparent
}: CustomScrollbarProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className={`relative h-full overflow-y-overlay ${containerClassName}`}
      style={{
        ...style, // Spread the passed styles
        background: "transparent",
        scrollbarWidth: "thin", // For Firefox
      }}
    >
      {children}
      <style jsx>{`
        .${containerClassName}::-webkit-scrollbar {
          width: 1vw;
        }
        .${containerClassName}::-webkit-scrollbar-thumb {
          background-color: hsla(0, 0%, 42%, 0.49);
          border-radius: 100px;
        }
      `}</style>
    </div>
  );
};

export default CustomScrollbar;
