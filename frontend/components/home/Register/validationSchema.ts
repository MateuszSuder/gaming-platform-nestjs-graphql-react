import * as Yup from 'yup';
import YupPassword from "yup-password";

YupPassword(Yup);

export const RegisterSchema = Yup.object().shape({
	username: Yup.string()
		.required('Username is required').label('Username'),
	email: Yup.string().email('Invalid email').required('Email is required').label('Email'),
	password: Yup.string().min(8).minNumbers(1).minSymbols(1).required('Password is required').label('Password'),
	passwordRepeat: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required('Repeat your password')
})