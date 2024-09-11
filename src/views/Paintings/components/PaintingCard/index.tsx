import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContainer, DialogTrigger, DialogContent, DialogClose, DialogImage, DialogTitle, DialogSubtitle, DialogDescription } from "@/components/HeadlessDialog";
import { motion, AnimatePresence, MotionConfig, Transition, Variant, easeInOut, spring } from "framer-motion";
import { PlusIcon, ArrowUpRight, ChevronDown, ChevronUp } from "lucide-react";
import { Category, Painting, Props } from "@/types/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArtmajeurLogo, SingulartLogo } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// Custom hook to fetch paintings
const usePaintings = () => {
	const AUTH_KEY = import.meta.env.VITE_BACKEND_KEY;
	return useQuery({
		queryKey: ["paintings"],
		queryFn: async () => {
			const response = await fetch("/api/paintings", {
				headers: {
					Authorization: `${AUTH_KEY}`,
				},
			});
			console.log(response);
			// sort the paintings by createdAt date
			const data = await response.json();
			data.sort((a: Painting, b: Painting) => {
				return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
			});
			return data;
		},
	});
};

function PaintingWrapper(props: any) {
	return (
		<div {...props} className="py-16 flex gap-14 flex-col w-full">
				<h1 className="inline-flex w-full">Meine Werke</h1>
				<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-14">{props.children}</div>
			</div>
	);
}

