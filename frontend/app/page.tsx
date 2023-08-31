import Categories from "@/components/home/Categories/Categories";
import TopWinners from "@/components/home/TopWinners/TopWinners";
import GameList from "@/components/home/GameList/GameList";


export default async function Home() {
	return (
		<>
			<TopWinners/>
			<div
				className='w-full h-full bg-gradient-to-b from-primary-lighter to-transparent to-40% drop-shadow-2xl p-2 grid grid-cols-main gap-5'>
				<div>
					<Categories/>
				</div>
				<GameList/>
			</div>
		</>
	);
};