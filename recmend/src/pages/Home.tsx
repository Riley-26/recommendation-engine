import React, {useState, useEffect, useContext, FC} from "react";
import Navbar from "../components/Navbar";
import { MusicNote, Movie, VideogameAsset, Book } from "@mui/icons-material";
import LoginButton from "../components/LoginButton";
import { ThemeContext } from "../App";

const Home:FC = () => {

    const loggedContext:any = useContext(ThemeContext);

    return(
        <div>
            <Navbar />
            <LoginButton />
            <section className="min-h-screen max-w-8xl mx-auto text-center bg-gray-800 flex items-center justify-center flex-col">
                <div className="">
                    <span id="homeLogo">REC<span className="text-indigo-200">MEND</span></span>
                </div>
                <div className="max-w-6xl mx-4 font-normal p-8 border-2 border-indigo-200 rounded-lg my-10">
                    <h1 className="leading-relaxed text-3xl lg:text-5xl sm:text-4xl lg:leading-relaxed md:leading-relaxed sm:leading-relaxed">The <span className="text-indigo-200">BEST</span> Entertainment Recommendation Engine on the Internet</h1>
                </div>
                <button className="my-8 px-6 py-4 bg-indigo-200 border-2 border-indigo-200 rounded-lg text-gray-800 font-bold text-xl transition-all hover:bg-gray-800 hover:text-gray-50" onClick={() => {window.location.href = "#genre"}}>
                    GET STARTED
                </button>
            </section>
            <section id="genre" className="min-h-screen mx-auto text-center bg-gray-800 flex items-center justify-center flex-col">
                <div className="max-w-6xl mx-4 font-normal p-4 my-10 sm:p-8">
                    <h1 className="text-4xl leading-relaxed lg:text-5xl sm:leading-relaxed">What was it that you enjoyed?</h1>
                </div>
                <div id="genreButtons" className="flex flex-wrap max-w-4/5 items-center justify-center">
                    <button className="my-4 w-64 mx-10 px-16 py-10 border-indigo-200 border-2 text-gray-50 rounded-lg font-medium text-3xl lg:text-4xl transition-all hover:bg-indigo-200 hover:text-gray-800" onClick={() => {window.location.href = "/movies"}}>
                        <Movie className="my-2" style={{fontSize: "64px"}}/>
                        <br/>
                        MOVIE
                    </button>
                    <button className="my-4 w-64 mx-10 px-16 py-10 border-indigo-200 border-2 text-gray-50 rounded-lg font-medium text-3xl lg:text-4xl transition-all hover:bg-indigo-200 hover:text-gray-800" onClick={() => {window.location.href = "/music"}}>
                        <MusicNote className="my-2" style={{fontSize: "64px"}} />
                        <br/>
                        SONG
                    </button>
                    <button className="my-4 w-64 mx-10 px-16 py-10 border-indigo-200 border-2 text-gray-50 rounded-lg font-medium text-3xl lg:text-4xl transition-all hover:bg-indigo-200 hover:text-gray-800" onClick={() => {window.location.href = "/games"}}>
                        <VideogameAsset className="my-2" style={{fontSize: "64px"}} />
                        <br/>
                        GAME
                    </button>
                </div>
            </section>
        </div>
    )
}

export default Home;