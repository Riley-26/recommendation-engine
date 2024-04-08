import { Close } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import {FC, useState} from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar:FC = () => {

	const navigate:any = useNavigate();
	const [menuOpen, setMenuOpen] = useState(false)

	const menuToggle = () => {
		if (!menuOpen){
			setMenuOpen(!menuOpen)
			document.getElementById("modal")?.classList.remove("hidden")
			document.getElementById("modal")?.classList.add("flex")
			document.getElementById("modal")?.classList.add("opacity-90")
			document.body.classList.remove("overflow-auto")
			document.body.classList.add("overflow-hidden")
		} else{
			setMenuOpen(!menuOpen)
			document.getElementById("modal")?.classList.remove("flex")
			document.getElementById("modal")?.classList.remove("opacity-90")
			document.getElementById("modal")?.classList.add("hidden")
			document.body.classList.remove("overflow-hidden")
			document.body.classList.add("overflow-auto")
		}
	}

	return (
		<nav className='px-4 relative'>
			<ul className='flex uppercase items-center justify-around max-w-7xl mx-auto text-xl py-6'>
				<img className='cursor-pointer' src="/" alt="RECMEND" onClick={() => navigate("/")}/>
				<li className='hover:text-indigo-200 transition-all hidden sm:flex'><a href="/movies">Movies</a></li>
				<li className='hover:text-indigo-200 transition-all hidden sm:flex'><a href="/music">Music</a></li>
				<li className='hover:text-indigo-200 transition-all hidden sm:flex'><a href="/games">Video Games</a></li>
				<li className='flex sm:hidden cursor-pointer' onClick={() => menuToggle()}><MenuIcon style={{fontSize: "32px"}}/></li>
			</ul>
			<div id='modal' className='bg-black opacity-0 absolute top-0 left-0 w-screen h-screen hidden z-50 transition-all items-center justify-center'>
				<ul className='flex flex-col uppercase items-center justify-around max-w-7xl h-2/5 text-2xl'>
					<li className='flex sm:hidden cursor-pointer absolute top-20 right-20'onClick={() => menuToggle()}><Close style={{fontSize: "32px"}} /></li>
					<li className='hover:text-indigo-200 transition-all'><a href="/">Home</a></li>
					<li className='hover:text-indigo-200 transition-all'><a href="/movies">Movies</a></li>
					<li className='hover:text-indigo-200 transition-all'><a href="/music">Music</a></li>
					<li className='hover:text-indigo-200 transition-all'><a href="/games">Video Games</a></li>
				</ul>
			</div>
			<hr className= 'h-0.5 border-b-1 border-solid border-indigo-200 max-w-7xl mx-auto' />
		</nav>
	)
}

export default Navbar;