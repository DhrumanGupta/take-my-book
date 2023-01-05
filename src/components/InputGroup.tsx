import clsx from "clsx";
import { ReactNode } from "react";

interface IProps<T> {
  placeholder?: string;
  label: string;
  value: T;
  type?: string;
  setValue: (value: T) => void;
  className?: string;
}

const InputGroup = <T extends unknown>({
  label,
  type,
  value,
  setValue,
  placeholder,
  className,
}: IProps<T> & { children?: ReactNode }) => {
  return (
    <>
      <label
        htmlFor={label}
        className={clsx("mt-4 mb-1 font-semibold", className)}
      >
        {label}
      </label>
      <input
        placeholder={placeholder}
        type={type ? type : typeof value}
        id={label}
        value={value as string | undefined}
        onChange={(e) => setValue(e.target.value as T)}
        className={clsx("bg-gray-light text-md p-2 rounded", className)}
      />
    </>
  );
};

export default InputGroup;
