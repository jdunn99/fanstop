import React, { InputHTMLAttributes } from "react";
import { useField } from "formik";
import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  Textarea,
} from "@chakra-ui/core";

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  textarea?: boolean;
  white?: boolean;
};

export const Field: React.FC<FieldProps> = ({
  textarea,
  label,
  size: _,
  ...props
}) => {
  const [field, { error }] = useField(props);

  let FieldType = Input as any;
  if (textarea) FieldType = Textarea;

  return (
    <FormControl>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <InputGroup>
        <FieldType rounded={0} {...field} {...props} id={field.name} />
      </InputGroup>
      {error ? <small style={{ color: "red" }}>{error}</small> : null}
    </FormControl>
  );
};
