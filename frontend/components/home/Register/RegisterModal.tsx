import {FunctionComponent} from "react";
import {useRegisterMutation} from "@/types/gql/graphql";
import {useFormik} from "formik";
import {RegisterSchema} from "@/components/home/Register/validationSchema";
import useModal from "@/context/modalContext";

interface RegisterCredentials {
	email: string;
	username: string
	password: string;
	passwordRepeat: string;
}

type Props = {};
export const RegisterModal: FunctionComponent<Props> = ({}) => {
	const {close} = useModal();
	const [register, {error}] = useRegisterMutation({});

	const formik = useFormik({
		initialValues: {
			username: "",
			email: "",
			password: "",
			passwordRepeat: ""
		},
		validationSchema: RegisterSchema,
		validateOnChange: false,
		onSubmit: async (values) => {
			const {passwordRepeat, ...registerData} = values;
			await register({
				variables: {
					registerData
				}
			}).then(() => close && close())
		}
	})

	return (
		<form className='flex flex-col gap-4 w-80 m-8' onSubmit={formik.handleSubmit}>
			<div className='flex flex-col gap-1'>
				<label htmlFor='email' className='text-xs text-gray-400 font-bold'>
					Email
				</label>
				<input
					value={formik.values.email}
					onChange={formik.handleChange}
					id='email'
					className='rounded-sm border-gray-300 border-2 border-solid text-black text-sm focus-visible:outline-0'
				/>
				<div className='text-red-500 text-xs'>{formik.errors.email}</div>
			</div>
			<div className='flex flex-col gap-2'>
				<label htmlFor='username' className='text-xs text-gray-400 font-bold'>
					Username
				</label>
				<input
					value={formik.values.username}
					onChange={formik.handleChange}
					id='username'
					className='rounded-sm border-gray-300 border-2 border-solid text-black text-sm focus-visible:outline-0'
				/>
				<div className='text-red-500 text-xs'>{formik.errors.username}</div>
			</div>
			<div className='flex flex-col gap-2'>
				<label htmlFor='password' className='text-xs text-gray-400 font-bold'>
					Password
				</label>
				<input
					type='password'
					value={formik.values.password}
					onChange={formik.handleChange}
					id='password'
					className='rounded-sm border-gray-300 border-2 border-solid text-black text-sm focus-visible:outline-0'
				/>
				<div className='text-red-500 text-xs'>{formik.errors.password}</div>
			</div>
			<div className='flex flex-col gap-2'>
				<label htmlFor='password-repeat' className='text-xs text-gray-400 font-bold'>
					Repeat password
				</label>
				<input
					type='password'
					value={formik.values.passwordRepeat}
					onChange={formik.handleChange}
					id='passwordRepeat'
					className='rounded-sm border-gray-300 border-2 border-solid text-black text-sm focus-visible:outline-0'
				/>
				<div className='text-red-500 text-xs'>{formik.errors.passwordRepeat}</div>
			</div>
			<div className='text-red-500 text-xs'>{error?.message}</div>
			<button
				type='submit'
				className='w-100 bg-secondary-light text-gray-700 rounded-sm min-h-[2rem] hover:bg-secondary-dark hover:text-white duration-300 text-sm mt-3'>
				Register
			</button>
		</form>
	);
};