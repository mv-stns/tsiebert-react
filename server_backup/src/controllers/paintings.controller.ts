import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import webp from "webp-converter";
import sharp from "sharp";

const prisma = new PrismaClient().paintings;
const categoryClient = new PrismaClient().category;
const uploadDir = "../public/uploads/paintings/";

if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true });
}

type Painting = {
	title: string;
	image: string | undefined;
	content: string;
	isOOAK: boolean;
	type: string;
	size: string;
	isFramed: boolean;
	category: Category[];
	buyLink: string;
	createAt: String;
};

type Category = {
	id: number;
	name: string;
};

// Multer configuration
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, uploadDir);
	},
	filename: function (req, file, cb) {
		const extension = path.extname(file.originalname);
		const fileName = `${uuidv4()}${extension}`;
		cb(null, fileName);
	},
});

const upload = multer({ storage: storage }).single("image");

const convertAndResizeImage = async (filePath: string, maxHeight: number) => {
	const metadata = await sharp(filePath).metadata();
	const outputFilePath = filePath.replace(path.extname(filePath), ".webp");

	if (metadata.height < 500) {
		return;
	}

	if (metadata.height && metadata.height > maxHeight) {
		await sharp(filePath)
			.resize({ height: maxHeight }) // Ändere die Höhe des Bildes nur, wenn es größer als maxHeight ist
			.webp({
				quality: 70,
				effort: 6,
			})
			.toFile(outputFilePath);
	} else {
		await sharp(filePath)
			.webp({
				quality: 70,
				effort: 6,
			})
			.toFile(outputFilePath);
	}

	fs.unlinkSync(filePath); // Lösche die Originaldatei nach der Konvertierung
	return outputFilePath;
};

// getAllPaintings
export const getAllPaintings = async (req: Request, res: Response) => {
	try {
		const paintings = await prisma.findMany({
			include: {
				category: true,
			},
		});
		if (paintings.length === 0) {
			res.status(404).send("Noch keine Gemälde vorhanden");
			return;
		}
		res.json(paintings).status(200);
	} catch (err) {
		console.error("Error getting paintings:", err);
		res.status(500).send("Fehler beim Abrufen der Gemälde");
	}
};

// getPaintingById
export const getPaintingById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		if (!id || isNaN(Number(id))) {
			res.status(400).send("Gemälde-ID ist erforderlich");
			return;
		}
		const painting = await prisma.findUnique({
			where: {
				id: Number(id),
			},
			include: {
				category: true,
			},
		});
		if (!painting) {
			res.status(404).send("Kein Gemälde gefunden");
			return;
		}
		res.json(painting).status(200);
	} catch (err) {
		console.error("Error getting painting by ID:", err);
		res.status(500).send("Fehler beim Abrufen des Gemäldes");
	}
};

