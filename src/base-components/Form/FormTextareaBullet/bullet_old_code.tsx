import { useContext, forwardRef, useState } from "react";
import { formInlineContext } from "../FormInline";
import { inputGroupContext } from "../InputGroup";
import { twMerge } from "tailwind-merge";

interface FormTextareaProps extends React.ComponentPropsWithoutRef<"textarea"> {
  formTextareaSize?: "sm" | "lg";
  rounded?: boolean;
  bullet?: boolean;
}

type FormTextareaRef = React.ComponentPropsWithRef<"textarea">["ref"];

const FormTextareaBullet = forwardRef(
  (props: FormTextareaProps, ref: FormTextareaRef) => {
    const formInline = useContext(formInlineContext);
    const inputGroup = useContext(inputGroupContext);
    const { formTextareaSize, rounded, bullet, ...computedProps } = props;

    const [value, setValue] = useState("");
    const [bulletAdded, setBulletAdded] = useState(false);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (bullet && event.key === "Enter") {
        event.preventDefault();
        setValue(value + "\n• ");
        setBulletAdded(true);
      }
      if (!bulletAdded && event.key === "Tab") {
        event.preventDefault();
        setValue("• ");
        setBulletAdded(true);
      }
    };

    const handleFocus = () => {
      if (!bulletAdded) {
        setValue("• ");
        setBulletAdded(true);
      }
    };

    return (
      <textarea
        {...computedProps}
        ref={ref}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        className={twMerge([
          "disabled:bg-slate-100 disabled:cursor-not-allowed dark:disabled:bg-darkmode-800/50 dark:disabled:border-transparent",
          "[&[readonly]]:bg-slate-100 [&[readonly]]:cursor-not-allowed [&[readonly]]:dark:bg-darkmode-800/50 [&[readonly]]:dark:border-transparent",
          "transition duration-200 ease-in-out w-full text-sm border-slate-200 shadow-sm rounded-md placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary focus:border-opacity-40 dark:bg-darkmode-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:placeholder:text-slate-500/80",
          props.formTextareaSize == "sm" && "text-xs py-1.5 px-2",
          props.formTextareaSize == "lg" && "text-lg py-1.5 px-4",
          props.rounded && "rounded-full",
          formInline && "flex-1",
          inputGroup &&
            "rounded-none [&:not(:first-child)]:border-l-transparent first:rounded-l last:rounded-r z-10",
          props.className,
        ])}
      />
    );
  }
);

export default FormTextareaBullet;
