import { AuthProvider } from "../contexts/AuthContext";
import {
	createBrowserRouter,
	RouterProvider
} from "react-router-dom";
import SignUp from "./preLogin/SignUp";
import Login from "./preLogin/Login";
import ProfileDashboard from "./postLogin/ProfileDashboard";
import GroupsDashboard from "./postLogin/GroupsDashboard";
import JoinGroupRedirect from "./postLogin/JoinGroupRedirect";
import GroupDetails from "./postLogin/GroupDetails";
import FallbackComponent from "./FallbackComponent";
import NotFoundComponent from "./NotFoundComponent";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import ForgotPassword from "./preLogin/ForgotPassword";

const router = createBrowserRouter(
	[
		{
			path: "/not-found",
			element: <NotFoundComponent />
		},
		{
			path: "/signup",
			element: <PublicRoute component={SignUp} />
		},
		{
			path: "/login",
			element: <PublicRoute component={Login} />
		},
		{
			path: "/forgot-password",
			element: <PublicRoute component={ForgotPassword} />
		},
		{
			path: "/",
			element: <PrivateRoute component={GroupsDashboard} />
		},
		{
			path: "/groups",
			element: <PrivateRoute component={GroupsDashboard} />
		},
		{
			path: "/groups/:groupId",
			element: <PrivateRoute component={GroupDetails} />
		},
		{
			path: "/groups/:groupId/join",
			element: <PrivateRoute component={JoinGroupRedirect} />
		},
		{
			path: "/profile",
			element: <PrivateRoute component={ProfileDashboard} />
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
