import {FC, useContext, useEffect, useState} from 'react'
import { ThemeContext } from '../App'
import { useLocation ,useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import LoginButton from '../components/LoginButton'
import axios from "axios";
import qs from 'qs';

const ContentPage:FC = () => {
	const loggedContext:any = useContext(ThemeContext);
	const stateData = useLocation().state;
	const [currentData, setCurrentData]:any = useState();
	const [dataSet, setDataSet]:any = useState(false)
	const [currentGenre, setCurrentGenre]:any = useState();
	const [currentName, setCurrentName]:any = useState();
	const [displayImg, setDisplayImg]:any = useState();
	const [movieDetails, setMovieDetails]:any = useState();
	const [songDetails, setSongDetails]:any = useState();
	const [gameDetails, setGameDetails]:any = useState();
	const [fetched, setFetched]:any = useState(false);

	const navigate:any = useNavigate();
	const genre = stateData[0] || ""
	const data = stateData[1] || ""
	const name = stateData[2] || ""
	const id = stateData[3] || ""
	const image = stateData[4] || ""
	
	const setData = () => {
		if (stateData){
			setCurrentGenre(genre)
			setCurrentName(name)
			if (image){
				setDisplayImg(image)
			} else{
				if (stateData[0] === "SONG"){
					try {
						setDisplayImg(data.tracks.items[0].album.images[0].url)
						setCurrentData(data.tracks.items[0])
					} catch {
						setDisplayImg(data.album.images[0].url)
						setCurrentData(data)
					}
				} else if (stateData[0] === "MOVIE"){
					try {
						setDisplayImg(data.Search[0]["Poster"])
						setCurrentData(data.Search[0])
					} catch {
						setDisplayImg(data["Poster"])
						setCurrentData(data)
					}
				} else if (stateData[0] === "GAME"){
					try {
						setDisplayImg(data.results[0]["background_image"])
						setCurrentData(data.results[0])
					} catch {
						setDisplayImg(data["background_image"])
						setCurrentData(data)
					}
				}
			}
		}

		setDataSet(true)
	}

	const newMovieData = async () => {
        const detailedSearch = await fetch(`https://www.omdbapi.com/?i=${ id }&apikey=7ceed11f`)
        const searchResult = await detailedSearch.json()

        return searchResult
    }

	const newSongData = async () => {
		let spotifyToken = "";

		const client_id = "85baaa6f21eb44f184cadb4433f207cc";
		const client_secret = "656b44490ac346d79f08fc1e51cdc0a1";
	
		const headers = {
			headers: {
			Accept: 'application/json',
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			auth: {
				username: client_id,
				password: client_secret,
			},
		};
		const clientData = {
			grant_type: 'client_credentials',
		};
		
		try {
			const response = await axios.post(
				'https://accounts.spotify.com/api/token',
				qs.stringify(clientData),
				headers
			);
			spotifyToken = response.data.access_token;
			
			const searchData = await axios.get(`https://api.spotify.com/v1/tracks/${ id }`, {
				headers: {
					Authorization: `Bearer ${spotifyToken}`
				},
			}).then(async (data) => {
				const artistData = await axios.get(`https://api.spotify.com/v1/artists/${ data.data.artists[0].id }`, {
					headers: {
						Authorization: `Bearer ${spotifyToken}`
					},
				})
				return artistData
			})

			return searchData
		} catch (error) {
			console.log(error);
		}
	}

	const newGameData = async () => {
		const gameFetch = await fetch(`https://api.rawg.io/api/games?key=cf44002358b0402eb16af2dbdf380343&search=${ name }&search_precise=True`)
		const gameInfo = await gameFetch.json()

		return gameInfo
	}

	useEffect(() => {
		sessionStorage.setItem("prevHref", window.location.pathname)
		setData()
	}, [window.onload])

	useEffect(() => {
		if (dataSet){
			if (id && currentGenre === "MOVIE"){
				newMovieData().then((data:any) => {
					const movieGenreObj:any = {};
					movieGenreObj[name] = data.Genre.split(" ")
					setMovieDetails(movieGenreObj)
					setFetched(true)
				}).then(() => {
					setFetched(false)
				})
			} else if (currentGenre === "SONG"){
				newSongData().then((data:any) => {
					const songGenreObj:any = {};
					songGenreObj[name] = data.data.genres
					setSongDetails(songGenreObj)
					setFetched(true)
				}).then(() => {
					setFetched(false)
				})
			} else if (currentGenre === "GAME"){
				const gameGenreArray:number[] = [];
				newGameData().then((data:any) => {
					console.log(data)
					for (let i=0; i<data.results[0].genres.length; i++){
						gameGenreArray.push(data.results[0].genres[i].name)
					}
					const gameGenreObj:any = {};
					gameGenreObj[name] = gameGenreArray
					setGameDetails(gameGenreObj)
					setFetched(true)
				}).then(() => {
					setFetched(false)
				})
			}
		}

    }, [dataSet])

	useEffect(() => {}, [currentData])

	useEffect(() => {}, [fetched])

	useEffect(() => {
		if (movieDetails){
			console.log(movieDetails)
		}
	}, [movieDetails])

	useEffect(() => {
		if (songDetails){
			console.log(songDetails)
		}
	}, [songDetails])

	useEffect(() => {
		if (gameDetails){
			console.log(gameDetails)
		}
	}, [gameDetails])

	return (
		<>
			{
				stateData ? <>
					<section className='mx-auto min-h-screen max-w-4xl flex flex-col items-center justify-center'>
						<img className='cursor-pointer' src="/" alt="RECMEND" onClick={() => navigate("/")}/>
						<LoginButton/>
						<div className='max-w-8xl my-24 mx-auto flex items-center justify-center flex-col'>
							<img src={displayImg} alt="imgURL" className='rounded-lg my-8'/>
							<h1 className='text-4xl'>{`${genre[0]}${genre.substring(1).toLowerCase()}s which are similar to `}<span className="text-indigo-200 font-medium transition-all">{currentName}:</span></h1>
						</div>
					</section>
					<section className='mx-auto min-h-screen max-w-4xl flex flex-col items-center justify-center'>

					</section>
				</> : <>
					<section className='mx-auto min-h-screen max-w-4xl flex flex-col items-center justify-center'>
						<img className='cursor-pointer' src="/" alt="RECMEND" onClick={() => navigate("/")}/>
						<LoginButton/>
						<div className='max-w-8xl my-24 mx-auto flex items-center justify-center flex-col'>
							<h1 className='my-4 text-3xl'>NO CONTENT</h1>
						</div>
					</section>
				</>
			}
		</>
	)
}

export default ContentPage