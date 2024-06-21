import { prisma } from "./prisma-service"

export async function getAllPosts() {
    try {
        return await prisma.post.findMany({
            where: { parentPost: null },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                        avatar: true,
                        followers: true,
                        following: true
                    },
                },
                likes: true,
                replies: true,
            },
            orderBy: {
                createdAt: "desc"
            },
        })
    } catch {}
}

export async function getPostById(postId: string) {
    try {
        return await prisma.post.findUnique({ where: { id: postId } })
    } catch {}
}

export async function addPost(authorId: string, text?: string, files?: string[]) {
    try {
        return await prisma.post.create({
            data: {
                authorId,
                text,
                files
            }
        })
    } catch {}
}

export async function addReply(authorId: string, postId: string, text?: string, files?: string[]) {
    try {
        return await prisma.post.create({
            data: {
                text,
                files,
                authorId,
                parentPostId: postId
            }
        })
    } catch {}
}

export async function deletePost(postId: string) {
    try {
        return await prisma.post.delete({ where: { id: postId } })
    } catch {}
}