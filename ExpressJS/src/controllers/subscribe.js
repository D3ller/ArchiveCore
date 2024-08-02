import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export const toggleSubscription = async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({message: 'User is not logged in'});
    }

    const {artistid} = req.body;

    if(!artistid) {
        return res.status(400).json({message: 'Artist id is required'});
    }

    const artist = await prisma.artist.findUnique({
        where: {
            slug: artistid
        }
    });

    if(!artist) {
        return res.status(404).json({message: 'Artist not found'});
    }

    const subscription = await prisma.subscription.findFirst({
        where: {
            artist_id: artist.id,
            account_id: req.session.userId
        }
    });

    if(subscription) {
        await prisma.subscription.delete({
            where: {
                id: subscription.id
            }
        });
    } else {
        await prisma.subscription.create({
            data: {
                artist_id: artist.id,
                account_id: req.session.userId
            }
        });
    }

    return res.status(200).json({subscribed: !subscription, message: 'Subscription toggled'});
}