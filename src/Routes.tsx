import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Auth from "@views/Auth";
import Dashboard from "@views/Dashboard";
import Landingpage from "./Landingpage";

const MainRoutes = () => (
	<Routes>
		{/** Public Routes */}

		<Route>
			<Route path="/" element={<Landingpage />}>
				<Route path="/" element={<Navigate to="login" />} />
			</Route>
		</Route>
		
		<Route path="/dashboard" element={<Dashboard />} />

		<Route path="login">
			<Route path="/login" element={<Auth />} />
		</Route>

		{/* if route not found, route to 404 not found */}
		<Route path="*" element={<Navigate to="/404" />} />
		<Route path = "/404" element={<h1>404 Not Found</h1>} />

	</Routes>
);

export default MainRoutes;
