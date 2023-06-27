import React, { useContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "firebase/auth";

const AuthContext = React.createContext();

export function useAuth() {
	return useContext(AuthContext);
}

export function AuthProvider({ children }) {
	const [currentUser, setCurrentUser] = useState();
	const [loading, setLoading] = useState(true);

	function SignUpAuth(email, password) {
		return createUserWithEmailAndPassword(auth, email, password);
	}

	function LogInAuth(email, password) {
		return signInWithEmailAndPassword(auth, email, password);
	}

	function LogOutAuth() {
		return signOut(auth);
	}

	function ResetPasswordAuth(email) {
		return sendPasswordResetEmail(auth, email);
	}

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			setCurrentUser(user);
			setLoading(false);
		});

		return unsubscribe;
	}, []);

	const values = {
		currentUser,
		SignUpAuth,
		LogInAuth,
		LogOutAuth,
		ResetPasswordAuth
	};

	return (
		<AuthContext.Provider value={values}>
			{!loading && children}
		</AuthContext.Provider>
	);
}
