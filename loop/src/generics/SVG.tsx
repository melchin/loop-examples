// Libs
import React, { CSSProperties as CSS } from "react";
import InlineSvgReact from "svg-inline-react";

interface Props {
  src: string;
  size?: number;
  color?: string;
}

const styles = {
  container: (size: number): CSS => ({
    display: "inline-block",
    height: size,
    width: size,
    position: "relative",
  }),
  svg: (color: string): CSS => ({
    display: "block",
    fill: color,
  }),
};

/**
 *
 * For simplicity, width and height will be the same for this example.
 */
export const SvgIcon: React.FC<Props> = ({
  src,
  size = 24,
  color = "initial",
}) => {
  return (
    <div style={styles.container(size)}>
      <InlineSvgReact src={src} style={styles.svg(color)} />
    </div>
  );
};

export default SvgIcon;
