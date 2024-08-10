import {PrismaClient} from '@prisma/client';
import crypto from 'crypto';
import {getLyrics, getSong} from 'genius-lyrics-api';

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
                        slug: true,
                        coverURL: true
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
    let {title, published, duration, artistid, cover, slugs} = req.body;
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

    if (!slugs) {
        slugs = crypto.randomBytes(60).toString('base64').slice(0, 60).replace(/\+/g, '0').replace(/\//g, '0')
    }

    if (!cover) {
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
        const newSong = await prisma.song.create({
            data: {
                title: title,
                coverURL: coverOrNo ? 'null' : cover,
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

        return res.status(201).json({
            message: 'Song added',
            songId: newSong.id,
            songSlug: newSong.slug,
            title: newSong.title
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: 'An error occurred while adding the song'});
    }

}

export const generateSlug = async (req, res) => {
    return res.status(200).json({slug: crypto.randomBytes(60).toString('base64').slice(0, 60).replace(/\+/g, '0').replace(/\//g, '0')});
}

export const getLyric = async (req, res) => {
    const {artist, title} = req.body;
    const options = {
        apiKey: 'lDLTpyb6Hv5CmtGXE0cqbM0rMVmnnFBYD9cJsnrVjg4HdcP2ogLa5sixzMF_svPA',
        title: title,
        artist: artist,
        optimizeQuery: true
    };

    getLyrics(options).then((lyrics) => {
        return res.status(200).json({lyrics: lyrics});
    }).catch((err) => {
        return res.status(500).json({message: 'An error occurred while fetching the lyrics'});
    })
}

export const getSongAll = async (req, res) => {

    if (!req.session.userId) {
        return res.status(401).json({message: 'User is not logged in'});
    }

    if (req.session.userId !== 2) {
        return res.status(401).json({message: 'Forbidden'});
    }

    try {
        const songs = await prisma.song.findMany({
            select: {
                title: true,
                id: true,
                slug: true,
                artist: {
                    select: {
                        name: true,
                        slug: true
                    }
                },

            }

        })

        if (!songs) {
            return res.status(404).json({message: 'No songs found'});
        }

        return res.status(200).json(songs);

    } catch (err) {
        console.error(err);
        return res.status(500).json({message: 'An error occurred while fetching the songs'});
    }
}

export const addFeature = async (req, res) => {
    const {songId, artistId} = req.body;

    if (!songId || !artistId) {
        return res.status(400).json({message: 'Please fill in all fields'});
    }

    if (!req.session.userId) {
        return res.status(401).json({message: 'User is not logged in'});
    }

    if (req.session.userId !== 2) {
        return res.status(401).json({message: 'Forbidden'});
    }

    try {
        const song = await prisma.song.findUnique({
            where: {
                id: songId
            }
        });

        if (!song) {
            return res.status(404).json({message: 'Song not found'});
        }

        const artist = await prisma.artist.findUnique({
            where: {
                id: artistId
            }
        });

        if (!artist) {
            return res.status(404).json({message: 'Artist not found'});
        }

        const feature = await prisma.featurings.create({
            data: {
                song: {
                    connect: {
                        id: songId
                    }
                },
                artist: {
                    connect: {
                        id: artistId
                    }
                }
            }
        });

        if (!feature) {
            return res.status(500).json({message: 'An error occurred while adding the feature'});
        }

        return res.status(201).json({message: 'Feature added'});

    } catch (err) {
        console.error(err);
        return res.status(500).json({message: 'An error occurred while adding the feature'});
    }
}

export const mostfourPlayed = async (req, res) => {

    const topSongs = await prisma.history.groupBy({
        by: ['song_id'],
        _count: {
            song_id: true,
        },
        orderBy: {
            _count: {
                song_id: 'desc',
            },
        },
        take: 4,
    });

    console.log(topSongs)

    if (topSongs.length === 0) {
        return res.status(404).json({message: 'No songs found'});
    }



    const songDetails = await prisma.song.findMany({
        where: {
            id: {
                in: topSongs.map((song) => song.song_id)
            },
        },
        select: {
            title: true,
            slug: true,
            coverURL: true,
            artist: {
                select: {
                    name: true,
                    slug: true,
                    avatarURL: true,
                }
            },
            album: {
                select: {
                    title: true,
                    slug: true,
                    coverURL: true,
                }
            }
        }
    })

    return res.status(200).json(songDetails);
}