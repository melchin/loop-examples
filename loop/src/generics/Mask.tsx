// Libs
import * as React from "react";

// Components
import Spinner from "react-spinkit";

// Style
import classes from "./styles/mask.scss";

const Mask: React.FC<{ enabled?: boolean }> = (props) => {
  if (!props.enabled) {
    return null;
  }

  return (
    <div className={classes["mask-container"]}>
      <Spinner name={"ball-spin-fade-loader"} />
    </div>
  );
};

export default Mask;
