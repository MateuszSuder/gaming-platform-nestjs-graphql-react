'use client';

import Container from "@/components/common/Container";
import useGameList, {ExtendedCategory} from "@/context/gameListContext";
import {Loading} from "@/components/common/Loading";
import React from "react";

type Props = {};

export default function Categories(props: Props) {
	const {categories, categoriesLoading, chosenCategory, setChosenCategory} = useGameList();

	const changeCategory = (id: ExtendedCategory['id']) => setChosenCategory && setChosenCategory(id)

	if (categoriesLoading) return (
		<Container title='Categories'>
			<div className='w-100 justify-center items-center py-4'>
				<Loading/>
			</div>
		</Container>
	)

	if (!categories?.length) return (
		<Container title='Categories'>
			<span className='drop-shadow-text-white-shadow'>No categories found</span>
		</Container>
	)

	return (
		<Container title='Categories'>
			<div className='grid gap-2 py-2'>
				{
					categories.map(({id, label}, index) => (
						<div
							key={`category-${label}-${id}`}
							className={`py-3 px-2 font-bold text-sm rounded-xl mx-1 cursor-pointer duration-200 hover:bg-primary-dark ${id === chosenCategory && 'bg-primary-dark'}`}
							onClick={() => changeCategory(id)}
						>
							<span className='drop-shadow-text-white-shadow'>{label}</span>
						</div>
					))
				}
			</div>
		</Container>
	);
};