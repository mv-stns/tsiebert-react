import { Html, Text, Body, Head, Container, Preview, Heading, Tailwind, Img, Section, Link, Hr } from "@react-email/components";
import * as React from "react";

interface Message {
	firstname: string;
	lastname: string;
	email: string;
	phone?: string;
	message: string;
}

export const emailMessage = ({ firstname = "Max", lastname = "Mustermann", email = "max@musterrmann", phone, message = "Lorem Ipsum" }: Message) => {
	const currentYear = new Date().getFullYear();
	return (
		<Html>
			<Head />
			<Preview>
				Nachticht von {firstname} {lastname}
			</Preview>
			<Tailwind>
				<Body className={`bg-white font-sans w-screen h-screen flex items-center justify-center`}>
					<Section className="w-fit px-4 py-4 mx-auto bg-gray-100 shadow-sm rounded-3xl">
						<main className="mt-8">
							<h2 className="text-gray-700">Hi Tamara,</h2>

							<p className="mt-2 leading-loose text-gray-600">
								Du hast folgende Nachricht von{" "}
								<span className="font-semibold">
									{firstname} {lastname}
								</span>{" "}
								erhalten:
							</p>
							<Hr />
							<div className="flex gap-2">
								{phone && (
									<span className="text-gray-600">
										Telefon: <a href={`tel:${phone}`}>{phone}</a>
									</span>
								)}
								<span className="text-gray-600">
									E-Mail: <a href={`mailto:${email}`}>{email}</a>
								</span>
							</div>
							<p className="text-gray-600 my-8">{message}</p>
							<Hr />
						</main>

						<footer className="mt-8">
							<p className="mt-3 text-gray-500">© {currentYear} Tamara Siebert.</p>
						</footer>
					</Section>
				</Body>
			</Tailwind>
		</Html>
	);
}