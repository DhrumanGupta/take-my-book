import { ReactNode } from "react";

interface IProps<T> {
  placeholder?: string;
  label: string;
  value: T;
  type?: string;
  setValue: (value: T) => void;
}

const InputGroup = <T extends unknown>({
  label,
  type,
  value,
  setValue,
  placeholder,
}: IProps<T> & { children?: ReactNode }) => {
  return (
    <>
      <label htmlFor={label} className="mt-4 mb-1 font-semibold">
        {label}
      </label>
      <input
        placeholder={placeholder}
        type={type ? type : typeof value}
        id={label}
        className="bg-gray-light text-md p-2 rounded"
      />
    </>
  );
};

export default InputGroup;
