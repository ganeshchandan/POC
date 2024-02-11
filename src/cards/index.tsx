import {
  Dispatch,
  SetStateAction,
  createContext,
  useRef,
  useState,
  useEffect,
} from "react";
import Card from "./card";
import "./styles/index.scss";
import Canvas from "./canvas";
import { isMobileDevice } from "../utils";
import CardContent from "./card_content";
import { contents, LEFT_SIDE, RIGHT_SIDE } from "./constant";

const getClassName = (
  index: number,
  selectedCardNo: number,
  side: string,
  selectedIndex: number,
  secondIndex: number,
  thirdIndex: number,
  lastCardSwip: number
) => {
  let className = "";
  if (index === selectedCardNo) {
    className = " selectedCard";
  } else if (selectedIndex === index) {
    className = `activeCard selectingCard_${side}`;
  } else if (secondIndex === index) {
    className = "secondCard";
  } else if (thirdIndex === index) {
    className = "thirdCard";
  } else if (selectedIndex - 1 === index) {
    className = "lastCardSwip";
  }

  return `${className} ${selectedCardNo !== -1 ? "activeCardNone" : ""}`;
};

const CardContext = createContext<{
  selectedCard?: {
    selectedIndex: number;
    id: number;
    color: string;
    content: string;
  };
  setSelectedCard?: Dispatch<
    SetStateAction<{
      selectedIndex: number;
      id: number;
      color: string;
      content: string;
      header: string;
      sample: string;
    }>
  >;
}>({});

export type TSide = "none" | "left" | "right" | "both" | "reverse_both";

