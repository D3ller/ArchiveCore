import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export const getArtistBySlug = async (req, res) => {
    const {slug} = req.params;
    const artist = await prisma.artist.findUnique({
        where: {
            slug
        },
        select: {
            name: true,
            avatarURL: true,
            id: true,
            songs: {
                take: 5,
                orderBy: {
                    created_at: 'desc'
                },
                select: {
                    title: true,
                    coverURL: true,
                    slug: true,
                    duration: true,

                    history: {
                        where: {
                            date: {
                                gte: new Date(new Date().setDate(new Date().getDate() - 30))
                            }
                        },
                        select: {
                            id: true
                        }
                    }
                }
            },

        }
    });

    if (!artist) {
        return res.status(404).json({error: 'Artist not found'});
    }
    
    const recentSong = await prisma.song.findMany({
        where: {
            artist_id: artist.id
        },
        orderBy: {
            created_at: 'desc'
        },
        take: 4,
        select: {
            title: true,
            coverURL: true,
            slug: true,
            duration: true
        }
    })

    artist.recentSongs = recentSong;

    return res.status(200).json(artist);
}