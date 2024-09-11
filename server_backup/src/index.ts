import express from "express";
import { env } from "process";
import paintingsRouter from "@routes/paintings.router";
import categoriesRouter from "@routes/category.router";
import userRouter from "@routes/user.router";
import mailRouter from "@routes/mail.router";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

const validAuthKey = env.AUTH_KEY;

// create Global variable names debug, thats every accessiable in the whole project
global.debug = env.DEBUG;

const app = express();
const port = 3000;

app.use(express.json());

// Handle preflight requests and enable cors
app.use(
	cors({
		origin: "*",
		methods: ["GET", "POST", "DELETE", "PUT"],
		allowedHeaders: ["Content-Type", "Authorization"],
	})
);

// const authMiddleware = (req, res, next) => {
// 	const { method, path } = req;
// 	console.log("Method: ", method);
// 	console.log("Path: ", path);
// 	if (req.method === "POST" && req.path === "/auth/login" || path === "/auth/link/sent") {
// 		return next();
// 	}
// 	const authKey = req.headers["authorization"];
// 	if (authKey === validAuthKey) {
// 		next();
// 	} else {
// 		res.status(401).json({ message: "Unauthorized" });
// 	}
// };
// app.use(authMiddleware);


if (!global.debug) {
	app.use((req, res, next) => {
		console.log(`Request from ${req.ip} to ${req.path}`);
		// console log whloe request object
		console.log(req);
		next();
	});
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRouter);
app.use("/paintings", paintingsRouter);
app.use("/category", categoriesRouter);
app.use("/mail", mailRouter);

app.get("/ping", (req, res) => {
	res.status(200).json({ message: "pong" });
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});

app.get("/auth/link/sent", (req, res) => {
	const email = req.query.email; // eg. /auth/link/sent?email=...
	if (!email) {
		res.status(400).send("Email wird benötigt");
		return;
	}
	res.send(email).status(200);
});
