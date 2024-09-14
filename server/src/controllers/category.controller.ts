import { PrismaClient } from "@prisma/client";
const categoryClient = new PrismaClient().category;
type Category = {
	name: string;
};

// addCategory
export const addCategory = async (req, res) => {
	const { name } = req.body as Category;
	if (!name) {
		res.status(400).send("Category name is required");
		return;
	}
	try {
		const categoryAlreadyExists = await categoryExists(name);
		if (categoryAlreadyExists) {
			res.status(409).send("Category already exists");
		} else {
			const category = await categoryClient.create({
				data: {
					name,
				},
			});
			res.json(category)
				.status(201)
				.send("Category " + category.name + " created");
		}
	} catch (err) {
		console.log(err);
	}
};

export const addCategories = async (req, res) => {
    const { categories } = req.body;
    
    if (!categories || categories.length === 0) {
        res.status(400).send("Categories array is required");
        return;
    }

    const existingCategories = [];
    const newCategories = [];

    for (const category of categories) {
        const { name } = category;
        if (!name) {
            res.status(400).send("Category name is required");
            return;
        }
        try {
            const categoryAlreadyExists = await categoryExists(name);
            if (categoryAlreadyExists) {
                existingCategories.push(name);
            } else {
                const createdCategory = await categoryClient.create({
                    data: {
                        name,
                    },
                });
                newCategories.push(createdCategory.name);
            }
        } catch (err) {
            console.log(err);
        }
    }

    if (existingCategories.length > 0 && newCategories.length > 0) {
        res.status(207).json({ existingCategories, newCategories }).send("Some categories already exist and some are created");
    } else if (existingCategories.length > 0) {
        res.status(409).json({ existingCategories }).send("Some categories already exist");
    } else {
        res.status(201).json({ newCategories }).send("All categories created successfully");
    }
};

// removeCategory
export const removeCategory = async (req, res) => {
	try {
		const { name } = req.body as Category;
		const category = await categoryClient.delete({
			where: {
				name,
			},
		});
		res.json(category)
			.status(200)
			.send("Category " + category.name + " deleted");
	} catch (err) {
		console.log(err);
	}
};

// getAllCategories
export const getAllCategories = async (req, res) => {
	try {
		const categories = await categoryClient.findMany();
		if (categories.length === 0) {
			res.status(200).send("There are no categories yet");
		}
		res.json(categories).status(200).send("All categories");
	} catch (err) {
		console.log(err);
	}
};

// helper function
const categoryExists = async (name: string) => {
	const category = await categoryClient.findUnique({
		where: {
			name,
		},
	});
	return category !== null;
};
