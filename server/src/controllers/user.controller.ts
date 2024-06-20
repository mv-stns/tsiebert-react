import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

type Role = "USER" | "ADMIN";

interface User {
	email: string;
	name: string;
	password: string;
	role: Role;
}

const userClient = new PrismaClient().user;

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
	try {
		const { id } = req.params;
		const user = await userClient.findUnique({
			where: {
				id: Number(id),
			},
			include: {
				posts: true,
			},
		});
		res.json(user).status(200);
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
				id: Number(id),
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
				id: Number(id),
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
				id: Number(id),
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
				id: Number(id),
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
		const user = await userClient.findUnique({
			where: {
				email,
			},
		});
		if (user.password === hashPassword(password)) {
			res.status(200).send("User authenticated");
		} else {
			res.sendStatus(401).send("Unauthorized");
		}
	} catch (err) {
		console.log(err);
	}
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
