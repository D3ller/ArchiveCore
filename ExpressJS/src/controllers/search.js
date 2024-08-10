import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export const searchSongAlbumArtist = async (req, res) => {
    const {search} = req.params;
    if (!search) {
        return res.status(400).json({error: 'Search query is required'});
    }

    const songs = await prisma.song.findMany({
        // take: 20,
        where: {
            OR: [
                {
                    title: {
                        contains: search.toString(),
                        mode: 'insensitive',
                    },
                },
                {
                    Featurings: {
                        some: {
                            artist: {
                                name: {
                                    contains: search.toString(),
                                    mode: 'insensitive',
                                },
                            },
                        },
                    },
                },
                {
                    album: {
                        title: {
                            contains: search.toString(),
                            mode: 'insensitive',
                        },
                    },
                },
                {
                    artist: {
                        name: {
                            contains: search.toString(),
                            mode: 'insensitive',
                        },
                    },
                },
            ],
        },
        include: {
            album: true,
            artist: true,
            Featurings: {
                select: {
                    artist: true,
                },
            },
        },
    });
    const artists = await prisma.artist.findMany({
        take: 4,
        where: {
            name: {
                contains: search.toString(),
                mode: 'insensitive',
            },
            Album: {
                some: {
                    title: {
                        contains: search.toString(),
                        mode: 'insensitive',
                    },
                    songs: {
                        some: {
                            title: {
                                contains: search.toString(),
                                mode: 'insensitive',
                            },
                        },
                    },
                },
            },
        },
    });

    return res.json({songs, artists});
};