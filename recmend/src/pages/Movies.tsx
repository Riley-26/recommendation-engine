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
		setTransferMovieData(loggedContext.search.results[id].title)
	}
	
	useEffect(() => {
		if (loggedContext.search.results && loggedContext.search !== "undefined"){
			setTransferMovieData(loggedContext.search.results[0])
			setPropsObj({
				movieName: loggedContext.search.results[0].title,
				directorName: "",
				imgURL: `https://image.tmdb.org/t/p/original${ loggedContext.search.results[0].poster_path }`,
				movieId: loggedContext.search.results[0].id
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
					<h1 className='leading-relaxed mx-4 text-3xl lg:text-5xl sm:text-4xl lg:leading-relaxed md:leading-relaxed sm:leading-relaxed text-center'>Please pick the correct one, or narrow down the search</h1>
					<div className='min-h-screen mx-auto bg-gray-800 flex items-center justify-between flex-wrap max-w-5xl py-12'>
						{
							loggedContext.search.results.map((item:any, index:any) => {
								return (
									<div id={index} key={index} className='mx-auto my-8 flex flex-col sm: sm:mx-6 sm:w-2/5 lg:flex-row lg:mx-12 items-center cursor-pointer w-3/5 rounded-lg hover:bg-gray-600 transition-all p-4' onClick={() => {newSearch(`https://image.tmdb.org/t/p/original${ item.poster_path }`, item.title, "", index, item.id); window.location.href = `#${genre.toLowerCase()}`}}>
										<img className='w-48 sm:32 rounded-lg' src={`https://image.tmdb.org/t/p/original${ item.poster_path }`} alt="" />
										<div>
											<h1 className='mx-4 my-2 text-2xl text-center'>{item.title}</h1>
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