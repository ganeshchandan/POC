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
import { getArcWidthForSide, isMobileDevice } from "../utils";

const getClassName = (
  index: number,
  selectedCardNo: number,
  side: string,
  selectedIndex: number,
  secondIndex: number,
  thirdIndex: number
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
    }>
  >;
}>({});

export type TSide = "none" | "left" | "right" | "both" | "reverse_both";

const contents = [
  {
    id: 0,
    color: "#0073e6",
    content:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries",
  },
  {
    id: 1,
    color: "#2991f5",
    content:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English",
  },
  {
    id: 2,
    color: "#e42616",
    content:
      "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur",
  },
  {
    id: 3,
    color: "#ceead6",
    content:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English",
  },
  {
    id: 4,
    color: "#ee5143",
    content:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English",
  },
  {
    id: 5,
    color: "#1fb254",
    content:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English",
  },
  {
    id: 6,
    color: "#202124",
    content:
      "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur",
  },
];

const Cards = () => {
  // const [translateX, setTranslateX] = useState("-1200px");
  const contentRef = useRef<HTMLDivElement>(null);
  const [selectedCard, setSelectedCard] = useState({
    selectedIndex: 0,
    ...contents[0],
  });
  const [side, setSide] = useState<TSide>("none");
  const { selectedIndex, color } = selectedCard;
  const [selectedCardNo, setSelectedCardNo] = useState(-1);
  const { color: nextColor = "#0073e6", content } =
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
    return contents.map(({ content }, index) => {
      let className = getClassName(
        index,
        selectedCardNo,
        side,
        selectedIndex,
        secondIndex,
        thirdIndex
      );
      // if(index === selectedCardNo){
      //     className = " selectedCard"
      // } else if(selectedIndex === index){
      //     className = `activeCard selectingCard_${side}`;
      // } else if(secondIndex === index){
      //     className = "secondCard";
      // } else if(thirdIndex === index){
      //     className = "thirdCard";
      // } else if(selectedIndex - 1 === index){
      //     className = "lastCardSwip"
      // }
      return (
        <Card
          handleCloseClick={handleCloseClick}
          content={`${index} - ${content}`}
          key={index}
          className={className}
          isSelected={index === selectedCardNo}
        />
      );
    });
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
          datasetID === "left" ? "-" : ""
        }350px`,
      }));
      // setArcWidth(getArcWidthForSide(event, datasetID));
    }
  };

  const handleTouchEnter = (event: any) => {
    event.stopPropagation();
    const { dataset } = event.target;
    const { side: datasetID } = dataset;

    if (side !== datasetID) {
      setSide(() => datasetID);
    }
    if (isMobileDevice()) {
      setCssVaribales((cssVaribales) => ({
        ...cssVaribales,
        [`--selecting-card-position`]: `${
          datasetID === "left" ? "-" : ""
        }100px`,
      }));
    }

    // setArcWidth(getArcWidthForSide(event, datasetID));
  };

  const handleMouseLeave = () => {
    if (!isMobileDevice()) {
      // setSide(() => "none");
    }
  };

  const handleTouchEnd = (event: any) => {
    event.stopPropagation();
    const { dataset } = event.target;
    const { side } = dataset;
    if (side === "left") {
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

  const handleSideClick = (event: any) => {};

  const handleEvents = isMobileDevice()
    ? {
        onTouchStart: handleTouchEnter,
        onTouchEnd: handleTouchEnd,
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
            data-side="left"
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
            data-side="right"
          >
            Show me!
          </div>
        </div>

        <Canvas
          side={side}
          backgroundColor={color}
          nextColor={nextColor}
          arcWidth={arcWidth}
        />

        <div
          ref={contentRef}
          className="flipCardContainer"
          onClick={onCloseSelectedCard}
        >
          <div className={`flipCard`}>
            <div className="front-face">font-face - {content}</div>
            <div className="back-face">
              <button>Close</button>Back face - {content}
            </div>
          </div>
        </div>
      </CardContext.Provider>
    </div>
  );
};

export default Cards;