const PaintingCard: React.FC = (props: Props) => {
	const { data: paintings, error, isLoading } = usePaintings();
	const [isDescriptionOpen, toggleDescription] = useState(false);

	if (isLoading) {
		return (
			<PaintingWrapper>
				<Skeleton className="rounded-xl shadow-xl border border-slate-700 outline outline-4 outline-slate-950/10 outline-offset-4 bg-gray-300 pointer-events-none aspect-[5/6] w-full"></Skeleton>
				<Skeleton className="rounded-xl shadow-xl border border-slate-700 outline outline-4 outline-slate-950/10 outline-offset-4 bg-gray-300 pointer-events-none aspect-[5/6] w-full"></Skeleton>
				<Skeleton className="rounded-xl shadow-xl border border-slate-700 outline outline-4 outline-slate-950/10 outline-offset-4 bg-gray-300 pointer-events-none aspect-[5/6] w-full"></Skeleton>
			</PaintingWrapper>
		);
	}

	if (error) {
		if (error == null)
			return (
				<PaintingWrapper>
					<div>Ein unbekannter Fehler ist aufgetreten</div>
				</PaintingWrapper>
			);
		return (
			<PaintingWrapper>
				<p>Ein Fehler ist aufgetreten: {String(error)}</p>
			</PaintingWrapper>
		);
	}

	return (
		<PaintingWrapper>
			{paintings?.map((painting: Painting) => {
				const { id, title, image, size, createdAt, content, buyLink, isOOAK, isFramed, category, type } = painting;
				const shoppingPlattform = (link: string) => {
					if (link.includes("singulart")) return "Singulart";
					if (link.includes("artmajeur")) return "Artmajeur";
					const regex = /https?:\/\/(www\.)?([a-zA-Z0-9-]+)\./;
					return link.match(regex)![2];
				};
				const platformIcons: { [key: string]: JSX.Element } = {
					singulart: <SingulartLogo />,
					artmajeur: <ArtmajeurLogo />,
				};
				return (
					<Dialog
						key={id}
						transition={{
							type: "spring",
							bounce: 0,
							duration: 0.45,
						}}
					>
						<DialogTrigger className="flex flex-col gap-2 relative group cursor-pointer">
							<div className="absolute top-4 right-4 md:opacity-0 md:group-hover:opacity-100 rounded-full bg-white z-20 size-12 flex items-center justify-center text-4xl md:rotate-90 md:group-hover:rotate-0 scale-100 md:group-hover:scale-110 transition-all duration-300 ease-in-out">
								<ArrowUpRight />
							</div>
							<div className="-inset-4 rounded-3xl absolute transition-colors duration-200 ease-in-out group-hover:bg-gray-200/60"></div>
							<DialogImage src={image as string} alt={title} className="rounded-xl z-10 pointer-events-none aspect-[5/6] object-cover shadow-[0px_52px_21px_0px_rgba(0,0,0,0.02),0px_29px_18px_0px_rgba(0,0,0,0.08),0px_13px_13px_0px_rgba(0,0,0,0.13),0px_3px_7px_0px_rgba(0,0,0,0.15)]" />
							<div className="flex z-10 gap-1 items-center text-sm whitespace-nowrap">
								<DialogTitle>
									<h2 className="font-semibold text-sm not-italic font-sans uppercase">{title}</h2>
								</DialogTitle>
								<span className="font-light">{size}</span>
								<div className="h-px w-full bg-[#CBD0D7] transition-all duration-200 ease-in-out group-hover:bg-[hsl(215deg,13%,50%,1)]"></div>
								<DialogDescription className="text-slate-700 dark:text-slate-400">
									<time className="italic font-main">{createdAt}</time>
								</DialogDescription>
							</div>
						</DialogTrigger>
						<DialogContainer className="px-32">
							<DialogContent style={{ borderRadius: "24px" }} className="pointer-events-auto w-fit shadow-lg relative flex overflow-hidden border border-slate-950/10 bg-white dark:border-slate-50/10 dark:bg-slate-900">
								<DialogImage src={image as string} alt={title} className="h-full aspect-[5/6] object-cover w-1/3" />
								<div className="p-6">
									<div className="flex gap-2 items-center">
										<DialogTitle className="text-2xl font-semibold not-italic font-sans uppercase">{title}</DialogTitle>
										<time className="text-slate-300">({createdAt})</time>
									</div>
									<div className="flex items-start gap-8">
										<h2 className="mb-4 mt-8 not-italic text-slate-950 font-sans font-semibold text-xs">{isOOAK == false ? "" : "Original-Kunstwerk (ONE OF A KIND)"}</h2>
										{type && <h2 className="mb-4 not-italic mt-8 text-slate-950 font-normal font-sans text-xs">{type}</h2>}
									</div>
									<div className={cn("flex gap-8")}>
										<h3 className="not-italic font-sans font-semibold text-xs">Maße:</h3>
										<h4 className="mb-4 text-slate-950 not-italic font-normal font-sans text-xs">{painting.size}</h4>
									</div>
									<div className="flex gap-8">
										<h3 className="not-italic font-sans font-semibold text-xs">Rahmen:</h3>
										<h4 className="mb-4 text-slate-950 not-italic font-normal font-sans text-xs">{isFramed ? "Gerahmt" : "Ungerahmt"}</h4>
									</div>
									<div className="flex gap-8">
										<h3 className="not-italic font-sans font-semibold text-xs">Kategorien:</h3>
										<div className="flex flex-wrap gap-1 items-center justify-center">
											{(category as Category[]).map((cat: Category, index: number, array: Category[]) => (
												<Badge className="rounded-md" key={cat.id} variant={"outline"}>
													{cat.name}
												</Badge>
											))}
										</div>
									</div>
									{content && (
										<div className="max-w-2xl relative mb-24">
											<motion.p
												// cubic easing like figmas preset gentle
												transition={{ easings: [0.645, 0.045, 0.355, 1], bounce: 1.25, duration: 0.5, type: "spring", stiffness: 80, damping: 15 }}
												className={cn("mt-4 text-slate-800 text-base overflow-hidden dark:text-slate-500")}
												animate={{
													// when the description is open, the height should be 200px, else 25px
													height: isDescriptionOpen ? "auto" : "75px",
												}}
											>
												{content}
											</motion.p>
											<motion.div
												className={cn("absolute z-10 justify-center flex items-end inset-0")}
												transition={{
													duration: 0.5,
													ease: "easeInOut",
													type: "spring",
													stiffness: 80,
													damping: 15,
												}}
												animate={{
													background: isDescriptionOpen ? "linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 100%)" : "linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%)",
												}}
											>
												<motion.button
													onClick={() => toggleDescription(!isDescriptionOpen)}
													className="flex underline"
													animate={{
														// -bottom-10 absolute
														bottom: isDescriptionOpen ? -50 : -30,
														position: isDescriptionOpen ? "relative" : "absolute",
													}}
													transition={{
														duration: 0.5,
														ease: "easeInOut",
														spring: 1.2,
													}}
												>
													{isDescriptionOpen ? (
														<>
															Weniger Anzeigen
															<ChevronUp />
														</>
													) : (
														<>
															Mehr anzeigen
															<ChevronDown />
														</>
													)}
												</motion.button>
											</motion.div>
										</div>
									)}
									{buyLink && (
										<div className="my-8">
											<Button variant={"outline"} onClick={() => window.open(buyLink, "_blank")}>
												Kaufen auf &nbsp;
												{platformIcons[shoppingPlattform(buyLink).toLowerCase()] ? platformIcons[shoppingPlattform(buyLink).toLowerCase()] : shoppingPlattform(buyLink)}
											</Button>
										</div>
									)}
								</div>

								<DialogClose className="text-slate-950" />
							</DialogContent>
						</DialogContainer>
					</Dialog>
				);
			})}
		</PaintingWrapper>
	);
};

export default PaintingCard;
