/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly env: Record<string, string>;
	readonly VITE_BACKEND_KEY: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}