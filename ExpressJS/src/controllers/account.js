import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export const getAccount = async (req, res) => {
    let userId = req.session.userId;
    if (!userId) {
        req.session.destroy();
        return res.status(401).json({message: 'User is not logged in'});
    }
    let user = await prisma.account.findFirst({
        where: {
            id: userId
        },
        select: {
            id: false,
            username: true,
            avatarURL: true,
            email: false,
            creation_date: false,
            password: false,
            bio: true,
            bannerURL: true,
        }
    });
    return res.status(200).json({message: 'User found', user});
}