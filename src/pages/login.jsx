import text_logo from '../../public/assets/text-logo.svg'
import { Loader } from '@/components'
import { useSessionStore } from '@/store'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { toast } from 'react-hot-toast'

export default function Login() {
	const [isLoading, setLoading] = useState(false)

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const router = useRouter()
	const session = useSessionStore(state => ({
		setUser: state.setUser,
	}))

	const onSubmit = async event => {
		event.preventDefault()
		setLoading(true)
		try {
			const { data } = await axios.post('/api/users/login', { email, password })
			session.setUser(data.user)
			router.push('/')
		} catch (error) {
			toast.error(error.response.data.message)
			setLoading(false)
		}
	}
	return (
		<main className="h-screen flex items-center justify-center">
			<div className="border w-form rounded-xl flex flex-col items-center h-box border-zinc-700 px-6">
				<Image src={text_logo} alt="text instagram logo" width={160} />
				<form
					className="flex flex-col w-full gap-3 text-center"
					onSubmit={onSubmit}
				>
					<input
						type="email"
						onChange={({ target }) => setEmail(target.value)}
						className="input"
						placeholder="Correo Electrónico"
					/>
					<input
						type="password"
						onChange={({ target }) => setPassword(target.value)}
						className="input"
						placeholder="Contraseña"
					/>
					<button
						disabled={!email || !password}
						type="submit"
						className="button-light h-12 mt-4 w-full disabled:cursor-not-allowed disabled:hover:bg-opacity-100 flex gap-x-2 items-center justify-center"
					>
						<span>Entrar</span>
						{isLoading && <Loader />}
					</button>
				</form>
				<hr className="m-6 w-full border-zinc-700" />
				<p className="text-zinc-400 text-sm">
					<span>¿No tienes una cuenta? </span>
					<Link href="/register" className="text-main-accent hover:underline">
						Regístrate
					</Link>
				</p>
			</div>
		</main>
	)
}

export async function getServerSideProps(ctx) {
	const token = ctx.req.cookies['token']
	if (token)
		return {
			redirect: {
				destination: '/',
				permanent: true,
			},
		}
	return {
		props: {},
	}
}
