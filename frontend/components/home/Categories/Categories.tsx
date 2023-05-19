import Container from "@/components/common/Container";

type Props = {

};

const categories = [
	'All games',
	'Slot machines',
	'Table games',
	'Other'
]

export default function Categories (props: Props) {
 return (
	 <Container title='Categories'>
		 <div className='grid gap-2 py-2'>
			 {
				 categories.map((category, i) => (
					 <div key={category} className={`py-3 px-2 font-bold text-sm rounded-xl mx-1 cursor-pointer duration-200 hover:bg-primary-dark ${!i && 'bg-primary-dark'}`}>
						 <span className='drop-shadow-text-white-shadow'>{category}</span>
					 </div>
				 ))
			 }
		 </div>
	 </Container>
 );
};