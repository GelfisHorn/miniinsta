import { prisma } from '@/config'
import { verifyToken } from '@/utils'

export default async function handler(req, res) {
	if (req.method === 'GET') {
		const { registerCode } = req.query
		const decodedToken = verifyToken(registerCode)

		if (!decodedToken) {
			return res.status(400).json({ error: 'Código inválido' })
		}

		await prisma.user.update({
			where: {
				id: decodedToken.id,
			},
			data: {
				active: true,
			},
		})

		res.status(200).redirect('/login')
		//TODO: authenticates the user and redirects to home
	}
}
