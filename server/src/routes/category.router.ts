import { Router } from "express";

import { addCategory, removeCategory, getAllCategories, addCategories } from "@controllers/category.controller";

const categoriesRouter = Router();
categoriesRouter.get("/", getAllCategories);
categoriesRouter.post("/", addCategory);
categoriesRouter.post("/multi", addCategories);
categoriesRouter.delete("/:id", removeCategory);

export default categoriesRouter;