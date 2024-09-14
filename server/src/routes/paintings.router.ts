import { Router } from "express";

import { getAllPaintings, getPaintingById, createPainting, deletePainting, updatePainting} from "@controllers/paintings.controller";

const paintingsRouter = Router();

paintingsRouter.get("/", getAllPaintings);
paintingsRouter.post("/", createPainting);
paintingsRouter.delete("/:id", deletePainting);
paintingsRouter.put("/:id", updatePainting);
paintingsRouter.get("/:id", getPaintingById);

export default paintingsRouter;
