import { prisma } from "./prisma-service"

export async function getUserByUsername(username: string) {
    try {
        return await prisma.user.findUnique({ 
            where: { username },
        })
    } catch {}
}

export async function createUser(email: string, username: string, hash: string, name: string) {
    try {
        return await prisma.user.create({
            data: {
                email,
                username,
                password: hash,
                name
            }
        })
    } catch {}
}

export async function getUserById(id: string) {
    try {
        return await prisma.user.findUniqueOrThrow({
            where: { id },
            include: {
                notifications: true,
                followers: {
                    select: {
                        following: {
                            select: {
                                id: true
                            }
                        }
                    }
                },
                following: {
                    select: {
                        followed: {
                            select: {
                                id: true
                            }
                        }
                    }
                }
            },
        })
    } catch {}
}