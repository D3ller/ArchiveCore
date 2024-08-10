import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export const getFriends = async (req, res) => {
    try {

        if(!req.session.userId) {
            return res.status(401).json({message: 'User is not logged in'});
        }

        const friends = await prisma.friends.findMany({
            where: {
                OR: [
                    { requesterId: req.session.userId },
                    { accepterId: req.session.userId }
                ],
                status: "accepted"
            },
            include: {
                requester: {
                    select: {
                        username: true,
                        avatarURL: true
                    }
                },
                accepter: {
                    select: {
                        username: true,
                        avatarURL: true
                    }
                }
            }
        });

        const pendingRequests = await prisma.friends.findMany({
            where: {
                accepterId: req.session.userId,
                status: "pending"
            },
            include: {
                requester: {
                    select: {
                        username: true,
                        avatarURL: true
                    }
                }
            }
        });

        return res.status(200).json({friends: friends, pending: pendingRequests});
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: 'An error occurred while fetching the friends'});
    }
}

export const addFriend = async (req, res) => {

    if(!req.session.userId) {
        return res.status(401).json({message: 'User is not logged in'});
    }

    const {username} = req.body;

    const getUserByEmailorUsername = await prisma.account.findFirst({
        where: {
            OR: [
                { email: username },
                { username: username }
            ]
        }
    });

    if(!getUserByEmailorUsername) {
        return res.status(404).json({message: 'User not found'});
    }

    if(getUserByEmailorUsername.id === req.session.userId) {
        return res.status(400).json({message: 'You cannot send a friend request to yourself'});
    }

    const friendRequest = await prisma.friends.findFirst({
        where: {
            OR: [
                {
                    requesterId: req.session.userId,
                    accepterId: getUserByEmailorUsername.id
                },
                {
                    requesterId: getUserByEmailorUsername.id,
                    accepterId: req.session.userId
                }
            ]
        }
    });

    if(friendRequest) {
        return res.status(400).json({message: 'Friend request already sent'});
    }

    await prisma.friends.create({
        data: {
            requesterId: req.session.userId,
            accepterId: getUserByEmailorUsername.id
        }
    });

    return res.status(200).json({message: 'Friend request sent', userId: req.session.userId});

}

export const acceptFriend = async (req, res) => {

        if(!req.session.userId) {
            return res.status(401).json({message: 'User is not logged in'});
        }

        const {userId} = req.body;

        const friendRequest = await prisma.friends.findFirst({
            where: {
                requesterId: userId,
                accepterId: req.session.userId
            }
        });

        if(!friendRequest) {
            return res.status(404).json({message: 'Friend request not found'});
        }

        await prisma.friends.update({
            where: {
                id: friendRequest.id
            },
            data: {
                status: 'accepted'
            }
        });

        return res.status(200).json({message: 'Friend request accepted'});
}