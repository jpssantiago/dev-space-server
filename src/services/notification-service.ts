import { prisma } from "./prisma-service"

export async function getNotifications(userId: string) {
    try {
        return await prisma.notification.findMany({
            where: { receiverId: userId },
            include: {
                sender: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                        avatar: true
                    }
                }
            }
        })
    } catch {}
}