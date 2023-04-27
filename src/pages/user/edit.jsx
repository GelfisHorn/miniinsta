import { Layout, Loader } from '@/components'
import { prisma } from '@/config'
import { uploadImage, verifyToken } from '@/utils'
import axios from 'axios'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { IoMdArrowRoundBack } from 'react-icons/io'

export default function Edit({ user }) {
	const router = useRouter()
	const [form, setForm] = useState({ ...user })
	const [hasChanged, setChanged] = useState(false)
	const [imagePreview, setImagePreview] = useState(user.avatar)
	const [isLoading, setLoading] = useState(false)
	const back = () => router.back()
	const onSubmit = async event => {
		event.preventDefault()

		try {
			setLoading(true)
			let newPost = { ...form }
			if (form.avatar !== user.avatar) {
				const cdnURL = await uploadImage(form.avatar)
				newPost = { ...form, avatar: cdnURL }
			}

			const { data } = await axios.put('/api/users/profile', newPost)
			if (data.ok) {
				toast.success('Información actualizada correctamente')
			}
			setLoading(false)
			setTimeout(() => {
				location.href = '/user/' + user.id
			}, 500)
		} catch (error) {
			toast.error(error.response.data.message)
			setLoading(false)
		}
	}
	const onImageChange = event => {
		setChanged(true)
		setForm(state => ({ ...state, avatar: event.target.files[0] }))
		setImagePreview(URL.createObjectURL(event.target.files[0]))
	}
	const onTextChange = event => {
		if (
			event.target.name !== 'password' &&
			event.target.name !== 'confirm_password'
		) {
			setChanged(true)
		}
		setForm(state => ({ ...state, [event.target.name]: event.target.value }))
	}
	return (
		<Layout>
			<div className="w-box mx-auto border rounded-lg border-zinc-700 min-h-screen">
				<p className="text-center py-2 border-b border-zinc-700">
					Editar mis datos
				</p>
				<form className="py-6 px-4 flex flex-col gap-4" onSubmit={onSubmit}>
					<div className="flex gap-x-4 items-center">
						<Image
							src={imagePreview}
							alt="profile picture preview"
							width={120}
							height={120}
							className="object-cover object-center rounded-full aspect-square"
						/>
						<label className="button py-3 px-2 cursor-pointer">
							<input
								type="file"
								accept="image/*"
								onChange={onImageChange}
								hidden
							/>
							<span>Change Image</span>
						</label>
					</div>

					<label>
						<p className="mb-2 text-zinc-400 text-sm">Nombre de usuario</p>
						<input
							type="text"
							name="user_name"
							value={form.user_name}
							onChange={onTextChange}
							className="input w-full"
						/>
					</label>
					<label>
						<p className="mb-2 text-zinc-400 text-sm">Email</p>
						<input
							type="email"
							name="email"
							value={form.email}
							onChange={onTextChange}
							className="input w-full"
						/>
					</label>
					<label>
						<p className="mb-2 text-zinc-400 text-sm">Descripción</p>
						<textarea
							type="text"
							name="about_me"
							value={form.about_me}
							onChange={onTextChange}
							className="input w-full h-40 resize-none"
						/>
					</label>
					<div className="grid grid-cols-2 mt-4 gap-4">
						<button
							type="button"
							className="button h-12 flex items-center justify-center"
							onClick={() => router.back()}
						>
							<IoMdArrowRoundBack className="translate-y-[1px] mr-1" />
							<span>Volver</span>
						</button>
						<button
							disabled={!hasChanged || isLoading}
							type="submit"
							className="button-light py-3 w-full disabled:cursor-not-allowed disabled:hover:bg-opacity-100 flex gap-x-2 items-center justify-center"
						>
							<span>Actualizar</span>
							{isLoading && <Loader />}
						</button>
					</div>
				</form>
			</div>
		</Layout>
	)
}

export async function getServerSideProps(ctx) {
	const token = ctx.req.cookies['token']

	if (!token) {
		return {
			redirect: {
				destination: '/',
				permanent: true,
			},
		}
	}
	const verifiedToken = verifyToken(token)

	const user = await prisma.user.findUnique({
		where: { id: verifiedToken.id },
		select: {
			id: true,
			about_me: true,
			avatar: true,
			email: true,
			user_name: true,
		},
	})

	return {
		props: { user },
	}
}
