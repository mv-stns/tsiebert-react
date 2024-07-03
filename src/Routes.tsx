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
	</Routes>
);

export default MainRoutes;
