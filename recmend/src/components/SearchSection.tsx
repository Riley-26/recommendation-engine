import {FC, useContext, useEffect, useState} from 'react';
import {ThemeContext} from "../App";
import axios from "axios";
import qs from 'qs';

interface SearchProps {
    genre: string;
}

const SearchSection:FC<SearchProps> = ({genre}) => {
    const loggedContext:any = useContext(ThemeContext)!;
    sessionStorage.setItem("loading", "false")
    let spotifyToken = "";

    const getToken = async () => {
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
        const data = {
            grant_type: 'client_credentials',
        };
        
        try {
            const response = await axios.post(
                'https://accounts.spotify.com/api/token',
                qs.stringify(data),
                headers
            );
            spotifyToken = response.data.access_token;
            loggedContext.setToken(spotifyToken)
        } catch (error) {
            console.log(error);
        }
    }

    const getSearch = async function(){
        const input:string = (document.getElementById("searchInput") as HTMLInputElement).value
        loggedContext.updateIncorrect(false)

        if (input === ""){
            loggedContext.updateSearch(input)
            return ""
        }
        
        const movieData = async () => {
            const movieFetch = await fetch(`https://www.omdbapi.com/?s=${ input }&apikey=7ceed11f`)
            const movieInfo = await movieFetch.json()

            loggedContext.updateSearch(movieInfo)
        }

        const musicData = async () => {
            try {
                const {data} = await axios.get(`https://api.spotify.com/v1/search?q=${ input }&type=track`, {
                    headers: {
                        Authorization: `Bearer ${spotifyToken}`
                    },
                })
                if (data.tracks.items.length !== 0){
                    loggedContext.updateSearch(data);
                } else{
                    loggedContext.updateSearch("undefined");
                }
            } catch {
                loggedContext.updateSearch("undefined");
            }
        }
        
        const gameData = async () => {
            const gameFetch = await fetch(`https://api.rawg.io/api/games?key=cf44002358b0402eb16af2dbdf380343&search=${ input }`)
            const gameInfo = await gameFetch.json()

            if (input.length > 0 && gameInfo.count > 0){
                loggedContext.updateSearch(gameInfo);
            } else {
                loggedContext.updateSearch("undefined");
            }
        }
        
        if (genre === "MOVIE"){
            loggedContext.updateLoading(true)
            setTimeout(() => {
                movieData().then(() => {
                    loggedContext.updateLoading(false)
                })
            }, 2000)
        } else if (genre === "SONG"){
            loggedContext.updateLoading(true)
            setTimeout(() => {
                getToken().then(() => musicData()).then(() => {
                    loggedContext.updateLoading(false)
                })
            }, 2000)
        } else if (genre === "GAME"){
            loggedContext.updateLoading(true)
            setTimeout(() => {
                gameData().then(() => {
                    loggedContext.updateLoading(false)
                })
            }, 2000)
        }
    }

    return (
        <section id="search" className="min-h-screen max-w-8xl mx-auto text-center bg-gray-800 flex items-center justify-center flex-col">
            <div className="max-w-6xl mx-4 font-normal p-8 my-10">
                <h1 className="text-6xl leading-relaxed">Please type the name of the <span id="textAnim" className="text-indigo-200 font-medium transition-all">{genre}</span> that you enjoyed</h1>
            </div>
            <input id="searchInput" className="text-2xl border-2 border-indigo-200 rounded-lg bg-gray-800 p-4 w-3/5 animate-pulse"/>
            <button id="searchBtn" className="my-8 px-6 py-4 bg-indigo-200 border-2 border-indigo-200 rounded-lg text-gray-800 font-bold text-xl transition-all hover:bg-gray-800 hover:text-gray-50" onClick={() => {getSearch()}}>
                SEARCH
            </button>
        </section>
    )
}

export default SearchSection;