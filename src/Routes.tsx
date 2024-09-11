import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Auth from "@views/Auth";
import Dashboard from "@views/Dashboard";
import Landingpage from "@views/Landingpage";
import LinkSent from '@views/Auth/LinkSent';
import SuccessLogin from '@views/Auth/SuccessLogin';

// AuthLayout-Komponente als Wrapper für Auth-Routen
function AuthLayout() {
	return (
		<div>
			<Outlet />
		</div>
	);
}

function NotFound() {
	return (
		<div>
			<h1>404 - Not Found</h1>
		</div>
	);
}

const MainRoutes = () => (
	<Routes>
		{/** Public Routes */}
		<Route path="/" element={<Landingpage />} />
		<Route path="/dashboard" element={<Dashboard />} />

		{/** Auth Routes */}
		<Route path="/auth" element={<AuthLayout />}>
			<Route index element={<Auth />} />
			<Route path="/auth/link/sent" element={<LinkSent />} />
			<Route path="/auth/link/success" element={<SuccessLogin />} />
		</Route>

		{/** Login Route */}
		<Route path="/login" element={<Auth />} />

		{/** 404 Route */}
		<Route path="*" element={<Navigate to="/404" />} />
		<Route path="/404" element={<NotFound />} />
	</Routes>
);

export default MainRoutes;
