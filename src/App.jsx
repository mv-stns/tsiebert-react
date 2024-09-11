import "./index.css";
import { Helmet } from "react-helmet";
import MainRoutes from "./Routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
	return (
		<>
			<QueryClientProvider client={queryClient}>
				<Helmet>
					<title>Tamara Siebert</title>
					<meta name="description" content="Tamara Siebert - Zeitgenössische Malerin" />
				</Helmet>
				<MainRoutes />
			</QueryClientProvider>
		</>
	);
}

export default App;
