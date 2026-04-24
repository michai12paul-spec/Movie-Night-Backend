import express from 'express'
import { PORT } from './config.js'
import { getFaves, getMovie, getMovies, getRatedMovies } from './readUtils.js'
import { addToFavs, updateMemo} from './createUtils.js'
import cors from 'cors'

const app = express()
app.use(cors())

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})

app.get('/', (req, res) => {
    res.send('<h1><a href="/show">Link Test</a></h1>')
})

app.get('/test', (req, res) => {
    res.send('Test')
})

// Get a Movie/Series by id
app.get("/info/:id", (req, res) => {
    let movieID = req.params.id
    if (!movieID || movieID.length != 24) {
        res.status(400).send({ "error": "Invalid ID" })
        return
    }
    getMovie(res, movieID)
})

//Show all the favourites
app.get("/faves/show", (req, res) => {
    getFaves(res)
})

//Add a Show to the favourites list by id
app.post("/faves/add/:id", (req, res) => {
    let showID = req.params.id
    if (!showID || showID.length != 24)
        res.status(400).send({ error: "Invalid ID" })
    else
        addToFavs(res, showID)
})

// Get 10 Movies/Series
app.get("/:type", (req, res) => {
    let type = req.params.type.toLowerCase()
    if (type != "movie" && type != "series") {
        res.status(400).send({ "error": "Invalid URI" })
        return
    }
    getMovies(res, type)
})
// Get 10 Movies/Series by pages 
app.get("/:type/p:page", (req, res) => {
    const pageSize = 10
    let type = req.params.type.toLowerCase()
    if (type != "movie" && type != "series") {
        res.status(400).send({ "error": "Invalid URI" })
        return
    }
    let page = parseInt(req.params.page)
    if (!page || isNaN(page) || page < 1) {
        res.status(400).send({ "error": "Invalid URI" })
        return
    }
    page = (page - 1) * pageSize
    getMovies(res, type, page)
})

//Get 10 Movies/Series by rating abouve 6
app.get("/:rating/:type", (req, res) => {
    let rating = parseFloat(req.params.rating)
    if (isNaN(rating) || rating <= 0 || rating > 10) {
        res.status(400).send({ "error": "Invalid rating" })
        return
    }
    let type = req.params.type.toLowerCase()
   if (type != "movie" && type != "series") {
        res.status(400).send({ "error": "Invalid URI" })
        return
    }
    getRatedMovies(res, type, 0, rating)
})

//Add a memo to a favourite movie/series by id
app.put('/memo', (req, res) => {
    const data = req.body
    if (!data || !data.mID || !data.memo) {
        res.status(400).json({ error: "Corrupted or missing request data" })
        return
    }
    if (data.memo.length > 160) {
        res.status(400).json({ error: "Memo exceeds 160 characters" })
        return
    }
    updateMemo(res, data.mID, data.memo)
})

//Delete a movie/series from the favourites list by id
app.delete('/faves/remove', (req, res) => {
    const data = req.body
    deleteFromFaves(res, data.aID)
})