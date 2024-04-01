import {FC, useEffect, useContext, useState} from 'react';
import Navbar from "../components/Navbar";
import SearchSection from "../components/SearchSection";
import LoginButton from '../components/LoginButton';
import SearchDisplay from '../components/SearchDisplay';
import { ThemeContext } from '../App';
import { Settings } from "@mui/icons-material"

const Games:FC = () => {
	const loggedContext:any = useContext(ThemeContext);
	const genre:string = "GAME";
	const [propsObj, setPropsObj] = useState({
		gameName: "",
		devName: "",
		imgURL: "",
		gameId: ""
	});
	const [transferGameData, setTransferGameData]:any = useState(loggedContext.search);

	const newSearch = (url:any, name:any, dev_name:any, id:any, game_id:any) => {
		setPropsObj({
			gameName: name,
			devName: dev_name,
			imgURL: url,
			gameId: String(game_id)
		})
		setTransferGameData(loggedContext.search.results[id])
	}
	
	useEffect(() => {
		if (loggedContext.search){
			setTransferGameData(loggedContext.search.results[0])
			setPropsObj({
				gameName: loggedContext.search.results[0]["name"],
				devName: "",
				imgURL: loggedContext.search.results[0]["background_image"],
				gameId: String(loggedContext.search.results[0]["id"])
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
						display_name={propsObj.gameName}
						display_artistName={propsObj.devName}
						item_id={propsObj.gameId}
						genre={genre}
						new_data={transferGameData}
					/>
				</section> :
				<section id={genre.toLowerCase()} className='min-h-screen max-w-8xl mx-auto text-center bg-gray-800 flex items-center justify-center flex-col'>
					<h1 className='my-4 text-3xl'>No game found</h1>
				</section>
			}
			{
                !loggedContext.incorrect ? <>
                </> : <div id="extras" className="mx-auto max-w-8xl py-12">
					<h1 className='my-12 text-5xl text-center'>Please pick the correct one, or narrow down the search</h1>
					<div className='min-h-screen mx-auto bg-gray-800 flex items-center justify-between flex-wrap max-w-5xl py-12'>
						{
							loggedContext.search.results.map((item:any, index:any) => {
								return (
									<div id={index} key={index} className='mx-12 my-8 flex flex-col items-center cursor-pointer w-2/5 rounded-lg hover:bg-gray-600 transition-all p-4' onClick={() => {newSearch(item["background_image"], item["name"], "", index, String(item.id)); window.location.href = `#${genre.toLowerCase()}`}}>
										<img className='w-56 rounded-lg' src={item["background_image"]} alt="" />
										<div>
											<h1 className='mx-4 my-2 text-2xl text-center'>{item["name"]}</h1>
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

export default Games