'use client'

import {FunctionComponent} from "react";
import {useGameHistoryQuery} from "@/types/gql/graphql";
import {Loading} from "@/components/common/Loading";

const headers = [
	'Date',
	'Game',
	'Bet',
	'Win',
	'Multiplier'
]

type Props = {};
export const GameHistory: FunctionComponent<Props> = ({}) => {
	const {data, loading} = useGameHistoryQuery({
		variables: {
			historyInput: {
				limit: 1000,
				offset: 0
			}
		}
	})

	const records = data?.gameHistory.history;

	if (loading) return (
		<Loading/>
	)

	if (!records?.length) return (
		<div>
			No records found
		</div>
	)

	return (
		<div className='max-w-screen-xl max-h-[80vh] min-w-[40vw] overflow-y-scroll gap-2'>
			<div className='grid grid-cols-history gap-2 col-span-5 border-b-1 border-b-secondary-light'>
				{
					headers.map(header => (
						<div key={`header-${header}`}>
							{header}
						</div>
					))
				}
			</div>
			{
				records.map(({game, bet, win, createdAt, multiplier}, index) => (
					<div key={createdAt}
					     className={`grid grid-cols-history gap-2 py-2 ${(index % 2) && 'bg-primary-dark'} items-center`}>
						<div>
							{new Intl.DateTimeFormat('pl-PL', {
								year: "numeric",
								month: "numeric",
								day: "numeric",
								hour: "numeric",
								minute: "numeric",
								second: "numeric",
							}).format(new Date(createdAt))}
						</div>
						<div>
							{game}
						</div>
						<div>
							{bet.toLocaleString('pl-PL', {
								maximumFractionDigits: 2,
								minimumFractionDigits: 2
							})}
						</div>
						<div>
							{win.toLocaleString('pl-PL', {
								maximumFractionDigits: 2,
								minimumFractionDigits: 2
							})}
						</div>
						<div>
							{multiplier}x
						</div>
					</div>
				))
			}
		</div>
	);
};