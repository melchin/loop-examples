// Libs
import chunk from "lodash/chunk";
import React, { useState } from "react";
import { FormattedMessage, IntlShape, injectIntl } from "react-intl";
import { createSelector } from "reselect";

// Components
import Mask from "./Mask";
import TextField from "./TextField";
import Paginator from "./Paginator";
import SVG from "./SVG";

// Hooks
import { usePage } from "./hooks/selection";

// Utils
import { emptyArrayOr, getIcon, messages } from "utils";

// Styles
import classes from "./styles/selection.scss";

export interface Props<T extends { id: number }, X> {
  items: T[];
  itemsSelected: { [key: number]: X };
  isBusy: boolean;
  intl: IntlShape;
  filterItems: (searchValue: string) => (item: T) => boolean;
  selectItems: (ids: number[], deselect: boolean) => void;
  labelKey: string;
  perPage?: number;
  paginated?: boolean;
  messageKeys?: {
    search?: keyof typeof messages;
    selectAll?: keyof typeof messages;
    noOptions?: keyof typeof messages;
  };
  translated?: boolean;
  hideSelectAll?: boolean;
}

export const isTranslatable = (
  label: string | keyof typeof messages
): label is keyof typeof messages => {
  return !!messages?.[label as keyof typeof messages];
};

const translate = (label: string | keyof typeof messages, intl: IntlShape) => {
  if (isTranslatable(label)) {
    return intl.formatMessage(messages[label]);
  }
  return label;
};

const getItems = (props: Props<any, any>) => emptyArrayOr(props.items);
const getIntl = (props: Props<any, any>) => props.intl;
const getTranslated = (props: Props<any, any>) => props.translated;
const getLabelKey = (props: Props<any, any>) => props.labelKey;

const getTranslatedItems = createSelector(
  [getItems, getIntl, getTranslated, getLabelKey],
  (items, intl, translated, labelKey) => {
    if (translated && items.length) {
      return items.map((item) => ({
        ...item,
        [labelKey]: translate(item[labelKey], intl),
      }));
    }
    return items;
  }
);

const Selection: React.FC<Props<any, any>> = (props) => {
  const { selectItems } = props;

  const selectHandler = React.useCallback(
    (ids: number[], deselect: boolean) => selectItems(ids, deselect),
    [selectItems]
  );

  const {
    onSelectAll,
    onChangeSearch,
    searchValue,
    records,
    allSelected,
  } = usePage(
    getTranslatedItems(props),
    props.itemsSelected,
    props.filterItems,
    selectHandler
  );

  const selectedRecordRows: JSX.Element[] = [];

  const recordRows = records.map((record, index) => {
    const row = (
      <div
        key={index}
        className={classes["cc-selection-row"]}
        onClick={record.onClick}
      >
        <div className={"selection-checkbox"}>
          <SVG src={getIcon(record.isSelected).checkbox} />
        </div>
        <div className={"selection-item"}>
          <span>{record[props.labelKey]}</span>
        </div>
      </div>
    );
    if (record.isSelected) {
      selectedRecordRows.push(row);
    }
    return row;
  });

  const messageKeys: { [key: string]: keyof typeof messages } = {
    search: props.messageKeys?.search ?? "search",
    selectAll: props.messageKeys?.selectAll ?? "selectAll",
    noOptions: props.messageKeys?.noOptions ?? "noOptions",
  };

  return (
    <React.Fragment>
      <div className={classes["cc-selection-textFieldContainer"]}>
        <TextField onChange={onChangeSearch} value={searchValue} />
      </div>
      <SelectAll
        checked={allSelected}
        show={!props.hideSelectAll}
        onClick={onSelectAll}
        records={records}
        messageKeys={messageKeys}
      />
      <Page
        selectedRecordRows={selectedRecordRows}
        paginated={props.paginated}
        records={recordRows}
        perPage={props.perPage}
        messageKeys={messageKeys}
      />
      <Mask enabled={props.isBusy} />
    </React.Fragment>
  );
};

interface SelectAllProps {
  onClick: any;
  show: boolean;
  records: any[];
  checked: boolean;
  messageKeys: { [key: string]: keyof typeof messages };
}

const SelectAll: React.FC<SelectAllProps> = (props) => {
  if (props.show) {
    const disabled = !props.records.length;
    return (
      <div
        className={classes["cc-selection-selectAll"]}
        onClick={props.onClick}
      >
        <div className={`selection-checkbox${disabled ? " is-disabled" : ""}`}>
          <SVG src={getIcon(props.checked).checkbox} />
        </div>
        <div className={`selection-item${disabled ? " is-disabled" : ""}`}>
          <FormattedMessage {...messages[props.messageKeys.selectAll]} />
        </div>
      </div>
    );
  }
  return null;
};

interface PageProps {
  paginated: Props<any, any>["paginated"];
  selectedRecordRows: JSX.Element[];
  records: JSX.Element[];
  perPage?: Props<any, any>["perPage"];
  messageKeys: { [key: string]: keyof typeof messages };
}

const getRecords = (props: PageProps) => emptyArrayOr(props.records);
const getPerPage = (props: PageProps) => props.perPage ?? 10;
const getPages = createSelector(
  [getRecords, getPerPage],
  (
    records: PageProps["records"],
    perPage: PageProps["perPage"]
  ): Array<PageProps["records"]> => {
    return chunk(records, perPage);
  }
);

const Page: React.FC<PageProps> = (props) => {
  const [pageIndex, setPageIndex] = useState<number>(0);

  const page = getPages(props)[pageIndex];
  const records = getRecords(props);
  const numRecords = records.length;

  const classPaginated = !props.paginated ? " paginator-off" : "";
  const className = `page${classPaginated}`;

  if (numRecords) {
    return (
      <div className={classes[className]}>
        {props.paginated ? page : records}
        {props.paginated && (
          <Paginator
            totalRecords={numRecords}
            perPage={getPerPage(props)}
            setPageIndex={setPageIndex}
            pageIndex={pageIndex}
          />
        )}
      </div>
    );
  }

  return (
    <div className={classes["cc-selection-message"]}>
      <FormattedMessage {...messages[props.messageKeys.noOptions]} />
    </div>
  );
};

export default React.memo(injectIntl(Selection));
