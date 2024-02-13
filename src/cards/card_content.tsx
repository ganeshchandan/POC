const CardContent = ({
  details,
}: {
  details: { id: number; [key: string]: string | number };
}) => {
  const { content, header, color, sample } = details;
  return (
    <>
      <div className="front-face">
        <div className="cardPreview">
          <div className="cardPreviewHeader">
            <span style={{ background: color }}>{header}</span>
          </div>
          <article
            className="cardPreviewContent"
            // style={{ color: color as string }}
          >
            {sample}
          </article>
          <div className="cardPreviewImage">
            <img src={`images/${header}.jpg`} alt="images"></img>
          </div>
        </div>
      </div>
      <div className="back-face">Back face {content}</div>
    </>
  );
};

export default CardContent;
