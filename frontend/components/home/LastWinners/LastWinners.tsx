import Container from "@/components/common/Container";

type Props = {

};

interface Winner {
	username: string;
	win: number;
}

const winners: Array<Winner> = [
	{
		username: 'user253',
		win: 1010
	},
	{
		username: 'user3212',
		win: 578
	},
	{
		username: 'user43123',
		win: 12045.25
	},
	{
		username: 'user763',
		win: 1024.25
	},
	{
		username: 'user12',
		win: 255.75
	},
	{
		username: 'user433',
		win: 1010
	},
	{
		username: 'user321',
		win: 578
	},
	{
		username: 'user9785',
		win: 12045.25
	},
	{
		username: 'user65',
		win: 1024.25
	},
	{
		username: 'user6523',
		win: 255.75
	}
]

export default function LastWinners (props: Props) {
 return (
	 <Container title='Last winners'>
		 <div className='p-2'>
			 {
				 winners.map(({ username, win }, index) => (
					 <div key={`${username}-${win}-${index}`} className={`grid grid-cols-2 h-8 justify-center items-center px-2 rounded text-sm ${(index % 2) && 'bg-primary-dark'}`}>
						 <div className='flex font-bold drop-shadow-text-white-shadow'>
							 {username}
						 </div>
						 <div className='text-right drop-shadow-text-white-shadow'>
							 {win.toLocaleString('pl-PL', { maximumFractionDigits: 2, minimumFractionDigits: 2 } )}
						 </div>
					 </div>
				 ))
			 }
		 </div>
	 </Container>
 );
};