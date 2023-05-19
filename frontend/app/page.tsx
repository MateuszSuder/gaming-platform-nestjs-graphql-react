import GameCard from "@/components/home/GameCard/GameCard";
import LastWinners from "@/components/home/LastWinners/LastWinners";
import Categories from "@/components/home/Categories/Categories";
import TopWinners from "@/components/home/TopWinners/TopWinners";

const games = [
	{
		src: '/img/three-card-monte.png',
		name: 'Three-card monte'
	},
	{
		src: '/img/plinko.png',
		name: 'Plinko'
	},
	{
		src: '/img/slot-machine.png',
		name: 'Slot machine'
	}
] as const;
export default function Home() {
	return (
		<>
			<TopWinners/>
			<div
				className='w-full h-full bg-gradient-to-b from-primary-lighter to-transparent to-40% drop-shadow-2xl p-2 grid grid-cols-main gap-5'>
				<div>
					<Categories/>
				</div>
				<div className='grid grid-cols-2 justify-center gap-10'>
					{
						games.map((game) => (
							<GameCard {...game} key={game.name}/>
						))
					}
				</div>
				<div>
					<LastWinners/>
				</div>
			</div>
		</>
	);
};