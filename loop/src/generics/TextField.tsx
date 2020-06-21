// Libs
import debounce from "lodash/debounce";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

// SVG
import searchSvg from "images/svg/search.svg";

// Utils
import { emptyObject, messages } from "utils";

// Components
import { FormattedMessage, MessageDescriptor } from "react-intl";
import { SVG } from "generics";

// Styles
import { useCustomStyles } from "hooks";
import classes from "./styles/textField.scss";

type Event = React.FormEvent<HTMLInputElement>;
type EventHandler = (e: Event) => void;
type Ref = React.MutableRefObject<HTMLDivElement | null>;

export interface Props {
  onChange: EventHandler;
  onFocus?: EventHandler;
  onBlur?: EventHandler;
  placeholder?: MessageDescriptor;
  value?: string;
  timeout?: number;
  disabled?: boolean;
  extendInputProps?: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >;
  customSass?: { [key: string]: string };
}

export const useTextFieldStyles = (args: {
  disabled: boolean;
  focused: boolean;
  containerRef: Ref;
  inputRef: Ref;
  iconRef: Ref;
  text: string;
  customSass: { [className: string]: string };
}) => {
  const {
    disabled,
    focused,
    containerRef,
    inputRef,
    iconRef,
    text,
    customSass,
  } = args;
  const textFieldContainer = useCustomStyles(
    classes,
    customSass,
    "text-field-container"
  );
  const textFieldInput = useCustomStyles(
    classes,
    customSass,
    "text-field-input"
  );
  const textFieldIcon = useCustomStyles(classes, customSass, "text-field-icon");
  const textFieldPlaceholder = useCustomStyles(
    classes,
    customSass,
    "text-field-placeholder"
  );

  const textFieldContainerDisabled = useCustomStyles(
    classes,
    customSass,
    "text-field-container-disabled"
  );

  useLayoutEffect(() => {
    // Container
    if (disabled) {
      containerRef.current?.classList.add(...textFieldContainerDisabled);
    } else {
      containerRef.current?.classList.remove(...textFieldContainerDisabled);
    }
  }, [disabled, containerRef, textFieldContainerDisabled]);

  useLayoutEffect(() => {
    if (!text && !focused && !disabled) {
      inputRef.current?.classList.add(...textFieldPlaceholder);
    } else {
      inputRef.current?.classList.remove(...textFieldPlaceholder);
    }
  }, [text, focused, disabled, inputRef, textFieldPlaceholder]);

  useLayoutEffect(() => {
    containerRef.current?.classList.add(...textFieldContainer);
    inputRef.current?.classList.add(...textFieldInput);
    iconRef.current?.classList.add(...textFieldIcon);
  }, [
    containerRef,
    inputRef,
    iconRef,
    textFieldContainer,
    textFieldInput,
    textFieldIcon,
  ]);
};

export const TextField: React.FC<Props> = (props) => {
  const {
    value = "",
    placeholder = messages.search,
    timeout = 200,
    disabled = false,
    customSass = emptyObject,
    extendInputProps = emptyObject,
    onChange: _onChange,
    onBlur: _onBlur,
    onFocus: _onFocus,
  } = props;
  const [text, setText] = useState<string>(value);
  const [focused, setFocused] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const iconRef = useRef<HTMLInputElement>(null);

  useTextFieldStyles({
    disabled,
    focused,
    containerRef,
    inputRef,
    iconRef,
    text,
    customSass,
  });

  const onChange = useRef(
    debounce((e: Event) => {
      setText(e?.currentTarget?.value ?? "");
      if (_onChange) {
        _onChange(e);
      }
    }, timeout)
  );

  useEffect(() => {
    onChange.current = debounce(_onChange, timeout);
  }, [_onChange, timeout]);

  const onBlur = useCallback(
    (e: Event) => {
      setFocused(false);
      if (_onBlur) {
        _onBlur(e);
      }
    },
    [_onBlur]
  );

  const onFocus = useCallback(
    (e: Event) => {
      setFocused(true);
      if (inputRef.current) {
        inputRef.current.select();
      }
      if (_onFocus) {
        _onFocus(e);
      }
    },
    [_onFocus]
  );

  const getValue = useCallback(
    (placeholder: string): string => {
      if (text || focused) {
        return text ?? "";
      }

      return placeholder;
    },
    [focused, text]
  );

  return (
    <FormattedMessage {...placeholder}>
      {(translation) => (
        <div ref={containerRef} data-test={"Zeplin-TextField"}>
          <div ref={iconRef}>
            <SVG src={searchSvg} />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={getValue(translation as string)}
            onBlur={onBlur}
            onChange={onChange.current}
            onFocus={onFocus}
            disabled={disabled}
            {...extendInputProps}
          />
        </div>
      )}
    </FormattedMessage>
  );
};

export default React.memo(TextField);
