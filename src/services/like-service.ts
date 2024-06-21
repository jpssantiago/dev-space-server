import { prisma } from "./prisma-service"

export async function toggleLike(userId: string, postId: string) {
    try {
        const found = await prisma.like.findFirst({ where: { userId, postId } })

        if (found) {
            return await prisma.like.delete({ 
                where: { id: found.id },
                include: {
                    user: {
                        select: {
                            id: true
                        }
                    }
                }
            })
        } else {
            return await prisma.like.create({
                data: {
                    userId,
                    postId
                },
                include: {
                    user: {
                        select: {
                            id: true
                        }
                    }
                }
            })
        }
    } catch { }
}