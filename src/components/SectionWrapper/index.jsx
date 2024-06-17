import PropTypes from "prop-types";

const SectionWrapper = ({ title, children, viewType = "default", className = "" }) => {
	const sectionId = (title || "").toLowerCase().replace(/\s/g, "-");

	const renderDefaultView = () => (
		<section id={sectionId ? sectionId : undefined} className={`flex flex-col items-start px-6 sm:px-12 md:px-12 py-0 relative w-full ${className}`}>
			<div className="py-16 flex gap-14 flex-col border-t border-gray-100 container mx-auto">
				<h1 className="inline-flex w-full">{title}</h1>
				{children}
			</div>
		</section>
	);

	const renderAlternativeView = () => (
		<section id={sectionId ? sectionId : undefined} className={`flex flex-col py-16 items-start gap-14 px-6 sm:px-12 md:px-12 relative container mx-auto ${className}`}>
			{children}
		</section>
	);

	return viewType === "alternative" ? renderAlternativeView() : renderDefaultView();
};

SectionWrapper.propTypes = {
	title: PropTypes.string,
	children: PropTypes.node.isRequired,
	viewType: PropTypes.oneOf(["default", "alternative"]),
	className: PropTypes.string,
};

export default SectionWrapper;
