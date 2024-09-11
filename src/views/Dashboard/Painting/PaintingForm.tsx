import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Painting, Category } from "@/types/types";
import { Checkbox } from "@/components/ui/checkbox";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

type PaintingFormProps = {
	painting?: Painting | null;
	categories: Category[];
	onSave: (data: any) => void;
	onCancel: () => void;
	isLoading: boolean;
	setImage: (image: File | null) => void;
};

const PaintingFormSchema = z.object({
	image: z.string().min(1, "Bitte fügen Sie ein Bild hinzu"),
	title: z.string().min(1, "Bitte geben Sie einen Titel ein"),
	type: z.string().min(1, "Bitte geben Sie einen Typ ein"),
	size: z.string().min(1, "Bitte geben Sie eine Größe ein (z.B. 30cm x 40cm)"),
	isFramed: z.boolean(),
	isOOAK: z.boolean(),
	category: z.string().min(1, "Bitte wählen Sie mindestens eine Kategorie aus"),
	content: z.string().optional(),
	buyLink: z.string().optional(),
	createdAt: z.string().regex(/^\d{4}$/),
});

const PaintingForm: React.FC<PaintingFormProps> = ({ painting, categories, onSave, onCancel, isLoading, setImage }) => {
	const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);
	const BACKEND_KEY = "GVZY9AGW^BA!4&zDGFDpifcUwdet!8nVf7V&n8vZn%#F9YzP2Zm#!UXaMLb@ne5q";
	const saveButton = useRef<HTMLButtonElement>(null);
	const [loadingState, setLoadingState] = useState(false);
	const [image, settingImage] = useState<File | null>(null);

	console.log("Painting", painting);
	let preparePainting = painting;
	// set painting categories to a string. no more array. If multiple categories, separate with comma
	if (painting && painting.category) {
		if (Array.isArray(painting.category)) {
			const categories = painting.category.map((cat) => cat.name);
			preparePainting = { ...painting, category: categories.join(", ") };
		}
	}
	painting = preparePainting;

	const form = useForm({
		resolver: zodResolver(PaintingFormSchema),
		defaultValues: painting || {
			image: "",
			title: "",
			type: "",
			size: "",
			isFramed: false,
			isOOAK: false,
			category: "",
			content: "",
			buyLink: "",
			createdAt: new Date().getFullYear().toString(),
		},
	});

	const { reset, setValue, getValues, watch, getFieldState } = form;

	const handleDeleteImage = () => {
		setValue("image", "");
		setImage(null);
	};

	const handleDeletePainting = async () => {
		setLoadingState(true);
		if (!painting) {
			toast.error("Kein Gemälde zum löschen gefunden");
			return;
		}

		try {
			const response = await fetch(`http://localhost:3000/paintings/${painting.id}`, {
				method: "DELETE",
				headers: {
					Authorization: `${BACKEND_KEY}`,
				},
			});

			if (!response.ok) {
				throw new Error(`Failed to delete painting: ${response.status} ${response.statusText}`);
			}

			toast.success("Gemälde '" + painting.title + "' wurde erfolgreich gelöscht");
			onCancel();
		} catch (error) {
			console.error("Error deleting painting:", error);
			toast.error("Fehler beim Löschen des Gemäldes: " + error);
		}
		setLoadingState(false);
		setImage(null);
	};

	const handleSubmit = async (data: any) => {
		const updatedPainting = { ...painting, ...data };

		if (!data.image || data.image === "") {
			toast.error("Bitte fügen Sie ein Bild hinzu");
			return;
		}

		setLoadingState(true);

		try {
			const formData = new FormData();
			formData.append("title", updatedPainting.title);
			formData.append("content", updatedPainting.content);
			formData.append("isOOAK", updatedPainting.isOOAK.toString());
			formData.append("type", updatedPainting.type);
			formData.append("size", updatedPainting.size);
			formData.append("isFramed", updatedPainting.isFramed.toString());
			formData.append("buyLink", updatedPainting.buyLink);
			formData.append("createdAt", updatedPainting.createdAt);
			updatedPainting.category.split(", ").forEach((catName: string) => {
				const category = categories.find((cat) => cat.name === catName);
				if (category) {
					formData.append("category", category.name);
				}
			});

			if (image instanceof File) {
				formData.append("image", image);
			}

			let response;
			if (!painting) {
				response = await fetch("http://localhost:3000/paintings", {
					method: "POST",
					headers: {
						Authorization: `${BACKEND_KEY}`,
					},
					body: formData,
				});
			} else {
				response = await fetch("http://localhost:3000/paintings/" + painting.id, {
					method: "PUT",
					headers: {
						Authorization: `${BACKEND_KEY}`,
					},
					body: formData,
				});
			}

			if (!response.ok) {
				const message = await response.text();
				toast.error(message.toString());
				throw new Error(`Failed to update painting: ${response.status} ${response.statusText}`);
			}

			const savedPainting = await response.json();
			toast.success("Gemälde " + (!painting ? "erstellt" : "aktualisiert") + "!");
			onSave(savedPainting);
		} catch (error) {
			toast.error("Fehler beim Speichern des Gemäldes");
			console.error("Error saving painting:", error);
		}
		setLoadingState(false);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSave)}>
				<div className="grid grid-cols-2 gap-6">
					<div className="grid col-span-2 grid-cols-2 gap-4">
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem className="col-span-1">
									<FormLabel>Titel</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="type"
							render={({ field }) => (
								<FormItem className="col-span-1">
									<FormLabel>Typ</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className="grid col-span-2 grid-cols-2 gap-4">
						<FormField
							control={form.control}
							name="size"
							render={({ field }) => (
								<FormItem className="col-span-1">
									<FormLabel>Größe</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="category"
							render={({ field }) => (
								<FormItem className="col-span-1">
									<FormLabel>Kategorie</FormLabel>
									<FormControl>
										<DropdownMenu open={isCatDropdownOpen} onOpenChange={setIsCatDropdownOpen}>
											<DropdownMenuTrigger asChild>
												<Button className="w-full justify-start overflow-hidden" variant="outline">
													<div className="text-left">
														{typeof field.value === 'string' && field.value.split(", ").length >= 5 
															? `${field.value.split(", ").length} Kategorien ausgewählt` 
															: typeof field.value === 'string' && field.value.length > 0 
																? field.value 
																: <span className="text-slate-500">Kategorie wählen...</span>}
													</div>
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent>
												<DropdownMenuGroup>
													{categories.map((category) => {
														const isChecked = typeof field.value === 'string' && field.value.split(", ").includes(category.name);
														return (
															<DropdownMenuCheckboxItem
																key={category.name}
																checked={isChecked}
																onCheckedChange={() => {
																	console.log("field Value", field.value);
																	let newCategories: string[];
																	if (isChecked) {
																		newCategories = typeof field.value === 'string' ? field.value.split(", ").filter((cat) => cat !== category.name) : [];
																	} else {
																		newCategories = typeof field.value === 'string' ? field.value.split(", ").concat(category.name) : [category.name];
																	}
																	console.log("newCategories", newCategories);
																	setValue("category", newCategories.join(", ").toString());
																}}
															>
																{category.name}
															</DropdownMenuCheckboxItem>
														);
													})}
												</DropdownMenuGroup>
											</DropdownMenuContent>
										</DropdownMenu>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<FormField
						control={form.control}
						name="image"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Gemälde</FormLabel>
								<FormControl>
									{field.value ? (
										<div className="relative">
											<div className="group size-44 ring-0 hover:ring-2 ring-offset-2 hover:ring-slate-950 bg-cover rounded-md relative overflow-hidden" style={{ backgroundImage: `url(${field.value})` }}>
												<HoverCard>
													<HoverCardTrigger className="absolute hidden lg:block z-10 top-0 right-0 p-2 justify-center">
														<Badge>Vorschau</Badge>
													</HoverCardTrigger>
													<HoverCardContent side="right" className="size-fit">
														<img src={field.value} alt={getValues("title") + " Gemälde"} className="object-cover h-auto w-[500px]" />
													</HoverCardContent>
												</HoverCard>
												<div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center">
													<Button type="button" className="px-8 py-16 text-white" variant={"link"} onClick={handleDeleteImage}>
														Bild Löschen
													</Button>
												</div>
											</div>
										</div>
									) : (
										<Input
											id="image"
											type="file"
											onChange={(e) => {
												if (e.target.files && e.target.files[0]) {
													setImage(e.target.files[0]);
													setValue("image", URL.createObjectURL(e.target.files[0]));
												}
											}}
										/>
									)}
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="grid">
						<FormField
							control={form.control}
							name="buyLink"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Link</FormLabel>
									<FormControl>
										<Input {...field} value={field.value as string} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="createdAt"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Erstellungsdatum</FormLabel>
									<FormControl>
										<Select value={field.value} onValueChange={field.onChange}>
											<SelectTrigger>
												<SelectValue placeholder="Datum wählen..." />
											</SelectTrigger>
											<SelectContent>
												<SelectGroup className="grid grid-cols-3">
													{Array.from({ length: new Date().getFullYear() - 2014 }, (_, i) => new Date().getFullYear() - i).map((year) => (
														<SelectItem className="cursor-pointer" key={year} value={year.toString()}>
															{year}
														</SelectItem>
													))}
												</SelectGroup>
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className="col-span-2">
						<FormField
							control={form.control}
							name="content"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Inhalt</FormLabel>
									<FormControl>
										<Textarea {...field} className="w-full h-32 p-2 border rounded-md" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<FormField
						control={form.control}
						name="isFramed"
						render={({ field }) => (
							<FormItem className="flex space-y-0 items-center gap-2">
								<FormControl>
									<Checkbox checked={field.value} onCheckedChange={field.onChange} />
								</FormControl>
								<FormLabel>{field.value ? "Das Gemälde ist gerahmt" : "Das Gemälde ist nicht gerahmt"}</FormLabel>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="isOOAK"
						render={({ field }) => (
							<FormItem className="flex space-y-0 items-center gap-2">
								<FormControl>
									<Checkbox checked={field.value} onCheckedChange={field.onChange} />
								</FormControl>
								<FormLabel>{field.value ? "Das Gemälde ist ein Unikat" : "Das Gemälde ist kein Unikat"}</FormLabel>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="flex mt-4 justify-end gap-4">
					{/* <Button type="button" variant="destructive" onClick={() => setIsDeleteDrawerOpen(true)} className={`w-24 ${newPainting ? "hidden" : ""}`} disabled={isLoading}>
						Löschen
					</Button> */}
					<Button type="button" variant="outline" onClick={onCancel}>
						Abbrechen
					</Button>
					<Button type="submit">Speichern</Button>
				</div>
			</form>
		</Form>
	);
};

export default PaintingForm;
