import React, { FC, useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import config from './amplifyconfiguration.json';

import Home from "./pages/Home";
import Movies from "./pages/Movies";
import Music from "./pages/Music";
import Games from "./pages/Games";
import User from "./pages/User";
import Login from "./pages/Login";
import ContentPage from "./pages/ContentPage";
import { getCurrentUser } from 'aws-amplify/auth';

interface LoggedInProps {
    loggedIn: boolean;
    updateState: (newState:boolean) => void;
    userData: object;
    updateSearch: (newState:string) => void;
    search: string;
    updateLoading: (newState:object) => void;
    loading: boolean;
    updateIncorrect: (newState:object) => void;
    incorrect: boolean;
    saveObjToDB: (userId:string, jsonObj:object, genre:string) => void;
    unsaveDBItem: (item:any) => void;
    fetchDBData: (userId:string, jsonObj:object, genre:string) => void;
    userStoredData: any,
    updateUserStoredData: (newState:any) => void;
    token: string;
    setToken: (newState:object) => void;
}

type UserProps = {
    username: string;
    userId: string;
}

Amplify.configure(config);
const { DynamoDBClient, PutItemCommand, QueryCommand, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");

export const ThemeContext:any = React.createContext<LoggedInProps | undefined>(undefined)

const App = () => {
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const userObj:UserProps = {"username": "", "userId": ""};
    const [userData, setUserData] = useState(userObj);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [incorrect, setIncorrect] = useState(false);
    const [userStoredData, setUserStoredData] = useState("");
    const [token, setToken] = useState("")
    
    const updateState = async (newState:boolean) => {
        setLoggedIn(newState);
    }

    const updateSearch = async (newState:string) => {
        setSearch(newState);
    }

    const updateLoading = async (newState:boolean) => {
        setLoading(newState)
    }

    const updateIncorrect = async (newState:boolean) => {
        setIncorrect(newState)
    }

    const updateUserStoredData = async (newState:any) => {
        setUserStoredData(newState)
    }
    
    const AWS = require("aws-sdk");
    
    AWS.config.update({
        accessKeyId: "AKIA3QSX7W3GF5EESL7N",
        secretAccessKey: "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",
        region: "eu-west-2",
    });

    const dynamoDB = new DynamoDBClient({
        region: AWS.config.region,
        credentials: AWS.config.credentials,
    });
    
    const saveObjToDB = async (userId:string, jsonObj:any, genre:string, id:string) => {
        let itemIndex:number = 0;
        let exists:boolean = false;
        
        fetchDBData(userId, genre).then((data:any) => {
            if (data.Count > 0){
                let largestIndex:number = 0;
                
                //sets range
                for (let i=0; i<data["Count"]; i++){
                    if (Number(data["Items"][i]["index"]["N"]) > largestIndex){
                        largestIndex = Number(data["Items"][i]["index"]["N"]);
                    }
                    if (data["Items"][i]["data"]["M"]["id"]["S"] === id){
                        exists = true;
                    }
                }
                
                //sets first available index
                for (let i=0; i<=largestIndex; i++){
                    if (i != data["Items"][i]["index"]["N"]){
                        itemIndex = i
                        break
                    } else if (i === largestIndex){
                        itemIndex = largestIndex+1
                        break
                    }
                }
            } else{
                itemIndex = 0
            }

        }).then(async () => {
            //sets parameters for PUT command
            const params = {
                TableName: `RECMEND-${genre.toLowerCase()}s`,
                Item: {
                    userId: { "S": userId },
                    index: { "N": `${itemIndex}` },
                    data: { "M": {
                        "name": {"S": jsonObj[0]},
                        "image": {"S": jsonObj[1]}, 
                        "artist": {"S": jsonObj[2]},
                        "id": {"S": id}
                    }}
                }
            };
            
            try{
                if (!exists){
                    const data = await dynamoDB.send(new PutItemCommand(params));
                    alert("Item saved.")
                    return data
                } else{
                    alert("Already saved.")
                }
            } catch (error){
                console.log(error)
                return error
            }
        })

    }

    const fetchDBData = async (userId:string, genre:string) => {
        const params = {
            TableName: `RECMEND-${genre.toLowerCase()}s`,
            KeyConditionExpression: "userId = :userId",
            ExpressionAttributeValues: {
                ":userId": {"S": userId},
            }
        };
        
        try{
            const data = await dynamoDB.send(new QueryCommand(params));
            return data
        } catch (error){
            return error
        }

    }

    const checkLoggedIn = async () => {
        try {
            const { username, userId } = await getCurrentUser();
            userObj["username"] = username
            userObj["userId"] = userId
            updateState(true)
        } catch {
            userObj["username"] = "undefined"
            userObj["userId"] = "undefined"
            updateState(false)
        }
        return userObj
    }

    const unsaveDBItem = async (item:any, genre:string, userId:string,) => {
        if (window.confirm("Are you sure that you would like to unsave this item?")){
            fetchDBData(userId, genre).then( async (data) => {
                for (let i=0; i<data.Count; i++){
                    if (data.Items[i].data["M"].id["S"] === item.data["M"].id["S"]){
                        const params = {
                            TableName: `RECMEND-${genre.toLowerCase()}s`,
                            Key: {
                                userId: {"S": userId},
                                index: {"N": `${data.Items[i].index["N"]}`}
                            },
                        };

                        try{
                            const data = await dynamoDB.send(new DeleteItemCommand(params));
                            window.location.reload()
                            return data
                        } catch (error){
                            window.location.reload()
                            return error
                        }
                    }
                }
            })
        }
    }
    
    useEffect(() => {
        const fetchData = async () => {
            try{
                const result = await checkLoggedIn();
                setUserData(result)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData()
    }, [])

    useEffect(() => {}, [userStoredData])

    useEffect(() => {
        if (window.location.pathname !== "/user"){
            sessionStorage.setItem("prevHref", window.location.pathname)
        }
    }, [])

    useEffect(() => {}, [token])
    
    return (
        <div className="App">
            <ThemeContext.Provider value={{ loggedIn, updateState, userData, updateSearch, search, loading, updateLoading, incorrect, updateIncorrect, saveObjToDB, fetchDBData, userStoredData, updateUserStoredData, unsaveDBItem, token, setToken }}>
                <BrowserRouter>
                    <Routes>
                        <Route index element={<Home />} />
                        <Route path="/movies" element={<Movies />} />
                        <Route path="/music" element={<Music />} />
                        <Route path="/games" element={<Games />} />
                        <Route path="/user" element={<User />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/content" element={<ContentPage />} />
                    </Routes>
                </BrowserRouter>
            </ThemeContext.Provider>
        </div>
    );
}

export default App;
