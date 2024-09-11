import SectionWrapper from "../../components/SectionWrapper";
import PaintingCard from "./components/PaintingCard";

const Paintings = () => {
	return (
		<SectionWrapper viewType="alternative" className="bg-slate-50 my-20 rounded-3xl sm:rounded-[132px]" title="Meine Werke">
			<PaintingCard className="container p-0 mx-auto" />
		</SectionWrapper>
	);
};

export default Paintings;