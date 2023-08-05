import {createContext, FunctionComponent, ReactNode, useContext, useState} from "react";
import {CategoryModel, GameModel, useCategoryListQuery, useGameListQuery} from "@/types/gql/graphql";

interface IGameListProviderProps {
	categories: CategoryModel[],
	games: GameModel[],
	categoriesLoading: boolean,
	gamesLoading: boolean
}

const GameListContext = createContext<IGameListProviderProps>({
	games: [],
	categories: [],
	categoriesLoading: true,
	gamesLoading: true
});

const defaultCategories = [
	{
		id: -1,
		label: 'All games'
	}
]

type Props = {
	children: ReactNode
}

export const GameListProvider: FunctionComponent<Props> = ({children}) => {
	const [categories, setCategories] = useState<CategoryModel[]>(defaultCategories);
	const {data, loading: gamesLoading} = useGameListQuery();

	const {loading: categoriesLoading} = useCategoryListQuery({
		onCompleted: data => {
			if (data.categoryList) {
				setCategories([
					...defaultCategories,
					...data.categoryList
				])
			}
		}
	})

	const games = data?.gameList || [];

	return (
		<GameListContext.Provider value={{
			categories,
			categoriesLoading,
			games,
			gamesLoading
		}}>
			{children}
		</GameListContext.Provider>
	)
}

export default function useGameList() {
	return useContext(GameListContext);
}