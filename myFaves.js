import { favCollection } from "./myMongo.js"


// Add a movie to the favourites list by id
const addToFavs = async (res, id) => {
    try {
        
        const exists = await favCollection.findOne({ showID: id });

        if (exists) {
            return res.status(200).json({ error: "Show already in favourites" });
        }

        const response = await fetch(`http://localhost:2811/shows/${id}`);
        const showData = await response.json();

        if (!showData) {
            return res.status(404).json({ error: "Show not found" });
        }

        
        const favDoc = {
            showID: id,
            title: 1,
            poster: 1,
            genres: 1,
            plot: 1,
            year: 1,
            runtime: 1,
        };

       
        const result = await favCollection.insertOne(favDoc);

        if (result.insertedId) {
            return res.status(200).json({ message: "Show added to favourites" });
        }

        return res.status(500).json({ error: "Failed to add show to favourites" });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
};

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