import {createContext, Dispatch, FunctionComponent, ReactNode, SetStateAction, useContext, useState} from "react";
import {CategoryModel, GameModel, useCategoryListQuery, useGameListQuery} from "@/types/gql/graphql";

export type ExtendedCategory = CategoryModel | { id: 'All', label: string };

interface IGameListProviderProps {
	categories: ExtendedCategory[],
	games: GameModel[],
	categoriesLoading: boolean,
	gamesLoading: boolean,
	chosenCategory: ExtendedCategory['id'],
	setChosenCategory?: Dispatch<SetStateAction<ExtendedCategory['id']>>
}

const GameListContext = createContext<IGameListProviderProps>({
	games: [],
	categories: [],
	categoriesLoading: true,
	gamesLoading: true,
	chosenCategory: 'All',
});

const defaultCategories = [
	{
		id: 'All' as const,
		label: 'All games'
	}
]

type Props = {
	children: ReactNode
}

export const GameListProvider: FunctionComponent<Props> = ({children}) => {
	const [chosenCategory, setChosenCategory] = useState<CategoryModel['id'] | 'All'>('All');
	const [categories, setCategories] = useState<ExtendedCategory[]>(defaultCategories);
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
			gamesLoading,
			chosenCategory,
			setChosenCategory
		}}>
			{children}
		</GameListContext.Provider>
	)
}

export default function useGameList() {
	return useContext(GameListContext);
}