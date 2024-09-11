import { Router } from "express";

import { sendMail } from "@controllers/mail.controller";

const mailRouter = Router();

mailRouter.post("/", sendMail);

export default mailRouter;