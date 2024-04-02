import React, {useState, useEffect, useContext, FC} from "react";
import { Check, Close, Favorite, Settings } from '@mui/icons-material';
import { ThemeContext } from "../App";
import { Link } from "react-router-dom";

type DisplayProps = {
    display_imgURL: string;
    display_name: string;
    display_artistName: string;
    item_id: string;
    genre: string;
    new_data: any;
}

const SearchDisplay:FC<DisplayProps> = ({display_imgURL, display_name, display_artistName, item_id, genre, new_data}) => {

    const loggedContext:any = useContext(ThemeContext);
    let dataName:any = "";
    let dataImage:any = "";
    let dataArtist:any = "";
    let dataId:any = "";
    
    const imgHover = () => {
        const favBtn:any = document.getElementById("favBtn");
        const displayImg:any = document.getElementById("displayImg");
        
        favBtn.classList.toggle("hidden");
        favBtn.classList.toggle("opacity-100");
        displayImg.classList.toggle("brightness-50")
    }
    
    const saveItem = () => {
        dataName = display_name;
        dataImage = display_imgURL;
        dataArtist = display_artistName;
        dataId = item_id;
        
        if (loggedContext.loggedIn){
            const userId = loggedContext.userData.userId;
            loggedContext.saveObjToDB(userId, [dataName, dataImage, dataArtist], genre, String(dataId))
        } else {
            const userId = "undefined";
            alert("Please log in to use this feature.")
        }
    }

    useEffect(() => {
        if (loggedContext.incorrect === true){
            window.location.href = "#extras";
        }
    }, [loggedContext.incorrect])

    return (
        <>
            <h1 className="text-6xl leading-relaxed">Is this the correct <span id="textAnim" className="text-indigo-200 font-medium transition-all">{genre}</span>?</h1>
            <div className='flex items-center justify-center my-16'>
                <div className='mx-8 w-2/4 max-w-xl relative transition-all' onMouseOver={() => imgHover()} onMouseOut={() => imgHover()}>
                    <img id="displayImg" src={display_imgURL} alt="displayImg" className='rounded-lg transition-all'/>
                    <Favorite id="favBtn" className="absolute top-5 left-5 hidden transition-all opacity-0 cursor-pointer" style={{fontSize: "48px"}} onClick={() => saveItem()}/>
                </div>
                <div className='mx-8 w-2/4 max-w-3xl'>
                    <h1 className='my-4 text-5xl'>{display_name}</h1>
                    <h2 className='my-4 text-3xl'>{display_artistName}</h2>
                </div>
            </div>
            <div className='mx-auto w-64 flex justify-between'>
                <Close style={{fontSize: "4rem", color: "rgb(180, 0, 0)", cursor: "pointer"}} onClick={() => {loggedContext.updateIncorrect(true)}}/>
                <Link state={[genre, new_data, display_name, item_id]} to={"/content"}><Check style={{fontSize: "4rem", color: "rgb(0, 150, 0)", cursor: "pointer"}} onClick={() => {loggedContext.updateIncorrect(false)}}/></Link>
            </div>
        </>
    )
}

export default SearchDisplay