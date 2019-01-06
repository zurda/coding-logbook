import React from "react";

const ActionBtn = props => {
  return (
    <div>
      <button className={props.name} onClick={e => props.click(e)}>
        {props.text}
      </button>
    </div>
  );
};

export default ActionBtn;
