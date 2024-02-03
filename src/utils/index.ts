export const getArcWidthForSide = (event: MouseEvent, side: string) => {
  const windowWidth = window.innerWidth;
  const mousePosition = event.pageX;
  //   debugger;
  return side === "right" ? mousePosition - windowWidth / 2 : mousePosition;
};
