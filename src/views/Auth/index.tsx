// views/Auth/index.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";
import { useCookies } from "react-cookie";
import { cn, useMounted } from "@/lib/utils";
import { LoadingIcon } from "@/components/icons";

// localStorageSetter function to set multiple items in localStorage, accepts the following layout
// {key: value, key2: value2, key3: value3, ...} so an array of objects
function localStorageSetter(items: { [key: string]: string }) {
	Object.entries(items).forEach(([key, value]) => {
		localStorage.setItem(key, value);
	});
}

const LoginPage = () => {
	const mounted = useMounted();
	const BACKEND_KEY = import.meta.env.VITE_BACKEND_KEY;
	const [isLoading, setLoadingState] = useState(false);
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

	const MagicLinkSchema = z.object({
		email: z.string().email("Bitte geben Sie eine gültige E-Mail-Adresse ein"),
	});

	const magicLinkForm = useForm<z.infer<typeof MagicLinkSchema>>({
		resolver: zodResolver(MagicLinkSchema),
		defaultValues: {
			email: "",
		},
	});

	const magicLinkSubmit = async (data: z.infer<typeof MagicLinkSchema>) => {
		setLoadingState(true);
		console.log(data);
		debugger;
		const authUrl = "/api/users/magicauth";
		toast.promise(
			fetch(authUrl, {
				method: "POST",
				headers: {
					"Authorization": `${BACKEND_KEY}`,
					"Content-Type": "application/json", // Ensure the content type is set
				},
				body: JSON.stringify(data),
			}).then(async (response) => {
				if (!response.ok) {
					const errorData = await response.text();
					console.log(errorData);
					throw new Error(errorData.toString());
				}
				return response;
			}),
			{
				loading: "Ihre Anfrage wird bearbeitet...",
				success: () => {
					return "Bitte überprüfen Sie Ihre E-Mails!";
				},
				error: (error) => {
					if (error.message) return error.message;
					return "Ein Fehler ist aufgetreten!";
				},
			}
		);
		setLoadingState(false);
	};

	const onSubmit = async (data: z.infer<typeof FormSchema>) => {
		setLoadingState(true);
		const authUrl = "/api/users/auth";

		console.log(data);

		if (!data || !data.email || !data.password || data.email === "" || data.password === "") {
			toast.error("Bitte füllen Sie alle Felder aus!");
			setLoadingState(false);
			return;
		}
		console.log("Data: " + data);

		toast.promise(
			fetch(authUrl, {
				method: "POST",
				headers: {
					"Authorization": `${BACKEND_KEY}`,
					"Content-Type": "application/json", // Ensure the content type is set
				},
				body: JSON.stringify(data),
			}).then(async (response) => {
				if (!response.ok) {
					const errorData = await response.text();
					console.log(errorData);
					throw new Error(errorData.toString());
				}
				console.log(response);
				setTimeout(() => {
					return response.text();
				}, 2000);
			}),
			{
				loading: "Authentifiziere...",
				success: (data: any) => {
					const token = Math.random().toString(36).substring(7);
					localStorageSetter({ token: token, loggedIn: Date.now().toString()});
					setTimeout(() => {
						window.location.href = "/dashboard";
					}, 2000);
					return "Erfolgreich Angemeldet!";
				},
				error: (error) => {
					if (error.message) return error.message;
					return error;
				},
				finally: () => {
					setLoadingState(false);
				},
			}
		);
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
						<Tabs defaultValue="account">
							<TabsList className="w-2/3">
								<TabsTrigger className="w-full" value="account">
									Anmelden
								</TabsTrigger>
								<TabsTrigger className="w-full" value="magic-link">
									Magic Link
								</TabsTrigger>
							</TabsList>
							<TabsContent value="account">
								<Form {...form}>
									<form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6 mx-auto flex flex-col">
										<FormField
											control={form.control}
											name="email"
											render={({ field }: { field: any }) => (
												<FormItem className="w-full">
													<FormLabel className="block text-[11px] text-left font-medium text-slate-700 uppercase">E-Mail Adresse</FormLabel>
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
													<FormLabel className="block text-[11px] font-medium text-left text-slate-700 uppercase">Passwort</FormLabel>
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
										<Button
											type="submit"
											disabled={isLoading}
											className={cn("", {
												"disabled cursor": isLoading,
											})}
										>
											{isLoading ? <LoadingIcon /> : <>Senden</>}
										</Button>
									</form>
								</Form>
							</TabsContent>
							<TabsContent value="magic-link">
								<Form {...magicLinkForm}>
									<form onSubmit={magicLinkForm.handleSubmit(magicLinkSubmit)} className="w-2/3 space-y-6 mx-auto flex flex-col">
										<FormField
											control={magicLinkForm.control}
											name="email"
											render={({ field }: { field: any }) => (
												<FormItem className="w-full">
													<FormLabel className="block text-[11px] text-left font-medium text-slate-700 uppercase">E-Mail Adresse</FormLabel>
													<FormControl>
														<Input {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<Button type="submit">Senden</Button>
									</form>
								</Form>
							</TabsContent>
						</Tabs>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
