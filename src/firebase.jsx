import { initializeApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { getAuth } from "firebase/auth";

if (import.meta.env.VITE_APP_DEV) {
	self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}

const app = initializeApp({
	apiKey: import.meta.env.VITE_APP_API_KEY,
	authDomain: import.meta.env.VITE_APP_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_APP_PROJECT_ID,
	storageBucket: import.meta.env.VITE_APP_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_APP_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_APP_APP_ID
});

const appCheck = initializeAppCheck(
	app,
	{
		provider: new ReCaptchaV3Provider("" + import.meta.env.VITE_APP_RECAPTCHA_SITE_KEY),
		isTokenAutoRefreshEnabled: true
	}
);

export const auth = getAuth(app);
export default appCheck;
