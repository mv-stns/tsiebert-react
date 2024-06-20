import { PrismaClient } from "@prisma/client"
import { Resend } from "resend"

const mailClient = new PrismaClient().contactForm

const resend = new Resend()
// if (process.env.NODE_ENV !== "production") {
const mail = (process.env.Node_ENV === "production") ? "marcusvaitschulis@gmail.com" : "marcusvaitschulis@gmail.com"

interface Mail {
    firstname: string;
    lastname: string;
    email: string;
    phone?: string;
    message: string;
    createdAt: Date;
}

export const sendMail = async (req, res) => {
    const { firstname, lastname, email, phone, message } = req.body as Mail
    if (!firstname || !lastname || !email || !message) {
        res.status(400).send("All fields are required")
        return
    }
    try {
        await resend.emails.send({
            to: mail,
            from: email,
            subject: "New message from " + firstname + " " + lastname,
            text: message,
            html: `<p>${message}</p>`
        })
        res.status(200).send("Message sent")
        await writeToDb({
            firstname,
            lastname,
            email,
            phone,
            message,
            createdAt: new Date()
        })
    } catch (err) {
        console.log(err)
        res.status(500).send("Internal server error")
    }
}

const writeToDb = async (mail: Mail) => {
    try {
        await mailClient.create({
            data: mail
        })
    } catch (err) {
        console.log(err)
    }
}
