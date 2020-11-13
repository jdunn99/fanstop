import React, { InputHTMLAttributes } from 'react';
import { useField } from 'formik';
import {
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	Icon,
	Textarea,
	InputLeftElement,
} from '@chakra-ui/core';

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
	label: string;
	name: string;
	icon?: string;
	textarea?: boolean;
};

export const Field: React.FC<FieldProps> = ({
	label,
	icon,
	size: _,
	...props
}) => {
	const [field, { error }] = useField(props);

	let FieldType = Input as any;
	if (props.textarea) FieldType = Textarea;

	return (
		<FormControl>
			<FormLabel htmlFor={field.name}>{label}</FormLabel>
			<InputGroup>
				{icon ? (
					<InputLeftElement children={<Icon name={icon} />} />
				) : null}
				<Input rounded={0} {...field} {...props} id={field.name} />
			</InputGroup>
			{error ? <small style={{ color: 'red' }}>{error}</small> : null}
		</FormControl>
	);
};
