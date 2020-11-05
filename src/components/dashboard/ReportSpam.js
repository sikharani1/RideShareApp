import React from 'react'
const ReportSpam = props => {
  let classes = "fas fa-flag";
  if (!props.spamReported) classes = "far fa-flag";
  return (
    <i
        id="spam"
      onClick={props.onClick}
      style={{ cursor: "pointer" }}
      className={classes}
      aria-hidden="true"
      spamReported={props.spamReported}
    />
  );
};

export default ReportSpam;