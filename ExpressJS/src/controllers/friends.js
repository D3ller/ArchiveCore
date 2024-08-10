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

        if(!friends) {
            return res.status(404).json({message: 'No friends found'});
        }

        return res.status(200).json(friends);
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

    res.status(200).json({message: 'Friend request sent'});

}