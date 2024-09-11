export type Painting = {
	id?: number;
	image?: string | undefined;
	title: string;
	type: string;
	size: string;
	isFramed: boolean;
	isOOAK: boolean;
	category: string | Category | Category[];
	content?: string;
	buyLink?: string;
	createdAt: string;
}
export type Category = {
	id: number;
	name: string;
}

export type Props = {};

export type User = {
	id: String;
	email: String;
	name: String;
	password: String;
	role: String;
	posts: String[];
}
