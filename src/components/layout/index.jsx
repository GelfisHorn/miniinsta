import Sidebar from './Sidebar'
import RegisterBanner from './RegisterBanner'
import PostModal from './PostModal'
import { useSessionStore } from '@/store'
import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'

export default function Layout({ children }) {
	const user = useSessionStore(state => state.user)
	const [createModalIsOpen, setCreateModalIsOpen] = useState(false)
	const openCreateModal = () => setCreateModalIsOpen(true)
	const closeCreateModal = () => setCreateModalIsOpen(false)
	const [userClosed, setUserClosed] = useState(false)
	return (
		<>
			<div className="grid grid-cols-1 md:grid-cols-main-layout">
				<Sidebar user={user} openCreateModal={openCreateModal} />
				<main className="w-full min-h-screen pb-32 pt-16 md:pt-20">
					{children}
				</main>
			</div>
			{!user && !userClosed && <RegisterBanner setUserClosed={setUserClosed} />}
			<AnimatePresence>
				{createModalIsOpen && <PostModal closeCreateModal={closeCreateModal} />}
			</AnimatePresence>
		</>
	)
}
