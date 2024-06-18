import "./index.css";
import Biography from "./views/Biography";
import Vita from "./views/Vita";
import Partners from "./views/Partners";
import Paintings from "./views/Paintings";
import News from "./views/News";
import Contact from "./views/Contact";
import Footer from "./views/Footer";
import { Toaster } from "@/components/ui/sonner"

import { Helmet } from "react-helmet";
import HeroSection from "./views/HeroSection/index.jsx";

function App() {
	return (
		<>
			<Helmet>
				<link rel="preconnect" href="https://rsms.me/"></link>
				<link rel="stylesheet" href="https://rsms.me/inter/inter.css"></link>
			</Helmet>
			<HeroSection />
			<Biography />
			<Vita />
			<Partners />
			<Paintings />
			<News />
			<Contact />
			<Footer />
			<Toaster />
		</>
	);
}

export default App;
