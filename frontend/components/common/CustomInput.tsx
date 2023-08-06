import {FunctionComponent, HTMLInputTypeAttribute} from "react";

type Props<T = string | number> = {
	value: T,
	onChange: (value: T) => void;
	type: HTMLInputTypeAttribute
};
export const CustomInput: FunctionComponent<Props> = ({value, onChange, type}) => {
	return (
		<input
			type={type}
			value={value}
			onChange={(e) => onChange(e.target.value)}
			id='email'
			className='rounded-sm border-gray-300 border-2 border-solid text-black text-sm focus-visible:outline-0'
		/>
	);
};