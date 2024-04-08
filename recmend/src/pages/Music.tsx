import {FC, useContext, useEffect, useState} from 'react';
import Navbar from "../components/Navbar";
import SearchSection from "../components/SearchSection";
import LoginButton from "../components/LoginButton";
import { ThemeContext } from "../App";
import SearchDisplay from '../components/SearchDisplay';
import { Settings } from '@mui/icons-material';

const Music:FC = () => {
	const loggedContext:any = useContext(ThemeContext);
	const genre:string = "SONG";
	const [propsObj, setPropsObj] = useState({
		songName: "",
		artistName: "",
		imgURL: "",
		songId: "",
	});
	const [transferMusicData, setTransferMusicData]:any = useState();

	const newSearch = (url:any, name:any, artist_name:any, id:any, songId:any) => {
		setPropsObj({
			songName: name,
			artistName: artist_name,
			imgURL: url,
			songId: songId
		})
		setTransferMusicData(loggedContext.search.tracks.items[id])
	}

	useEffect(() => {
		if (loggedContext.search.tracks){
			setTransferMusicData(loggedContext.search.tracks.items[0])
			setPropsObj({
				songName: loggedContext.search.tracks.items[0].name,
				artistName: loggedContext.search.tracks.items[0].artists[0].name,
				imgURL: loggedContext.search.tracks.items[0].album.images[0].url,
				songId: loggedContext.search.tracks.items[0].id,
			})
		}
	}, [loggedContext.search])

	useEffect(() => {
		if (loggedContext.loading){
			window.location.href = "#loading"
		}
	}, [loggedContext.loading])

	return (
		<>
			<Navbar />
			<LoginButton/>
			<SearchSection genre={genre}/>
			{
				loggedContext.loading ? 
				<div id="loading" className='flex justify-center items-center min-h-screen'>
					<Settings style={{fontSize: "64px", animation: "loading 2s infinite"}}/>
				</div> : (loggedContext.search && loggedContext.search !== "undefined") ? 
				<section id={genre.toLowerCase()} className='py-16 min-h-screen max-w-8xl mx-auto bg-gray-800 flex items-center justify-center flex-col'>
					<SearchDisplay 
						display_imgURL={propsObj.imgURL}
						display_name={propsObj.songName}
						display_artistName={propsObj.artistName}
						item_id={propsObj.songId}
						genre={genre}
						new_data={transferMusicData}
					/>
				</section> :
				<section id={genre.toLowerCase()} className='min-h-screen max-w-8xl mx-auto text-center bg-gray-800 flex items-center justify-center flex-col'>
					<h1 className='my-4 text-3xl'>No song found</h1>
				</section>
			}
			{
                !loggedContext.incorrect ? <>
                </> : <div id="extras" className="mx-auto max-w-8xl py-12">
					<h1 className='leading-relaxed mx-4 text-3xl lg:text-5xl sm:text-4xl lg:leading-relaxed md:leading-relaxed sm:leading-relaxed text-center'>Please pick the correct one, or narrow down the search</h1>
					<div className='min-h-screen mx-auto bg-gray-800 flex items-center justify-between flex-wrap max-w-5xl py-12'>
						{
							loggedContext.search.tracks.items.map((item:any, index:any) => {
								return (
									<div id={index} key={index} className='mx-auto my-8 flex flex-col sm: sm:mx-6 sm:w-2/5 lg:flex-row lg:mx-12 items-center cursor-pointer w-3/5 rounded-lg hover:bg-gray-600 transition-all p-4' onClick={() => {newSearch(item.album.images[0].url, item.name, item.artists[0].name, index, item.id); window.location.href = `#${genre.toLowerCase()}`}}>
										<img className='w-48 sm:32 rounded-lg' src={item.album.images[0].url} alt="" />
										<div>
											<h1 className='mx-4 my-2 text-2xl text-center'>{item.name}</h1>
											<h2 className='mx-4 my-2 text-xl text-center'>{item.artists[0].name}</h2>
										</div>
									</div>
								)
							})
						}
					</div>
                </div>
            }
		</>
	)
}

export default Music