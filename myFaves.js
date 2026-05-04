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

const updateMemo = (res, mID, theMemo) => {
    
    // convert mID to ObjectID
    mID = new ObjectId(mID)

    // update the memo field with the new value.
    const query = { _id: mID }
    const updateData = {
        $set: {
            memo: theMemo
        }
    }
    const options = { upsert: true }
    favesCollection
        .updateOne(query, updateData, options)
        .then(result => {
            if (result.matchedCount == 0 || result.modifiedCount == 0) {
                res.status(400).json({
                    error: `Update failed: ${result.matchedCount} document(s) found and ${result.modifiedCount} document(s) updated.`
                })
                return
            }
            res.status(200).json({
                message: "Memo upadted successfully."
            })
        })
}

const deleteFromFaves = (res, movieID) => {
    favesCollection
        .deleteOne({ _id: movieID })
        .then(result => {
            if (result.deletedCount > 0) {
                res.status(200).json({ message: "Deleted successfully." })
            }
            else
                res.status(200).json({ error: "An occurred while attempting to delete that customer." })
        })
}

export { addToFavs, updateMemo, deleteFromFaves }