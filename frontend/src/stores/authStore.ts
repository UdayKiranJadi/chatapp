import { create } from "zustand"
import {persist} from "zustand/middleware"

export type User = {
    id:string;
    fullName:string;
    email:string;
    connectCode:string;
    username:string;
}

interface AuthState {
    user: User | null,
    isAuthenticated: Boolean;
    setUser: (user: User) => void;
    logout: () => void;

}

export const useAuthStore = create<AuthState>()(
    persist (
        (set) => ({
            user:null,
            isAuthenticated:false,
            setUser:(user) => set({user, isAuthenticated: true}),
            logout: () => set({user:null, isAuthenticated:false})
        }),
        {
            name: "auth-storage",
        }
    )
)