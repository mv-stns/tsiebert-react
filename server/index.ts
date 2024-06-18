import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./trpc";

const app = express();

app.use(
	"/trpc",
	createExpressMiddleware({
		router: appRouter,
		createContext: () => ({}),
	})
);

app.listen(3000, () => {
	console.log("Server is running on port 3000");
});
