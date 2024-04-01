import {FC, useContext, useEffect, useState} from 'react';
import Navbar from "../components/Navbar";
import SearchSection from "../components/SearchSection";
import LoginButton from "../components/LoginButton";
import SearchDisplay from "../components/SearchDisplay";
import { ThemeContext } from "../App";
import { Settings } from "@mui/icons-material"

const Movies:FC = () => {
	const loggedContext:any = useContext(ThemeContext);
	const genre:string = "MOVIE";
	const [propsObj, setPropsObj] = useState({
		movieName: "",
		directorName: "",
		imgURL: "",
		movieId: ""
	});
	const [transferMovieData, setTransferMovieData]:any = useState();
	
	const newSearch = (url:any, name:any, dir_name:any, id:any, uniqueId:any) => {
		setPropsObj({
			movieName: name,
			directorName: dir_name,
			imgURL: url,
			movieId: uniqueId
		})
		setTransferMovieData(loggedContext.search.Search[id])
	}
	
	useEffect(() => {
		if (loggedContext.search){
			setTransferMovieData(loggedContext.search.Search[0])
			setPropsObj({
				movieName: loggedContext.search.Search[0]["Title"],
				directorName: "",
				imgURL: loggedContext.search.Search[0]["Poster"],
				movieId: loggedContext.search.Search[0]["imdbID"]
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
				<section id={genre.toLowerCase()}  className='py-16 min-h-screen max-w-8xl mx-auto bg-gray-800 flex items-center justify-center flex-col'>
					<SearchDisplay 
						display_imgURL={propsObj.imgURL}
						display_name={propsObj.movieName}
						display_artistName={propsObj.directorName}
						item_id={propsObj.movieId}
						genre={genre}
						new_data={transferMovieData}
					/>
				</section> :
				<section id={genre.toLowerCase()} className='min-h-screen max-w-8xl mx-auto text-center bg-gray-800 flex items-center justify-center flex-col'>
					<h1 className='my-4 text-3xl'>No movie found</h1>
				</section>
			}
			{
                !loggedContext.incorrect ? <>
                </> : <div id="extras" className="mx-auto max-w-8xl py-12">
					<h1 className='my-12 text-5xl text-center'>Please pick the correct one, or narrow down the search</h1>
					<div className='min-h-screen mx-auto bg-gray-800 flex items-center justify-between flex-wrap max-w-5xl py-12'>
						{
							loggedContext.search.Search.map((item:any, index:any) => {
								return (
									<div id={index} key={index} className='mx-12 my-8 flex items-center cursor-pointer w-2/5 rounded-lg hover:bg-gray-600 transition-all p-4' onClick={() => {newSearch(item["Poster"], item["Title"], "", index, item["imdbID"]); window.location.href = `#${genre.toLowerCase()}`}}>
										<img className='w-32 rounded-lg' src={item["Poster"]} alt="" />
										<div>
											<h1 className='mx-4 my-2 text-2xl'>{item["Title"]}</h1>
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

export default Movies;