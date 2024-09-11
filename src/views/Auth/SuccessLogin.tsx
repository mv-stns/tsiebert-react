import React, { useEffect } from "react";
import { Fragment, useState } from "react";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { User } from "@/types/types";
import { useCookies } from "react-cookie";
import { useMounted } from "@/lib/utils";

function Wrapper(props: any) {
	return (
		<div className="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
			<div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
				<div className="absolute inset-0 bg-zinc-900" />
				<div className="relative z-20 flex items-center text-lg font-medium">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-6 w-6">
						<path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
					</svg>
					TS
				</div>
			</div>
			<div className="lg:p-8 h-full flex justify-center">
				<div className="mx-auto flex sm:w-full flex-col justify-center space-y-6 w-[350px]">
					<div className="flex flex-col space-y-2 text-center">{props.children}</div>
				</div>
			</div>
		</div>
	);
}

type SuccessStates = "loading" | "success" | "error";

export default function SuccessLogin() {
	const [userData, setUserData] = useState<User>();
	const [successState, setSuccessState] = useState<SuccessStates>("loading");
	const [cookies, setCookie, removeCookie] = useCookies(["token"]);
	const userId = new URLSearchParams(window.location.search).get("userId");
	const mounted = useMounted();
    // get cookie token from session
	console.log(cookies);

	if (cookies) {
		useEffect(() => {
			if (!mounted) return;
			setTimeout(() => {
				toast.error("Nicht Authentifiziert!");
			});
		}, [mounted]);
		return <Wrapper>Sie sind nicht authentifiziert!</Wrapper>;
	}
	if (!userId) {
		useEffect(() => {
			if (!mounted) return;
			setTimeout(() => {
				toast.error("Keine Benutzer-ID gefunden!");
			});
		}, [mounted]);
		return <Wrapper>Keine Benutzer-ID gefunden!</Wrapper>;
	}
	useEffect(() => {
		const fetchUserData = async () => {
			const response = await fetch(`/api/users/${userId}`);
			if (!response.ok) throw new Error("Fehler beim Laden der Daten!");
			return response.json();
		};

		if (!userId) toast.error("Keine Benutzer-ID gefunden!");

		setTimeout(() => {
			if (!mounted) return;
			const toastProm = toast.promise(fetchUserData(), {
				loading: "Lade Daten...",
				success: (data) => {
					setUserData(data);
					localStorage.setItem("token", Math.random().toString(36).substring(7));
					localStorage.setItem("userId", userId as string);
					localStorage.setItem("loggedIn", Date.now().toString());
					window.location.href = "/dashboard";
					return "Daten geladen!";
				},
				error: (error) => {
					console.error(error);
					return "Fehler beim Laden der Daten!";
				},
			});
			return () => toast.dismiss(toastProm);
		});
	}, [userId, setUserData, mounted]);

	return (
		// welcome message in german to greet the user, with name if available
		<Wrapper>
			<h1 className="text-2xl">Willkommen zurück!</h1>
			<p>Willkommen zurück, {userData?.name ?? "Gast"}!</p>
		</Wrapper>
	);
}
