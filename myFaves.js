import { favCollection } from "./myMongo.js"



const addToFavs = async (res, id) => {
    favoritesCollection
        .countDocuments(
            { showID: id })
        .then(countresults => {
            if (!countresults) {
                favoritesCollection.insertOne({
                    showID: new ObjectId(id),
                    note: "",
                    watched: false
                })
                    .then(result => {
                        if (result.insertedId)
                            res.status(200).json({ "msg": "Show added to favorites" })
                        else
                            res.status(500).json({ "error": "Failed to add show to favorites" })
                    })
            }
            else
                res.status(200).json({ "error": "Show already in favorites" })
        })
}




const updateMemo = (res, mID, theMemo) => {
    mID = new ObjectId(mID)
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