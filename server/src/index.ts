import express from "express";
import { env } from "process";
import paintingsRouter from "@routes/paintings.router";
import categoriesRouter from "@routes/category.router";
import userRouter from "@routes/user.router";
import mailRouter from "@routes/mail.router";

const validAuthKey = env.AUTH_KEY;

const authMiddleware = (req, res, next) => {
	const authKey = req.headers["authorization"];
	if (authKey === validAuthKey) {
		next();
	} else {
		res.sendStatus(401).send("Unauthorized");
	}
};


const app = express();
const port = 3000;

app.use(express.json());
app.use(authMiddleware);

app.use("/users", userRouter);
app.use("/paintings", paintingsRouter);
app.use("/category", categoriesRouter);
app.use("/mail", mailRouter);

app.get('/ping', (req, res) => {
	res.json({ message: 'pong' }).status(200);
});


app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
