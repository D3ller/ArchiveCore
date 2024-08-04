import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();
import crypto from 'crypto';

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
                    artist: {
                        select: {
                            name: true,
                            slug: true,
                            avatarURL: true
                        }
                    },
                    album: {
                      select: {
                          slug: true,
                      }
                    },
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
            Album: {
                take: 4,
                orderBy: {
                    created_at: 'desc'
                },
                select: {
                    title: true,
                    coverURL: true,
                    slug: true,
                }
            }
        }
    });


    if (!artist) {
        return res.status(404).json({error: 'Artist not found'});
    }

    if (req.session.loggedin) {
        if (req.session.userId) {
            const subscribe = await prisma.subscription.findFirst({
                where: {
                    artist_id: artist.id,
                    account_id: req.session.userId
                }
            });

            artist.subscribed = !!subscribe;
        }
    }

    artist.recentSongs = await prisma.song.findMany({
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
            duration: true,
            album: {
                select: {
                    slug: true
                }
            }
        }
    });

    artist.feat = await prisma.featurings.findMany({
        where: {
            artist_id: artist.id
        },
        take: 4,
        select: {
            song: {
                select: {
                    title: true,
                    coverURL: true,
                    slug: true,
                    duration: true,
                    artist: {
                        select: {
                            name: true,
                            slug: true,
                            avatarURL: true
                        }
                    }
                }
            }
        }
    });

    return res.status(200).json(artist);
}

export const addArtist = async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({error: 'Unauthorized'});
    }

    if (req.session.userId !== 16) {
        return res.status(403).json({error: 'Forbidden'});
    }

    const {name, avatarURL} = req.body;

    const slug = crypto.randomBytes(60).toString('base64').slice(0, 60).replace(/\+/g, '0').replace(/\//g, '0')
    const artist = await prisma.artist.create({
        data: {
            name,
            avatarURL,
            slug
        }
    });

    if (!artist) {
        return res.status(500).json({error: 'Failed to create artist'});
    }

    return res.status(201).json(artist);
}