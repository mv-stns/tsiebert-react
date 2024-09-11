import React, { useEffect, useMemo, useState } from "react";

type Props = {};

/**
 * v0 by Vercel.
 * @see https://v0.dev/t/vMgBbgYhMgC
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { JSX } from "react/jsx-runtime";
import { PaintingManagement } from "./Painting/PaintingManagement";
import { CategoryManagement } from "./Category/category";
import { DashboardView } from "./dashboard";
import { Cog6ToothIcon as SettingsIcon, PaintBrushIcon as BrushIcon, SwatchIcon as PaletteIcon, HomeIcon, TagIcon, ChartBarIcon, NewspaperIcon, Bars2Icon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { cn, useMounted } from "@/lib/utils";

export default function Component() {
	const [currentView, setCurrentView] = useState("dashboard");
	const [currentTimeNumber, setCurrentTimeNumber] = useState<number | null>(null);
	const mounted = useMounted();

	useEffect(() => {
		if (!localStorage.getItem("loggedIn")) {
			setTimeout(() => {
				toast.error("Nicht authentifiziert. Sie werden in Kürze zur Anmeldeseite weitergeleitet.");
			});
			setTimeout(() => {
				window.location.href = "/login";
			}, 12000);
			return;
		}
		if (!localStorage.getItem("token")) {
			setTimeout(() => {
				if (!mounted) return;
				toast.error("Nicht authentifiziert. Sie werden in Kürze zur Anmeldeseite weitergeleitet.");
			})
			setTimeout(() => {
				window.location.href = "/login";
			}, 2000);
			return;
		} else if (localStorage.getItem("loggedIn")) {
			const loggedIn = localStorage.getItem("loggedIn");
			const loggedInNumber = Number(loggedIn);

			const interval = setInterval(() => {
				const currentTime = Date.now();
				setCurrentTimeNumber(currentTime);

				if (currentTimeNumber != null && !isNaN(currentTimeNumber) && !isNaN(loggedInNumber) && currentTimeNumber - loggedInNumber > 760000) {
					// Prüfe nach 12 Minuten Inaktivität
					toast.error("Session abgelaufen. Sie werden in Kürze zur Anmeldeseite weitergeleitet.");
					localStorage.removeItem("token");
					localStorage.removeItem("loggedIn");
					clearInterval(interval);
					setTimeout(() => {
						window.location.href = "/login";
					}, 2000);
				}
			}, 1000);
		}
	}, [mounted]);

	// everytime the mouse is moved set the current time to the current time, to prevent the user from being logged out
	useEffect(() => {
		document.addEventListener("mousemove", () => {
			const currentTime = Date.now();
			setCurrentTimeNumber(currentTime);
		});
	}, []);

	const views = useMemo(() => {
		return {
			managePaintings: <PaintingManagement />,
			manageCategories: <CategoryManagement />,
			paintingStatistics: (
				<div>
					<h1>Painting Statistics</h1>
				</div>
			),
			manageNews: (
				<div>
					<h1>Manage News</h1>
				</div>
			),
			newsStatistics: (
				<div>
					<h1>News Statistics</h1>
				</div>
			),
			settings: (
				<div>
					<h1>Settings</h1>
				</div>
			),
			dashboard: <DashboardView />,
		};
	}, []);

	return (
		<>
			<div
				className={cn("absolute inset-0 bg-white/25 z-[100] backdrop-blur-md", {
					hidden: localStorage.getItem("token"),
				})}
			></div>
			<div className="flex min-h-screen w-full">
				<aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
					<nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
						<TooltipProvider>
							<button onClick={() => setCurrentView("dashboard")} className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base">
								<BrushIcon className="h-4 w-4 transition-all group-hover:scale-110" />
								<span className="sr-only">Digital Paintings</span>
							</button>
							<Tooltip>
								<TooltipTrigger asChild>
									<button onClick={() => setCurrentView("dashboard")} className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8">
										<HomeIcon className="h-5 w-5" />
										<span className="sr-only">Dashboard</span>
									</button>
								</TooltipTrigger>
								<TooltipContent side="right">Dashboard</TooltipContent>
							</Tooltip>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<button className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8">
										<PaletteIcon className="h-5 w-5" />
										<span className="sr-only">Paintings</span>
									</button>
								</DropdownMenuTrigger>
								<DropdownMenuContent side="right" align="start">
									<DropdownMenuItem onClick={() => setCurrentView("managePaintings")}>
										<span className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
											<PaletteIcon className="h-5 w-5" />
											Gemälde verwalten
										</span>
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => setCurrentView("manageCategories")}>
										<span className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
											<TagIcon className="h-5 w-5" />
											Kategorien verwalten
										</span>
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => setCurrentView("paintingStatistics")} disabled>
										<span className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
											<ChartBarIcon className="h-5 w-5" />
											Gemälde Statistiken
										</span>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<button className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8">
										<NewspaperIcon className="h-5 w-5" />
										<span className="sr-only">News</span>
									</button>
								</DropdownMenuTrigger>
								<DropdownMenuContent side="right" align="start">
									<DropdownMenuItem onClick={() => setCurrentView("manageNews")}>
										<span className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
											<NewspaperIcon className="h-5 w-5" />
											Manage News
										</span>
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => setCurrentView("newsStatistics")}>
										<span className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
											<ChartBarIcon className="h-5 w-5" />
											News Statistics
										</span>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</TooltipProvider>
					</nav>
					<nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
						<button onClick={() => setCurrentView("settings")} className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8">
							<SettingsIcon className="h-5 w-5" />
							<span className="sr-only">Einstellungen</span>
						</button>
					</nav>
				</aside>
				<div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 w-full">
					<header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
						<Sheet>
							<SheetTrigger asChild>
								<Button size="icon" variant="outline" className="sm:hidden">
									<Bars2Icon className="h-5 w-5" />
									<span className="sr-only">Toggle Menu</span>
								</Button>
							</SheetTrigger>
							<SheetContent side="left" className="sm:max-w-xs">
								<nav className="grid gap-6 text-lg font-medium">
									<a href="#" className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base">
										<BrushIcon className="h-5 w-5 transition-all group-hover:scale-110" />
										<span className="sr-only">Digital Paintings</span>
									</a>
									<a href="#" className="flex items-center gap-4 px-2.5 text-foreground">
										<HomeIcon className="h-5 w-5" />
										Dashboard
									</a>
									<DropdownMenu>
										<DropdownMenuTrigger className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground [&[data-state=open]>svg]:rotate-90">
											<PaletteIcon className="h-5 w-5" />
											Paintings <ChevronRightIcon className="ml-auto h-5 w-5 transition-all" />
										</DropdownMenuTrigger>
										<DropdownMenuContent side="right">
											<div className="-mx-6 grid gap-6 bg-muted p-6">
												<a href="#" className="group grid h-auto w-full items-center justify-start gap-1 rounded-md bg-background p-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
													<div className="text-sm font-medium leading-none group-hover:underline">Add Painting</div>
												</a>
												<a href="#" className="group grid h-auto w-full items-center justify-start gap-1 rounded-md bg-background p-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
													<div className="text-sm font-medium leading-none group-hover:underline">Manage Paintings</div>
												</a>
												<a href="#" className="group grid h-auto w-full items-center justify-start gap-1 rounded-md bg-background p-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
													<div className="text-sm font-medium leading-none group-hover:underline">Painting Statistics</div>
												</a>
											</div>
										</DropdownMenuContent>
									</DropdownMenu>
									<DropdownMenu>
										<DropdownMenuTrigger className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground [&[data-state=open]>svg]:rotate-90">
											<NewspaperIcon className="h-5 w-5" />
											News <ChevronRightIcon className="ml-auto h-5 w-5 transition-all" />
										</DropdownMenuTrigger>
										<DropdownMenuContent side="right">
											<div className="-mx-6 grid gap-6 bg-muted p-6">
												<a href="#" className="group grid h-auto w-full items-center justify-start gap-1 rounded-md bg-background p-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
													<div className="text-sm font-medium leading-none group-hover:underline">Add News</div>
												</a>
												<a href="#" className="group grid h-auto w-full items-center justify-start gap-1 rounded-md bg-background p-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
													<div className="text-sm font-medium leading-none group-hover:underline">Manage News</div>
												</a>
												<a href="#" className="group grid h-auto w-full items-center justify-start gap-1 rounded-md bg-background p-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
													<div className="text-sm font-medium leading-none group-hover:underline">News Statistics</div>
												</a>
											</div>
										</DropdownMenuContent>
									</DropdownMenu>
									<a href="#" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
										<SettingsIcon className="h-5 w-5" />
										Settings
									</a>
								</nav>
							</SheetContent>
						</Sheet>
						<Breadcrumb className="hidden md:flex">
							<BreadcrumbList>
								<BreadcrumbItem>
									<BreadcrumbLink asChild>
										<a href="#">Dashboard</a>
									</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator />
								<BreadcrumbItem>
									<BreadcrumbLink asChild>
										<a href="#">Paintings</a>
									</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator />
								<BreadcrumbItem>
									<BreadcrumbPage>Painting Details</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
					</header>
					<main className="flex-1 px-4 pt-4 sm:px-6">{views[currentView as keyof typeof views]}</main>
				</div>
			</div>
		</>
	);
}
