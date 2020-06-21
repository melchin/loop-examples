// Libs
import _ from "lodash";
import { useCallback, useState } from "react";

const getLastSelectedIndex = <T extends { id: number }, X>(
  lastSelectedId: number,
  filteredItems: T[],
  selectedItems: { [id: number]: X }
) => {
  return lastSelectedId > -1
    ? _.findIndex(filteredItems, (item) => item.id === lastSelectedId)
    : _.findLastIndex(filteredItems, (item) => !!selectedItems[item.id]);
};

const useSearch = <T extends { id: number }, X>(
  items: Array<T>,
  filterFn: (searchValue: string) => (item: T) => X
) => {
  const [searchValue, setSearchValue]: [any, any] = useState(undefined);
  const onChangeSearch = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    const value = e?.currentTarget?.value;
    const text = value ? _.toLower(value) : undefined;
    setSearchValue(text);
  }, []);

  const filteredItems = searchValue
    ? items.filter(filterFn(searchValue))
    : items;

  return [onChangeSearch, searchValue, filteredItems] as [
    typeof onChangeSearch,
    typeof searchValue,
    typeof filteredItems
  ];
};

const useSelection = <T extends { id: number }, X>(
  filteredItems: Array<T>,
  selectedItems: { [id: number]: X },
  allSelected: boolean
) => {
  const [lastSelectedId, setLastSelectedId] = useState(-1); // Needed for shift click selecting
  const createOnSelect = useCallback(
    (
      selectFn: (ids: number[], deselect: boolean) => void,
      selectAll: boolean
    ): ((...a: any[]) => void) => {
      if (selectAll) {
        return (e: any) => {
          if (_.size(filteredItems)) {
            selectFn(
              filteredItems.map((item) => item.id),
              allSelected
            );
          }
        };
      }

      return (id: number) => {
        const deselect = !!selectedItems[id];
        selectFn([id], deselect);
        setLastSelectedId(deselect ? -1 : id);
      };
    },
    [filteredItems, selectedItems, allSelected]
  );

  return [createOnSelect, lastSelectedId] as [
    typeof createOnSelect,
    typeof lastSelectedId
  ];
};

export const usePage = <T extends { id: number }, X>(
  allItems: Array<T>,
  selectedItems: { [id: number]: X },
  filterFn: (searchValue: string) => (item: T) => X,
  selectFn: (ids: number[], deselect: boolean) => void
) => {
  const [onChangeSearch, searchValue, filteredItems] = useSearch<T, X>(
    allItems,
    filterFn
  );
  const filteredIds = _.map(filteredItems, (item) => item.id);
  const allSelected =
    !!_.size(filteredIds) && !_.find(filteredIds, (id) => !selectedItems[id]);
  const [createOnSelect, lastSelectedId] = useSelection<T, X>(
    filteredItems,
    selectedItems,
    allSelected
  );

  const onSelect = createOnSelect(selectFn, false);
  const onSelectAll = createOnSelect(selectFn, true);

  const lastSelectedIndex = getLastSelectedIndex(
    lastSelectedId,
    filteredItems,
    selectedItems
  );

  const records = _.map(filteredItems, (item, index) => {
    const isSelected = !!selectedItems[item.id];
    const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (e.shiftKey && _.size(selectedItems)) {
        if (lastSelectedIndex > -1 && index > lastSelectedIndex) {
          const nextSelected = filteredItems.slice(
            lastSelectedIndex,
            index + 1
          );
          selectFn(
            nextSelected.map((item) => item.id),
            false
          );
          return;
        }
      }
      onSelect(item.id);
    };
    return { ...item, onClick, isSelected } as T & {
      onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
      isSelected: boolean;
    };
  });

  return {
    onSelectAll,
    onChangeSearch,
    searchValue,
    records,
    allSelected,
  };
};
