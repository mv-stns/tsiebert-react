import { PrismaClient } from "@prisma/client";
import fs from "fs";

const paintingsClient = new PrismaClient().paintings;
const imagePath = "/../src/assets/paintings/";

type Category = {
	name: string;
};

type Image = {
	imageFile: File;
	altText: string;
	path: string;
};

type Painting = {
	title: string;
	image: Image;
	content?: string;
	isOOAK?: boolean;
	type?: string;
	size: string;
	isFramed: boolean;
	category: Category[];
	artmajeur_link?: string;
};

// getAllPaintings
export const getAllPaintings = async (req, res) => {
	try {
		const paintings = await paintingsClient.findMany({
			include: {
				category: true,
			},
		});
		if (paintings.length === 0) {
			res.status(200).send("There are no Paintings yet");
		}
		res.json(paintings).status(200).send("All paintings");
	} catch (err) {
		console.log(err);
	}
};

// getPaintingById
export const getPaintingById = async (req, res) => {
	try {
		const { id } = req.params;
		if (!id || isNaN(Number(id))) {
			res.status(400).send("Painting ID is required");
			return;
		}
		const painting = await paintingsClient.findUnique({
			where: {
				id: Number(id),
			},
			include: {
				category: true,
			},
		});
		if (painting === null) {
			res.status(404).send("Painting not found");
		}
		res.json(painting).status(200);
	} catch (err) {
		console.log(err);
	}
};

// createPainting
export const createPainting = async (req, res) => {
    try {
		const { title, content, isOOAK, type, size, isFramed, category, artmajeur_link } = req.body as Painting;
        if (await paintingExists(title)) {
            res.status(409).send("Painting already exists");
            return; // exit early
        }
        const image = req.body.image as Image;
        const imagePath = await saveImage(image);
        const painting = await paintingsClient.create({
            data: {
                title,
                image: imagePath,
                content,
                isOOAK,
                type,
                size,
                isFramed,
                category: {
                    connect: category,
                },
				artmajeur_link,
            },
        });
        res.json(painting)
            .status(201)
            .send("Painting " + painting.title + " created");
    } catch (err) {
        console.log(err);
    }
}

// updatePainting
export const updatePainting = async (req, res) => {
	try {
		const { id } = req.params;
		const { title, content, isOOAK, type, size, isFramed, category, artmajeur_link } = req.body as Painting;
		if (await paintingExists(title)) {
			res.status(409).send("Painting with that title already exists");
			return; // exit early
		}
		const image = req.body.image as Image;
		const imagePath = await saveImage(image);
		const painting = await paintingsClient.update({
			where: {
				id: Number(id),
			},
			data: {
				title,
				image: imagePath,
				content,
				isOOAK,
				type,
				size,
				isFramed,
				category: {
					connect: category,
				},
				artmajeur_link,
			},
		});
		res.json(painting)
			.status(200)
			.send("Painting " + painting.title + " updated");
	} catch (err) {
		console.log(err);
	}
};

// deletePainting
export const deletePainting = async (req, res) => {
	try {
		const { id } = req.params;
		const painting = await paintingsClient.delete({
			where: {
				id: Number(id),
			},
		});
		res.json(painting)
			.status(200)
			.send("Painting " + painting.title + " deleted");
		await deleteImage(painting.image);
	} catch (err) {
		console.log(err);
	}
};

// helper functions
const paintingExists = async (title: string) => {
	const painting = await paintingsClient.findUnique({
		where: {
			title,
		},
	});
	return painting !== null;
};

const getImagePathByID = async (id: number) => {
	const painting = await paintingsClient.findUnique({
		where: {
			id,
		},
	});
	return painting.image;
};

const saveImage = async (image: Image) => {
	const { imageFile } = image;
	const uniqueName = generateUniqueName();
	const filePath = `${imagePath}${uniqueName}`;

	try {
		const fileBuffer = await imageFile.arrayBuffer();
		await fs.promises.writeFile(filePath, Buffer.from(fileBuffer));
		console.log("Image saved successfully");
		return uniqueName;
	} catch (err) {
		console.log("Error saving image:", err);
	}
};

const deleteImage = async (path: string) => {
	try {
		await fs.promises.unlink;
	} catch (err) {
		console.log("Error deleting image:", err);
	}
};

const generateUniqueName = () => {
	const timestamp = Date.now();
	const randomString = Math.random().toString(36).substring(2, 15);
	return `${timestamp}_${randomString}`;
};
