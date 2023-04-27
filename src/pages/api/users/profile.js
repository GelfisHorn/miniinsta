import { prisma } from '@/config'
import { verifyToken } from '@/utils'

export default async function handler(req, res) {
	if (req.method === 'PUT') {
		if (!req.cookies.token) {
			return res.status(401).json({ message: 'No autenticado' })
		}
		const verifiedToken = verifyToken(req.cookies.token)
		if (!verifiedToken) {
			return res.status(401).json({ message: 'No autenticado' })
		}

		const data = req.body
		const user = await prisma.user.findFirst({
			where: { id: data.id },
		})

		const changes = {}

		for (let key in data) {
			if (data[key] !== user[key]) {
				changes[key] = data[key]
			}
		}
		if (changes.user_name) {
			const foundUser = await prisma.user.findUnique({
				where: {
					user_name: changes.user_name,
				},
			})
			if (foundUser) {
				return res.status(400).json({
					message: 'Nombre de usuario en uso',
				})
			}
		}
		if (changes.email) {
			const foundUser = await prisma.user.findUnique({
				where: {
					email: changes.email,
				},
			})
			if (foundUser) {
				return res.status(400).json({
					message: 'Email ya asociado a otra cuenta',
				})
			}
		}
		await prisma.user.update({
			where: { id: user.id },
			data: changes,
		})
		return res.status(200).json({ ok: true })
	}
}
