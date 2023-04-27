import { motion } from 'framer-motion'
import { useEffect } from 'react'

export default function RouteChangeBar({ routeLoaded, setRouteLoaded }) {
	useEffect(() => {
		return () => {
			setRouteLoaded(false)
		}
	}, [setRouteLoaded])
	return (
		<motion.div
			initial={{ scaleX: 0 }}
			animate={{ scaleX: routeLoaded ? 1 : 0.6 }}
			transition={{ type: 'spring', bounce: 0, duration: 0.25 }}
			exit={{
				opacity: 0,
				transition: { duration: 0.2, delay: 0.2, ease: 'easeOut' },
			}}
			className="fixed h-1 top-0 bg-main-accent w-full z-50 origin-left"
		/>
	)
}
