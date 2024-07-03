import React, { useState } from "react";

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
import { PaintingManagement } from "./Painting/painting"

export default function Component() {
  const [currentView, setCurrentView] = useState('default');
  let view = null;
  const managePaintings = () => {
    setCurrentView('managePaintings');
  }
  const paintingStatistics = () => {
    setCurrentView('paintingStatistics');
  }
  const manageNews = () => {
    setCurrentView('manageNews');
  }
  const newsStatistics = () => {
    setCurrentView('newsStatistics');
  }
  const settings = () => {
    setCurrentView('settings');
  }
  const dashboard = () => {
    setCurrentView('dashboard');
  }

  if (currentView === 'managePaintings') {
    view = <PaintingManagement />;
  } else if (currentView === 'paintingStatistics') {
    view = (
      <div>
        <h1>Painting Statistics</h1>
      </div>
    );
  } else if (currentView === 'manageNews') {
    view = (
      <div>
        <h1>Manage News</h1>
      </div>
    );
  } else if (currentView === 'newsStatistics') {
    view = (
      <div>
        <h1>News Statistics</h1>
      </div>
    );
  } else if (currentView === 'settings') {
    view = (
      <div>
        <h1>Settings</h1>
      </div>
    );
  } else if (currentView === 'dashboard') {
    view = (
      <div>
        <h1>Dashboard</h1>
      </div>
    );
  }



	return (
		<div className="flex min-h-screen w-full">
			<aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
				<nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
					<TooltipProvider>
						<button onClick={dashboard} className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base">
							<BrushIcon className="h-4 w-4 transition-all group-hover:scale-110" />
							<span className="sr-only">Digital Paintings</span>
						</button>
						<Tooltip>
							<TooltipTrigger asChild>
								<button onClick={dashboard} className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8">
									<LayoutGridIcon className="h-5 w-5" />
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
								<DropdownMenuItem>
									<button onClick={managePaintings} className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
										<PaletteIcon className="h-5 w-5" />
										Manage Paintings
									</button>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<button className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
										<BarChartIcon className="h-5 w-5" />
										Painting Statistics
									</button>
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
								<DropdownMenuItem>
									<button className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
										<NewspaperIcon className="h-5 w-5" />
										Manage News
									</button>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<button className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
										<BarChartIcon className="h-5 w-5" />
										News Statistics
									</button>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</TooltipProvider>
				</nav>
				<nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
					<button className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8">
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
								<MenuIcon className="h-5 w-5" />
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
									<LayoutGridIcon className="h-5 w-5" />
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
				<main className="flex-1 px-4 pt-4 sm:px-6">
          {view}
        </main>
			</div>
		</div>
	);
}

function BarChartIcon(props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) {
	return (
		<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<line x1="12" x2="12" y1="20" y2="10" />
			<line x1="18" x2="18" y1="20" y2="4" />
			<line x1="6" x2="6" y1="20" y2="16" />
		</svg>
	);
}

function BrushIcon(props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) {
	return (
		<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08" />
			<path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z" />
		</svg>
	);
}

function ChevronRightIcon(props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) {
	return (
		<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<path d="m9 18 6-6-6-6" />
		</svg>
	);
}

function LayoutGridIcon(props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) {
	return (
		<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<rect width="7" height="7" x="3" y="3" rx="1" />
			<rect width="7" height="7" x="14" y="3" rx="1" />
			<rect width="7" height="7" x="14" y="14" rx="1" />
			<rect width="7" height="7" x="3" y="14" rx="1" />
		</svg>
	);
}

function MenuIcon(props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) {
	return (
		<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<line x1="4" x2="20" y1="12" y2="12" />
			<line x1="4" x2="20" y1="6" y2="6" />
			<line x1="4" x2="20" y1="18" y2="18" />
		</svg>
	);
}

function NewspaperIcon(props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) {
	return (
		<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
			<path d="M18 14h-8" />
			<path d="M15 18h-5" />
			<path d="M10 6h8v4h-8V6Z" />
		</svg>
	);
}

function PaletteIcon(props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) {
	return (
		<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
			<circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
			<circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
			<circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
			<path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
		</svg>
	);
}

function PlusIcon(props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) {
	return (
		<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<path d="M5 12h14" />
			<path d="M12 5v14" />
		</svg>
	);
}

function SettingsIcon(props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) {
	return (
		<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
			<circle cx="12" cy="12" r="3" />
		</svg>
	);
}

