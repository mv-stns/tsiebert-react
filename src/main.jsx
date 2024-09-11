import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "@/components/ui/sonner";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<BrowserRouter>
			<div vaul-drawer-wrapper="">
				<div className="relative flex min-h-screen flex-col bg-background">
					<App />
				</div>
			</div>
		</BrowserRouter>
		<Toaster richColors position="top-center" />
	</React.StrictMode>
);
