import { Router } from "express";

import { getAllUsers, getUserById, createUser, updateUser, deleteUser, setRole, getRole, authUser } from "@controllers/user.controller";

const userRouter = Router();

userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserById);
userRouter.post("/", createUser);
userRouter.put("/:id", updateUser);
userRouter.delete("/:id", deleteUser);
userRouter.put("/:id/role", setRole);
userRouter.get("/:id/role", getRole);
userRouter.post("/auth", authUser);

export default userRouter;
