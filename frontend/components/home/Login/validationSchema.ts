import * as Yup from 'yup';
import YupPassword from "yup-password";

YupPassword(Yup);

export const LoginSchema = Yup.object().shape({
	email: Yup.string().email('Invalid email').required('Email is required').label('Email'),
	password: Yup.string().required('Password is required').label('Password'),
})