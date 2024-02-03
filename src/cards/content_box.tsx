import "./box.scss";

const ContentBox = () => {
  return (
    <div className="box">
      <div className="front-face">
        "Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry's standard dummy text ever
        since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book. It has survived not only five
        centuries",
      </div>
      <div className="back-face">
        "Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry's standard dummy text ever
        since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book. It has survived not only five
        centuries",
      </div>
      <div className="left-face"></div>
      <div className="right-face"></div>
      <div className="bottom-face"></div>
      <div className="top-face"></div>
    </div>
  );
};

export default ContentBox;
