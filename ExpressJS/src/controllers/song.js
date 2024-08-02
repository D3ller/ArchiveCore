import {PrismaClient} from '@prisma/client';
import crypto from 'crypto';
const prisma = new PrismaClient();


export const getSongBySlug = async (req, res) => {
    const {slug} = req.params;

    if (!slug) {
        return res.status(400).json({message: 'Please provide a slug'});
    }

    try {
        const song = await prisma.song.findUnique({
            where: {
                slug: slug
            },
            include: {
                account: {
                    select: {
                        username: true
                    }
                },
                artist: {
                    select: {
                        name: true,
                        avatarURL: true,
                        slug: true
                    }
                }
            }
        });

        if (!song) {
            return res.status(404).json({message: 'Song not found'});
        }

        return res.status(200).json(song);
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: 'An error occurred while fetching the song'});
    }


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
                slug: crypto.randomBytes(60).toString('base64').slice(0, 60).replace(/\+/g, '0').replace(/\//g, '0'),
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

export const generateSlug = async (req, res) => {
return res.status(200).json({slug: crypto.randomBytes(60).toString('base64').slice(0, 60).replace(/\+/g, '0').replace(/\//g, '0')});
}