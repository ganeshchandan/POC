export const getArcWidthForSide = (event: MouseEvent, side: string) => {
  const windowWidth = window.innerWidth;
  const mousePosition = event.pageX;
  return isMobileDevice()
    ? sideAndCalculationMapper[side](mousePosition, windowWidth)
    : 350;
};

const rightSideCalcuation = (mousePosition: number, windowWidth: number) => {
  const width = mousePosition - windowWidth / 2;
  return Math.min(width, 350);
};

const leftSideCalcuation = (mousePosition: number, windowWidth: number) => {
  const width = windowWidth / 2 - mousePosition;
  return Math.min(width, 350);
};

const sideAndCalculationMapper: {
  [key: string]: (mousePosition: number, windowWidth: number) => number;
} = {
  right: rightSideCalcuation,
  left: leftSideCalcuation,
};

export const formatCssVaribales = (varibales: { [key: string]: string }) => {
  return Object.entries(varibales).reduce(
    (result, [key, value]) => ({ ...result, [`--${key}`]: value }),
    {}
  );
};

export const isMobileDevice = () =>
  navigator.userAgent.toLowerCase().includes("mobi");
