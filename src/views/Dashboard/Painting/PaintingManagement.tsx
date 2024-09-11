/**
 * v0 by Vercel.
 * @see https://v0.dev/t/I6SeiTKMTDr
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
("use client");

import { useState, useMemo, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { CheckIcon, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { set, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuCheckboxItem, DropdownMenuGroup } from "@/components/ui/dropdown-menu";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ViewIcon, LoadingIcon, PlusIcon, ArrowUpDownIcon, BrushIcon, RulerIcon, FrameIcon, DiamondIcon, FolderIcon } from "@/components/icons";
import { Painting, Category, Props } from "@/types/types";
import PaintingCard from "./PaintingCard";

// Schema für das Erstellen eines neuen Gemäldes
const NewPaintingFormSchema = z.object({
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

// Schema für das Bearbeiten eines bestehenden Gemäldes
const EditPaintingFormSchema = NewPaintingFormSchema.extend({
	image: z.string().optional(),
});

const PaintingFormSchema = (isNew: boolean) => (isNew ? NewPaintingFormSchema : EditPaintingFormSchema);

export const PaintingManagement = (props: Props) => {
	const [categories, setCategories] = useState<Category[]>([]);
	const [editingPainting, setEditingPainting] = useState<Painting | null>(null);
	const [errorMessage, setErrorMessage] = useState("");
	const [image, setImage] = useState<File | null>(null);

	const [isLoading, setIsLoading] = useState(true);
	const [isDeleteDrawerOpen, setIsDeleteDrawerOpen] = useState(false);
	const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const [newPainting, setCreateNewPainting] = useState(false);
	const [paintings, setPaintings] = useState<Painting[]>([]);
	const [selectedCategory, setSelectedCategory] = useState<Category>({ name: "Alle", id: 0 });
	const [searchString, setSearchString] = useState("");
	const [sortBy, setSortBy] = useState("createdAt");
	const [sortOrder, setSortOrder] = useState("desc");
	const [viewMode, setViewMode] = useState("grid");
	const saveButton = useRef<HTMLButtonElement>(null);
	const BACKEND_KEY = import.meta.env.VITE_BACKEND_KEY;

	const form = useForm<Painting>({
		resolver: zodResolver(PaintingFormSchema(newPainting)),
		defaultValues: {
			image: "",
			title: "",
			type: "",
			size: "",
			isFramed: false,
			isOOAK: false,
			category: [],
			content: "",
			buyLink: "",
			createdAt: new Date().getFullYear().toString(),
		},
	});

	const { reset, setValue } = form;

	const loadCategories = async () => {
		const backendUrl = "/api/category";
		try {
			const response = await fetch(backendUrl, {
				method: "GET",
				headers: {
					"Authorization": `${BACKEND_KEY}`,
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			setCategories(data);
			setErrorMessage(""); // Reset the error message if the fetch is successful
		} catch (error: any) {
			console.error("Fehler beim Laden der Kategorien:", error);
			setErrorMessage(`Fehler beim Laden der Kategorien: ${error.message}`);
		}
	};

	const loadPaintings = async () => {
		setIsLoading(true);
		const backendUrl = "/api/paintings";
		try {
			const response = await fetch(backendUrl, {
				method: "GET",
				headers: {
					"Authorization": `${BACKEND_KEY}`,
					"Content-Type": "application/json",
				},
			});

			// Überprüfen, ob die Antwort erfolgreich ist
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			setPaintings(data);
			setErrorMessage(""); // Reset the error message if the fetch is successful
		} catch (error: any) {
			if (error instanceof TypeError && error.message === "Failed to fetch") {
				setErrorMessage("Der Server ist momentan nicht erreichbar. Bitte versuchen Sie es später erneut.");
			} else {
				setErrorMessage(`Fehler beim Laden der Bilder: ${error.message}`);
			}
			console.error("Fehler beim Laden der Bilder:", error);
		}
		setIsLoading(false);
	};

	useEffect(() => {
		loadCategories();
		loadPaintings();
	}, []);

	useEffect(() => {
		if (editingPainting) {
			form.reset({
				image: editingPainting.image,
				title: editingPainting.title,
				type: editingPainting.type,
				size: editingPainting.size,
				isFramed: editingPainting.isFramed,
				isOOAK: editingPainting.isOOAK,
				category: Array.isArray(editingPainting.category) ? editingPainting.category.map((cat) => cat.name).join(", ") : editingPainting.category,
				content: editingPainting.content,
				buyLink: editingPainting.buyLink || "",
				createdAt: editingPainting.createdAt,
			});
		}
	}, [editingPainting, form, reset]);

	const handleDeleteImage = () => {
		setValue("image", "");
		setImage(null);
	};

	const filteredPaintings = useMemo(() => {
		let filtered = paintings;
		if (selectedCategory.name !== "Alle") {
			filtered = filtered.filter((painting) => {
				if (Array.isArray(painting.category)) {
					return painting.category.map((cat) => cat.name).includes(selectedCategory.name);
				}
				return false;
			});
		}
		if (searchString) {
			filtered = filtered.filter((painting) => painting.title.toLowerCase().includes(searchString.toLowerCase()));
		}
		return filtered.sort((a: any, b: any) => {
			if (sortOrder === "asc") {
				return a[sortBy] > b[sortBy] ? 1 : -1;
			} else {
				return a[sortBy] < b[sortBy] ? 1 : -1;
			}
		});
	}, [paintings, selectedCategory, sortBy, searchString, sortOrder]);

	const handleEditPainting = (painting: Painting) => {
		setCreateNewPainting(false);
		setEditingPainting(painting);
		setIsDialogOpen(true);
	};

	const handleCategoryChange = (category: Category) => {
		setSelectedCategory(category);
	};

	const handleSaveEditedPainting = async (data: any) => {
		const updatedPainting = { ...editingPainting, ...data };

		const preparedEditingPainting = {
			...editingPainting,
			category: Array.isArray(editingPainting?.category) 
				? editingPainting?.category.map((cat) => typeof cat === 'string' ? cat : cat.name).join(", ") 
				: typeof editingPainting?.category === 'string' ? editingPainting?.category : editingPainting?.category.name,
		};
		let isDifferent = JSON.stringify(updatedPainting) === JSON.stringify(preparedEditingPainting);
		if (isDifferent) {
			console.log("No changes detected, not saving");
			toast.info("Wenn Sie keine Änderungen vorgenommen haben, wird das Gemälde auch nicht aktualisiert.");
			setEditingPainting(null);
			setCreateNewPainting(false);
			setIsDialogOpen(false);
			return;
		}

		if (!data.image || data.image === "") {
			toast.error("Bitte fügen Sie ein Bild hinzu");
			return;
		}

		let updatedPaintings = paintings.map((painting) => (painting.id === updatedPainting.id ? updatedPainting : painting));
		setIsLoading(true);

		try {
			// Prepare data for the backend
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

			// Remove the image field if no new image is selected
			if (!image) {
				delete updatedPainting.image;
			} else if (image instanceof File) {
				formData.append("image", image);
			}

			let response;

			console.log("Wird ein neues Gemälde erstellt?", newPainting);
			console.log("Aktuelles Gemälde", updatedPainting);

			if (newPainting) {
				// Create new painting
				response = await fetch("/api/paintings", {
					method: "POST",
					headers: {
						Authorization: `${BACKEND_KEY}`,
					},
					body: formData,
				});
			} else {
				// Update existing painting
				response = await fetch("/api/paintings/" + editingPainting?.id, {
					method: "PUT",
					headers: {
						Authorization: `${BACKEND_KEY}`,
					},
					body: formData,
				});
			}

			if (!response.ok) {
				// const { message } = await response.json();
				const message = await response.text();
				console.log("Message", message);
				toast.error(message.toString());
				console.error(`Failed to update painting: ${response.status} ${response.statusText}`);
				throw new Error(`Failed to update painting: ${response.status} ${response.statusText}`);
			}

			const savedPainting = await response.json();
			console.log("Saved painting", savedPainting);

			if (newPainting) {
				updatedPaintings.push(savedPainting);
			} else {
				const index = updatedPaintings.findIndex((painting) => painting.id === savedPainting.id);
				updatedPaintings[index] = savedPainting;
			}

			console.log("Updated paintings", updatedPaintings);

			setPaintings(updatedPaintings);

			setIsLoading(false);
			setEditingPainting(null);
			setCreateNewPainting(false);
			setIsDialogOpen(false);
			toast.success("Gemälde " + (newPainting ? "erstellt" : "aktualisiert") + "!");
		} catch (error) {
			toast.error("Fehler beim Speichern des Gemäldes");
			console.error("Error saving painting:", error);
			setCreateNewPainting(false);
			setIsLoading(false);
			// Handle error as needed
		}
		handleDeleteImage();
	};

	const handleDeletePainting = async () => {
		setIsLoading(true);
		if (!editingPainting) {
			toast.error("Kein Gemälde zum löschen gefunden");
			return;
		}

		try {
			const response = await fetch(`/api/paintings/${editingPainting.id}`, {
				method: "DELETE",
				headers: {
					Authorization: `${BACKEND_KEY}`,
				},
			});

			if (!response.ok) {
				throw new Error(`Failed to delete painting: ${response.status} ${response.statusText}`);
			}

			// Entferne das gelöschte Gemälde aus dem Zustand
			setPaintings((prevPaintings) => prevPaintings.filter((painting) => painting.id !== editingPainting.id));
			setEditingPainting(null);
			toast.success("Gemälde '" + editingPainting.title + "' wurde erfolgreich gelöscht");
			setIsDialogOpen(false);
		} catch (error) {
			console.error("Error deleting painting:", error);
			toast.error("Fehler beim Löschen des Gemäldes" + error);
		}
		setIsDeleteDrawerOpen(false);
		setIsLoading(false);
		setImage(null);
		setCreateNewPainting(false);
	};

	const handleCreateNewPainting = () => {
		setCreateNewPainting(true);
		setEditingPainting(null);
		reset({
			image: undefined,
			title: "",
			type: "",
			size: "",
			isFramed: false,
			isOOAK: false,
			category: "",
			content: "",
			buyLink: "",
			createdAt: new Date().getFullYear().toString(),
		});
		setIsDialogOpen(true);
	};

	const handleCloseDialog = () => {
		setIsDialogOpen(false);
		setEditingPainting(null);
		setCreateNewPainting(false);
	};

	return (
		<div className="flex flex-col h-full">
			<header className="bg-background border-b px-6 py-4 flex items-center justify-between">
				<h1 className="">Gemälde</h1>
				<div className="flex items-center gap-4">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline">
								<ViewIcon className="w-4 h-4 mr-2" />
								{viewMode === "grid" ? "Gitter Ansicht" : "Listen Ansicht"}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => setViewMode("grid")}>Gitter Ansicht</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setViewMode("list")}>Listen Ansicht</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					<Button onClick={handleCreateNewPainting} disabled={isLoading} variant={isLoading ? "secondary" : "default"}>
						Neues Gemälde
						<PlusIcon className="w-4 h-4 mr-2" />
					</Button>
				</div>
			</header>
			<div className="flex-1 overflow-auto p-6">
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center gap-4">
						<DropdownMenu>
							{/* Kategorien */}
							<DropdownMenuTrigger asChild>
								{categories ? (
									<Button variant="outline">
										<CheckIcon className="w-4 h-4 mr-2" />
										{selectedCategory.name}
									</Button>
								) : (
									<Button disabled variant="outline">
										Keine Katagorie gefunden
									</Button>
								)}
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								{categories ? (
									<DropdownMenuCheckboxItem checked={selectedCategory.name === "Alle"} onCheckedChange={() => handleCategoryChange({ name: "Alle", id: 0 })}>
										Alle
									</DropdownMenuCheckboxItem>
								) : (
									<DropdownMenuItem disabled>Keine Kategorien gefunden</DropdownMenuItem>
								)}
								{categories &&
									categories.map((category) => (
										<DropdownMenuCheckboxItem key={category.id} checked={selectedCategory.id === category.id} onCheckedChange={() => handleCategoryChange(category)}>
											{category.name}
										</DropdownMenuCheckboxItem>
									))}
							</DropdownMenuContent>
						</DropdownMenu>

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline">
									<ArrowUpDownIcon className="w-4 h-4 mr-2" />
									Sortieren nach: {sortBy === "title" ? "Titel" : sortBy === "type" ? "Typ" : sortBy === "size" ? "Größe" : sortBy === "category" ? "Kategorie" : sortBy === "createdAt" ? "Erstellungsdatum" : "Titel"}
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="start">
								<DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
									<DropdownMenuRadioItem value="title">Titel</DropdownMenuRadioItem>
									<DropdownMenuRadioItem value="type">Typ</DropdownMenuRadioItem>
									<DropdownMenuRadioItem value="size">Größe</DropdownMenuRadioItem>
									<DropdownMenuRadioItem value="category">Kategorie</DropdownMenuRadioItem>
									<DropdownMenuRadioItem value="createdAt">Erstellungsdatum</DropdownMenuRadioItem>
								</DropdownMenuRadioGroup>
								<DropdownMenuSeparator />
								<DropdownMenuRadioGroup value={sortOrder} onValueChange={setSortOrder}>
									<DropdownMenuRadioItem value="asc">Aufsteigend</DropdownMenuRadioItem>
									<DropdownMenuRadioItem value="desc">Absteigend</DropdownMenuRadioItem>
								</DropdownMenuRadioGroup>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
					<Input type="search" placeholder="Nach Gemälden suchen..." className="w-64" value={searchString} onChange={(e) => setSearchString(e.target.value)} />
				</div>
				<div
					className={cn("grid", {
						"grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3": viewMode === "grid",
						"grid-cols-1 gap-4": viewMode === "list",
					})}
				>
					{isLoading ? (
						// LOADING STATE
						<>
							{[1, 2, 3, 4, 5, 6].map((i) => (
								<Card className="cursor-pointer relative" key={i}>
									<Skeleton className="w-full h-48 object-cover rounded-t-lg" />
									<div className={`p-4 ${viewMode === "list" ? "w-full" : "py-4"}`}>
										<Skeleton className="w-44 h-6 mb-4" />
										<div className="grid gap-2 text-sm text-muted-foreground">
											<div className="flex items-center gap-2">
												<Skeleton className="size-6 animate-pulse" />
												<Skeleton className="w-20 h-4" />
											</div>
											<div className="flex items-center gap-2">
												<Skeleton className="size-6 animate-pulse" />
												<Skeleton className="w-20 h-4" />
											</div>
											<div className="flex items-center gap-2">
												<Skeleton className="size-6 animate-pulse" />
												<Skeleton className="w-20 h-4" />
											</div>
											<div className="flex items-center gap-2">
												<Skeleton className="size-6 animate-pulse" />
												<Skeleton className="w-20 h-4" />
											</div>
											<div className="flex items-center gap-2 flex-wrap">
												<Skeleton className="size-6 animate-pulse" />
												{[1, 2, 3, 4, 5].map((i) => (
													<Skeleton key={i} className="w-8 h-4" />
												))}
											</div>
										</div>
									</div>
								</Card>
							))}
						</>
					) : paintings.length === 0 ? (
						<div className="flex flex-col col-span-3 gap-3 items-center justify-center w-full h-36">
							<h2 className="">Es konnten keine Gemälde gefunden werden.</h2>
							{!errorMessage && <Button onClick={handleCreateNewPainting}>Neues Gemälde erstellen</Button>}
							{errorMessage && <Badge variant={"destructive"}>{errorMessage}</Badge>}
							<Button size={"lg"} className="mt-4" disabled={isLoading} variant={"secondary"} onClick={loadPaintings}>
								{isLoading ? <LoadingIcon /> : "Erneut versuchen"}
							</Button>
						</div>
					) : filteredPaintings.length === 0 ? (
						<div className="flex col-span-3 items-center justify-center w-full h-36">
							<h2 className="">
								Keine Gemälde mit der Kategorie <span className="font-semibold">{selectedCategory.name}</span> gefunden.
							</h2>
						</div>
					) : (
						filteredPaintings.map((painting: Painting) => <PaintingCard painting={painting} onEdit={handleEditPainting} viewMode={viewMode as "grid" | "list"} />)
					)}
				</div>
			</div>
			{isDialogOpen && (
				<Dialog open onOpenChange={handleCloseDialog}>
					<DialogContent className="w-full max-w-4xl" aria-description={`Edit painting ${editingPainting?.title}`}>
						<DialogHeader>
							<DialogTitle className="not-italic font-sans text-2xl group">
								{editingPainting ? `${editingPainting?.title} bearbeiten` : "Neues Gemälde erstellen"}
								<span className="ml-2 transition-all duration-300 blur-sm group-hover:blur-0 text-slate-100">{editingPainting?.id}</span>
							</DialogTitle>
						</DialogHeader>
						<div>
							<Form {...form}>
								<form onSubmit={form.handleSubmit(handleSaveEditedPainting)}>
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
																		<ScrollArea className="text-left">
																			{typeof field.value === 'string' ? 
																				field.value.split(", ").length >= 5 ? field.value.split(", ").length + " Kategorien ausgewählt" : field.value ? field.value : <span className="text-slate-500">Kategorie wählen...</span> 
																				: <span className="text-slate-500">Kategorie wählen...</span>}
																		</ScrollArea>
																	</Button>
																</DropdownMenuTrigger>
																<DropdownMenuContent>
																	<DropdownMenuGroup>
																		{categories.map((category) => {
																			const isChecked = typeof field.value === 'string' ? field.value.split(", ").includes(category.name) : false;
																			return (
																				<DropdownMenuCheckboxItem
																					key={category.name}
																					checked={isChecked}
																					onCheckedChange={() => {
																						let newCategories;
																						if (isChecked) {
																							// Ensure field.value is a string before calling split
																							const categoryValue = typeof field.value === 'string' ? field.value : '';
																							newCategories = categoryValue
																								.split(", ")
																								.filter((cat) => cat !== category.name)
																								.join(", ");
																						} else {
																							// Ensure field.value is a string before calling split
																							const categoryValue = typeof field.value === 'string' ? field.value : '';
																							newCategories = [...categoryValue.split(", ").filter(Boolean), category.name].join(", ");
																						}
																						setValue("category", newCategories);
																						setIsCatDropdownOpen(true);
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
																<div tabIndex={0} className={"focus-within:ring-2 focus-within:ring-slate-950 focus-within:ring-offset-4 group size-44 ring-0 hover:ring-2 ring-offset-2 hover:ring-slate-950 bg-cover rounded-md relative overflow-hidden"} style={{ backgroundImage: `url(${field.value})` }}>
																	<HoverCard>
																		<HoverCardTrigger className="absolute hidden lg:block z-10 top-0 right-0 p-2 justify-center">
																			<Badge>Vorschau</Badge>
																		</HoverCardTrigger>
																		<HoverCardContent side="right" className="size-fit">
																			<img src={field.value} alt={editingPainting?.title + " Gemälde"} className="object-cover h-auto w-[500px]" />
																		</HoverCardContent>
																	</HoverCard>
																	<div className="absolute ring-0 focus:ring-0 inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center">
																		<div className="px-8 hover:cursor-pointer ring-0 focus:ring-0 py-16 text-white" onClick={handleDeleteImage}>
																			<Badge variant={"destructive"}>Bild Löschen</Badge>
																		</div>
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
															<Input {...field} />
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
										{/* dont show next button when its a new painting, only when its an editingPainting */}
										<Button type="button" variant="destructive" onClick={() => setIsDeleteDrawerOpen(true)} className={`w-24 ${newPainting ? "hidden" : ""}`} disabled={isLoading}>
											Löschen
										</Button>
										<Button className="w-24" type="button" variant="outline" onClick={handleCloseDialog} disabled={isLoading}>
											Abbrechen
										</Button>
										<Button className="w-24" ref={saveButton} disabled={isLoading}>
											{editingPainting?.id && !isLoading ? "Speichern" : !isLoading ? "Erstellen" : null}
											{isLoading ? <LoadingIcon /> : null}
										</Button>
									</div>
								</form>
							</Form>
						</div>
					</DialogContent>
				</Dialog>
			)}
			<Drawer open={isDeleteDrawerOpen} onOpenChange={setIsDeleteDrawerOpen}>
				<DrawerContent>
					<DrawerHeader className="flex flex-col lg:flex-row items-end justify-between">
						<div className="flex flex-col">
							<DrawerTitle className="not-italic text-3xl font-sans">Gemälde "{editingPainting?.title}" löschen</DrawerTitle>
							<DrawerDescription>Sind Sie sicher, dass Sie dieses Gemälde löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.</DrawerDescription>
						</div>
						<img src={editingPainting?.image} alt={editingPainting?.title} className="w-1/3 h-auto object-cover rounded-lg" />
					</DrawerHeader>
					<DrawerFooter>
						<Button variant="outline" onClick={() => setIsDeleteDrawerOpen(false)}>
							Abbrechen
						</Button>
						<Button type="button" variant="destructive" onClick={handleDeletePainting} disabled={isLoading}>
							{!isLoading ? "Löschen" : null}
							{isLoading ? <LoadingIcon /> : null}
						</Button>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		</div>
	);
};
