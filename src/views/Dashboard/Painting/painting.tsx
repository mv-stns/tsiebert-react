type Props = {};

/**
 * v0 by Vercel.
 * @see https://v0.dev/t/I6SeiTKMTDr
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
("use client");

import { useState, useMemo } from "react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export const PaintingManagement = (props: Props) => {
	const [paintings, setPaintings] = useState([
		{
			id: 1,
			image: "/placeholder.svg",
			title: "Sonnenuntergangsruhe",
			type: "Ölgemälde",
			size: '24" x 36"',
			framed: true,
			oneOfAKind: true,
			category: "Landschaft",
		},
		{
			id: 2,
			image: "/placeholder.svg",
			title: "Herbstliche Freude",
			type: "Acryl",
			size: '18" x 24"',
			framed: false,
			oneOfAKind: true,
			category: "Landschaft",
		},
		{
			id: 3,
			image: "/placeholder.svg",
			title: "Lebhafte Stadtszene",
			type: "Aquarell",
			size: '12" x 16"',
			framed: true,
			oneOfAKind: false,
			category: "Städtisch",
		},
		{
			id: 4,
			image: "/placeholder.svg",
			title: "Ätherische Blüte",
			type: "Ölgemälde",
			size: '30" x 40"',
			framed: true,
			oneOfAKind: true,
			category: "Blumen",
		},
		{
			id: 5,
			image: "/placeholder.svg",
			title: "Küstenbrise",
			type: "Acryl",
			size: '20" x 30"',
			framed: false,
			oneOfAKind: true,
			category: "Landschaft",
		},
		{
			id: 6,
			image: "/placeholder.svg",
			title: "Städtischer Rhythmus",
			type: "Aquarell",
			size: '16" x 20"',
			framed: true,
			oneOfAKind: false,
			category: "Städtisch",
		},
	]);

	const [selectedCategory, setSelectedCategory] = useState("All");
	const [sortBy, setSortBy] = useState("title");
	const [sortOrder, setSortOrder] = useState("asc");
	const [editingPainting, setEditingPainting] = useState(null);
	const [viewMode, setViewMode] = useState("grid");
	const filteredPaintings = useMemo(() => {
		let filtered = paintings;
		if (selectedCategory !== "All") {
			filtered = filtered.filter((painting) => painting.category === selectedCategory);
		}
		return filtered.sort((a, b) => {
			if (sortOrder === "asc") {
				return a[sortBy] > b[sortBy] ? 1 : -1;
			} else {
				return a[sortBy] < b[sortBy] ? 1 : -1;
			}
		});
	}, [paintings, selectedCategory, sortBy, sortOrder]);
	const handleEditPainting = (painting) => {
		setEditingPainting(painting);
	};
	const handleSaveEditedPainting = (updatedPainting) => {
		const updatedPaintings = paintings.map((painting) => {
			if (painting.id === updatedPainting.id) {
				return updatedPainting;
			}
			return painting;
		});
		setPaintings(updatedPaintings);
		setEditingPainting(null);
	};
	const handleCreateNewPainting = () => {
		setEditingPainting({
			id: Date.now(),
			image: "/placeholder.svg",
			title: "",
			type: "",
			size: "",
			framed: false,
			oneOfAKind: false,
			category: "",
		});
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
								{viewMode === "grid" ? "Grid View" : "List View"}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => setViewMode("grid")}>Grid View</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setViewMode("list")}>List View</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					<Button onClick={handleCreateNewPainting}>
						<PlusIcon className="w-4 h-4 mr-2" />
						Create New
					</Button>
				</div>
			</header>
			<div className="flex-1 overflow-auto p-6">
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center gap-4">
						<Select value={selectedCategory} onValueChange={setSelectedCategory}>
							<SelectTrigger>
								<SelectValue placeholder="Filter by category" />
							</SelectTrigger>
							<SelectContent>
								{["All", "Landscape", "Floral", "Urban"].map((category) => (
									<SelectItem key={category} value={category}>
										{category}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline">
									<ArrowUpDownIcon className="w-4 h-4 mr-2" />
									Sortieren nach: {sortBy === "title" ? "Titel" : sortBy === "type" ? "Typ" : sortBy === "size" ? "Größe" : "Kategorie"}
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="start">
								<DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
									<DropdownMenuRadioItem value="title">Titel</DropdownMenuRadioItem>
									<DropdownMenuRadioItem value="type">Typ</DropdownMenuRadioItem>
									<DropdownMenuRadioItem value="size">Größe</DropdownMenuRadioItem>
									<DropdownMenuRadioItem value="category">Kategorie</DropdownMenuRadioItem>
								</DropdownMenuRadioGroup>
								<DropdownMenuSeparator />
								<DropdownMenuRadioGroup value={sortOrder} onValueChange={setSortOrder}>
									<DropdownMenuRadioItem value="asc">Aufsteigend</DropdownMenuRadioItem>
									<DropdownMenuRadioItem value="desc">Absteigend</DropdownMenuRadioItem>
								</DropdownMenuRadioGroup>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
					<Input type="search" placeholder="Search paintings..." className="w-64" />
				</div>
				<div className={`grid ${viewMode === "grid" ? "grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3" : "grid-cols-1 gap-4"}`}>
					{filteredPaintings.map((painting) => (
						<Card key={painting.id} className={`cursor-pointer relative ${viewMode === "list" ? "flex items-center gap-4" : ""}`} onClick={() => handleEditPainting(painting)}>
							<img src="/placeholder.svg" alt={painting.title} width={300} height={200} className={`w-full h-48 object-cover rounded-t-lg ${viewMode === "list" ? "w-32 h-24 rounded-lg" : ""}`} />
							<div className={`p-4 ${viewMode === "list" ? "w-full" : "py-4"}`}>
								<h3 className="text-lg not-italic font-sans font-bold">{painting.title}</h3>
								<div className={`grid gap-2 text-sm text-muted-foreground ${viewMode === "list" ? "grid-cols-2 gap-x-4" : ""}`}>
									<div className="flex items-center gap-2">
										<BrushIcon className="w-4 h-4" />
										<span>{painting.type}</span>
									</div>
									<div className="flex items-center gap-2">
										<RulerIcon className="w-4 h-4" />
										<span>{painting.size}</span>
									</div>
									{painting.framed && (
										<div className="flex items-center gap-2">
											<FrameIcon className="w-4 h-4" />
											<span>Gerahmt</span>
										</div>
									)}
									{painting.oneOfAKind && (
										<div className="flex items-center gap-2">
											<DiamondIcon className="w-4 h-4" />
											<span>One-of-a-Kind</span>
										</div>
									)}
									<div className="flex items-center gap-2">
										<FolderIcon className="w-4 h-4" />
										<span>{painting.category}</span>
									</div>
								</div>
							</div>
						</Card>
					))}
				</div>
			</div>
			{editingPainting && (
				<Dialog open onOpenChange={setEditingPainting}>
					<DialogContent className="w-full max-w-4xl">
						<DialogHeader>
							<DialogTitle className="not-italic font-sans text-2xl">{editingPainting.id ? "Gemälde bearbeiten" : "Neues Gemälde einrichten"}</DialogTitle>
						</DialogHeader>
						<div>
							<form
								onSubmit={(e) => {
									e.preventDefault();
									handleSaveEditedPainting(editingPainting);
								}}
								className="grid gap-6"
							>
								<div className="grid grid-cols-2 gap-6">
									<div className="grid gap-2">
										<Label htmlFor="title">Titel</Label>
										<Input
											id="title"
											value={editingPainting.title}
											onChange={(e) =>
												setEditingPainting({
													...editingPainting,
													title: e.target.value,
												})
											}
										/>
									</div>
									<div className="grid gap-2">
										<Label htmlFor="type">Typ</Label>
										<Input
											id="type"
											value={editingPainting.type}
											onChange={(e) =>
												setEditingPainting({
													...editingPainting,
													type: e.target.value,
												})
											}
										/>
									</div>
								</div>
								<div className="grid grid-cols-2 gap-6">
									<div className="grid gap-2">
										<Label htmlFor="size">Größe</Label>
										<Input
											id="size"
											value={editingPainting.size}
											onChange={(e) =>
												setEditingPainting({
													...editingPainting,
													size: e.target.value,
												})
											}
										/>
									</div>
									<div className="grid gap-2">
										<Label htmlFor="category">Kategorie</Label>
										<Select
											id="category"
											value={editingPainting.category}
											onChange={(value) =>
												setEditingPainting({
													...editingPainting,
													category: value,
												})
											}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select category" />
											</SelectTrigger>
											<SelectContent>
                                                {/* TODO: SWITCH FUNKTIONIERT NOCH NICHT */}
												{["Landschaft", "Blumen", "Städtisch"].map((category) => (
													<SelectItem key={category} value={category}>
														{category}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="image">Image</Label>
									<Input
										id="image"
										type="file"
										onChange={(e) =>
											setEditingPainting({
												...editingPainting,
												image: URL.createObjectURL(e.target.files[0]),
											})
										}
									/>
								</div>
								<div className="grid grid-cols-2 gap-6">
									<div className="grid gap-2">
										<Label className="flex items-center gap-2">
											<Checkbox
												checked={editingPainting.framed}
												onCheckedChange={(checked) =>
													setEditingPainting({
														...editingPainting,
														framed: checked,
													})
												}
											/>
											{editingPainting.framed ? "Das Gemälde ist gerahmt" : "Das Gemälde ist nicht gerahmt"}
										</Label>
									</div>
									<div className="grid gap-2">
										<Label className="flex items-center gap-2">
											<Checkbox
												checked={editingPainting.oneOfAKind}
												onCheckedChange={(checked) =>
													setEditingPainting({
														...editingPainting,
														oneOfAKind: checked,
													})
												}
											/>
											{editingPainting.oneOfAKind ? "Das Gemälde ist ein Unikat" : "Das Gemälde ist kein Unikat"}
										</Label>
									</div>
								</div>
								<div className="flex justify-end gap-4">
									<Button type="button" variant="outline" onClick={() => setEditingPainting(null)}>
										Abbrechen
									</Button>
									<Button type="submit">Speichern</Button>
								</div>
							</form>
						</div>
					</DialogContent>
				</Dialog>
			)}
		</div>
	);
};

