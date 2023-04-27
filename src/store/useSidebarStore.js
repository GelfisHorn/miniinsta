import { create } from 'zustand'

export const useSidebarStore = create(set => ({
	sidebarTranslate: '-100%',
	setSidebarTranslate: translate => set({ sidebarTranslate: translate }),
}))
