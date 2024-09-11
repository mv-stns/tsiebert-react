"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
const chartData = [
	{ browser: "chrome", visitors: 275, fill: "hsl(207deg, 89.7%, 54.1%)" },
	{ browser: "safari", visitors: 200, fill: "hsl(207deg, 89.7%, 60.1%)" },
	{ browser: "firefox", visitors: 287, fill: "hsl(207deg, 89.7%, 75.1%)" },
	{ browser: "edge", visitors: 173, fill: "hsl(207deg, 89.7%, 44.1%)" },
	{ browser: "other", visitors: 190, fill: "hsl(207deg, 89.7%, 24.1%)" },
];

const chartConfig = {
	visitors: {
		label: "Visitors",
	},
	chrome: {
		label: "Chrome",
	},
	safari: {
		label: "Safari",
	},
	firefox: {
		label: "Firefox",
	},
	edge: {
		label: "Edge",
	},
	other: {
		label: "Other",
	},
} satisfies ChartConfig;

export function DashboardView() {
	const totalVisitors = React.useMemo(() => {
		return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
	}, []);

	return (
		<div className="flex flex-col h-full">
			<header className="bg-background border-b px-6 py-4 flex items-center justify-between">
				<h1 className="">Dashboard</h1>
				{/* <div className="flex items-center gap-4">
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
				</div> */}
			</header>
			<main>
				<div className="mt-8">
                    <ul className="grid grid-cols-3 gap 4">
                        <li>
                            <Card className="flex flex-col">
                                <CardHeader className="items-center pb-0">
                                    <CardTitle>Besucher der Seite</CardTitle>
                                    <CardDescription>Januar - Juli 2024</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1 pb-0">
                                    <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
                                        <PieChart>
                                            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                            <Pie data={chartData} dataKey="visitors" nameKey="browser" innerRadius={60} strokeWidth={5}>
                                                <Label
                                                    content={({ viewBox }) => {
                                                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                                            return (
                                                                <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                                                    <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                                                                        {totalVisitors.toLocaleString()}
                                                                    </tspan>
                                                                    <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                                                                        Besucher
                                                                    </tspan>
                                                                </text>
                                                            );
                                                        }
                                                    }}
                                                />
                                            </Pie>
                                        </PieChart>
                                    </ChartContainer>
                                </CardContent>
                                <CardFooter className="flex-col gap-2 text-sm">
                                    <div className="flex items-center gap-2 font-medium leading-none">
                                        5.2% mehr Besucher diesen Monat<TrendingUp className="h-4 w-4" />
                                    </div>
                                    <div className="leading-none text-muted-foreground">Verglichen mit dem letzten Monat</div>
                                </CardFooter>
                            </Card>
                        </li>
                    </ul>
                </div>
			</main>
		</div>
	);
}
