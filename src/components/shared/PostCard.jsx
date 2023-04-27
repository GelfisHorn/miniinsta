import { Loader } from '@/components'
import { AiFillHeart } from 'react-icons/ai'
import { RiSendPlaneFill } from 'react-icons/ri'
import { MdInsertComment } from 'react-icons/md'
import { useSessionStore } from '@/store'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { motion } from 'framer-motion'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/es'

export default function PostCard({
	post: postInitialData,
	skeleton = false,
	full = false,
}) {
	const [post, setPost] = useState(postInitialData)
	const [isLoading, setLoading] = useState(false)
	const [isLikeLoading, setLikeLoading] = useState(false)
	const user = useSessionStore(state => state.user)
	const [comment, setComment] = useState('')
	const commentRef = useRef(null)
	const router = useRouter()

	dayjs.extend(relativeTime).locale('es')

	//comment handlers
	const addComment = async () => {
		setLoading(true)
		commentRef.current.blur()
		const { data } = await axios.post(`/api/posts/${post.id}/comments`, {
			userId: user.id,
			content: comment,
		})
		if (data.ok) {
			setPost(data.post)
			setComment('')
		}
		setLoading(false)
	}
	const deleteComment = async commentId => {
		const { data } = await axios.delete(`/api/posts/${post.id}/comments`, {
			params: {
				commentId,
			},
		})
		if (data.ok) {
			setPost(data.post)
		}
	}

	//like handlers
	const likeAction = () => {
		const like = post.liked_by.find(currUser => currUser.id_user === user.id)
		if (!user) {
			return toast.error('Inicia sesión antes!')
		}
		setLikeLoading(true)
		if (like) {
			deleteLike()
		} else {
			addLike()
		}
	}
	const addLike = async () => {
		const { data } = await axios.post(`/api/posts/${post.id}/likes`, {
			userId: user.id,
		})
		if (data.ok) {
			setPost(data.post)
		}
		setLikeLoading(false)
	}
	const deleteLike = async () => {
		const { data } = await axios.delete(`/api/posts/${post.id}/likes`, {
			params: {
				userId: user.id,
			},
		})
		if (data.ok) {
			setPost(data.post)
		}
		setLikeLoading(false)
	}

	//clipboard handlers
	const copyPostLink = async url => {
		try {
			await navigator.clipboard.writeText(url)
			toast.success('Enlace del post copiado correctamente al portapapeles', {
				id: 'clipboard',
			})
		} catch (err) {}
	}

	return (
		<div className="w-full flex flex-col">
			<div className="flex items-center py-4 gap-2 text-sm">
				{skeleton ? (
					<div className="w-10 h-10 rounded-full bg-zinc-800 anim-skeleton" />
				) : (
					<Link href={`/user/${post?.author.id}`}>
						<Image
							src={post?.author.avatar}
							alt="profile image"
							width={36}
							height={36}
							className="rounded-full outline outline-2 outline-zinc-700 text-xs grid place-content-center object-cover w-9 h-9"
						/>
					</Link>
				)}
				{skeleton ? (
					<p className="h-4 w-32 bg-zinc-800 rounded-md anim-skeleton"></p>
				) : (
					<>
						<Link href={`/user/${post?.author.id}`}>
							<p>{post?.author.user_name}</p>
						</Link>
						<span className="text-zinc-400">
							{dayjs(post.created_at).fromNow(true)}
						</span>
					</>
				)}
			</div>
			<div
				className={`bg-main-black-accent overflow-hidden outline outline-1 ${
					skeleton ? 'outline-none' : 'outline-zinc-700'
				} aspect-square rounded-md`}
			>
				{skeleton ? (
					<div className="w-full h-full bg-zinc-800 anim-skeleton"></div>
				) : (
					<Link
						href={`/post/${post?.id}`}
						className="h-full flex items-center"
						title="ver post completo"
					>
						<Image
							src={post?.image + '-/scale_crop/700x700/center/'}
							width={500}
							height={500}
							alt={post?.text ?? 'post image'}
							className=" object-cover w-full h-full"
						/>
					</Link>
				)}
			</div>
			<div className="py-3 text-2xl flex justify-between">
				<div className="flex gap-3">
					<div className="flex gap-1">
						<motion.button
							onClick={likeAction}
							whileTap={{
								rotate: -30,
								scale: 0.8,
								transition: { duration: 0.1 },
							}}
						>
							<AiFillHeart
								className={`post-actions ${
									user &&
									post?.liked_by?.find(
										currUser => currUser?.id_user === user.id
									) &&
									'text-red-500'
								}`}
							/>
						</motion.button>
						<span className="text-sm select-none w-3">
							{isLikeLoading ? (
								<div className="mt-0.5">
									<Loader />
								</div>
							) : (
								<span>{post?.liked_by.length ?? 0}</span>
							)}
						</span>
					</div>
					<div className="flex gap-1">
						<Link href={`/post/${post?.id}`} title="ver post completo">
							<MdInsertComment className="post-actions" />
						</Link>
						<span className="text-sm select-none">
							{post?.comments.length ?? 0}
						</span>
					</div>
				</div>
				<motion.button
					whileTap={{
						rotate: -30,
						scale: 0.8,
						transition: { duration: 0.1 },
					}}
					title="copiar enlace del post al portapapeles"
					className="post-actions"
					onClick={() =>
						copyPostLink(window.location.origin + `/post/${post?.id}`)
					}
				>
					<RiSendPlaneFill />
				</motion.button>
			</div>
			{skeleton ? (
				<div className="w-full rounded-md h-14 bg-zinc-800 anim-skeleton"></div>
			) : (
				<p className="text-zinc-400 text-sm">
					<span className="text-zinc-200 font-bold">
						<button>{post?.author.user_name}</button>
					</span>{' '}
					{!full && post?.text && post?.text.slice(0, 100)}
					{post?.text?.length > 100 && '... '}
					{!full && post?.text && post?.text.length > 100 && (
						<Link href={`/post/${post?.id}`} title="ver post completo">
							<button className="hover:underline text-zinc-300">
								Leer más
							</button>
						</Link>
					)}
					{full && <span>{post?.text}</span>}
				</p>
			)}
			<hr className="border-zinc-700 my-4" />
			{full && (
				<div>
					<p>Comentarios ({post?.comments.length})</p>

					<div className="flex flex-col py-3 gap-y-3">
						{post?.comments.map(comment => (
							<div key={comment.id} className="text-sm">
								<p>
									<Link
										href={`/user/${comment.id_user}`}
										className="font-bold hover:underline"
									>
										{comment.author.user_name}
									</Link>
									<span> {comment.content}</span>
									{comment.id_user === user?.id && (
										<span
											className="text-zinc-400 hover:underline cursor-pointer"
											onClick={() => deleteComment(comment.id)}
										>
											{' '}
											Borrar mi comentario
										</span>
									)}
								</p>
							</div>
						))}
						{user ? (
							<>
								<textarea
									ref={commentRef}
									onChange={e => setComment(e.target.value)}
									value={comment}
									className="input resize-none w-full h-40"
									placeholder="Agrega un comentario"
									maxLength={200}
								/>
								<div className="grid grid-cols-2 gap-4 mt-2">
									<button
										className="button h-12 flex items-center justify-center"
										onClick={() => router.back()}
									>
										<IoMdArrowRoundBack className="translate-y-[1px] mr-1" />
										<span>Volver</span>
									</button>
									<button
										disabled={!comment || isLoading}
										className="button-light h-12 w-full disabled:cursor-not-allowed disabled:hover:bg-opacity-100 flex gap-x-2 items-center justify-center"
										onClick={addComment}
									>
										Comentar
										{isLoading && <Loader />}
									</button>
								</div>
							</>
						) : (
							<p className="mt-2 text-zinc-500">
								Inicia sesión para participar
							</p>
						)}
					</div>
				</div>
			)}
		</div>
	)
}
