import express from 'express'
import { PORT } from './config.js'
import { getFaves, getMovie, getMovies, getRatedMovies } from './readUtils.js'
import { addToFavs, updateMemo } from './myFaves.js'
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

// Get 10 Movies/Series by pages 
app.get("/:type/pg:page", (req, res) => {
    const pageSize = 10
    let page = parseInt(req.params.page)
    let type = req.params.type.toLowerCase()

    if (!page || isNaN(page) || page < 1) {
        res.status(400).json({ error: "Invalid page" })
        return
    }

    if (type !== "movie" && type !== "series") {
        res.status(400).json({ error: "Invalid type" })
        return
    }

    getMovies(res, type, page, pageSize)
})

// Get a Movie/Series by id
app.get("/:type/:id", (req, res) => {
    const type = req.params.type.toLowerCase()
    const id = req.params.id

    if (type !== "movie" && type !== "series") {
        res.status(400).json({ error: "Invalid type" })
        return
    }

    if (!id || id.length !== 24) {
        res.status(400).json({ error: "Invalid ID" })
        return
    }

    getMovie(res, id)
})



//Show all the favourites
app.get("/faves/series", (req, res) => {
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

/* Get 10 Movies/Series
app.get("/:type", (req, res) => {
    let type = req.params.type.toLowerCase()
    if (type != "movie" && type != "series") {
        res.status(400).send({ "error": "Invalid URI" })
        return
    }
    getMovies(res, type)
})
*/


//Get 10 Movies/Series by rating above 6
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