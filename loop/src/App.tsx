import React, { useState, useCallback } from "react";
import { IntlProvider } from "react-intl";

import { Selection } from "generics";

const people = [
  { id: 1, label: "brad" },
  { id: 2, label: "brayden" },
  { id: 3, label: "owen" },
  { id: 4, label: "oscar" },
  { id: 5, label: "steve" },
  { id: 6, label: "steven" },
  { id: 7, label: "stevo" },
  { id: 8, label: "kyle" },
  { id: 9, label: "karen" },
  { id: 10, label: "andrea" },
  { id: 11, label: "becky" },
  { id: 12, label: "sharon" },
  { id: 13, label: "kacey" },
  { id: 14, label: "jenna" },
  { id: 15, label: "jesse" },
  { id: 16, label: "ryan" },
  { id: 17, label: "renold" },
];

function App() {
  const [selectedPeople, setSelectedPeople] = useState<{
    [id: string]: boolean;
  }>({});

  const selectItems = useCallback((ids: number[], deselect: boolean) => {
    const updatedSelections = ids.reduce((acc: any, id: number) => {
      acc[id] = !deselect;
      return acc;
    }, {});

    setSelectedPeople((selectedPeople) => {
      const nextSelections = {
        ...selectedPeople,
        ...updatedSelections,
      };

      Object.keys(nextSelections).forEach((id) => {
        if (!nextSelections[id]) {
          delete nextSelections[id];
        }
      });
      return nextSelections;
    });
  }, []);

  const filterItems = useCallback(
    (searchValue) => (person: { id: number; label: string }) => {
      return !!person.label.toLowerCase().match(searchValue);
    },
    []
  );

  return (
    <IntlProvider locale={"en"}>
      <Selection
        items={people}
        itemsSelected={selectedPeople}
        filterItems={filterItems}
        selectItems={selectItems}
        labelKey={"label"}
        perPage={8}
        isBusy={false}
        translated
        paginated
      />
    </IntlProvider>
  );
}

export default App;
