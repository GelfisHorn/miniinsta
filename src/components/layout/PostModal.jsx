import { Loader } from '@/components'
import { IoMdClose } from 'react-icons/io'
import { uploadImage } from '@/utils'
import { useSessionStore } from '@/store'
import Image from 'next/image'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function PostModal({ closeCreateModal }) {
	const user = useSessionStore(state => state.user)
	const [image, setImage] = useState(null)
	const [text, setText] = useState('')
	const [imagePreview, setImagePreview] = useState(null)

	const [isLoading, setLoading] = useState(false)

	const onImageChange = event => {
		setImage(event.target.files[0])
		setImagePreview(URL.createObjectURL(event.target.files[0]))
	}
	const onTextChange = event => {
		setText(event.target.value)
	}
	const onSubmit = async event => {
		event.preventDefault()
		try {
			setLoading(true)
			const cdnURL = await uploadImage(image)
			const newPost = { image: cdnURL, id_user: user.id }
			if (text) {
				newPost.text = text
			}
			const { data } = await axios.post('/api/posts', newPost)
			toast.success(data.message)
			closeCreateModal()
		} catch (error) {
			toast.error(error.response.data.message)
			setLoading(false)
		}
	}

	useEffect(() => {
		document.body.style.overflowY = 'hidden'
		return () => {
			document.body.style.overflowY = 'auto'
		}
	}, [])

	return (
		<motion.div
			initial={{ opacity: 0 }}
			whileInView={{ opacity: 1 }}
			transition={{ duration: 0.1 }}
			className="fixed z-40 h-screen w-full top-0 left-0 bg-black/50 flex items-center backdrop-blur-sm"
		>
			<motion.div
				initial={{ scale: 0.9, y: 40 }}
				whileInView={{ scale: 1, y: 0 }}
				transition={{ duration: 0.2, type: 'spring', bounce: 0 }}
				className="mx-auto flex flex-col items-center bg-main-black pt-0 border rounded-md border-zinc-700 h-fit"
			>
				<div className="mb-4 text-center py-2 border-b border-zinc-700 w-full relative">
					<button className="absolute right-2 top-3" onClick={closeCreateModal}>
						<IoMdClose className="text-xl text-zinc-200" />
					</button>
					<p>Agrega una publicación</p>
				</div>
				<form onSubmit={onSubmit} className="flex flex-wrap w-full gap-4 p-4">
					<label
						className="cursor-pointer rounded-lg border border-zinc-700 aspect-square overflow-hidden w-[280px] mx-auto relative grid place-content-center hover:bg-main-black-accent"
						title="subir imagen"
					>
						<input
							type="file"
							onChange={onImageChange}
							accept="image/*"
							hidden
						/>
						{imagePreview ? (
							<Image
								src={imagePreview}
								alt="image preview"
								height={280}
								width={280}
								className="object-cover h-[280px] w-[280px]"
							/>
						) : (
							<p className="text-zinc-500">Agregar una imagen</p>
						)}
					</label>
					<div className=" w-[280px] mx-auto flex flex-col justify-between">
						<textarea
							onChange={onTextChange}
							name="text"
							className="bg-transparent outline-none h-32 resize-none px-2 py-1 text-sm"
							placeholder="Agrega una descripción (opcional)"
							maxLength={300}
						/>
						<button
							disabled={!image || isLoading}
							type="submit"
							className="button py-3 w-full disabled:cursor-not-allowed disabled:hover:bg-opacity-100 flex gap-x-2 items-center justify-center"
						>
							<span>Crear</span>
							{isLoading && <Loader />}
						</button>
					</div>
				</form>
			</motion.div>
		</motion.div>
	)
}
