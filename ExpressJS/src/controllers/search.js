import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export const searchSongAlbumArtist = async (req, res) => {
  const {search} = req.params;
  if (!search) {
    return res.status(400).json({error: 'Search query is required'});
  }

  const songs = await prisma.song.findMany({
    where: {
      OR: [
        {
          title: {
            contains: search.toString(),
            mode: 'insensitive',
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
    },
  });

  return res.json(songs);
};