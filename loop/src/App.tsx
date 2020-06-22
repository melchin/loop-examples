import React, { useState, useCallback, useEffect } from "react";
import { IntlProvider } from "react-intl";

import { Selection } from "generics";

let breedId = 1;
const breedIdNext = () => breedId++;

function App() {
  const [dogBreeds, setDogBreeds] = useState<
    Array<{ id: number; label: string }>
  >([]);
  const [selectedPeople, setSelectedPeople] = useState<{
    [id: string]: boolean;
  }>({});

  useEffect(() => {
    const controller = new AbortController();
    try {
      fetch("https://dog.ceo/api/breeds/list/all", {
        signal: controller.signal,
      })
        .then((response) => response.json())
        .then(({ message }: any) => {
          return Object.keys(message);
        })
        .then((breeds) => {
          setDogBreeds(
            breeds.map((breed) => ({ id: breedIdNext(), label: breed }))
          );
        });
    } catch (e) {
      setDogBreeds([]);
    }

    return () => controller.abort();
  }, []);

  const selectItems = useCallback((ids: number[], deselect: boolean) => {
    const updatedSelections = ids.reduce((acc: any, id: number) => {
      acc[id] = !deselect;
      return acc;
    }, {});

    setSelectedPeople((selectedBreeds) => {
      const nextSelections = {
        ...selectedBreeds,
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
        items={dogBreeds}
        itemsSelected={selectedPeople}
        filterItems={filterItems}
        selectItems={selectItems}
        labelKey={"label"}
        perPage={30}
        isBusy={false}
        translated
        paginated
      />
    </IntlProvider>
  );
}

export default App;
