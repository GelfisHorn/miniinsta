import jwt from 'jsonwebtoken'

const verifyToken = token => {
	try {
		return jwt.verify(token, process.env.JWT_SECRET)
	} catch (error) {
		return null
	}
}
export default verifyToken
