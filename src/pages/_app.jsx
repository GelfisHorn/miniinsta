import '@/styles/globals.css'
import { useSessionStore } from '@/store'
import axios from 'axios'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { useRouter } from 'next/router'
import { RouteChangeBar } from '@/components'
import { AnimatePresence } from 'framer-motion'

export default function App({ Component, pageProps }) {
	const [loader, setLoader] = useState(true)
	const setUser = useSessionStore(state => state.setUser)

	const router = useRouter()
	const [isRouteChange, setIsRouteChange] = useState(false)
	const [routeLoaded, setRouteLoaded] = useState(false)

	useEffect(() => {
		const getSession = async () => {
			try {
				const { data } = await axios.post('/api/users/verify-session')
				setUser(data.user)
			} catch (error) {}

			setTimeout(() => {
				setLoader(false)
				document.body.style.overflow = 'auto'
			}, 500)
		}

		const handleRouteChangeStart = () => {
			setIsRouteChange(true)
		}
		const handleRouteChangeComplete = () => {
			setRouteLoaded(true)
			setTimeout(() => setIsRouteChange(false), 200)
		}
		// verifying session token
		getSession()

		// router events subscribing
		router.events.on('routeChangeStart', handleRouteChangeStart)
		router.events.on('routeChangeComplete', handleRouteChangeComplete)
		return () => {
			router.events.off('routeChangeStart', handleRouteChangeStart)
			router.events.off('routeChangeComplete', handleRouteChangeComplete)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	return (
		<>
			<Head>
				<title>Instagram Clone</title>
				<link rel="icon" type="image/jpg" href="/assets/logo.svg" />
			</Head>
			<Component {...pageProps} />
			{loader && (
				<div className="fixed z-[999] top-0 left-0 w-full h-screen bg-zinc-800 grid place-content-center">
					<Image
						src="/assets/logo.svg"
						alt="logo"
						width={200}
						height={200}
						className="custom-rotate"
					/>
				</div>
			)}
			<Toaster
				position="bottom-center"
				reverseOrder={false}
				toastOptions={{
					style: {
						borderRadius: '10px',
						background: '#333',
						color: '#fff',
					},
				}}
			/>
			<AnimatePresence>
				{isRouteChange && (
					<RouteChangeBar
						routeLoaded={routeLoaded}
						setRouteLoaded={setRouteLoaded}
					/>
				)}
			</AnimatePresence>
		</>
	)
}