function ArrowUpDownIcon(props) {
	return (
		<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<path d="m21 16-4 4-4-4" />
			<path d="M17 20V4" />
			<path d="m3 8 4-4 4 4" />
			<path d="M7 4v16" />
		</svg>
	);
}

function BrushIcon(props) {
	return (
		<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08" />
			<path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z" />
		</svg>
	);
}

function DiamondIcon(props) {
	return (
		<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z" />
		</svg>
	);
}

function FolderIcon(props) {
	return (
		<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
		</svg>
	);
}

function FrameIcon(props) {
	return (
		<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<line x1="22" x2="2" y1="6" y2="6" />
			<line x1="22" x2="2" y1="18" y2="18" />
			<line x1="6" x2="6" y1="2" y2="22" />
			<line x1="18" x2="18" y1="2" y2="22" />
		</svg>
	);
}

function LayoutGridIcon(props) {
	return (
		<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<rect width="7" height="7" x="3" y="3" rx="1" />
			<rect width="7" height="7" x="14" y="3" rx="1" />
			<rect width="7" height="7" x="14" y="14" rx="1" />
			<rect width="7" height="7" x="3" y="14" rx="1" />
		</svg>
	);
}

function PlusIcon(props) {
	return (
		<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<path d="M5 12h14" />
			<path d="M12 5v14" />
		</svg>
	);
}

function RulerIcon(props) {
	return (
		<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z" />
			<path d="m14.5 12.5 2-2" />
			<path d="m11.5 9.5 2-2" />
			<path d="m8.5 6.5 2-2" />
			<path d="m17.5 15.5 2-2" />
		</svg>
	);
}

function ViewIcon(props) {
	return (
		<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<path d="M5 12s2.545-5 7-5c4.454 0 7 5 7 5s-2.546 5-7 5c-4.455 0-7-5-7-5z" />
			<path d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
			<path d="M21 17v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2" />
			<path d="M21 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2" />
		</svg>
	);
}
