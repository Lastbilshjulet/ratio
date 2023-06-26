import { AuthProvider } from "../contexts/AuthContext";
import PreLoginPage from "./login/PreLoginPage";

function App() {
	return (
		<AuthProvider>
			<PreLoginPage />
		</AuthProvider>
	);
}

export default App;
