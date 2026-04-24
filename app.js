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

app.get("/info/:id", (req, res) => {
    let movieID = req.params.id
    if (!movieID || movieID.length != 24) {
        res.status(400).send({ "error": "Invalid ID" })
        return
    }
    getMovie(res, movieID)
})

app.get("/faves/show", (req, res) => {
    getFaves(res)
})

app.post("/faves/add/:id", (req, res) => {
    let showID = req.params.id
    if (!showID || showID.length != 24)
        res.status(400).send({ error: "Invalid ID" })
    else
        addToFavs(res, showID)
})

app.get("/:type", (req, res) => {
    let type = req.params.type.toLowerCase()
    if (type != "movie" && type != "series") {
        res.status(400).send({ "error": "Invalid URI" })
        return
    }
    getMovies(res, type)
})

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

app.put('/memo', (req, res) => {
    //const {mID, memo} = req.body
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