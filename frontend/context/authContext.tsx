import {createContext, FunctionComponent, ReactNode, useContext, useState} from "react";
import {UserModel, useUserBalanceSubscription, useUserQuery} from "@/types/gql/graphql";

interface IAuthProvider {
	user: Omit<UserModel, '_id'> | undefined;
	loading: boolean;
	refetchUser?: ReturnType<typeof useUserQuery>['refetch'];
}

const AuthContext = createContext<IAuthProvider>({
	user: undefined,
	loading: true
});

type Props = {
	children: ReactNode
}

export const AuthProvider: FunctionComponent<Props> = ({children}) => {
	const [user, setUser] = useState<Omit<UserModel, '_id'> | undefined>(undefined);

	const {loading, refetch: refetchUser} = useUserQuery({
		onCompleted: (data) => {
			setUser(data.user);
		}
	});
	useUserBalanceSubscription({
		skip: !user,
		onData: ({data}) => {
			const balance = data.data?.userBalance?.balance;
			if (balance !== undefined && user?.username) {
				setUser(prevState => ({
					username: user.username || '',
					balance
				}))
			}
		}
	})

	return (
		<AuthContext.Provider value={{user, loading, refetchUser}}>
			{children}
		</AuthContext.Provider>
	)
}

export default function useAuth() {
	return useContext(AuthContext);
}