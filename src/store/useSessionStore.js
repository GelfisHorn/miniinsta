import { create } from 'zustand'

export const useSessionStore = create(set => ({
	user: null,
	setUser: userData => set({ user: userData }),
	clearUser: () => set({ user: null }),
}))
