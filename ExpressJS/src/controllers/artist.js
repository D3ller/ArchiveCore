import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();
import crypto from 'crypto';
const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

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
                          coverURL: true
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
            },
            _count: {
                select: {
                    subscription: true,
                }
            }
        }
    });


    if (!artist) {
        return res.status(404).json({error: 'Artist not found'});
    }

    const listener = await prisma.history.groupBy({
        by: ['account_id'],
        where: {
            date: {
                gte: startOfMonth,
                lte: endOfMonth
            },
            song: {
                artist_id: artist.id
            }
        },
        _count: {
            account_id: true
        }
    });

    artist.listener = listener.length;

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
                    slug: true,
                    coverURL: true
                }
            }
        }
    });

    artist.feat = await prisma.featurings.findMany({
        where: {
            artist_id: artist.id
        },
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
                    },
                    album: {
                        select: {
                            slug: true,
                            coverURL: true
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

    if (req.session.userId !== 2) {
        return res.status(403).json({error: 'Forbidden'});
    }

    let {name, slug} = req.body;

    if (!name) {
        return res.status(400).json({error: 'Name is required'});
    }

    if(!slug) {
        slug = crypto.randomBytes(45).toString('base64').replace(/\+/g, '0').replace(/\//g, '0').substring(0, 60);
    }

    const artist = await prisma.artist.create({
        data: {
            name,
            avatarURL:'/file/artist/'+slug,
            slug
        }
    });

    if (!artist) {
        return res.status(500).json({error: 'Failed to create artist'});
    }

    return res.status(201).json(artist);
}

export const getAllArtists = async (req, res) => {

    if(!req.session.loggedin) {
        return res.status(401).json({error: 'Unauthorized'});
    }

    if(req.session.userId !== 2) {
        return res.status(403).json({error: 'Forbidden'});
    }

    const artists = await prisma.artist.findMany({
        select: {
            name: true,
            id: true,
        },
        orderBy: {
            name: 'asc'
        }
    });

    if(!artists) {
        return res.status(404).json({error: 'No artist found'});
    }

    return res.status(200).json(artists);
}