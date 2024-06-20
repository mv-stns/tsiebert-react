import SectionWrapper from "@/components/SectionWrapper";
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

const Contact = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [lastSentTime, setLastSentTime] = useState(null);
	const buttonRef = useRef(null);

	const FormSchema = z.object({
		firstname: z.string().min(2, "Der Vorname muss mindestens 2 Zeichen lang sein").max(50, "Der Vorname darf maximal 50 Zeichen lang sein"),
		lastname: z.string().min(2, "Der Nachname muss mindestens 2 Zeichen lang sein").max(50, "Der Nachname darf maximal 50 Zeichen lang sein"),
		email: z.string().email("Bitte geben Sie eine gültige E-Mail-Adresse ein"),
		phone: z.string().optional(),
		message: z.string().min(10, "Die Nachricht muss mindestens 10 Zeichen lang sein").max(500, "Die Nachricht darf maximal 500 Zeichen lang sein"),
		dataprivacy: z.boolean().refine((value) => value === true, { message: "Sie müssen die Datenschutzbestimmungen akzeptieren" }).optional(),
		captcha: z.string().refine((value) => value === "", { message: "Es gab einen Fehler mit dem Captcha" }),
	});

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			firstname: "",
			lastname: "",
			email: "",
			phone: "",
			message: "",
			dataprivacy: false,
			captcha: "",
		},
	});

	const canSendEmail = () => {
		if (typeof window !== 'undefined') {
			const lastSentTime = localStorage.getItem('lastSentTime');
			if (!lastSentTime) {
				localStorage.setItem('lastSentTime', Date.now().toString());
				return true; // Allow sending if no email has been sent yet
			}

			const currentTime = Date.now();
			const timeDiff = currentTime - parseInt(lastSentTime);
			const timeLimit = 5 * 60 * 1000; // 5 minutes in milliseconds

			if (timeDiff >= timeLimit) {
				localStorage.setItem('lastSentTime', Date.now().toString());
				return true;
			} else {
				return false;
			}
		}

		return true;
	};

	function onSubmit(data: z.infer<typeof FormSchema>) {
		setLastSentTime(Date.now());
		if (!canSendEmail()) {
			toast.error("Sie können nur alle 5 Minuten eine E-Mail senden");
			return;
		}
		toast.success("Folgende Daten wurden gesendet: " + JSON.stringify(data));
	}

	return (
		<SectionWrapper viewType="default" title="Kontakt">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6 mx-auto flex flex-col">
					<div className="flex gap-4">
						<FormField
							control={form.control}
							name="firstname"
							render={({ field }: { field: any }) => (
								<FormItem className="w-full">
									<FormLabel className="block text-[11px] font-medium text-slate-700 uppercase">Vorname</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="lastname"
							render={({ field }: { field: any }) => (
								<FormItem className="w-full">
									<FormLabel className="block text-[11px] font-medium text-slate-700 uppercase">Nachname</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<FormField
						control={form.control}
						name="email"
						render={({ field }: { field: any }) => (
							<FormItem>
								<FormLabel className="block text-[11px] font-medium text-slate-700 uppercase">Email</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="phone"
						render={({ field }: { field: any }) => (
							<FormItem>
								<FormLabel className="block text-[11px] font-medium text-slate-700 uppercase">Telefon</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="message"
						render={({ field }: { field: any }) => (
							<FormItem>
								<FormLabel className="block text-[11px] font-medium text-slate-700 uppercase">Message</FormLabel>
								<FormControl>
									<Textarea {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="dataprivacy"
						render={({ field }: { field: any }) => (
							<FormItem>
								<FormLabel className="block text-[11px] font-medium text-slate-700 uppercase">Datenschutz</FormLabel>
								<FormControl>
									<div className="items-top flex space-x-2">
										<Checkbox {...field} onClick={() => form.setValue("dataprivacy", !form.getValues("dataprivacy"))} />
										<div className="grid gap-1.5 leading-none">
											<label htmlFor="terms1" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
												Sie akzeptieren unsere <a href="/datenschutz" className="underline-offset-4 hover:text-[hsla(196,80%,40%,1)] transition-colors duration-200 ease-in-out text-[hsla(196,80%,56%,1)] underline">Datenschutzbestimmungen</a>
											</label>
										</div>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="captcha"
						render={({ field }: { field: any }) => (
							<FormItem className="hidden">
								<FormLabel className="text-[11px] font-medium text-slate-700 uppercase">Captcha (Whats 2+2)</FormLabel>
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
		</SectionWrapper>
	);
};

export default Contact;
