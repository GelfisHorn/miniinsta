import { Layout, ProfilePostPreview } from '@/components'
import { AiFillEdit } from 'react-icons/ai'
import { prisma } from '@/config'
import { useSessionStore } from '@/store'
import Image from 'next/image'
import Link from 'next/link'

export default function UserProfile({ user }) {
	const currentUser = useSessionStore(state => state.user)

	return (
		<Layout>
			<div className="pb-6 w-profile mx-auto">
				<div className="mx-auto max-w-[600px] flex gap-4 sm:gap-6">
					<Image
						src={user.avatar}
						alt={user.user_name}
						width={150}
						height={150}
						className="rounded-full outline outline-2 outline-zinc-700 overflow-hidden w-[80px] sm:w-[150px] aspect-square object-cover"
					/>
					<div className="min-w-[180px] mt-2">
						<div className="flex items-center gap-2 text-lg">
							<h1 className="text-base sm:text-lg font-bold max-w-[128px] sm:max-w-[240px] overflow-hidden text-ellipsis">
								{user.user_name}
							</h1>
							{currentUser && currentUser.id === user.id && (
								<Link
									href="/user/edit"
									className="flex items-center hover:underline"
								>
									<span className="hidden lg:block text-sm">Editar perfil</span>
									<AiFillEdit className="m-2 text-xl" />
								</Link>
							)}
						</div>
						<p className="text-sm text-zinc-400">
							{user.posts.length}{' '}
							{user.posts.length !== 1 ? 'publicaciones' : 'publicación'}
						</p>
						<p className="hidden sm:block text-sm">{user.about_me}</p>
					</div>
				</div>
				<p className="sm:hidden text-sm mt-4">{user.about_me}</p>
			</div>
			<div className="mx-auto max-w-[900px] border-b border-zinc-700" />
			{/* posts container */}
			<div className="w-full grid grid-cols-3 gap-2 mt-10 max-w-[900px] mx-auto">
				{user.posts.map(post => (
					<ProfilePostPreview key={post.id} post={post} />
				))}
			</div>
			{!user.posts.length && (
				<p className="text-center text-zinc-500">No hay nada que ver aqui</p>
			)}
		</Layout>
	)
}

export async function getServerSideProps(ctx) {
	const { idUsuario } = ctx.query
	const userInfo = await prisma.user.findUnique({
		where: { id: idUsuario },
		select: {
			id: true,
			about_me: true,
			avatar: true,
			email: true,
			posts: {
				select: {
					id: true,
					image: true,
				},
				orderBy: {
					created_at: 'desc',
				},
			},
			user_name: true,
		},
	})
	if (!userInfo) {
		return {
			notFound: true,
		}
	}
	return {
		props: { user: userInfo },
	}
}
