import { prisma } from '@/config'

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const postId = +req.query.idPost
		const userId = req.body.userId

		const { id } = await prisma.like.create({
			data: {
				id_post: postId,
				id_user: userId,
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

		return res.status(201).json({ ok: true, post, likeId: id })
	}
	if (req.method === 'DELETE') {
		const postId = +req.query.idPost
		const userId = req.query.userId

		await prisma.like.delete({
			where: {
				id_post_id_user: {
					id_post: postId,
					id_user: userId,
				},
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

		res.status(201).json({ ok: true, post })
	}
}
