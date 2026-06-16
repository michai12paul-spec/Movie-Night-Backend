import { ObjectId } from "mongodb"
import { moviesCollection } from "./myMongo.js"

const addToFaves = async (res, id) => {
    try {
        const count = await moviesCollection.countDocuments({ showID: id })
        if (count > 0) {
            res.status(400).json({ message: "Already in favorites" })
            return
        }

        const results = await moviesCollection.insertOne({
            showID: id,
            note: "",
            watched: true
        })

        if (results && results.insertedId) {
            res.status(200).json({ message: "Added to favourites" })
        } else {
            res.status(500).json({ error: "Failed to add favourite" })
        }
    } catch (err) {
        console.error('addToFaves error', err)
        if (!res.headersSent) res.status(500).json({ error: 'Server error' })
    }
}


const deletefromFaves = (res, id) => {
    moviesCollection
        .deleteOne({ showID: id })
        .then(result => {
            if (result.deletedCount > 0) {
                res.status(200).json({ message: "Deleted from favourites" })
            }
            else
                res.status(404).json({ error: "Item not found in favourites" })

        })
}

const updateFaves = (res, id, data) => {
    moviesCollection
        .updateOne(
            { showID: id },
            { $set: { note: data.note, watched: data.watched } }
        )
        .then(result => {
            if (result.matchedCount === 0) {
                return res.status(404).json({ error: "Not found in favourites" })
            }

            res.status(200).json({ message: "Updated successfully" })
        })
}

export { addToFaves, deletefromFaves, updateFaves }