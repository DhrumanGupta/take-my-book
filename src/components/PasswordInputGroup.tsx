import { ReactNode } from "react";
import EyeHidden from "./icons/EyeHidden";
import EyeVisible from "./icons/EyeVisible";

interface IProps<T> {
  placeholder?: string;
  label: string;
  value: T;
  hidden: boolean;
  setHidden: (value: boolean) => void;
  setValue: (value: T) => void;
}

const PasswordInputGroup = <T extends unknown>({
  label,
  value,
  setValue,
  placeholder,
  hidden,
  setHidden,
}: IProps<T> & { children?: ReactNode }) => {
  return (
    <>
      <label htmlFor={label} className="mt-4 mb-1 font-semibold">
        {label}
      </label>
      <span className="flex bg-gray-light rounded text-md">
        <input
          placeholder={placeholder}
          type={hidden ? "password" : "text"}
          id={label}
          className="p-2 bg-gray-light flex-grow rounded"
        />
        <button className="m-2">
          {hidden ? (
            <EyeHidden className="w-4 h-auto" />
          ) : (
            <EyeVisible className="w-4 h-auto" />
          )}
        </button>
      </span>
    </>
  );
};

export default PasswordInputGroup;
