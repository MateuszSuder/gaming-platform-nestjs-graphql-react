import {useLoginMutation} from "@/types/gql/graphql";
import useModal from "@/context/modalContext";
import {RegisterModal} from "@/components/home/Register/RegisterModal";
import useAuth from "@/context/authContext";
import {useFormik} from "formik";
import {LoginSchema} from "@/components/home/Login/validationSchema";

type Props = {
	close: () => any;
};

export default function Login({close}: Props) {
	const {refetchUser} = useAuth();
	const {addModal} = useModal();

	const [login, {error}] = useLoginMutation({
		onCompleted: () => {
			refetchUser && refetchUser();
			close();
		}
	});

	const formik = useFormik({
		initialValues: {
			email: "",
			password: ""
		},
		validationSchema: LoginSchema,
		onSubmit: async (values) => {
			await login({
				variables: {
					credentials: {
						...values
					}
				}
			})
		}
	})

	const openRegisterModal = () => addModal && addModal(<RegisterModal/>)

	return (
		<form className='absolute bottom-0 right-0 translate-y-full rounded drop-shadow-2xl min-w-[20rem]'
		      onSubmit={formik.handleSubmit}>
			<div className='relative grid flex-col p-4 mt-1 gap-2'>
				<div
					className='absolute inset-0 w-full bg-gradient-to-r from-primary-dark via-primary-lighter to-primary-dark opacity-50 rounded -z-10'/>
				<div className='flex flex-col'>
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
				<div className='flex flex-col'>
					<label htmlFor='password' className='text-xs text-gray-400 font-bold'>
						Password
					</label>
					<input
						value={formik.values.password}
						onChange={formik.handleChange}
						type='password'
						id='password'
						className='rounded-sm border-gray-300 border-2 border-solid text-black text-sm focus-visible:outline-0'
					/>
					<div className='text-red-500 text-xs'>{formik.errors.password}</div>
				</div>
				<button
					type='submit'
					className='w-100 bg-secondary-light text-gray-700 rounded-sm min-h-[2rem] hover:bg-secondary-dark hover:text-white duration-300 text-sm mt-2'>
					Login
				</button>
				<div className='text-red-500 text-xs'>{error?.message}</div>
				<div className='text-[0.6rem] text-gray-300 text-center'>
					Don’t have an account? <span className='font-bold text-white cursor-pointer hover:text-gray-200 duration-300'
					                             onClick={openRegisterModal}>Register an Account</span>
				</div>
			</div>
		</form>
	);
};