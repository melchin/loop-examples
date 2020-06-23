// Libs
import React, { CSSProperties as CSS } from "react";

// Components
import BreedCard from "./BreedCard";
import { FormattedMessage } from "react-intl";

// Utils
import { messages } from "utils";
import { useViewport } from "hooks";

// Styles
const styles = {
  container: (maxHeight: number): CSS => ({
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    overflow: "auto",
    maxHeight,
    height: "100%",
    justifyContent: "center",
  }),
  helperMessage: {
    display: "flex",
    flex: "1 1 auto",
    justifyContent: "center",
    marginTop: "20%",
    fontSize: 20,
    textAlign: "center",
  } as CSS,
};

export interface Props {
  onClear: (breedId: number) => void;
  selected: Array<{ id: number; label: string }>;
}

const SelectedBreeds: React.FC<Props> = (props) => {
  const viewport = useViewport();
  return (
    <div
      style={styles.container(viewport.height)}
      data-test={"modules/dogs/SelectedBreeds"}
    >
      {props.selected.map(({ id, label }) => (
        <BreedCard key={id} name={label} onClear={() => props.onClear(id)} />
      ))}
      {!props.selected.length && (
        <FormattedMessage {...messages.selectSomeBreeds}>
          {(translation) => (
            <div style={styles.helperMessage}> {translation}</div>
          )}
        </FormattedMessage>
      )}
    </div>
  );
};

export default React.memo(SelectedBreeds);
