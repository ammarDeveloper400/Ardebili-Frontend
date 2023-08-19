import { useContext, forwardRef, useState, useEffect } from "react";
import { formInlineContext } from "../FormInline";
import { inputGroupContext } from "../InputGroup";
import { twMerge } from "tailwind-merge";

interface FormTextareaProps extends React.ComponentPropsWithoutRef<"textarea"> {
  formTextareaSize?: "sm" | "lg";
  rounded?: boolean;
  bullet?: boolean;
}

type FormTextareaRef = React.ComponentPropsWithRef<"textarea">["ref"];

const FormTextarea = forwardRef(
  (props: FormTextareaProps, ref: FormTextareaRef) => {
    const formInline = useContext(formInlineContext);
    const inputGroup = useContext(inputGroupContext);
    const [value, setValue] = useState<any | null>(props.value || "");

    useEffect(() => {
      setValue(props.value || "• ");
    }, [props.value]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (props.bullet && event.key === "Enter") {
        event.preventDefault();
        const textarea = event.target as HTMLTextAreaElement;
        const selectionStart = textarea.selectionStart || 0;
        const selectionEnd = textarea.selectionEnd || 0;
        const text = value.substring(0, selectionStart);
        const remainingText = value.substring(selectionEnd);
        const newText = `${text}\n\u2022 ${remainingText}`;
        setValue(newText);
        if (textarea.setSelectionRange) {
          const cursorPosition = selectionStart + 3;
          textarea.setSelectionRange(cursorPosition, cursorPosition);
        }
      }
    };
    

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      if(event.target.value == ""){
        setValue("• ");
      } else {
        setValue(event.target.value);
      }

      if (props.onChange) {
        props.onChange(event);
      }
    };

    // const handleFocus = () => {
    //   if(value == ""){
    //     setValue("• ");
    //   } 
    // };
    
    // const handleFocus = () => {
    //   if (value === "") {
    //     setValue("• ");
    //   } else {
    //     const textarea = document.activeElement as HTMLTextAreaElement;
    
    //     if (textarea instanceof HTMLTextAreaElement) {
    //       const textLength = textarea.value.length;
    
    //       if (textarea.setSelectionRange) {
    //         textarea.focus();
    //         textarea.setSelectionRange(textLength, textLength);
    //       }
    //     }
    //   }
    // };
    
    const handleFocus = () => {
      if (value === "") {
        setValue("• ");
      } else {
        const textarea = document.activeElement as HTMLTextAreaElement;
    
        if (textarea instanceof HTMLTextAreaElement) {
          const textLength = textarea.value.length;
    
          if (textarea.setSelectionRange) {
            textarea.focus();
            textarea.setSelectionRange(textLength, textLength);
    
            requestAnimationFrame(() => {
              textarea.setSelectionRange(textLength, textLength);
            });
          }
        }
      }
    };
    
    
    

    const { formTextareaSize, rounded, bullet, ...computedProps } = props;

    return (
      <textarea
        {...computedProps}
        ref={ref}
        value={value}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
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

export default FormTextarea;
