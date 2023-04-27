import { prisma } from '@/config'

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const postId = +req.query.idPost
		const userId = req.body.userId
		const content = req.body.content

		await prisma.comment.create({
			data: {
				id_post: postId,
				id_user: userId,
				content,
			},
		})
		const post = await prisma.post.findUnique({
			where: { id: postId },
			select: {
				id: true,
				image: true,
				text: true,
				author: {
					select: {
						id: true,
						avatar: true,
						user_name: true,
					},
				},
				liked_by: {
					select: {
						id_user: true,
					},
				},
				comments: {
					orderBy: {
						created_at: 'desc',
					},
					select: {
						id: true,
						id_user: true,
						author: true,
						content: true,
					},
				},
			},
		})

		return res.status(201).json({ ok: true, post })
	}
	if (req.method === 'DELETE') {
		const commentId = +req.query.commentId
		const postId = +req.query.idPost

		await prisma.comment.delete({
			where: {
				id: commentId,
			},
		})
		const post = await prisma.post.findUnique({
			where: { id: postId },
			select: {
				id: true,
				image: true,
				text: true,
				author: {
					select: {
						id: true,
						avatar: true,
						user_name: true,
					},
				},
				liked_by: {
					select: {
						id_user: true,
					},
				},
				comments: {
					orderBy: {
						created_at: 'desc',
					},
					select: {
						id: true,
						id_user: true,
						author: true,
						content: true,
					},
				},
			},
		})
		return res.status(200).json({ ok: true, post })
	}
}
