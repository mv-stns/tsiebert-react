import React, { useEffect, useMemo, useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { PlusIcon } from "@heroicons/react/20/solid";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { LoadingIcon } from "@/components/icons";

type Props = {};

const BACKEND_KEY = import.meta.env.VITE_BACKEND_KEY;

type Category = {
	id: number;
	name: string;
};

export const CategoryManagement = (props: Props) => {
	const [categories, setCategories] = useState<Category[]>([]);
	const [selectedCategories, setSelectedCategories] = useState<Record<string, boolean>>({});
	const [selectedSingleCategory, setSelectedSingleCategory] = useState<Category | null>(null);
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const loadCategories = async () => {
		try {
			const response = await fetch("/api/category", {
				method: "GET",
				headers: {
					authorization: `${BACKEND_KEY}`,
				},
			});
			const data = await response.json();
			if (response.status === 404) {
				toast.error("Es wurden keine Kategorien gefunden");
				setIsLoading(false);
				return;
			} else if (response.status !== 200) {
				toast.error("Fehler beim Laden der Kategorien");
				setIsLoading(false);
				return;
			}
			data.sort((a: Category, b: Category) => a.id - b.id);
			setCategories(data);
		} catch (error) {
			toast.error("Fehler beim Laden der Kategorien " + error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		loadCategories();
	}, []);

	const handleCreateCategory = async (name: string) => {
		let updatedCategories = categories;
		let newCategory;
		try {
			const data = await fetch("/api/category", {
				method: "POST",
				headers: {
					"Authorization": `${BACKEND_KEY}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ name }),
			});
			if (data.status === 409) {
				toast.info("Kategorie " + name + " existiert bereits");
				return;
			} else {
				newCategory = await data.json();
				updatedCategories = [...categories, newCategory];
				setCategories(updatedCategories);
				toast.success("Kategorie " + name + " erfolgreich hinzugefügt");
			}
		} catch (error) {
			toast.error("Fehler beim Hinzufügen der Kategorie " + error);
		}
		setIsCreateDialogOpen(false);
	};

	const handleEditCategory = async (id: number, name: string) => {
		try {
			const response = await fetch(`/api/category/${id}`, {
				method: "PUT",
				headers: {
					"Authorization": `${BACKEND_KEY}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ name }),
			});
			if (response.ok) {
				const updatedCategories = categories.map((category) => (category.id === id ? { ...category, name } : category));
				setCategories(updatedCategories);
				toast.success("Kategorie erfolgreich bearbeitet");
			} else {
				toast.error("Fehler beim Bearbeiten der Kategorie");
			}
		} catch (error) {
			toast.error("Fehler beim Bearbeiten der Kategorie " + error);
		}
		setIsEditDialogOpen(false);
	};

	const handleDeleteCategory = async (id: number) => {
		setIsLoading(true);
		try {
			const response = await fetch(`/api/category/${id}`, {
				method: "DELETE",
				headers: {
					Authorization: `${BACKEND_KEY}`,
				},
			});
			if (response.ok) {
				const updatedCategories = categories.filter((category) => category.id !== id);
				setCategories(updatedCategories);
				toast.success("Kategorie erfolgreich gelöscht");
			} else {
				toast.error("Fehler beim Löschen der Kategorie");
			}
		} catch (error) {
			toast.error("Fehler beim Löschen der Kategorie " + error);
		} finally {
			setIsLoading(false);
			setIsDeleteDialogOpen(false);
			setSelectedSingleCategory(null);
		}
	};

	const handleBulkDelete = async () => {
		const amount = Object.keys(selectedCategories).length;
		if (amount <= 0) {
			toast.info("Bitte wählen Sie mindestens eine Kategorie aus");
			return;
		}
		// if more than one
		if (Object.keys(selectedCategories).length > 1) {
			const rowIndex = Object.keys(selectedCategories).filter((id) => selectedCategories[id]);
			const idsToDelete = rowIndex.map((index: any) => table.getRowModel().rows[index].original.id);
			for (const id of idsToDelete) {
				await handleDeleteCategory(Number(id));
			}
		} else {
			const id = Number(Object.keys(selectedCategories)[0]);
			await handleDeleteCategory(id);
		}
		setSelectedCategories({});
		setIsDeleteDialogOpen(false);
		// refresh table
		loadCategories();
	};

	const columns = useMemo<ColumnDef<Category>[]>(
		() => [
			{
				id: "select",
				header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected()} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} />,
				cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} />,
			},
			{
				accessorKey: "id",
				header: "ID",
			},
			{
				accessorKey: "name",
				header: "Name",
			},
			{
				id: "actions",
				header: "Aktion",
				cell: ({ row }) => (
					<div className="flex gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => {
								setSelectedCategory(row.original);
								setIsEditDialogOpen(true);
							}}
						>
							Bearbeiten
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => {
								setSelectedSingleCategory(row.original);
								setIsDeleteDialogOpen(true);
							}}
							disabled={isLoading}
						>
							{isLoading ? <LoadingIcon /> : "Löschen"}
						</Button>
					</div>
				),
			},
		],
		[]
	);

	const table = useReactTable({
		data: categories,
		columns,
		getCoreRowModel: getCoreRowModel(),
		state: {
			rowSelection: selectedCategories,
		},
		onRowSelectionChange: (updater) => {
			const newSelectedCategories = updater instanceof Function ? updater(selectedCategories) : updater;
			setSelectedCategories(newSelectedCategories);
		},
	});

	return (
		<div className="flex flex-col h-full">
			<header className="bg-background border-b px-6 py-4 flex items-center justify-between">
				<h1 className="">Kategorien verwalten</h1>
				<div className="flex gap-4">
					<Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)} disabled={Object.keys(selectedCategories).length === 0 || isLoading}>
						Ausgewählte löschen
					</Button>
					<Button onClick={() => setIsCreateDialogOpen(true)} disabled={isLoading} variant={isLoading ? "ghost" : "default"}>
						Kategorie hinzufügen
						<PlusIcon className="size-6" />
					</Button>
				</div>
			</header>
			<div className="border mt-8 rounded-lg overflow-hidden">
				{categories && !isLoading ? (
					<Table>
						<TableHeader>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => (
										<TableHead key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
									))}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{table.getRowModel().rows.map((row) => (
								<TableRow key={row.id}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
									))}
								</TableRow>
							))}
						</TableBody>
					</Table>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>ID</TableHead>
								<TableHead>Name</TableHead>
								<TableHead>Aktion</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{[1, 2, 3, 4, 5].map((index) => (
								<TableRow key={index}>
									<TableCell>
										<Skeleton className="w-12 h-8" />
									</TableCell>
									<TableCell>
										<Skeleton className="w-24 h-8" />
									</TableCell>
									<TableCell className="flex gap-4">
										<Skeleton className="w-24 h-8" />
										<Skeleton className="w-24 h-8" />
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</div>
			<AlertDialog open={isCreateDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle className="not-italic font-sans">Neue Kategorie hinzufügen</AlertDialogTitle>
						<AlertDialogDescription>Bitte geben Sie den Namen der neuen Kategorie ein.</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<Input
							placeholder="Kategorie Name"
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									handleCreateCategory((e.target as HTMLInputElement).value);
								}
							}}
						/>
						<div className="flex gap-2">
							<Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
								Abbrechen
							</Button>
							<Button
								onClick={() => {
									const name = (document.querySelector("input") as HTMLInputElement).value;
									handleCreateCategory(name);
								}}
							>
								Hinzufügen
							</Button>
						</div>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
			<AlertDialog open={isEditDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle className="not-italic font-sans">Kategorie bearbeiten</AlertDialogTitle>
						<AlertDialogDescription>Bitte geben Sie den neuen Namen der Kategorie ein.</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<Input
							defaultValue={selectedCategory?.name}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									handleEditCategory(selectedCategory!.id, (e.target as HTMLInputElement).value);
								}
							}}
						/>
						<div className="flex gap-2">
							<Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
								Abbrechen
							</Button>
							<Button
								onClick={() => {
									const name = (document.querySelector("input") as HTMLInputElement).value;
									handleEditCategory(selectedCategory!.id, name);
								}}
							>
								Speichern
							</Button>
						</div>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
			<AlertDialog open={isDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle className="not-italic font-sans">Katgeorie löschen</AlertDialogTitle>
						<AlertDialogDescription>Sind Sie sicher, dass Sie die Kategorie/n löschen möchten?</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<div className="flex gap-2">
							<Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
								Abbrechen
							</Button>
							{selectedSingleCategory ? (
								<Button variant="destructive" onClick={() => handleDeleteCategory(selectedSingleCategory.id)}>
									{isLoading ? <LoadingIcon /> : "Löschen"}
								</Button>
							) : (
								<Button variant="destructive" onClick={handleBulkDelete}>
									{isLoading ? <LoadingIcon /> : "Löschen"}
								</Button>
							)}
						</div>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
};
