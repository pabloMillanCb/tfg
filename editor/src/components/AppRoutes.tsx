import { Route, Routes } from 'react-router-dom';
import GuardedRoute from './GuardedRoute';

interface AppRoutesProp {
	/**
	 * True, if the user is authenticated, false otherwise.
	 */
	isAuthenticated: boolean;
}

const ABOUT_ROUTE = '/';
const LOGIN_ROUTE = '/login';
const SCENE_ROUTE = '/scene';
const EDITOR_ROUTE = '/editor';
const PROFILE_ROUTE = '/config';

const AppRoutes = (props: AppRoutesProp): JSX.Element => {
	const { isAuthenticated } = props;

	return (
		<Routes>
			{/* Unguarded Routes */}
			<Route path={ABOUT_ROUTE} element={<p>About Page</p>} />
			{/* Non-Authenticated Routes: accessible only if user in not authenticated */}
			<Route
				element={
					<GuardedRoute
						isRouteAccessible={!isAuthenticated}
						redirectRoute={LOGIN_ROUTE}
					/>
				}
			>
				{/* Login Route */}
				<Route path={LOGIN_ROUTE} element={<p>Login Page</p>} />
			</Route>
			{/* Authenticated Routes */}
			<Route
				element={
					<GuardedRoute
						isRouteAccessible={isAuthenticated}
						redirectRoute={LOGIN_ROUTE}
					/>
				}
			>
				<Route path={SCENE_ROUTE} element={<p>Home Page</p>} />
			</Route>
			{/* Not found Route */}
			<Route path="*" element={<p>Page Not Found</p>} />
		</Routes>
	);
};

export default AppRoutes;