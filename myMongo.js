import { MongoClient, ServerApiVersion } from "mongodb";
import { MDBURI } from "./config.js";


const client = new MongoClient(MDBURI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
})

const mflixDB = client.db("sample_mflix")
const moviesCollection = mflixDB.collection("movies")
const favCollection = mflixDB.collection("faves")

export { moviesCollection, favCollection }