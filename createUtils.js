import { favCollection } from "./myMongo.js"


// Add a movie to the favourites list by id
const addToFavs = (res, id) => {
    favCollection
        .countDocuments({ showID: id })
        .then(countResult => {
            if (!countResult) {
                favCollection.insertOne({ showID: id })
                    .then(result => {
                        if (result.insertedId)
                            res.status(200).json({ message: "Show added to favourites" })
                        else
                            res.status(500).json({ error: "Failed to add show to favourites" })
                    })
            }
            else
                res.status(200).json({ error: "Show already in favourites" })
        })
}

export { addToFavs }