import Image from 'next/image'
import Link from 'next/link'

export default function ProfilePostPreview({ post }) {
	return (
		<Link href={`/post/${post.id}`} className="overflow-hidden">
			<div className="aspect-square outline outline-1 outline-zinc-700 relative transition-transform ease-out bg-zinc-800">
				<Image
					src={post.image + '-/crop/1:1/center'}
					alt="post image"
					width={300}
					height={300}
				/>
			</div>
		</Link>
	)
}
