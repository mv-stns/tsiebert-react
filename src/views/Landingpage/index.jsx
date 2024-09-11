
import Biography from '@views/Biography';
import Vita from '@views/Vita';
import Paintings from '@views/Paintings';
import News from '@views/News';
import Contact from '@views/Contact';
import Partners from '@views/Partners';
import HeroSection from '@views/HeroSection/index';
import Footer from '@views/Footer';

function App() {
	return (
		<>
			<HeroSection />
			<Biography />
			<Vita />
			<Partners />
			<Paintings />
			<News />
			<Contact />
			<Footer />
		</>
	);
}

export default App;
