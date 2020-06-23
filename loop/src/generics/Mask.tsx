// Libs
import * as React from "react";

// Components
import { FormattedMessage } from "react-intl";

// Style
import classes from "./styles/mask.scss";
import { messages } from "utils";

const Mask: React.FC<{ enabled?: boolean }> = (props) => {
  if (!props.enabled) {
    return null;
  }

  return (
    <div className={classes["mask-container"]}>
      <FormattedMessage {...messages.loading} />
    </div>
  );
};

export default Mask;
