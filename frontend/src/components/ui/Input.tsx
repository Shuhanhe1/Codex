import {
  TextInput as MantineTextInput,
  TextInputProps as MantineTextInputProps,
} from '@mantine/core';

interface InputProps extends MantineTextInputProps {
  label: string;
  placeholder?: string;
}

export const Input = ({ label, placeholder, ...props }: InputProps) => {
  return (
    <MantineTextInput label={label} placeholder={placeholder} {...props} />
  );
};
