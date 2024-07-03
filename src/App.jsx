import "./index.css";
import { Helmet } from "react-helmet";
import MainRoutes from './Routes';

function App() {


	return (
		<>
			<Helmet>
				<title>Tamara Siebert</title>
				<meta name="description" content="Tamara Siebert - Zeitgenössische Malerin" />
			</Helmet>
			<MainRoutes />
		</>
	);
}

export default App;
