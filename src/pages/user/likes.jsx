import { Layout, ProfilePostPreview } from '@/components'
import { prisma } from '@/config'
import { verifyToken } from '@/utils'
import { AiFillHeart } from 'react-icons/ai'

export default function Likes({ user }) {
	return (
		<Layout>
			<div className="w-full max-w-[900px] mx-auto border-b border-b-zinc-700 pb-4">
				<h1 className="w-profile mx-auto flex items-center">
					<AiFillHeart className="mr-2 text-xl" />
					Your likes
				</h1>
			</div>
			<div className="w-full grid grid-cols-3 gap-2 mt-8 max-w-[900px] mx-auto">
				{user.likes.map(({ post }) => (
					<ProfilePostPreview key={post.id} post={post} />
				))}
			</div>
			{!user.likes.length && (
				<p className="text-center text-zinc-500">
					No diste like a ninguna publicación!
				</p>
			)}
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
	const userInfo = await prisma.user.findUnique({
		where: { id: verifiedToken.id },
		select: {
			likes: {
				select: {
					post: {
						select: {
							id: true,
							image: true,
						},
					},
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
