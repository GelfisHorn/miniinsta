import { prisma, mailer } from '@/config'
import { createToken } from '@/utils'
import { hash } from 'bcrypt'

export default async function handler(req, res) {
	if (req.method === 'GET') {
		//gets user id from query
		const { id } = req.query
		const user = await prisma.user.findFirst({
			where: { id },
		})
		res.status(200).json({ user })
	}

	if (req.method === 'POST') {
		//creates user
		const registerData = { ...req.body }
		registerData.password = await hash(registerData.password, 10)
		const createdUser = await prisma.user.create({ data: registerData })

		const registerToken = createToken(createdUser.id)

		const verifyTokenURL =
			process.env.NODE_ENV !== 'production'
				? `http://localhost:3000/api/users/validate/${registerToken}`
				: `${process.env.NEXT_PUBLIC_DEPLOY_URL}/api/users/validate/${registerToken}`

		const html = `
  <div style="background-color: #f2f2f2; padding: 20px;">
    <h1 style="color: #333333;">¡Bienvenido a Instaclone!</h1>
    <p style="font-size: 16px; color: #666666;">Estamos emocionados de que te hayas unido a nuestra comunidad. Para activar tu cuenta, haz clic en el siguiente enlace:</p>
    <a href="${verifyTokenURL}" target="_blank" style="background-color: #ca38a5; color: #FFFFFF; padding: 12px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">Verificar cuenta</a>
  </div>
`
		await mailer.sendMail({
			from: 'Instagram clone <samuel.rnn31@gmail.com>',
			to: createdUser.email,
			subject: 'Verifica tu cuenta',
			html,
		})
		res.status(201).json({ status: 'ok' })
	}
}
