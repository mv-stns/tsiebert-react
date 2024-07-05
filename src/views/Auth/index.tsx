// views/Auth/index.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { env } from "process";

const LoginPage = () => {
	const BACKEND_KEY = import.meta.env.VITE_BACKEND_KEY;
	const submitRef = useRef<HTMLButtonElement>(null);
	const [hasError, setHasError] = useState(false);
	const FormSchema = z.object({
		email: z.string().email("Bitte geben Sie eine gültige E-Mail-Adresse ein"),
		password: z.string().min(6, "Das Passwort muss mindestens 6 Zeichen lang sein"),
	});

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (data: z.infer<typeof FormSchema>) => {
		// async await validation from localhost:3000/users/auth
		const authUrl = "http://localhost:3000/users/auth";

		console.log(data);

		try {
			const promise = () =>
				new Promise((resolve) => {
					resolve(
						fetch(authUrl, {
							method: "POST",
							headers: {
								"Authorization": `${BACKEND_KEY}`,
								"Content-Type": "application/json", // Add Content-Type header
							},
							body: JSON.stringify(data),
						})
					);
				});

			if (submitRef.current !== null) {
				submitRef.current.disabled = true;
				submitRef.current.classList.add("cursor-not-allowed", "opacity-50", "pointer-events-none");
				submitRef.current.innerHTML = `<svg class="animate-spin" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="mingcuteLoadingFill0" x1="50%" x2="50%" y1="5.271%" y2="91.793%"><stop offset="0%" stop-color="currentColor"/><stop offset="100%" stop-color="currentColor" stop-opacity=".55"/></linearGradient><linearGradient id="mingcuteLoadingFill1" x1="50%" x2="50%" y1="15.24%" y2="87.15%"><stop offset="0%" stop-color="currentColor" stop-opacity="0"/><stop offset="100%" stop-color="currentColor" stop-opacity=".55"/></linearGradient></defs><g fill="none"><path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="url(#mingcuteLoadingFill0)" d="M8.749.021a1.5 1.5 0 0 1 .497 2.958A7.5 7.5 0 0 0 3 10.375a7.5 7.5 0 0 0 7.5 7.5v3c-5.799 0-10.5-4.7-10.5-10.5C0 5.23 3.726.865 8.749.021" transform="translate(1.5 1.625)"/><path fill="url(#mingcuteLoadingFill1)" d="M15.392 2.673a1.5 1.5 0 0 1 2.119-.115A10.48 10.48 0 0 1 21 10.375c0 5.8-4.701 10.5-10.5 10.5v-3a7.5 7.5 0 0 0 5.007-13.084a1.5 1.5 0 0 1-.115-2.118" transform="translate(1.5 1.625)"/></g></svg>`;
			}

			const response = (await promise()) as Response;
			const json = await response.json();
			// promise to wait 2 seconds before redirecting
			const toastPromise = () => new Promise((resolve) => setTimeout(() => resolve({ name: "Viel Spaß" }), 2000));
			toast.promise(toastPromise(), {
				loading: "Erfolgreich Angemeldet! \n Sie werden in kürze Weitergeleitet",
				success: () => {
					// save token to local storage
					localStorage.setItem("token", json.token);
					window.location.href = "/dashboard";

					return "Los gehts!";
				},
				error: "Fehler beim Delay!",
			});
		} catch (error) {
			toast.error("An error occurred during authentication " + error);
			setHasError(true);
			if (hasError && submitRef.current !== null) {
				setHasError(false);
				setTimeout(() => {
					submitRef.current.disabled = false;
					submitRef.current.classList.remove("cursor-not-allowed", "opacity-50", "pointer-events-none");
					submitRef.current.innerHTML = "Senden";
				}, 2000);
			}
		}
	};

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
					<div className="flex flex-col space-y-2 text-center">
						<h1 className="text-2xl font-sans not-italic font-semibold tracking-tight">Anmelden</h1>
						<p className="text-sm whitespace-nowrap text-muted-foreground">Willkommen zurück! Melden Sie sich an, um fortzufahren.</p>
					</div>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6 mx-auto flex flex-col">
							<FormField
								control={form.control}
								name="email"
								render={({ field }: { field: any }) => (
									<FormItem className="w-full">
										<FormLabel className="block text-[11px] font-medium text-slate-700 uppercase">E-Mail Adresse</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({ field }: { field: any }) => (
									<FormItem className="w-full">
										<FormLabel className="block text-[11px] font-medium text-slate-700 uppercase">Passwort</FormLabel>
										<FormControl>
											<Input {...field} type="password" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<p className="px-8 text-center text-sm text-muted-foreground">
								Indem Sie auf Weiter klicken, stimmen Sie unseren{" "}
								<a href="/terms" className="underline underline-offset-4 hover:text-primary">
									Nutzungsbedingungen
								</a>{" "}
								und{" "}
								<a href="/privacy" className="underline underline-offset-4 hover:text-primary">
									Datenschutzrichtlinie
								</a>{" "}
								zu.
							</p>
							<Button ref={submitRef} type="submit">
								Senden
							</Button>
						</form>
					</Form>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
