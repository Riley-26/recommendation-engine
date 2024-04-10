const express = require('express');
const axios = require("axios")
const app = express();
const cors = require("cors")
const port = process.env.PORT || 5000;

app.use(express())
app.use(cors({
    origin: "https://recmend.web.app/",
    methods: "GET, POST",
}))

let prevData = "";
let prevQuery = "";

app.get("/", (req, res) => {
    res.send("Home")
})

app.get('/api/data', async (req, res) => {
    const query = req.query.query
    const searchType = req.query.type
    try{
        if (searchType === "search"){
            if (query !== prevQuery){
                const response = await axios.get(`https://www.giantbomb.com/api/search/?api_key=f48b4d0ac779a1ed9f10173ef0a2942aa15fb2c0&format=json&query=${ query }&resources=game`).then(async (data) => {
                    const similarGames = await axios.get(`https://www.giantbomb.com/api/game/${ data.data.results[0].guid }/?api_key=f48b4d0ac779a1ed9f10173ef0a2942aa15fb2c0&format=json`).then((data) => {
                        prevData = data.data.results.similar_games
                        prevQuery = query
                        return data.data.results.similar_games
                    })
                    return similarGames
                })
                
                res.json(response)
            } else {
                res.json(prevData)
            }
        }
        
    } catch (error){
        console.log(error)
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});