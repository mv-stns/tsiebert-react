import express from "express";
import { env } from "process";
import paintingsRouter from "@routes/paintings.router";
import categoriesRouter from "@routes/category.router";
import userRouter from "@routes/user.router";
import mailRouter from "@routes/mail.router";

const validAuthKey = env.AUTH_KEY;


const app = express();
const port = 3000;

app.use(express.json());

// const authMiddleware = (req, res, next) => {
// 	const authKey = req.headers["authorization"];
// 	if (authKey === validAuthKey) {
// 		next();
// 	} else {
// 		res.sendStatus(401).send("Unauthorized");
// 	}
// };
// app.use(authMiddleware);

// Enable CORS
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Content-Type, Authorization"
	);
	next();
});

app.use("/users", userRouter);
app.use("/paintings", paintingsRouter);
app.use("/category", categoriesRouter);
app.use("/mail", mailRouter);

app.get("/ping", (req, res) => {
	res.json({ message: "pong" }).status(200);
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
