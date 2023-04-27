import { verifyToken } from '@/utils'
import { serialize } from 'cookie'

export default function handler(req, res) {
	if (req.method === 'POST') {
		const token = req.cookies.token

		if (!token) {
			return res.status(401).json({ message: 'Sin autorización' })
		}

		const tokenData = verifyToken(token)
		if (!tokenData) {
			return res.status(401) - json({ message: 'Token inválido' })
		}
		const serializedToken = serialize('token', null, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 0,
			path: '/',
		})

		res.setHeader('Set-Cookie', serializedToken)
		res.status(200).json({ message: 'Cierre de sesión exitoso' })
	}
}
