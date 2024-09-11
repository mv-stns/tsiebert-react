import { Router } from "express";
import rateLimit from "express-rate-limit";
import { getAllUsers, getUserById, createUser, updateUser, deleteUser, setRole, getRole, authUser, authWithMagicLink, generateMagicLink } from "@controllers/user.controller";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { sendMailByMail } from "@controllers/mail.controller";
import { color, log, red, green, cyan, cyanBright } from "console-log-colors";

const db = new PrismaClient();

const userRouter = Router();
const authRateLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 5, // limit each IP to 5 requests per windowMs
	message: "Zu viele Anfragen, bitte versuchen Sie es in 15 Minuten erneut",
});

// when this route is called, console logg it
userRouter.use((req, res, next) => {
	console.log(red("User Router Called"));
	next();
});

userRouter.get("/", getAllUsers);
userRouter.get("/auth", authWithMagicLink);
userRouter.get("/:id/role", getRole);
userRouter.get("/:id", getUserById);
userRouter.delete("/:id", deleteUser);
userRouter.put("/:id", updateUser);
userRouter.put("/:id/role", setRole);
userRouter.post("/", createUser);
userRouter.post("/auth", authRateLimiter, authUser);
userRouter.post("/magicauth", generateMagicLink);

export default userRouter;
