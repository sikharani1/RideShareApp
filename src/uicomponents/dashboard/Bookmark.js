import React from "react";

const Bookmark = props => {
  let classes = "fas fa-star";
  if (!props.starred) classes = "far fa-star";
  return (
    <i
        id="bookmark"
      onClick={props.onClick}
      style={{ cursor: "pointer" }}
      className={classes}
      aria-hidden="true"
      starred={props.starred}
    />
  );
};

export default Bookmark;