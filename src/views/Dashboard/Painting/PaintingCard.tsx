import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BrushIcon, RulerIcon, FrameIcon, DiamondIcon, FolderIcon } from "@/components/icons";
import { Painting } from "@/types/types";
import { PenBoxIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type PaintingCardProps = {
	painting: Painting;
	onEdit: (painting: Painting) => void;
	viewMode: "grid" | "list";
};

const PaintingCard: React.FC<PaintingCardProps> = ({ painting, onEdit, viewMode }) => {
	return (
		<Card
			id={painting.id?.toString()}
			autoFocus
			key={painting.id}
			className={cn("cursor-pointer hover:ring-2 ring-offset-2 active:ring-offset-2 active:ring-4 active:ring-slate-800/5 active:shadow-sm shadow-lg duration-200 transition-all border-slate-300 ring-slate-800 h-96 group *:transition-all *:duration-1000 *:ease-in-out overflow-hidden relative", {
				"flex items-center gap-4": viewMode === "list",
			})}
			onClick={() => onEdit(painting)}
		>
			{/* center penbox */}
			<div className="absolute p-4 rounded-full bg-white top-5 right-5 opacity-0 duration-300 group-hover:opacity-100">
				<PenBoxIcon className="size-6 text-slate-950" />
			</div>
			<img
				src={painting.image}
				alt={painting.title}
				className={cn("w-full h-48 object-cover rounded-t-lg", {
					"w-full rounded-lg h-full": viewMode === "list",
					"rounded-lg group-hover:h-full": viewMode === "grid",
				})}
			/>
			<div className={`p-4 ${viewMode === "list" ? "w-full" : "py-4"}`}>
				<h3 className="text-lg flex items-center justify-between not-italic font-sans font-bold">
					{painting.title} <Badge>{painting.createdAt}</Badge>
				</h3>
				<div className={`grid gap-2 text-sm text-muted-foreground ${viewMode === "list" ? "grid-cols-2 gap-x-4" : ""}`}>
					<div className="flex items-center gap-2">
						<BrushIcon className="w-4 h-4" />
						<span>{painting.type}</span>
					</div>
					<div className="flex items-center gap-2">
						<RulerIcon className="w-4 h-4" />
						<span>{painting.size}</span>
					</div>
					{painting.isFramed && (
						<div className="flex items-center gap-2">
							<FrameIcon className="w-4 h-4" />
							<span>Gerahmt</span>
						</div>
					)}
					{painting.isOOAK && (
						<div className="flex items-center gap-2">
							<DiamondIcon className="w-4 h-4" />
							<span>One-of-a-Kind</span>
						</div>
					)}
					<div className="flex items-center gap-2 flex-wrap">
						<FolderIcon className="w-4 h-4" />
						{(Array.isArray(painting.category) ? painting.category : []).map((cat: any) => (
							<Badge key={cat.id} variant="outline" className="text-xs">
								{cat.name}
							</Badge>
						))}
					</div>
				</div>
			</div>
		</Card>
	);
};

export default PaintingCard;
