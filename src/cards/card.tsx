import { forwardRef, useRef } from "react";
import CardContent from "./card_content";
const Card = forwardRef(
  (
    {
      details,
      className,
    }: {
      details: { id: number; [key: string]: string | number };
      className?: string;
    },
    cardRef
  ) => {
    const handleMouseEnter = (event: any) => {
      event.preventDefault();
    };

    const handleMouseLeave = (event: any) => {
      event.preventDefault();
    };

    return (
      <div
        className={`card ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        //@ts-ignore
        ref={cardRef}
      >
        <CardContent details={details} />
      </div>
    );
  }
);

export default Card;
