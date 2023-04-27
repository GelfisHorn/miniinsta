import { Layout, PostCard } from '@/components/'
import axios from 'axios'
import { useEffect, useState } from 'react'

export default function Home() {
	const [posts, setPosts] = useState([])

	useEffect(() => {
		const getPosts = async () => {
			const { data } = await axios.get('/api/posts')
			setTimeout(() => {
				setPosts(data.posts)
			}, 1000)
		}
		getPosts()
	}, [])

	return (
		<Layout>
			<div className="w-full">
				<div className="min-h-screen w-box mx-auto">
					{posts.map(post => (
						<PostCard post={post} key={post.id} />
					))}
					{!posts.length && <PostCard skeleton />}
					{!posts.length && <PostCard skeleton />}
				</div>
			</div>
		</Layout>
	)
}
