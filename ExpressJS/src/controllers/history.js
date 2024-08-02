import {findSongById, findUserById} from '../function.js';

export const addToHistory = async (req, res) => {
    try {
        let {songId} = req.body;

        if (!req.session.userId) {
            return res.status(401).json({message: 'User is not logged in'});
        }

        const user = await findUserById(req.session.userId);
        if (!user) return res.status(404).json({message: 'User not found'});

        console.log(songId);
        if(!songId) return res.status(400).json({message: 'Song id is required'});
        const song = await findSongById(songId);
        if (!song) return res.status(404).json({message: 'Song not found'});

        res.status(200).json({message: 'Added to history'});

    } catch (error) {

        res.status(500).json({message: 'Not added to history'});

    }
}