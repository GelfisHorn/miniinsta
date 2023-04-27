import white_text_logo from '../../../public/assets/white-text-logo.svg'
import {
	AiFillHome,
	AiOutlineSearch,
	AiFillHeart,
	AiOutlineClose,
	AiOutlineMenuUnfold,
	AiFillInstagram,
} from 'react-icons/ai'
import { BsFillImageFill } from 'react-icons/bs'
import { BiLogOut } from 'react-icons/bi'
import { useSidebarStore } from '@/store'
import Link from 'next/link'
import { useEffect } from 'react'
import Image from 'next/image'
import axios from 'axios'

export default function Sidebar({ user, openCreateModal }) {
	const sidebarTranslate = useSidebarStore(state => state.sidebarTranslate)
	const setSidebarTranslate = useSidebarStore(
		state => state.setSidebarTranslate
	)

	const logout = async () => {
		try {
			await axios.post('/api/users/logout')
			location.href = '/'
		} catch (error) {
			alert('unexpected error')
		}
	}

	useEffect(() => {
		const sidebarStateChecker = () => {
			if (innerWidth > 768) setSidebarTranslate('0%')
			else setSidebarTranslate('-100%')
		}
		window.addEventListener('resize', sidebarStateChecker)
		sidebarStateChecker()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	return (
		<>
			<div className="fixed md:hidden top-0 w-full z-30 bg-main-black-accent">
				<div className="w-profile mx-auto flex items-center justify-between">
					<Link href="/">
						<AiFillInstagram className="text-3xl my-4" />
					</Link>
					<button onClick={() => setSidebarTranslate('0%')}>
						<AiOutlineMenuUnfold className="text-2xl my-4" />
					</button>
				</div>
			</div>
			<div
				className={`bg-main-black-accent border-r border-zinc-800 fixed md:sticky top-0 h-screen overflow-y-auto w-[270px] shadow-md transition-transform ease-out duration-500 z-40`}
				style={{ transform: `translateX(${sidebarTranslate})` }}
			>
				<nav className="h-full flex flex-col justify-between gap-5 relative">
					<button
						className="absolute top-6 right-3 md:hidden"
						onClick={() => setSidebarTranslate('-100%')}
					>
						<AiOutlineClose className="text-2xl m-3 border-zinc-200" />
					</button>
					<div className="h-full relative">
						<Image
							src={white_text_logo}
							alt="text instagram logo"
							width={160}
							className="ml-2"
						/>
						<div className="flex flex-col px-3 gap-4">
							<Link href="/" className="nav-action">
								<AiFillHome className="text-2xl" />
								Inicio
							</Link>
							<Link href="/search" className="nav-action">
								<AiOutlineSearch className="text-2xl" />
								Búsqueda
							</Link>
							{user ? (
								<>
									<Link className="nav-action" href="/user/likes">
										<AiFillHeart className="text-2xl" />
										Likes
									</Link>
									<button onClick={openCreateModal} className="nav-action">
										<BsFillImageFill className="text-2xl" />
										Crear{' '}
									</button>
								</>
							) : (
								<div className="flex flex-col gap-3 font-bold mt-24 absolute w-full left-0 px-3 bottom-10">
									<Link
										href="/login"
										className="button-light-variant px-3 py-2 grid place-content-center"
									>
										Iniciar Sesión
									</Link>
									<Link
										href="/register"
										className="button px-3 py-2 grid place-content-center"
									>
										Registrarse
									</Link>
								</div>
							)}
						</div>
					</div>
					{user && (
						<div className="px-6 flex items-center py-12 justify-between border-t border-zinc-800">
							<div className="flex items-center gap-3">
								<Link href={`/user/${user.id}`}>
									<Image
										src={user.avatar}
										alt="user avatar"
										width={50}
										height={50}
										className="w-[50px] h-[50px] object-cover rounded-full outline outline-2 outline-zinc-700 overflow-hidden cursor-pointer"
									/>
								</Link>
								<div>
									<p className="hover:text-white w-28 overflow-hidden text-ellipsis">
										<Link href={`/user/${user.id}`}>{user.user_name}</Link>
									</p>
									<Link
										href="/user/edit"
										className="text-zinc-400 text-sm hover:underline hover:text-zinc-200"
									>
										editar perfil
									</Link>
								</div>
							</div>
							<button
								onClick={logout}
								className="hover:bg-white/10 transition-colors ease-out rounded-md"
								title="Cerrar sesión"
							>
								<BiLogOut className="text-3xl m-1" />
							</button>
						</div>
					)}
				</nav>
			</div>
		</>
	)
}