const Cards = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [selectedCard, setSelectedCard] = useState({
    selectedIndex: 0,
    ...contents[0],
  });
  const [side, setSide] = useState<TSide>("none");
  const { selectedIndex, color } = selectedCard;
  const [selectedCardNo, setSelectedCardNo] = useState(-1);
  const { color: nextColor = "#0073e6" } =
    contents[(selectedIndex + 1) % contents.length];
  const [arcWidth, setArcWidth] = useState(0);
  const [cssVaribales, setCssVaribales] = useState({});

  useEffect(() => {
    const width = isMobileDevice() ? 100 : 350;
    setArcWidth(width);
    setCssVaribales({
      "--translate-x": `-${window.innerWidth / 2 + 150}px`,
      "--selecting-card-position": `${width}px`,
    });
  }, []);

  const handleSetSelectedCard = (event: any) => {
    const isMobile = isMobileDevice();
    const { nativeEvent } = event;
    if (
      (isMobile && nativeEvent instanceof TouchEvent) ||
      (!isMobile && nativeEvent instanceof MouseEvent)
    ) {
      setSide("both");
      setSelectedCard(() => {
        const index = (selectedIndex + 1) % contents.length;
        return {
          selectedIndex: index,
          ...contents[index],
        };
      });
    }
  };

  const renderCards = () => {
    const length = contents.length;
    const secondIndex = (selectedIndex + 1) % length;
    const thirdIndex = (selectedIndex + 2) % length;
    let lastCardSwip = selectedIndex - 1;
    lastCardSwip = lastCardSwip === -1 ? length - 1 : lastCardSwip;

    const html = [selectedIndex, secondIndex, thirdIndex, lastCardSwip].map(
      (index) => {
        const content = contents[index];
        let className = getClassName(
          index,
          selectedCardNo,
          side,
          selectedIndex,
          secondIndex,
          thirdIndex,
          lastCardSwip
        );

        return (
          <Card
            ref={selectedIndex === index ? cardsRef : null}
            details={content}
            key={index}
            className={className}
          />
        );
      }
    );
    return html;
  };

  const handleMouseEnter = (event: any) => {
    event.stopPropagation();
    const { dataset } = event.target;
    const { side: datasetID } = dataset;
    if (!isMobileDevice()) {
      if (side !== datasetID) {
        setSide(() => datasetID);
      }
      setCssVaribales((cssVaribales) => ({
        ...cssVaribales,
        [`--selecting-card-position`]: `${
          datasetID === LEFT_SIDE ? "-" : ""
        }350px`,
      }));
    }
  };

  const handleTouchEnter = (event: any) => {
    event.stopPropagation();
    const clientX = event.touches[0].clientX;
    const datasetID = clientX < window.innerWidth / 2 ? LEFT_SIDE : RIGHT_SIDE;

    if (side !== datasetID) {
      setSide(() => datasetID);
    }

    if (isMobileDevice()) {
      setCssVaribales((cssVaribales) => ({
        ...cssVaribales,
        [`--selecting-card-position`]: `${
          datasetID === LEFT_SIDE ? "-" : ""
        }100px`,
      }));
    }

    // setArcWidth(getArcWidthForSide(event, datasetID));
  };

  const handleTouchEnd = (event: any) => {
    event.stopPropagation();
    if (side === LEFT_SIDE) {
      handleSetSelectedCard(event);
    } else {
      handleSetSelectedCardNo(event);
    }
  };

  const handleSetSelectedCardNo = (event: any) => {
    event.stopPropagation();
    const isMobile = isMobileDevice();
    const { nativeEvent } = event;
    if (
      (isMobile && nativeEvent instanceof TouchEvent) ||
      (!isMobile && nativeEvent instanceof MouseEvent)
    ) {
      setSelectedCardNo(selectedIndex);
      setSide("both");
      const target = cardsRef.current;
      if (target) {
        target.style.transform = "";
      }
      if (contentRef.current) {
        const target = contentRef.current;
        target.classList.remove("deSelectedCard");
        target.classList.add("selectedCard");
      }
    }
  };

  const handleCloseClick = () => {
    setSelectedCardNo(-1);
  };

  const onCloseSelectedCard = (event: any) => {
    event.stopPropagation();
    if (contentRef.current) {
      const target = contentRef.current;
      target.classList.remove("selectedCard");
      target.classList.add("deSelectedCard");
      setSide("reverse_both");
      setTimeout(() => {
        setSelectedCardNo(-1);
        setSide("none");
        target.classList.remove("selectedCard");
        target.classList.remove("deSelectedCard");
      }, 1000);
    }
  };

  const updatePosition = (x3: number, drawingDirection: string) => {
    const current = cardsRef.current;
    if (current) {
      const multiplier = x3 < 0 ? -1 : 1;
      const rotateY =
        x3 * multiplier * 0.06 * (drawingDirection === LEFT_SIDE ? -1 : 1);
      x3 = x3 - (current.clientWidth / 2) * multiplier * 0.06;
      current.style.transform = `perspective(300px) rotateY(${rotateY}deg) translateX(${x3}px) translateZ(80px)`;
    }
  };

  const handleEvents = isMobileDevice()
    ? {
        onTouchStart: handleTouchEnter,
        // onTouchMove: handleTouchEnter,
        onTouchEnd: handleTouchEnd,
        onTouchMoveCapture: handleTouchEnter,
      }
    : {
        onClick: handleTouchEnd,
        onMouseEnter: handleMouseEnter,
        onMouseMove: handleMouseEnter,
      };

  return (
    <div className="App" style={cssVaribales}>
      <CardContext.Provider value={{ selectedCard, setSelectedCard }}>
        <div className="cards">{renderCards()}</div>

        <div
          className={`showMeAndNextCard ${
            selectedCardNo !== -1 ? "cardSelected" : ""
          }`}
        >
          <div
            className="nextCard"
            // onClick={handleSetSelectedCard}
            // onTouchStart={handleTouchEnter}
            // onMouseEnter={handleMouseEnter}
            // onMouseMove={handleMouseEnter}
            // onTouchEnd={handleTouchEnd}
            {...handleEvents}
            data-side={LEFT_SIDE}
          >
            Next Card
          </div>
          <div
            className="showme"
            // onClick={handleSetSelectedCardNo}
            // onTouchStart={handleTouchEnter}
            // onMouseEnter={handleMouseEnter}
            // onMouseMove={handleMouseEnter}
            // onTouchEnd={handleTouchEnd}
            {...handleEvents}
            data-side={RIGHT_SIDE}
          >
            Show me!
          </div>
        </div>

        <Canvas
          side={side}
          backgroundColor={color}
          nextColor={nextColor}
          arcWidth={arcWidth}
          updatePosition={updatePosition}
        />

        <div
          ref={contentRef}
          className="flipCardContainer"
          onClick={onCloseSelectedCard}
        >
          <div className={`flipCard`}>
            {/* <div className="front-face">font-face - {content}</div>
            <div className="back-face">
              <button>Close</button>Back face - {content}
            </div> */}
            <CardContent details={contents[selectedIndex]} />
          </div>
        </div>
      </CardContext.Provider>
    </div>
  );
};

export default Cards;
