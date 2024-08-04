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
                Featurings: {
                    select: {
                        artist: {
                            select: {
                                name: true,
                                slug: true
                            }
                        }
                    }
                },
                artist: {
                    select: {
                        name: true,
                        avatarURL: true,
                        slug: true
                    }
                },
                album: {
                    select: {
                        title: true,
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
    const {title, published, duration, artistid, cover} = req.body;
    let coverOrNo = false;

    console.log(req.session.userId)

    if (!req.session.userId) {
        return res.status(401).json({message: 'User is not logged in'});
    }

    if (!title || !published) {
        return res.status(400).json({message: 'Please fill in all fields'});
    }

    if (title.length > 35) {
        return res.status(400).json({message: 'Title is too long'});
    }

    if(!cover) {
        coverOrNo = true;
    }

    let date = new Date(published);
    if (date == 'Invalid Date') {
        return res.status(400).json({message: 'Please enter a valid date'});
    }

    if (duration < 0) {
        return res.status(400).json({message: 'Please enter a valid duration'});
    }

    if (!artistid) {
        return res.status(400).json({message: 'Please select an artist'});
    }

    try {
        let slugs = crypto.randomBytes(60).toString('base64').slice(0, 60).replace(/\+/g, '0').replace(/\//g, '0')
        const newSong = await prisma.song.create({
            data: {
                title: title,
                coverURL: 'null',
                songURL: '/file/song/' + slugs,
                publication_date: date,
                duration: duration,
                slug: slugs,
                account: {
                    connect: {
                        id: req.session.userId
                    }
                },
                artist: {
                    connect: {
                        id: artistid
                    }
                }
            }
        });

        if (!newSong) {
            return res.status(500).json({message: 'An error occurred while adding the song'});
        }

        return res.status(201).json({message: 'Song added to' + newSong, songId: newSong.id, songSlug: newSong.slug});
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: 'An error occurred while adding the song'});
    }

}

export const generateSlug = async (req, res) => {
    return res.status(200).json({slug: crypto.randomBytes(60).toString('base64').slice(0, 60).replace(/\+/g, '0').replace(/\//g, '0')});
}