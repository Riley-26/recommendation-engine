import {FC, useContext, useEffect, useState} from 'react'
import { useNavigate } from "react-router-dom"
import { ThemeContext } from '../App';
import { signOut } from 'aws-amplify/auth';
import { ArrowBackIos, Favorite, Visibility } from '@mui/icons-material';
import { Link } from "react-router-dom";

const User:FC = () => {

	const loggedContext:any = useContext(ThemeContext)!;
	const navigate = useNavigate()
    const prevHref = sessionStorage.getItem("prevHref");
	let itemData:object = {};
	const [fetchedMovies, setFetchedMovies] = useState([]);
	const [fetchedSongs, setFetchedSongs] = useState([]);
	const [fetchedGames, setFetchedGames] = useState([]);
	const [currentGenre, setCurrentGenre] = useState(fetchedMovies);
	const [currentTab, setCurrentTab] = useState("");
	let movieId:string = "";

	const logout = async () => {
		let confirm:any = window.confirm("Are you sure that you would like to log out?")
		if (confirm){
			try {
				await signOut();
				loggedContext.updateState(false);
				window.location.href = "/"
			} catch (error) {
				console.log('error signing out: ', error);
			}
		}
	}

	const userData:any = loggedContext.userData;

	useEffect(() => {
		if (loggedContext.loggedIn){
			loggedContext.fetchDBData(loggedContext.userData.userId, "MOVIE").then((data:any) => {
				setFetchedMovies(data.Items)
				movieId = data.Items
			})
			loggedContext.fetchDBData(loggedContext.userData.userId, "SONG").then((data:any) => {
				setFetchedSongs(data.Items)
			})
			loggedContext.fetchDBData(loggedContext.userData.userId, "GAME").then((data:any) => {
				setFetchedGames(data.Items)
			})
		}
	}, [loggedContext.loggedIn])

	const imgHover = (index:any) => {
		const favBtn:any = document.getElementsByClassName("favBtn")[index];
		const visBtn:any = document.getElementsByClassName("visBtn")[index];
        const displayImg:any = document.getElementsByClassName("displayImg")[index];
        
        favBtn.classList.toggle("hidden");
        favBtn.classList.toggle("opacity-100");
        visBtn.classList.toggle("hidden");
        visBtn.classList.toggle("opacity-100");
        displayImg.classList.toggle("brightness-50")
    }

	useEffect(() => {

	}, [currentTab])

	return (
		<>
			{
				loggedContext.loggedIn ?
				<div className='mx-auto max-w-6xl flex flex-col py-10 sm:py-14'>
					<div className='flex items-center mx-8'>
						<ArrowBackIos id="backArrow" style={{fontSize: "40px", cursor: "pointer"}} onClick={() => {window.history.back()}}/>
						<h1 className='text-4xl text-center mx-4 md:text-6xl sm:mx-12 sm:text-5xl'>Welcome, {userData["username"]}</h1>
					</div>
					<hr className='my-12 mx-4 border-indigo-200'/>
					<div className=''>
						<ul className='flex justify-around text-3xl'>
							<h2 id="savedTab" className='text-indigo-200 transition-all cursor-pointer'>Saved</h2>
						</ul>
						<ul id="genresList" className='text-xl flex justify-around my-8 mx-4 transition-all'>
							<li id='moviesTab' className='hover:text-indigo-200 transition-all cursor-pointer' onClick={() => {setCurrentGenre(fetchedMovies);
								document.getElementById("moviesTab")?.classList.add("text-indigo-200")
								document.getElementById("songsTab")?.classList.remove("text-indigo-200")
								document.getElementById("gamesTab")?.classList.remove("text-indigo-200")
								setCurrentTab("MOVIE")
							}}>Movies</li>
							<li id='songsTab' className='hover:text-indigo-200 transition-all cursor-pointer' onClick={() => {setCurrentGenre(fetchedSongs); 
								document.getElementById("songsTab")?.classList.add("text-indigo-200")
								document.getElementById("moviesTab")?.classList.remove("text-indigo-200")
								document.getElementById("gamesTab")?.classList.remove("text-indigo-200")
								setCurrentTab("SONG")
							}}>Songs</li>
							<li id='gamesTab' className='hover:text-indigo-200 transition-all cursor-pointer' onClick={() => {setCurrentGenre(fetchedGames);
								document.getElementById("gamesTab")?.classList.add("text-indigo-200")
								document.getElementById("moviesTab")?.classList.remove("text-indigo-200")
								document.getElementById("songsTab")?.classList.remove("text-indigo-200")
								setCurrentTab("GAME")
							}}>Games</li>
						</ul>
					</div>
					<div className='flex max-w-6xl px-4 justify-center mx-2 sm:mx-4'>
						<div className='flex flex-wrap min-w-full mx-4 px-2 sm:px-8 max-h-40 font-normal py-8 border border-indigo-200 rounded-lg my-4 overflow-y-auto' style={{minHeight: "28rem"}}>
							{
								currentGenre ? <>
									{
										currentGenre.map((item:any, index:any) => {
											return (
												<>
													<div className='flex flex-col text-center flex-wrap my-10 items-center justify-center mx-auto sm:w-1/2 sm:mx-0' key={index}>
														<div className='displayImgWrapper mx-8 w-48 relative transition-all' onMouseOver={() => imgHover(index)} onMouseOut={() => imgHover(index)}>
															<img id="displayImg" src={item.data["M"].image["S"]} alt="songURL" className='displayImg rounded-lg transition-all'/>
															<Favorite className="favBtn absolute top-2 left-2 hidden transition-all opacity-0 cursor-pointer" style={{fontSize: "32px"}} onClick={() => loggedContext.unsaveDBItem(item, currentTab, userData.userId)}/>
															<Link state={[currentTab, "", item.data["M"].name["S"], item.data["M"].id["S"], item.data["M"].image["S"]]} to={"/content"}>
																<Visibility className="visBtn absolute bottom-2 left-2 hidden transition-all opacity-0 cursor-pointer" style={{fontSize: "32px", cursor: "pointer"}} onClick={() => {loggedContext.updateIncorrect(false)}}/>
															</Link>
														</div>
														<div className='mx-4 w-1/2'>
															<h1 className='my-4 text-xl'>{item.data["M"].name["S"]}</h1>
														</div>
													</div>
												</>
											)
										})
									}
								</> : <h1></h1>
							}
						</div>
					</div>
					<button onClick={() => logout()} className=' w-44 mx-auto px-6 py-4 bg-indigo-200 border-2 border-indigo-200 rounded-lg text-gray-800 font-bold text-xl transition-all hover:bg-gray-800 hover:text-gray-50'>
						LOG OUT
					</button>
				</div> : 
				<div>
					<h1>Please log in</h1>
				</div>
			}
		</>
	)
}

export default User