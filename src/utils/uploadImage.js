import axios from 'axios'

export default async function uploadImage(file) {
	const body = {
		UPLOADCARE_PUB_KEY: process.env.NEXT_PUBLIC_UPLOADCARE_PUB_KEY,
		file,
	}

	const { data } = await axios.postForm(
		'https://upload.uploadcare.com/base/',
		body
	)
	return `https://ucarecdn.com/${data.file}/`
}
