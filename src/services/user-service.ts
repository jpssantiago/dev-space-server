import { prisma } from "./prisma-service"

export async function getUserByEmailOrUsername(emailOrUsername: string) {
    try {
        const where = emailOrUsername.includes("@") ? { email: emailOrUsername } : { username: emailOrUsername }

        return await prisma.user.findUnique({ 
            where: where,
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
                },
                activities: {
                    select: {
                        id: true,
                        hasBeenRead: true
                    }
                }
            },
        })
    } catch {}
}

export async function getUserProfile(username: string) {
    try {
        return await prisma.user.findUniqueOrThrow({
            where: { username: username },
            select: {
                id: true,
                username: true,
                name: true,
                avatar: true,
                description: true,
                followers: {
                    include: {
                        following: {
                            select: {
                                id: true
                            }
                        }
                    }
                },
                posts: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                username: true,
                                name: true,
                                avatar: true,
                                description: true,
                                followers: {
                                    select: {
                                        followingId: true
                                    }
                                }
                            },
                        },
                        likes: {
                            include: {
                                user: {
                                    select: {
                                        id: true
                                    }
                                }
                            }
                        },
                        replies: true,
                    },
                    orderBy: {
                        createdAt: "desc"
                    }
                }
            },
        })
    } catch {}
}

export async function editUser(userId: string, username: string, name: string, description?: string, avatar?: string) {
    try {
        return await prisma.user.update({
            where: { id: userId },
            data: {
                username,
                name,
                description,
                avatar
            }
        })
    } catch {}
}