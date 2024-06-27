import { ActivityType } from "@prisma/client"
import { prisma } from "./prisma-service"

export async function getActivities(userId: string) {
    try {
        return await prisma.activity.findMany({
            where: {
                userId
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                        avatar: true
                    }
                },
                post: {
                    select: {
                        id: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        })
    } catch {}
}

export async function createOrDeleteActivity(userId: string, type: ActivityType, senderId?: string, postId?: string) {
    try {
        const found = await prisma.activity.findFirst({
            where: {
                userId,
                type,
                senderId,
                postId
            }
        })

        if (found) {
            return await prisma.activity.delete({
                where: {
                    id: found.id
                }
            })
        } else {
            return await prisma.activity.create({
                data: {
                    userId,
                    type,
                    senderId,
                    postId
                },
                include: {
                    sender: {
                        select: {
                            id: true
                        }
                    }
                }
            })
        }
    } catch {}
}