export const updatePainting = async (req: Request, res: Response) => {
	console.log("——— Update Painting ———");
	try {
		upload(req, res, async (err) => {
			if (err instanceof multer.MulterError) {
				console.error("Multer error:", err);
				return res.status(500).send("Hochladen des Bildes fehlgeschlagen");
			} else if (err) {
				console.error("Error:", err);
				return res.status(500).send("Unbekannter Fehler, Kontaktiere den Administrator");
			}

			const { id } = req.params;
			const { title, content, isOOAK, type, size, isFramed, buyLink, category, createdAt } = req.body;

			// check if isOOAK and isFramed are strings, if so parse them to boolean
			const isOOAKBool = isOOAK === "true";
			const isFramedBool = isFramed === "true";
			console.log("req.body:", req.body);

			// Ensure category is defined and is an array
			if (!category) {
				// return res.status(400).json({ message: "Category is required and must be an array" });
				return res.status(400).send("Kategorie ist erforderlich");
			}

			// Clean up category names (remove double quotes) if array
			let cleanedCategories;
			if (Array.isArray(category)) {
				cleanedCategories = category.map((cat: string) => cat.replace(/"/g, ""));
				console.log("cleanedCategories:", cleanedCategories);
			} else {
				cleanedCategories = [category];
			}

			// Create or connect categories based on their names
			const categoryConnections = await Promise.all(
				cleanedCategories.map(async (catName: string) => {
					if (!catName) {
						throw new Error("Category name is required");
					}

					const existingCategory = await categoryClient.findUnique({
						where: { name: catName },
					});

					if (existingCategory) {
						return { id: existingCategory.id };
					} else {
						const newCategory = await categoryClient.create({
							data: { name: catName },
						});
						return { id: newCategory.id };
					}
				})
			);

			const updatedData: any = {
				title,
				content,
				isOOAK: isOOAKBool,
				type,
				size,
				isFramed: isFramedBool,
				buyLink: buyLink || "",
				category: {
					set: categoryConnections, // Connect categories by IDs
				},
				createdAt,
			};

			let imagePath: string | undefined;
			console.log("BILD:", (req as any).file);

			// check if new image was uploaded by checking db img path with new img path
			const checkOldImage = await prisma.findUnique({
				where: { id: parseInt(id, 10) },
				select: { image: true },
			});

			if ((req as any).file && (req as any).file.filename != undefined && checkOldImage.image != null) {
				// check if theres a new image and if the db img is not null
				imagePath = (req as any).file.filename;
				const fullImagePath = path.join(uploadDir, imagePath);
				imagePath = await convertAndResizeImage(fullImagePath, 2000); // Ändere die Höhe auf 500px und konvertiere in WebP
				if (!imagePath) {
					return res.status(500).send("Bild zu klein, bitte wähle ein größeres Bild (mindestens 500px hoch)");
				}
				// console.log("checkOldImage:", checkOldImage);
				console.log(checkOldImage.image);
				console.log(`/uploads/paintings/${imagePath}`);

				const check = checkOldImage && checkOldImage.image != null && checkOldImage.image != undefined && checkOldImage.image != `/uploads/paintings/${imagePath}`;
				console.log("check:", check);
				if (check && (req as any).file != undefined) {
					// this checks if the image path in db is not null, undefined, or the same as the new image path
					deleteOldImage(checkOldImage.image, Number(id));
				}
				if (imagePath) {
					updatedData.image = `/uploads/paintings/${path.basename(imagePath)}`;
					// Delete the old image if a new image is uploaded
					const oldPainting = await prisma.findUnique({
						where: { id: parseInt(id, 10) },
					});
					if (oldPainting && oldPainting.image) {
						deleteOldImage(oldPainting.image, parseInt(id, 10));
					}
				}
			}

			const painting = await prisma.update({
				where: { id: parseInt(id, 10) },
				include: {
					category: true,
				},
				data: updatedData,
			});

			if (!painting) {
				return res.status(404).send("Gemälde nicht gefunden");
			}

			// Return updated painting, but prepare category data for response cuz its currently Object[]
			const paintingCategories = painting.category.map((cat: any) => cat.name);
			const paintingResponse = {
				...painting,
				category: paintingCategories,
			};
			// console.log("paintingResponse:", paintingResponse);
			res.status(200).json(painting);
		});
	} catch (err) {
		console.error("Error updating painting:", err);
		res.status(500).send("Fehler beim Aktualisieren des Gemäldes");
	}
};

// createPainting
export const createPainting = async (req: Request, res: Response) => {
	console.log("——— Create Painting ———");
	try {
		upload(req, res, async (err) => {
			if (err instanceof multer.MulterError) {
				console.error("Multer error:", err);
				return res.status(500).send("Fehler beim Hochladen des Bildes");
			} else if (err) {
				console.error("Error:", err);
				return res.status(500).send("Unbekannter Fehler, Kontaktiere den Administrator");
			}

			const { title, content, isOOAK, type, size, isFramed, buyLink, category, createdAt } = req.body;

			// Log the request body for debugging
			console.log("Request body:", req.body);

			// Validate required fields
			if (!title || !type || !size) {
				console.error("Missing required fields");
				return res.status(400).send("Titel, Typ und Größe sind erforderlich");
			}

			const paintingExists = await paintingNameExists(title);
			if (paintingExists) {
				console.error("Painting with title already exists");
				return res.status(409).send("Gemälde mit diesem Titel '" + title + "' existiert bereits");
			}

			let imagePath: string | undefined;
			if ((req as any).file) {
				imagePath = (req as any).file.filename;
				const fullImagePath = path.join(uploadDir, imagePath);
				imagePath = await convertAndResizeImage(fullImagePath, 2000); // Ändere die Höhe auf 500px und konvertiere in WebP
			}

			// Category CAN be an array, but if its one category, it will be a string
			if (!category) {
				console.error("Category is required");
				return res.status(400).send("Kategorie ist erforderlich");
			}

			// Clean up category names (remove double quotes) if array
			let cleanedCategories;
			if (Array.isArray(category)) {
				cleanedCategories = category.map((cat: string) => cat.replace(/"/g, ""));
				console.log("cleanedCategories:", cleanedCategories);
			} else {
				cleanedCategories = [category];
			}

			// Create or connect categories based on their names
			const categoryConnections = await Promise.all(
				cleanedCategories.map(async (catName: string) => {
					if (!catName) {
						throw new Error("Category name is required");
					}

					const existingCategory = await categoryClient.findUnique({
						where: { name: catName },
					});

					if (existingCategory) {
						return { id: existingCategory.id };
					} else {
						const newCategory = await categoryClient.create({
							data: { name: catName },
						});
						return { id: newCategory.id };
					}
				})
			);

			console.log("categoryConnections:", categoryConnections);

			const painting = await prisma.create({
				data: {
					title,
					content,
					isOOAK: isOOAK === "true",
					type,
					size,
					isFramed: isFramed === "true",
					buyLink: buyLink || "",
					image: imagePath ? `/uploads/paintings/${path.basename(imagePath)}` : "",
					category: {
						connect: categoryConnections,
					},
					createdAt,
				},
			});

			// if painting creation fails, delete the image
			if (!painting) {
				deleteOldImage(imagePath, Number(painting.id));
				return res.status(500).send("Fehler beim Erstellen des Gemäldes");
			}

			// Return the created painting, but query it again so the category data is returned as an array of strings
			const paintingWithCategories = await prisma.findUnique({
				where: { id: painting.id },
				include: {
					category: true,
				},
			});

			res.status(201).json(paintingWithCategories);

			console.log("Painting created:", painting);
		});
	} catch (err) {
		console.error("Error creating painting:", err);
		res.status(500).send("Fehler beim Erstellen des Gemäldes");
	}
};

// Ensure other methods are defined similarly with proper error handling and validation

// deletePainting
export const deletePainting = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		console.log("Painting.ID to delete:", id);

		if (!id || isNaN(Number(id))) {
			res.status(400).send("Gemälde-ID ist erforderlich");
			return;
		}

		const painting = await prisma.findUnique({
			where: {
				id: Number(id),
			},
		});

		if (!painting) {
			res.status(404).send("Gemälde nicht gefunden");
			return;
		}

		// delete image
		const imagePath = painting.image;
		deleteOldImage(imagePath, Number(id));

		await prisma.delete({
			where: {
				id: Number(id),
			},
		});

		console.log("Painting:", painting);

		res.status(200).json(painting);
	} catch (err) {
		console.error("Error deleting painting:", err);
		res.status(500).send("Fehler beim Löschen des Gemäldes");
	}
};

// Helper function to check if painting with given title exists
const paintingExists = async (title: string) => {
	const painting = await prisma.findFirst({
		where: {
			title,
		},
	});
	return painting !== null;
};

const deleteOldImage = async (imagePath: string, paintingID: number) => {
	try {
		const oldImagePath = path.join(__dirname, "/../../../public", imagePath);
		const checkImageExistance = fs.existsSync(oldImagePath);
		console.log("Old image exists:", checkImageExistance);
		// check db for image path, if it exists, delete it if it doesn't match the new image path
		if (checkImageExistance) {
			const dbImage = await prisma.findUnique({
				where: { id: paintingID },
				select: { image: true },
			});
			if (dbImage.image != imagePath) {
				console.log("Image path in db doesn't match new image path, not deleting");
			}
			fs.unlinkSync(oldImagePath);
			console.log("Old image deleted from path:", oldImagePath);
		} else {
			console.log("Old image doesn't exist in path:", oldImagePath);
		}
	} catch (err) {
		console.error("Error deleting old image:", err);
	}
};

const paintingNameExists = async (title: string) => {
	const painting = await prisma.findFirst({
		where: {
			title,
		},
		select: {
			id: true,
			title: true,
		},
	});
	return painting;
};
