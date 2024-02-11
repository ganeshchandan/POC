import { forwardRef, useRef } from "react";

const debounce = (func: () => void, timeout = 1000) => {
  let timer: NodeJS.Timeout;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(null);
    }, timeout);
  };
};

const Card = forwardRef(
  (
    {
      details,
      className,
      isSelected,
      handleCloseClick,
    }: {
      details: { id: number; [key: string]: string | number };
      className?: string;
      isSelected: boolean;
      handleCloseClick: () => void;
    },
    cardRef
  ) => {
    const { content, header, color } = details;
    // const cardRef = useRef<HTMLDivElement>(null);

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
        <div className="front-face">
          <div className="cardPreview">
            <div className="cardPreviewHeader">
              <span style={{ background: color }}>{header}</span>
            </div>
            <div className="cardPreviewImage">
              <img src={`images/${header}.jpg`} alt="images"></img>
            </div>
          </div>
        </div>
        <div className="back-face">Back face {content}</div>
      </div>
    );
  }
);

export default Card;
