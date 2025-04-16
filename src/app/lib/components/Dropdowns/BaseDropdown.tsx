import Select, { SingleValue, StylesConfig } from "react-select";

export interface Option {
  value: string;
  label: string;
}

export type ChangeHandler = (newValue: SingleValue<Option>) => void;

// TODO: Make the trigger width based on the width of the longest label
const styles: StylesConfig<Option, false> = {
  control: (styles) => ({
    ...styles,
    height: 30,
    borderRadius: 8,
    borderColor: "#EBE9F1",
  }),
  singleValue: (styles) => ({
    ...styles,
    textAlign: "center",
    color: "#262626",
    fontSize: 14,
    fontWeight: 600,
  }),
  indicatorSeparator: (styles) => ({
    ...styles,
    height: "100%",
    margin: 0,
    backgroundColor: "#EBE9F1",
  }),
  menu: (styles) => ({
    ...styles,
    marginTop: 5,
  }),
};

const BaseDropdown = ({
  value,
  options,
  onChange,
  className = "",
}: {
  value: Option;
  options: Option[];
  onChange: ChangeHandler;
  className?: string;
}) => {
  return (
    <Select
      value={value}
      onChange={onChange}
      options={options}
      styles={styles}
      className={className}
    />
  );
};

export { BaseDropdown };
