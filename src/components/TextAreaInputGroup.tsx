import { ReactNode } from "react";

interface IProps<T> {
  placeholder?: string;
  label: string;
  value: T;
  setValue: (value: T) => void;
}

const TextAreaInputGroup = <T extends unknown>({
  label,
  value,
  setValue,
  placeholder,
}: IProps<T> & { children?: ReactNode }) => {
  return (
    <>
      <label htmlFor={label} className="mt-4 mb-1 font-semibold">
        {label}
      </label>
      <textarea
        placeholder={placeholder}
        value={value as any}
        id={label}
        rows={4}
        className="bg-gray-light text-md p-2 rounded w-full"
        onChange={(e) => setValue(e.target.value as any)}
      />
    </>
  );
};

export default TextAreaInputGroup;
