import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();


export const getSongs = async (req, res) => {

}

export const addSong = async (req, res) => {
    const {title, cover_url, song_url, published, duration} = req.body;

    console.log(req.session.userId)

    if (!req.session.userId) {
        return res.status(401).json({message: 'User is not logged in'});
    }

    if (!title || !cover_url || !song_url || !published) {
        return res.status(400).json({message: 'Please fill in all fields'});
    }

    if (title.length > 35) {
        return res.status(400).json({message: 'Title is too long'});
    }

    if (!cover_url.match("^(http|https)://")) {
        return res.status(400).json({message: 'Please enter a valid URL'});
    }

    if (!song_url.match("^(http|https)://")) {
        return res.status(400).json({message: 'Please enter a valid URL'});
    }

    let date = new Date(published);
    if (date == 'Invalid Date') {
        return res.status(400).json({message: 'Please enter a valid date'});
    }

    try {
        const newSong = await prisma.song.create({
            data: {
                title: title,
                coverURL: cover_url,
                songURL: song_url,
                publication_date: date,
                duration: duration,
                account: {
                    connect: {
                        id: req.session.userId
                    }
                },
                artist: {
                    connect: {
                        id: 1
                    }
                }
            }
        });

        return res.status(201).json({message: 'Song added successfully', songId: newSong.id});
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: 'An error occurred while adding the song'});
    }

}