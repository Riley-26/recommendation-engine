import {FC, useContext, useEffect, useMemo, useState} from 'react'
import { ThemeContext } from '../App'
import { useLocation ,useNavigate } from 'react-router-dom'
import { Favorite, Settings, ArrowBackIos } from '@mui/icons-material'
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
			loggedContext.updateLoading(true)
			const movieFetch = await axios.get(`https://api.themoviedb.org/3/movie/${ id }`, {
				headers: {
					Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyY2M4OGNhZjAwNjQ3NjI2YTMwMmQ4YjJlNjA2NDEzYiIsInN1YiI6IjY2MGM4YmU3MzNhMzc2MDE3ZDgxMzI0MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.OrB-1q5cIi57YByXS-u3savP3yUE2EcL5v8CKFrXOHQ`
				}

			}).then(async () => {
				const movieRecommendations = await axios.get(`https://api.themoviedb.org/3/movie/${ id }/recommendations`, {
					headers: {
						Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyY2M4OGNhZjAwNjQ3NjI2YTMwMmQ4YjJlNjA2NDEzYiIsInN1YiI6IjY2MGM4YmU3MzNhMzc2MDE3ZDgxMzI0MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.OrB-1q5cIi57YByXS-u3savP3yUE2EcL5v8CKFrXOHQ`
					}
				})
				return movieRecommendations
			})

			return movieFetch

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
			loggedContext.updateLoading(true)
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
		try{
			loggedContext.updateLoading(true)
			const gameFetch = await axios.get(`http://localhost:5000/api/data?query=${ name }&type=search`).then((data:any) => {
				return data
			})

			return gameFetch
		} catch (error){
			console.log(error)
		}
	}

	const imgHover = (index:any) => {
        const favBtn:any = document.getElementsByClassName("favBtn")[index];
        const displayImg:any = document.getElementsByClassName("displayImg")[index];
        
        favBtn.classList.toggle("hidden");
        favBtn.classList.toggle("opacity-100");
        displayImg.classList.toggle("brightness-50");
    }

	const saveItem = (item_name:any, item_img:any, item_id:any) => {
        if (loggedContext.loggedIn){
            const userId = loggedContext.userData.userId;
            loggedContext.saveObjToDB(userId, [item_name, item_img, ""], genre, String(item_id))
        } else {
            const userId = "undefined";
            alert("Please log in to use this feature.")
        }
    }

	useEffect(() => {
		sessionStorage.setItem("prevHref", window.location.pathname)
		setData()
	}, [window.onload])

	useEffect(() => {
		if (dataSet){
			if (id && currentGenre === "MOVIE"){
				newMovieData().then((data:any) => {
					setMovieDetails(data.data)
					setFetched(true)
				}).then(() => {
					setFetched(false)
					loggedContext.updateLoading(false)
				})
			} else if (currentGenre === "SONG"){
				newSongData().then((data:any) => {
					setSongDetails(data.data.tracks)
					setFetched(true)
				}).then(() => {
					setFetched(false)
					loggedContext.updateLoading(false)
				})
			} else if (currentGenre === "GAME"){
				newGameData().then(async (data:any) => {
					const gameRecommendations:any[] = [];
					if (!data){
						setGameDetails(undefined)
						return ""
					}
					for (let i=0; i<data.data.length; i++){
						const similarGameFetch = await axios.get(`https://api.rawg.io/api/games?key=cf44002358b0402eb16af2dbdf380343&search=${ data.data[i].name }&search_precise=true`).then((data:any) => {
							gameRecommendations.push(data.data.results[0])
						})
					}
					setGameDetails(gameRecommendations)
					setFetched(true)
				}).then(() => {
					setFetched(false)
					loggedContext.updateLoading(false)
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
						<div className='flex justify-between items-center w-3/4 sm:w-2/4'>
							<span className='cursor-pointer text-xl' id='backArrow' onClick={() => {window.history.back()}}><ArrowBackIos id="backArrow" style={{fontSize: "32px", cursor: "pointer"}}/>Back</span>
							<img className='cursor-pointer my-8' src="/" alt="RECMEND" onClick={() => navigate("/")}/>
						</div>
						<LoginButton/>
						<div className='max-w-8xl my-8 mx-auto flex items-center justify-center flex-col'>
							<img src={displayImg} alt="imgURL" className='rounded-lg my-8' style={{maxHeight: "40rem"}}/>
							<h1 className='leading-relaxed mx-4 text-3xl lg:text-5xl sm:text-4xl lg:leading-relaxed md:leading-relaxed sm:leading-relaxed text-center'>{`${genre[0]}${genre.substring(1).toLowerCase()}s which are similar to `}<span className="text-indigo-200 font-medium transition-all">{currentName}:</span></h1>
						</div>
					</section>
					<section className='mx-auto min-h-screen max-w-5xl my-20 flex flex-wrap items-center justify-evenly'>
						{
							currentGenre === "MOVIE" ?
								movieDetails ? <>
									{
										movieDetails.results.map((item:any, index:any) => {
											let movieName = item.title;
											if (item.title.length > 60){
												movieName += "..."
											}
											console.log(item)
											return <div className='flex flex-col items-center max-w-1/2 mx-8 my-14 w-60 h-80 justify-end'>
												<h1 className='text-lg text-center my-2'>{movieName}</h1>
												<div className='relative' onMouseOver={() => imgHover(index)} onMouseOut={() => imgHover(index)}>
													<img className='displayImg flex flex-col rounded-lg transition-all' src={`https://image.tmdb.org/t/p/original${ item.poster_path }`} alt="movieImg" />
													<Favorite className="favBtn absolute top-5 left-5 hidden transition-all opacity-0 cursor-pointer" style={{fontSize: "48px"}} onClick={() => saveItem(item.title, `https://image.tmdb.org/t/p/original${ item.poster_path }`, item.id)}/>
												</div>
											</div>
										})
									}
								</> : <>
									{
										loggedContext.loading ? <div id="loading" className='flex flex-col justify-center items-center min-h-screen'>
											<Settings style={{fontSize: "64px", animation: "loading 2s infinite"}}/>
											<h1 className='text-4xl my-4 text-center'>Fetching similar movies...</h1>
										</div>
										: <h1>No movies found. Please try again or search for a different movie.</h1>
									}
								</>
							: <>
								{
									currentGenre === "SONG" ?
										songDetails ? <>
											{
												songDetails.map((item:any, index:any) => {
													let songName = item.name;
													if (item.name.length > 60){
														songName += "..."
													}
													return <div className='flex flex-col items-center max-w-1/2 mx-8 my-14 w-60 h-80 justify-end'>
														<h1 className='text-lg text-center my-2'>{songName}</h1>
														<div className='relative' onMouseOver={() => imgHover(index)} onMouseOut={() => imgHover(index)}>
															<img className='displayImg flex flex-col rounded-lg transition-all' src={item.album.images[0].url} alt="songImg" />
															<Favorite className="favBtn absolute top-5 left-5 hidden transition-all opacity-0 cursor-pointer" style={{fontSize: "48px"}} onClick={() => saveItem(item.name, item.album.images[0].url, item.id)}/>
														</div>
													</div>
												})
											}
										</> : <>
											{
												loggedContext.loading ? <div id="loading" className='flex flex-col justify-center items-center min-h-screen'>
													<Settings style={{fontSize: "64px", animation: "loading 2s infinite"}}/>
													<h1 className='text-4xl my-4 text-center'>Fetching similar songs...</h1>
												</div>
												: <h1>No songs found. Please try again or search for a different song.</h1>
											}
										</>
									: <>
										{
											currentGenre === "GAME" ?
												gameDetails ? <>
													{
														gameDetails.map((item:any, index:any) => {
															let gameName = item.name
															if (item.name.length > 60){
																gameName += "..."
															}
															return <div className='flex flex-col items-center max-w-1/2 mx-8 my-14 w-60 h-80 justify-end'>
																<h1 className='text-lg text-center my-2'>{gameName}</h1>
																<div className='relative' onMouseOver={() => imgHover(index)} onMouseOut={() => imgHover(index)}>
																	<img className='displayImg flex flex-col rounded-lg transition-all' src={item.background_image} alt="gameImg" />
																	<Favorite className="favBtn absolute top-5 left-5 hidden transition-all opacity-0 cursor-pointer" style={{fontSize: "48px"}} onClick={() => saveItem(item.name, item.background_image, item.id)}/>
																</div>
															</div>
														})
													}
												</> : <>
													{
														loggedContext.loading ? <div id="loading" className='flex flex-col justify-center items-center min-h-screen'>
															<Settings style={{fontSize: "64px", animation: "loading 2s infinite"}}/>
															<h1 className='text-4xl my-4 text-center'>Fetching similar games...</h1>
														</div>
														: <h1>No games found. Please try again or search for a different game.</h1>
													}
												</> : <>
													<h1>None found. Please try again.</h1>
												</>
										}
									</>
								}
							</>
						}
					</section>
				</> : <>
					<section className='mx-auto min-h-screen max-w-4xl flex flex-col items-center justify-center'>
						<img className='cursor-pointer' src="/" alt="RECMEND" onClick={() => navigate("/")}/>
						<LoginButton/>
						<div className='max-w-8xl my-24 mx-auto flex items-center justify-center flex-col'>
							<h1 className='my-4 text-3xl text-center'>NO CONTENT</h1>
						</div>
					</section>
				</>
			}
		</>
	)
}

export default ContentPage