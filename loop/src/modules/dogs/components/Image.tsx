// Libs
import React, { CSSProperties as CSS, useLayoutEffect, useState } from "react";

// Components
import { Mask } from "generics";

// Styles
import colors from "styles/colors";

const styles: { [key: string]: CSS } = {
  container: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    padding: 10,
    border: `2px solid ${colors.grey()}`,
    minHeight: 100,
  },
};

export interface Props {
  src: string | null;
  breed: string;
}

const Image: React.FC<Props> = (props) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const { src, breed } = props;
  useLayoutEffect(() => {
    if (src) {
      const controller = new AbortController();
      setLoading(true);
      try {
        fetch(src, {
          signal: controller.signal,
        })
          .then((response) => response.blob())
          .then((blob) => {
            const objectUrl = URL.createObjectURL(blob);
            setImgSrc(objectUrl);
            setLoading(false);
          });
      } catch (e) {
        setLoading(false);
      }
    }
  }, [src]);

  return (
    <div style={styles.container}>
      {imgSrc && <img src={imgSrc} height={100} width={100} alt={breed} />}
      <Mask enabled={loading} />
    </div>
  );
};

export default React.memo(Image);
