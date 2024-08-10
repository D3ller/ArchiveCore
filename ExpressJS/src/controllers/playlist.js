import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient();
import crypto from 'crypto';


export const createPlaylist = async (req, res) => {
    try {
        if(!req.session.userId) {
            return res.status(401).json({message: 'User is not logged in'});
        }

        let slugs = crypto.randomBytes(60).toString('base64').slice(0, 60).replace(/\+/g, '0').replace(/\//g, '0')
        let playlist = await prisma.playlist.create({
            data: {
                account: {
                    connect: {
                        id: req.session.userId
                    }
                },
                title: "New Playlist",
                coverURL: "/file/playlist/default.png",
                slug: slugs,
                description: "New Playlist",

            }
        });

        console.log(playlist);

        if(!playlist) return res.status(400).json({message: 'Playlist not created', slug: slugs});

        return res.status(201).json(playlist);

    } catch (err) {
        console.log(err);
        return res.status(500).json({message: 'Internal Server Error'});
    }
}

export const getPlaylist = async (req, res) => {
    try {
        let playlist = await prisma.playlist.findUnique({
            where: {
                slug: req.params.slug
            },
            select: {
                title: true,
                description: true,
                coverURL: true,
                privacy: true,
                slug: true,
                account_id: true,
                account: {
                    select: {
                        username: true,
                        avatarURL: true,
                    }
                },
                songs: {
                    select: {
                        song: {
                            select: {
                                title: true,
                                duration: true,
                                coverURL: true,
                                slug: true,
                                artist: {
                                    select: {
                                        name: true,
                                        avatarURL: true,
                                        slug: true
                                    }
                                },
                                Featurings: {
                                    select: {
                                        artist: {
                                            select: {
                                                name: true,
                                                avatarURL: true,
                                                slug: true
                                            }
                                        }
                                    }
                                },
                                album: {
                                    select: {
                                        title: true,
                                        coverURL: true,
                                        slug: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if(!playlist) return res.status(404).json({message: 'Playlist not found'});

        if(!playlist.privacy) {
            if(!req.session.userId) {
                return res.status(403).json({message: 'Playlist is private'});
            }

            if(playlist.account_id !== req.session.userId) {
                return res.status(403).json({message: 'Playlist is private'});
            }

            return res.status(200).json(playlist);
        }


        return res.status(200).json(playlist);

    } catch (err) {
        console.log(err);
        return res.status(500).json({message: 'Internal Server Error'});
    }
}

export const getUserPlaylists = async (req, res) => {

    try {

        if(!req.session.userId) {
            return res.status(401).json({message: 'User is not logged in'});
        }


        let playlists = await prisma.playlist.findMany({
            where: {
                account_id: req.session.userId
            },
            select: {
                title: true,
                coverURL: true,
                privacy: true,
                slug: true,
            }
        });

        console.log(playlists);

        if(!playlists) return res.status(404).json({message: 'Playlists not found'});

        return res.status(200).json(playlists);

    } catch (err) {
        console.log(err);
        return res.status(500).json({message: 'Internal Server Error'});
    }

}

export const addSongToPlaylist = async (req, res) => {
    const {playlistSlug, SongSlug} = req.body

    try {
        if(!req.session.userId) {
            return res.status(401).json({message: 'User is not logged in'});
        }

        let playlist = await prisma.playlist.findUnique({
            where: {
                slug: playlistSlug
            }
        });

        if(!playlist) return res.status(404).json({message: 'Playlist not found'});

        let song = await prisma.song.findUnique({
            where: {
                slug: SongSlug
            }
        });

        if(!song) return res.status(404).json({message: 'Song not found'});

        let playlistSong = await prisma.playlistSong.create({
            data: {
                playlist: {
                    connect: {
                        id: playlist.id
                    }
                },
                song: {
                    connect: {
                        id: song.id
                    }
                }
            }
        });

        if(!playlistSong) return res.status(400).json({message: 'Song not added to playlist'});

        return res.status(201).json(playlistSong);

    } catch (err) {
        console.log(err);
        return res.status(500).json({message: 'Internal Server Error'});
    }
}

export const deleteSongFromPlaylist = async (req, res) => {
    const { playlistSlug, songSlug } = req.body;

    try {
        if (!req.session.userId) {
            return res.status(401).json({ message: 'User is not logged in' });
        }

        if (!playlistSlug || !songSlug) {
            return res.status(400).json({ message: 'Playlist slug and Song slug are required' });
        }

        let playlist = await prisma.playlist.findUnique({
            where: {
                slug: playlistSlug
            }
        });

        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        let song = await prisma.song.findUnique({
            where: {
                slug: songSlug
            }
        });

        if (!song) {
            return res.status(404).json({ message: 'Song not found' });
        }

        let playlistSong = await prisma.playlistSong.findFirst({
            where: {
                playlist_id: playlist.id,
                song_id: song.id
            }
        });

        if (!playlistSong) {
            return res.status(404).json({ message: 'Song not found in playlist' });
        }

        await prisma.playlistSong.delete({
            where: {
                id: playlistSong.id
            }
        });

        return res.status(200).json({ message: 'Song deleted from playlist successfully' });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

