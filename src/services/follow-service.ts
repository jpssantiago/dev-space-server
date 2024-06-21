import { prisma } from "./prisma-service"

export async function toggleFollow(followingId: string, followedId: string) {
    try {
        const found = await prisma.follow.findFirst({ 
            where: { followingId, followedId } 
        })

        if (found) {
            return await prisma.follow.delete({ 
                where: { id: found.id },
                include: {
                    followed: {
                        select: {
                            id: true
                        }
                    }
                }
            })
        } else {
            return await prisma.follow.create({
                data: {
                    followingId,
                    followedId
                },
                include: {
                    followed: {
                        select: {
                            id: true
                        }
                    }
                }
            })
        }
    } catch { }
}