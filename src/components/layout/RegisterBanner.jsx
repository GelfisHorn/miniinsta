import logo from '../../../public/assets/logo.svg'
import Image from 'next/image'
import Link from 'next/link'
import { AiOutlineClose } from 'react-icons/ai'

export default function RegisterBanner({ setUserClosed }) {
	return (
		<div className="fixed w-full bottom-0 left-0 h-48 bg-neutral-950/90 z-[45]">
			<div className="w-full relative flex items-center h-full">
				<button onClick={setUserClosed} className="absolute top-2 right-2">
					<AiOutlineClose className="text-lg m-2" />
				</button>

				<div className="mx-auto w-banner flex flex-col md:flex-row justify-center md:justify-between pt-8">
					<div className="flex max-md:mx-auto items-center">
						<Image src={logo} alt="instagram logo" width={80} height={80} />
						<div className="flex flex-col gap-y-2">
							<p className="font-bold text-base max-sm:hidden">
								Iniciar sesión en Instaclone
							</p>
							<p className="max-w-sm text-sm">
								Inicia sesión para ver las fotos y los videos de tus amigos y
								descubrir otras cuentas que te encantarán.
							</p>
						</div>
					</div>
					<div className="flex md:flex-col gap-3 max-md:mx-auto max-md:mt-3 font-bold">
						<Link
							href="/login"
							className="button-light-variant px-3 py-2 grid place-content-center w-32"
						>
							Iniciar Sesión
						</Link>
						<Link
							href="/register"
							className="button px-3 py-2 grid place-content-center w-32"
						>
							Registrarse
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}
