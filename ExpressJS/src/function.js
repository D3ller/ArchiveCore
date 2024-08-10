import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient();

export const findUserById = async (id) => {
    return prisma.account.findUnique({
        where: {
            id: id,
        },
    });
}

export const findSongById = async (id) => {
    return prisma.song.findUnique({
        where: {
            id: id,
        },
    });
}

export const findSongBySlug = async (slug) => {
    return prisma.song.findUnique({
        where: {
            slug: slug,
        },
    });
}