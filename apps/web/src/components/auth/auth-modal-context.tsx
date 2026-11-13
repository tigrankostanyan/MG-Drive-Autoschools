import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from "react";

interface AuthModalContextType {
	isOpen: boolean;
	openAuthModal: () => void;
	closeAuthModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

const AUTH_MODAL_EVENT = "open-auth-modal";

/** Trigger opening the auth modal from anywhere outside React tree if needed. */
export function triggerAuthModal() {
	if (typeof window !== "undefined") {
		window.dispatchEvent(new CustomEvent(AUTH_MODAL_EVENT));
	}
}

export function AuthModalProvider({ children }: { children: ReactNode }) {
	const [isOpen, setIsOpen] = useState(false);

	const openAuthModal = useCallback(() => setIsOpen(true), []);
	const closeAuthModal = useCallback(() => setIsOpen(false), []);

	useEffect(() => {
		const handleEvent = () => setIsOpen(true);
		window.addEventListener(AUTH_MODAL_EVENT, handleEvent);
		return () => window.removeEventListener(AUTH_MODAL_EVENT, handleEvent);
	}, []);

	return (
		<AuthModalContext.Provider value={{ isOpen, openAuthModal, closeAuthModal }}>
			{children}
		</AuthModalContext.Provider>
	);
}

export function useAuthModal() {
	const context = useContext(AuthModalContext);
	if (!context) {
		throw new Error("useAuthModal must be used within an AuthModalProvider");
	}
	return context;
}
