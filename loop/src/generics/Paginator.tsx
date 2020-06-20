// Libs
import React, { useCallback, useLayoutEffect, useRef } from "react";

// SVGs
import fillArrowLeft from "images/svg/arrow-left.svg";
import fillArrowRight from "images/svg/arrow-right.svg";

// Components
import { SVG } from "generics";
import { FormattedMessage, MessageDescriptor } from "react-intl";

// Styles
import { grey } from "styles/colors";
import { useCustomStyles } from "hooks";
import classes from "./paginator.scss";

// Utils
import { emptyObject, messages, withCommas } from "utils";

export interface Props {
  setPageIndex: (pageIndex: number) => void;
  pageIndex: number;
  perPage: number;
  totalRecords: number;
  arrows?: {
    size: number;
    color: string;
    leftSrc: string;
    rightSrc: string;
  };
  message?: MessageDescriptor;
  labelRenderer?: (translation: React.ReactNode) => string;
  customSass?: { [className: string]: string };
}

type Ref = React.MutableRefObject<HTMLDivElement | null>;

const isFirstPage = (props: Props) => props.pageIndex === 0;
const isLastPage = (props: Props) =>
  props.pageIndex + 1 >= props.totalRecords / props.perPage;
const getPageInfo = (props: Props) => ({
  onPage: withCommas(props.pageIndex + 1),
  ofPage: withCommas(Math.ceil(props.totalRecords / props.perPage)),
});

export const usePaginatorStyles = (args: {
  containerRef: Ref;
  leftArrowRef: Ref;
  labelRef: Ref;
  rightArrowRef: Ref;
  isFirstPage: boolean;
  isLastPage: boolean;
  customSass: { [className: string]: string };
}) => {
  const {
    containerRef,
    leftArrowRef,
    labelRef,
    rightArrowRef,
    isFirstPage,
    isLastPage,
    customSass,
  } = args;

  const paginatorContainer = useCustomStyles(
    classes,
    customSass,
    "paginator-container"
  );
  const paginatorLeftArrow = useCustomStyles(
    classes,
    customSass,
    "paginator-left-arrow"
  );
  const paginatorLabel = useCustomStyles(
    classes,
    customSass,
    "paginator-label"
  );
  const paginatorRightArrow = useCustomStyles(
    classes,
    customSass,
    "paginator-right-arrow"
  );
  const paginatorDisabled = useCustomStyles(
    classes,
    customSass,
    "paginator-arrow-disabled"
  );

  useLayoutEffect(() => {
    if (isFirstPage) {
      leftArrowRef.current?.classList.add(...paginatorDisabled);
    } else {
      leftArrowRef.current?.classList.remove(...paginatorDisabled);
    }
  }, [isFirstPage]);

  useLayoutEffect(() => {
    if (isLastPage) {
      rightArrowRef.current?.classList.add(...paginatorDisabled);
    } else {
      rightArrowRef.current?.classList.remove(...paginatorDisabled);
    }
  }, [isLastPage]);

  useLayoutEffect(() => {
    containerRef.current?.classList.add(...paginatorContainer);
    leftArrowRef.current?.classList.add(...paginatorLeftArrow);
    labelRef.current?.classList.add(...paginatorLabel);
    rightArrowRef.current?.classList.add(...paginatorRightArrow);
  }, []);
};

const Paginator: React.FC<Props> = (props) => {
  const {
    pageIndex,
    setPageIndex,
    arrows = {
      size: 18,
      color: grey(),
      leftSrc: fillArrowLeft,
      rightSrc: fillArrowRight,
    },
    labelRenderer = (translation: React.ReactNode) => translation,
    message = messages.page,
    customSass = emptyObject,
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const leftArrowRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const rightArrowRef = useRef<HTMLDivElement>(null);

  usePaginatorStyles({
    containerRef,
    leftArrowRef,
    labelRef,
    rightArrowRef,
    isFirstPage: isFirstPage(props),
    isLastPage: isLastPage(props),
    customSass,
  });

  const onClick = useCallback(setPageIndex, [setPageIndex]);
  const onPrev = () => (!isFirstPage(props) ? onClick(pageIndex - 1) : null);
  const onNext = () => (!isLastPage(props) ? onClick(pageIndex + 1) : null);
  const { onPage, ofPage } = getPageInfo(props);
  return (
    <FormattedMessage {...message} values={{ onPage, ofPage }}>
      {(translation) => (
        <div ref={containerRef} data-test={"Zeplin-Paginator"}>
          <div ref={leftArrowRef} onClick={onPrev}>
            <SVG src={arrows.leftSrc} size={arrows.size} color={arrows.color} />
          </div>
          <div ref={labelRef}>{labelRenderer(translation)}</div>
          <div ref={rightArrowRef} onClick={onNext}>
            <SVG
              src={arrows.rightSrc}
              size={arrows.size}
              color={arrows.color}
            />
          </div>
        </div>
      )}
    </FormattedMessage>
  );
};

export default React.memo(Paginator);
