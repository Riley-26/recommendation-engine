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
						setDisplayImg(`https://image.tmdb.org/t/p/original${ data.results[0].poster_path }`)
						setCurrentData(data.results[0])
					} catch {
						setDisplayImg(`https://image.tmdb.org/t/p/original${ data.poster_path }`)
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
        try{
			const {data} = await axios.get(`https://api.themoviedb.org/3/movie/${ id }`, {
				headers: {
					Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyY2M4OGNhZjAwNjQ3NjI2YTMwMmQ4YjJlNjA2NDEzYiIsInN1YiI6IjY2MGM4YmU3MzNhMzc2MDE3ZDgxMzI0MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.OrB-1q5cIi57YByXS-u3savP3yUE2EcL5v8CKFrXOHQ`
				}
			});

			return data
		} catch (error){
			console.log(error)
		}
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

				const genreSeed = String(artistData.data.genres.slice(0, 4)).replace(" ", "%20")

				const recommendData = await axios.get(`https://api.spotify.com/v1/recommendations?seed_genres=${ genreSeed }&seed_tracks=${ id }&limit=12`, {
					headers: {
						Authorization: `Bearer ${spotifyToken}`
					}
				})

				return recommendData
			})

			return searchData
		} catch (error) {
			console.log(error);
		}
	}

	const newGameData = async () => {
		const gameFetch = await fetch(`https://api.rawg.io/api/games?key=cf44002358b0402eb16af2dbdf380343&search=${ name }&search_precise=True`)
		const gameInfo = await gameFetch.json()

		const gameGenres = gameInfo.results[0].genres

		//const recommendGames = await axios.get(`https://api.rawg.io/api/games?key=cf44002358b0402eb16af2dbdf380343&genres=${"fighting"}&page_size=100&page=6`)

		return gameInfo
	}

	useEffect(() => {
		sessionStorage.setItem("prevHref", window.location.pathname)
		setData()
	}, [window.onload])

	useEffect(() => {
		if (dataSet){
			if (id && currentGenre === "MOVIE"){
				const movieGenreArray:number[] = []
				newMovieData().then((data:any) => {
					for (let i=0; i<data.genres.length; i++){
						movieGenreArray.push(data.genres[i].name)
					}
					setMovieDetails(movieGenreArray)
					setFetched(true)
				}).then(() => {
					setFetched(false)
				})
			} else if (currentGenre === "SONG"){
				newSongData().then((data:any) => {
<<<<<<< HEAD
					console.log(data.data.tracks)
=======
>>>>>>> 5d4dcb9eb141f3c6455c4fe5c89ee9e8746b8c5d
					setSongDetails(data.data.tracks)
					setFetched(true)
				}).then(() => {
					setFetched(false)
				})
			} else if (currentGenre === "GAME"){
				const gameGenreArray:number[] = [];
				newGameData().then((data:any) => {
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

	useEffect(() => {}, [movieDetails])

	useEffect(() => {}, [songDetails])

	useEffect(() => {}, [gameDetails])

	return (
		<>
			{
				stateData ? <>
					<section className='mx-auto min-h-screen max-w-4xl flex flex-col items-center justify-center'>
						<img className='cursor-pointer my-12' src="/" alt="RECMEND" onClick={() => navigate("/")}/>
						<LoginButton/>
						<div className='max-w-8xl my-24 mx-auto flex items-center justify-center flex-col'>
							<img src={displayImg} alt="imgURL" className='rounded-lg my-8'/>
							<h1 className='text-4xl'>{`${genre[0]}${genre.substring(1).toLowerCase()}s which are similar to `}<span className="text-indigo-200 font-medium transition-all">{currentName}:</span></h1>
						</div>
					</section>
					<section className='mx-auto min-h-screen max-w-5xl flex flex-wrap items-center justify-evenly'>
						{
							songDetails ? <>
								{
									songDetails.map((item:any, index:any) => {
										let songName = item.name;
										if (item.name.length > 60){
											songName += "..."
										}
										return <div className='flex flex-col items-center max-w-1/2 m-8 w-60 h-80 justify-end'>
<<<<<<< HEAD
											<h1 className='text-lg text-center'>{songName}</h1>
=======
											<h1 className='text-lg'>{songName}</h1>
>>>>>>> 5d4dcb9eb141f3c6455c4fe5c89ee9e8746b8c5d
											<img src={item.album.images[1].url} className='w-60' />
										</div>
									})
								}
							</> : <>
								<h1>No songs found</h1>
							</>
						}
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