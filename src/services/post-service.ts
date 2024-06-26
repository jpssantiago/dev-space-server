import { prisma } from "./prisma-service"

const defaultInclude = {
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
    likes: true,
    replies: true,
}

export async function getAllPosts() {
    try {
        return await prisma.post.findMany({
            where: { parentPost: null },
            include: {
                ...defaultInclude,
                likes: {
                    select: {
                        user: {
                            select: {
                                id: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            },
        })
    } catch { }
}

export async function getPostById(postId: string) {
    try {
        return await prisma.post.findUnique({
            where: { id: postId },
            include: {
                ...defaultInclude,
                likes: {
                    select: {
                        user: {
                            select: {
                                id: true
                            }
                        }
                    }
                },
                replies: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                username: true,
                                name: true,
                                avatar: true,
                                followers: true,
                                following: true
                            }
                        },
                        likes: {
                            select: {
                                user: {
                                    select: {
                                        id: true
                                    }
                                }
                            }
                        },
                        replies: {
                            include: {
                                author: {
                                    select: {
                                        id: true,
                                        username: true,
                                        name: true,
                                        avatar: true,
                                        followers: true,
                                        following: true
                                    }
                                },
                                likes: {
                                    select: {
                                        user: {
                                            select: {
                                                id: true
                                            }
                                        }
                                    }
                                },
                                replies: true
                            }
                        }
                    }
                }
            }
        })
    } catch { }
}

export async function addPost(authorId: string, text?: string, files?: string[]) {
    try {
        return await prisma.post.create({
            data: {
                authorId,
                text,
                files
            },
            include: defaultInclude,
        })
    } catch { }
}

export async function addReply(authorId: string, postId: string, text?: string, files?: string[]) {
    try {
        return await prisma.post.create({
            data: {
                text,
                files,
                authorId,
                parentPostId: postId
            },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                        avatar: true,
                        followers: true,
                        following: true
                    }
                },
                likes: {
                    select: {
                        user: {
                            select: {
                                id: true
                            }
                        }
                    }
                },
                replies: true
            }
        })
    } catch { }
}

export async function getAllPostReplies(postId: string) {
    try {
        return await prisma.post.findMany({ where: { parentPostId: postId } })
    } catch { }
}

export async function deletePost(postId: string) {
    try {
        return await prisma.post.delete({ where: { id: postId } })
    } catch { }
}