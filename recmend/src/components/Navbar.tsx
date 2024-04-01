import {FC} from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar:FC = () => {

	const navigate:any = useNavigate();

	return (
		<nav className='px-4 '>
			<ul className='flex uppercase items-center justify-around max-w-7xl mx-auto text-xl py-6'>
				<img className='cursor-pointer' src="/" alt="RECMEND" onClick={() => navigate("/")}/>
				<li className='hover:text-indigo-200 transition-all'><a href="/movies">Movies</a></li>
				<li className='hover:text-indigo-200 transition-all'><a href="/music">Music</a></li>
				<li className='hover:text-indigo-200 transition-all'><a href="/games">Video Games</a></li>
			</ul>
			<hr className= 'h-0.5 border-b-1 border-solid border-indigo-200 max-w-7xl mx-auto' />
		</nav>
	)
}

export default Navbar;