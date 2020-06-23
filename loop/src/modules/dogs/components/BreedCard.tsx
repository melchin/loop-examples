// Libs
import React, {
  CSSProperties as CSS,
  useEffect,
  useRef,
  useState,
} from "react";

// Components
import Image from "./Image";
import colors from "styles/colors";

// Hooks
import { useMouseHover } from "hooks";

// Styles
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    padding: 10,
    width: 200,
    maxWidth: 200,
  } as CSS,
  header: {
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: colors.grey(),
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  } as CSS,
  name: {
    flex: "1 1 auto",
    padding: 10,
    color: colors.white(),
  } as CSS,
  x: (hovered: boolean): CSS => ({
    flex: "0 0 auto",
    padding: 10,
    color: hovered ? "red" : colors.white(),
    cursor: hovered ? "pointer" : "default",
  }),
};

export interface Props {
  onClear: () => void;
  name: string;
}

const BreedCard: React.FC<Props> = (props) => {
  const { name } = props;

  const closeRef = useRef<HTMLDivElement>(null);

  const hovered = useMouseHover(closeRef);

  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    try {
      fetch(`https://dog.ceo/api/breed/${name}/images/random`, {
        signal: controller.signal,
      })
        .then((response) => response.json())
        .then(({ message: src }: any) => {
          setSrc(src);
        });
    } catch (e) {
      setSrc(null);
    }

    return () => controller.abort();
  }, [name]);

  return (
    <div style={styles.container} data-test={"modules/dogs/BreedCard"}>
      <div style={styles.header}>
        <div style={styles.name}> {props.name}</div>
        <div ref={closeRef} style={styles.x(hovered)} onClick={props.onClear}>
          x
        </div>
      </div>
      <Image src={src} breed={props.name} />
    </div>
  );
};

export default React.memo(BreedCard);
