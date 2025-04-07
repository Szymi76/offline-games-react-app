import { Eye, EyeOff } from "lucide-react";
import { Input, InputProps } from "@nextui-org/react";
import { forwardRef, useState } from "react";

type PasswordInputProps = Omit<InputProps, "type endContent">;
const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (props, ref) => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    return (
      <Input
        {...props}
        ref={ref}
        endContent={
          <button
            className="focus:outline-none h-full"
            type="button"
            onClick={toggleVisibility}
            tabIndex={-1}
          >
            {isVisible ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        }
        type={isVisible ? "text" : "password"}
      />
    );
  }
);

export default PasswordInput;
