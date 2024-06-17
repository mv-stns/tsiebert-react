import SectionWrapper from "../../components/SectionWrapper";
import PaintingCard from "./components/PaintingCard";
import { useRef, useState, useEffect, useCallback } from "react";
import Modal from "./components/Modal";
import { PropTypes } from "prop-types";

const paintings = [
	{
		image: "aufgang.webp",
		name: "Aufgang",
		size: "100×120 CM",
		date: "2022",
	},
	{
		image: "flamingoschar.webp",
		name: "Flamingoschar",
		size: "140×100 CM",
		date: "2022",
	},
	{
		image: "gruene_stiletto.webp",
		name: "Grüne Stiletto",
		size: "80×60 CM",
		date: "2022",
	},
	{
		image: "pfau_mit_monstera.webp",
		name: "Pfau mit Monstera",
		size: "70×100 CM",
		date: "2021",
	},
	{
		image: "tulpen_in_der_daemmerung.webp",
		name: "Tulpen in der Dämmerung",
		size: "100×150 CM",
		date: "2021",
	},
	{
		image: "spitzahorn_im_herbstgold_(1).webp",
		name: "Spitzahorn im Herbstgold (1)",
		size: "50×120 CM",
		date: "2019",
	},
];

const Paintings = () => {
	const [selectedPainting, setSelectedPainting] = useState(null);
	const [isPopupOpen, setIsPopupOpen] = useState(false);
	const popupRef = useRef(null);

	const handlePaintingClick = (painting) => {
		setSelectedPainting(painting);
		setIsPopupOpen(true);
		setTimeout(() => {}, 500); // Add a delay of 500 milliseconds (0.5 seconds)
	};

	const handleClosePopup = useCallback(() => {
		setIsPopupOpen(false);
	}, [setIsPopupOpen]);

	const paintingEntries = paintings.map((entry, index) => {
		return <PaintingCard key={index} image={entry.image} name={entry.name} size={entry.size} date={entry.date} onPaintingClick={handlePaintingClick} />;
	});

	//method when esc or click outside of popup is clicked to close the popup
	const closePopupOnEscape = useCallback(
		(event) => {
			if (event.key === "Escape" || event.key === "Esc") {
				handleClosePopup();
			}
		},
		[handleClosePopup]
	);

	const switchPaintings = useCallback(
		(event) => {
			if (event.key === "ArrowRight") {
				const currentIndex = paintings.findIndex((painting) => painting.name === selectedPainting.name);
				const nextIndex = currentIndex + 1;
				if (nextIndex < paintings.length) {
					setSelectedPainting(paintings[nextIndex]);
				}
			} else if (event.key === "ArrowLeft") {
				const currentIndex = paintings.findIndex((painting) => painting.name === selectedPainting.name);
				const previousIndex = currentIndex - 1;
				if (previousIndex >= 0) {
					setSelectedPainting(paintings[previousIndex]);
				}
			}
		},
		[selectedPainting]
	);

	useEffect(() => {
		window.addEventListener("keydown", closePopupOnEscape);
		window.addEventListener("keydown", switchPaintings);
		return () => {
			window.removeEventListener("keydown", closePopupOnEscape);
			window.removeEventListener("keydown", switchPaintings);
		};
	}, [closePopupOnEscape, switchPaintings]);

	//set on mount to a random selected painting
	useEffect(() => {
		const randomIndex = Math.floor(Math.random() * paintings.length);
		setSelectedPainting(paintings[randomIndex]);
	}, []);

	return (
		<>
			<SectionWrapper className="bg-slate-50 my-20 rounded-3xl sm:rounded-[132px]" title="Meine Werke">
				<ol className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 *:transition-all *:duration-300 *:ease-in-out gap-14">{paintingEntries}</ol>
			</SectionWrapper>
			{selectedPainting && <Modal selectedPainting={selectedPainting} popupRef={popupRef} isPopupOpen={isPopupOpen} setIsPopupOpen={setIsPopupOpen} handleClosePopup={handleClosePopup} />}
		</>
	);
};

Paintings.propTypes = {
	selectedPainting: PropTypes.shape({
		image: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		size: PropTypes.string.isRequired,
		date: PropTypes.string.isRequired,
	}),
	popupRef: PropTypes.shape({
		current: PropTypes.instanceOf(Element),
	}),
	isPopupOpen: PropTypes.bool,
	setIsPopupOpen: PropTypes.func,
	handleClosePopup: PropTypes.func,
};

export default Paintings;
