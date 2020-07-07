import React from "react";
import { Icon } from "@material-ui/core";
export default (props) => (
  <Icon
    {...props}
    component={(props) => (
      <span
        {...props}
        className={
          props.className
            ? props.className
                .split(" ")
                .filter((x) => x !== "material-icons")
                .concat("material-icons-outlined")
                .join(" ")
            : "material-icons-outlined"
        }
      >
        {" "}
        {props.children}{" "}
      </span>
    )}
  />
);
