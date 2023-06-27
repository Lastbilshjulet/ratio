import { AuthProvider } from "../contexts/AuthContext";
import {
	createBrowserRouter,
	RouterProvider
} from "react-router-dom";
import SignUp from "./preLogin/SignUp";
import Login from "./preLogin/Login";
import Dashboard from "./postLogin/Dashboard";
import FallbackComponent from "./FallbackComponent";
import PrivateRoute from "./PrivateRoute";

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
			element: <PrivateRoute component={Dashboard} />
		}
	]
);

function App() {
	return (
		<AuthProvider>
			<RouterProvider router={router} fallbackElement={<FallbackComponent />} />
		</AuthProvider>
	);
}

export default App;
