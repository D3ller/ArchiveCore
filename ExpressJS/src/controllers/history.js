import {findSongBySlug, findUserById} from '../function.js';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export const addToHistory = async (req, res) => {
    try {
        let { songId } = req.body;
        let listeningId = req.session.listening;
        console.log(listeningId + " id");

        if (!listeningId) return res.status(400).json({ message: 'Listening not started' });

        console.log(songId + " id");

        const listening = await prisma.startListening.findUnique({
            where: {
                id: listeningId,
            }
        });

        if (!listening) return res.status(404).json({ message: 'Listening not found' });

        console.log(listening);

        if (!req.session.userId) {
            return res.status(401).json({ message: 'User is not logged in' });
        }

        const user = await findUserById(req.session.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const song = await prisma.song.findUnique({
            where: {
                id: listening.song_id
            }
        });

        if (!song) return res.status(404).json({ message: 'Song not found' });

        if (listening.date) {
            let date = new Date();
            let diff = date - listening.date;

            if (diff < song.duration * 0.75) {
                return res.status(400).json({ message: 'Not enough time listened' });
            }
        }

        const history = await prisma.history.create({
            data: {
                account: {
                    connect: {
                        id: req.session.userId
                    }
                },
                song: {
                    connect: {
                        id: listening.song_id
                    }
                }
            }
        });

        if (!history) return res.status(500).json({ message: 'Not added to history' });

        res.status(200).json({ message: 'Added to history' });

    } catch (error) {
        console.log(error);
        if (error.status === 401 && error.message === 'User is not logged in') {
            console.log('didn\'t work');
        }
        res.status(500).json({ message: 'Not added to history' });
    }
};

export const getHistory = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ message: 'User is not logged in' });
        }

        const user = await findUserById(req.session.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const history = await prisma.startListening.findMany({
            where: {
                account_id: req.session.userId
            },
            orderBy: {
                date: 'desc'
            },
            include: {
                song: {
                    select: {
                        title: true,
                        slug: true,
                        coverURL: true,
                        duration: true,
                        album: {
                            select: {
                                title: true,
                                slug: true,
                                coverURL: true
                            }
                        },
                        Featurings: {
                            select: {
                                artist: {
                                    select: {
                                        name: true,
                                        slug: true,
                                        avatarURL: true
                                    }
                                }
                            }
                        },
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

        if (!history) return res.status(404).json({ message: 'History not found' });

        res.status(200).json(history);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'History not found' });
    }
};

export const startListening = async (req, res) => {
    try {
        let {songId} = req.body;

        if (!req.session.userId) {
            return res.status(401).json({message: 'User is not logged in'});
        }

        const user = await findUserById(req.session.userId);
        if (!user) return res.status(404).json({message: 'User not found'});

        if (!songId) return res.status(400).json({message: 'Song id is required'});
        const song = await findSongBySlug(songId);
        if (!song) return res.status(404).json({message: 'Song not found'});

        const listening = await prisma.startListening.create({
            data: {
                account: {
                    connect: {
                        id: req.session.userId
                    }
                },
                song: {
                    connect: {
                        id: song.id
                    }
                }
            }
        });

        if (!listening) return res.status(500).json({message: 'Not added to listening'});

        console.log(listening.id);

        req.session.listening = listening.id;

        res.status(200).json({message: 'Added to listening'});

    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Not added to listening'});

    }
}