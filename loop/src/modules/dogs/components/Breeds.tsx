// Libs
import React, { useState, useCallback, useEffect } from "react";

// Components
import SelectedBreeds from "./SelectedBreeds";
import { Selection } from "generics";

let breedId = 1;
const breedIdNext = () => breedId++;

export interface Props {
  [key: string]: any;
}

const Breeds: React.FC<Props> = (props) => {
  const [dogBreeds, setDogBreeds] = useState<
    Array<{ id: number; label: string }>
  >([]);
  const [selectedBreeds, setSelectedBreeds] = useState<{
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

    setSelectedBreeds((selectedBreeds) => {
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

  const onClearItem = useCallback(
    (id: number) => {
      selectItems([id], true);
    },
    [selectItems]
  );

  return (
    <div style={{ display: "flex" }} data-test={"modules/dogs/Breeds"}>
      <Selection
        items={dogBreeds}
        itemsSelected={selectedBreeds}
        filterItems={filterItems}
        selectItems={selectItems}
        labelKey={"label"}
        perPage={30}
        isBusy={false}
        translated
        paginated
      />
      <SelectedBreeds
        onClear={onClearItem}
        selected={dogBreeds.filter((breed) => selectedBreeds[breed.id])}
      />
    </div>
  );
};

export default React.memo(Breeds);
