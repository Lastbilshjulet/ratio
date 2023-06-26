import { AuthProvider } from "../contexts/AuthContext";
import {
	createBrowserRouter,
	RouterProvider
} from "react-router-dom";
import SignUp from "./login/SignUp";
import Login from "./login/Login";
import Dashboard from "./dashboard/Dashboard";

const router = createBrowserRouter(
	[
		{
			path: "/signup",
			element: <SignUp />
		},
		{
			path: "/login",
			element: <Login />
		},
		{
			path: "/",
			element: <Dashboard />
		}
	]
);

function App() {
	return (
		<AuthProvider>
			<RouterProvider router={router} />
		</AuthProvider>
	);
}

export default App;
