import { PrismaClient, Role } from "@prisma/client";
import crypto from "crypto";
import { sendMailByMail } from "./mail.controller";
import { color, log, red, green, cyan, cyanBright } from "console-log-colors";

interface User {
	email: string;
	name: string;
	password: string;
	role: Role;
	token?: string;
}

const userClient = new PrismaClient().user;
const db = new PrismaClient();

// getAllUsers
export const getAllUsers = async (req, res) => {
	try {
		const users = await userClient.findMany({
			include: {
				posts: true,
			},
		});
		res.json(users).status(200);
	} catch (err) {
		console.log(err);
	}
};
// getUserById
export const getUserById = async (req, res) => {
	// setimte out to simulate slow network
	try {
		const { id } = req.params;
		const user = await userClient.findUnique({
			where: {
				id: id,
			},
			include: {
				posts: true,
			},
		});
		setTimeout(() => {
			console.log("Timeout");
			res.json(user).status(200);
		}, 3000);
	} catch (err) {
		console.log(err);
	}
};
// createUser
export const createUser = async (req, res) => {
	try {
		const { email, name, password, role } = req.body as User;
		const userAlreadyExists = await userExists(email);
		if (userAlreadyExists) {
			console.log("——— User already exists");
			console.log(req.body);
			res.status(409).send("User already exists");
		} else {
			const user = await userClient.create({
				data: {
					email,
					name,
					password: hashPassword(password),
					role,
				},
			});
			res.json(user)
				.status(201)
				.send("User " + user.id + " created");
		}
	} catch (err) {
		console.log(err);
	}
};

// updateUser
export const updateUser = async (req, res) => {
	try {
		const { id } = req.params;
		const { email, name, password, role } = req.body as User;
		const user = await userClient.update({
			where: {
				id: id,
			},
			data: {
				email,
				name,
				password: hashPassword(password),
				role,
			},
		});
		res.json(user).status(200);
	} catch (err) {
		console.log(err);
	}
};
// deleteUser
export const deleteUser = async (req, res) => {
	try {
		const { id } = req.params;
		await userClient.delete({
			where: {
				id: id,
			},
		});
		res.sendStatus(204);
	} catch (err) {
		console.log(err);
	}
};
// setRole
export const setRole = async (req, res) => {
	try {
		const { id } = req.params;
		const { role } = req.body as { role: Role };
		const user = await userClient.update({
			where: {
				id: id,
			},
			data: {
				role,
			},
		});
		res.json(user).status(200);
	} catch (err) {
		console.log(err);
	}
};
// getRole
export const getRole = async (req, res) => {
	try {
		const { id } = req.params;
		const user = await userClient.findUnique({
			where: {
				id: id,
			},
		});
		res.json(user.role).status(200);
	} catch (err) {
		console.log(err);
	}
};

// authUser
export const authUser = async (req, res) => {
	try {
		const { email, password } = req.body as User;
		console.log(email);
		console.log(password);
		if (!password) {
			console.log(red("Password is required"));
			res.status(400).send("Password is required");
			return;
		}
		const user = await userClient.findUnique({
			where: {
				email,
			},
		});
		if (!user) {
			console.log(red("User not found"));
			res.status(404).send("Nutzer nicht gefunden");
			return;
		}
		if (user.password === hashPassword(password)) {
			console.log(green("User authenticated"));
			res.status(200).send("User authenticated");
			return;
		} else {
			console.log(red("Wrong email or password"));
			res.status(401).send("Falsche E-Mail oder Passwort");
			return;
		}
	} catch (err) {
		console.log(red(err));
	}
};

export const authWithMagicLink = async (req, res) => {
	const token = req.query.token as string;
	if (!token) {
		return res.status(400).send("Token is required");
	}
	if (token) {
		console.log("Token: ", token);
		const cookieToken = req.cookies["node-magic-link-check"];
		if (!cookieToken) {
			return res.sendStatus(400);
		}
		const magicLink = await db.magicLink.findFirst({
			where: {
				token,
				cookieToken,
				isUsed: false,
				validUntil: { gte: new Date() },
			},
		});
		if (!magicLink) {
			return res.sendStatus(404);
		}
		res.cookie({
			"node-magic-link-check": "",
			"sessionToken": magicLink.token,
		});

		// 5. Mark the link as used, to avoid replay attacks
		await db.magicLink.update({
			data: { isUsed: true },
			where: { id: magicLink.id },
		});

		const user = await userClient.findUnique({
			where: {
				id: magicLink.userId,
			},
		});

		res.redirect(`/auth/link/success?userId=${user.id}`);
	}
};

export const generateMagicLink = async (req, res) => {
	const { email } = req.body;
	if (!email) {
		return res.status(400).send("Email wird benötigt");
	}
	const user = await db.user.findUnique({ where: { email } });
	if (!user) {
		return res.status(404).send("Nutzer existiert nicht");
	}

	const token = crypto.randomBytes(64).toString("hex");
	const link = `${req.protocol + "://"}localhost:5173/api/users/auth?token=${token}`;
	const validUntil = new Date(Date.now() + 15 * 60 * 1000);
	const cookieToken = crypto.randomBytes(64).toString("hex");

	await db.magicLink.create({
		data: {
			token,
			userId: user.id,
			validUntil,
			cookieToken,
		},
	});

	// Send email, use function sendMailByMail from mail.controller.ts
	await sendMailByMail(email, "Magic Link", `Click on the link to login: ${link}`);

	res.cookie("node-magic-link-check", cookieToken, { httpOnly: true });
	//save token to local storage
	res.cookie("sessionToken", token, { httpOnly: true });

	// 7. We're done here!
	res.redirect(`/api/auth/link/sent?email=${email}`);
};

const hashPassword = (password: string) => {
	return crypto.createHash("sha256").update(password).digest("hex");
};

const userExists = async (email: string) => {
	const user = await userClient.findUnique({
		where: {
			email,
		},
	});
	return user !== null;
};

// create first admin user
const createInitialAdmin = async () => {
	const { email, name, password, role } = { email: "marcusvaitschulis@gmail.com", name: "Marcus", password: "EE5xDD4FO", role: Role.ADMIN };
	console.log(await userExists(email));
	if ((await userExists(email)) == false) {
		console.info("Init Admin user already exists");
		return;
	}
	userClient.create({
		data: {
			email,
			name,
			password: hashPassword(password),
			role,
		},
	});
	console.log("Admin user created");
};

createInitialAdmin();
