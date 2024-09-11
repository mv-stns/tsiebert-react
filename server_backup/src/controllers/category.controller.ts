import { PrismaClient } from "@prisma/client";
const categoryClient = new PrismaClient().category;

type Category = {
	name: string;
	id?: number;
};

export const addCategory = async (req, res) => {
	const { name } = req.body as Category;
	if (!name) {
		return res.status(400).send("Category name is required");
	}
	try {
		const categoryAlreadyExists = await categoryExists(name);
		if (categoryAlreadyExists) {
			return res.status(409).json({ message: "Category already exists" });
		} else {
			const category = await categoryClient.create({
				data: { name },
			});
			return res.status(201).json(category);
		}
	} catch (err) {
		console.error(err);
		return res.status(500).send("Internal Server Error");
	}
};

export const addCategories = async (req, res) => {
	const { categories } = req.body;
	if (!categories || categories.length === 0) {
		return res.status(400).send("Categories array is required");
	}

	const existingCategories = [];
	const newCategories = [];

	for (const category of categories) {
		const { name } = category;
		if (!name) {
			return res.status(400).send("Category name is required");
		}
		try {
			const categoryAlreadyExists = await categoryExists(name);
			if (categoryAlreadyExists) {
				existingCategories.push(name);
			} else {
				const createdCategory = await categoryClient.create({ data: { name } });
				newCategories.push(createdCategory.name);
			}
		} catch (err) {
			console.error(err);
		}
	}

	if (existingCategories.length > 0 && newCategories.length > 0) {
		return res.status(207).json({ existingCategories, newCategories });
	} else if (existingCategories.length > 0) {
		return res.status(409).json({ existingCategories });
	} else {
		return res.status(201).json({ newCategories });
	}
};

export const removeCategory = async (req, res) => {
	try {
		const { id } = req.params;
		if (!id || isNaN(Number(id))) {
			return res.status(400).send("Category ID is required");
		}
		const category = await categoryClient.findUnique({ where: { id: Number(id) } });
		if (!category) {
			return res.status(404).send("Category not found");
		}
		await categoryClient.delete({ where: { id: Number(id) } });
		return res.status(200).send(`Category ${category.name} deleted`);
	} catch (err) {
		console.error(err);
		return res.status(500).send("Internal Server Error");
	}
};

export const getAllCategories = async (req, res) => {
	try {
		const categories = await categoryClient.findMany();
		if (categories.length === 0) {
			return res.status(404).json({ message: "No categories found" });
		}
		return res.status(200).json(categories.sort((a, b) => a.id - b.id));
	} catch (err) {
		console.error(err);
		return res.status(500).send("Internal Server Error");
	}
};

const categoryExists = async (name) => {
	const category = await categoryClient.findUnique({ where: { name } });
	return category !== null;
};
