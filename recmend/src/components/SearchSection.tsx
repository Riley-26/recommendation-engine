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
        const client_id = "hidden";
        const client_secret = "hidden";
    
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

    const authMovies = async () => {
        try{
            const {data} = await axios.get(`https://api.themoviedb.org/3/authentication`, {
                headers: {
                    Authorization: `Bearer hidden`
                }
            })
            return data

        } catch{
            console.log("Error")
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
            try{
                const {data} = await axios.get(`https://api.themoviedb.org/3/search/movie?query=${ input }&include_adult=false`, {
                    headers: {
                        Authorization: `Bearer hidden`
                    }
                });

                if (data.total_results > 0){
                    loggedContext.updateSearch(data)
                } else{
                    loggedContext.updateSearch("undefined")
                }
            } catch {
                loggedContext.updateSearch("undefined")
            }
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
            try{
                const gameImageFetch = await axios.get(`https://api.rawg.io/api/games?key=hidden&search=${ input }`).then((newData:any) => {
                    return newData.data
                })

                if (input.length > 0 && gameImageFetch.results.length > 0){
                    loggedContext.updateSearch(gameImageFetch);
                } else {
                    loggedContext.updateSearch("undefined");
                }

            } catch (error){
                console.log(error)
            }

        }
        
        if (genre === "MOVIE"){
            loggedContext.updateLoading(true)
            setTimeout(() => {
                authMovies().then(() => movieData()).then(() => {
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
            <div className="max-w-6xl mx-4 font-normal p-4 my-10 sm:p-8">
                <h1 className="leading-relaxed text-3xl lg:text-6xl sm:text-5xl lg:leading-relaxed md:leading-relaxed sm:leading-relaxed">Please type the name of the <span id="textAnim" className="text-indigo-200 font-medium transition-all">{genre}</span> that you enjoyed</h1>
            </div>
            <input id="searchInput" className="text-xl border-2 border-indigo-200 rounded-lg bg-gray-800 p-4 w-4/5 animate-pulse xl:w-3/5 md:text-2xl"/>
            <button id="searchBtn" className="my-8 px-6 py-4 bg-indigo-200 border-2 border-indigo-200 rounded-lg text-gray-800 font-bold text-xl transition-all hover:bg-gray-800 hover:text-gray-50" onClick={() => {getSearch()}}>
                SEARCH
            </button>
        </section>
    )
}

export default SearchSection;
