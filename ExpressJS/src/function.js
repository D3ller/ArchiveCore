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

export const getCurrentPendingRequests = async (userId) => {
    return prisma.friends.findMany({
        where: {
            accepterId: userId,
            status: 'pending',
        },
    });
}

export const findUserByUsernameOrEmail = async (username) => {
    return prisma.account.findFirst({
        where: {
            OR: [
                { email: username },
                { username: username },
            ],
        },
    });
}

export const getFriendsByUserId = async (userId) => {
    return prisma.friends.findMany({
        where: {
            OR: [
                { requesterId: userId },
                { accepterId: userId },
            ],
            status: 'accepted',
        },
        include: {
            requester: {
                select: {
                    username: true,
                    avatarURL: true,
                },
            },
            accepter: {
                select: {
                    username: true,
                    avatarURL: true,
                },
            },
        },
    });
}