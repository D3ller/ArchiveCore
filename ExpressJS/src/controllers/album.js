import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient();

export const getAlbumBySlug = async (req,res) => {
    const {slug} = req.params;

    try {
        const album = await prisma.album.findUnique({
            where: {
                slug
            },
            select: {
                title: true,
                coverURL: true,
                slug: true,
                artist: {
                    select: {
                        name: true,
                        slug: true,
                        avatarURL: true
                    }
                },
                songs: {
                    select: {
                        title: true,
                        slug: true,
                        duration: true,
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
                        album: {
                            select: {
                                title: true,
                                slug: true
                            }
                        },
                        artist: {
                            select: {
                                name: true,
                                slug: true
                            }
                        }
                    }
                }
            }
        });

        if(!album) {
            return res.status(404).json({error: 'Album not found'});
        }

        return res.status(200).json(album);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: 'Internal server error'});
    }


}
