//News.jsx
import SectionWrapper from "@/components/SectionWrapper";
import Modal from "@/components/Modal";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const News = () => {
	const [modalOpen, setModalOpen] = useState(false);
	const [selectedNews, setSelectedNews] = useState(null);
	const closeModal = () => setModalOpen(false);

	const newslist = [
		{
			image: "erwachsenen_malkurse.webp",
			title: "Erwachsenen Mal-kurse ab dem 13.6",
			content: "Beschreibung für die Erwachsenen Mal-Kurse.",
		},
		{
			image: "ausstellungen_in_der_naehe.webp",
			title: "Ausstellungen in der Nähe",
			content: "Informationen zu aktuellen Ausstellungen.",
		},
		{
			image: "pressemitteilung.webp",
			title: "Pressemitteilung 2024",
			content: "Neueste Pressemitteilung mit wichtigen Informationen.",
		},
	];

	const openModal = (index) => {
		setModalOpen(true);
		setSelectedNews(newslist[index]);
	};

	return (
		<>
			<SectionWrapper title="Aktuelles">
				<ol className="grid grid-cols-2 lg:grid-cols-3 gap-14 relative w-fit mx-auto">
					{newslist.map((news, index) => (
						<li key={index} className="flex flex-col gap-2 relative lg:hover:scale-105 transition-all duration-300 ease-in-out group cursor-pointer truncate snap-start" onClick={openModal.bind(null, index)}>
							<div className="absolute top-4 right-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 rounded-full bg-white z-10 size-12 flex items-center justify-center text-4xl md:rotate-90 md:group-hover:rotate-0 scale-100 md:group-hover:scale-110 transition-all duration-300 ease-in-out">
								<svg className="size-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M15.6699 9.62403L7.7939 17.5L6.5 16.2061L14.3751 8.33013H7.43428V6.5H17.5V16.5657H15.6699V9.62403Z" fill="#0A0D14" style={{ fill: "#0A0D14" }} />
								</svg>
							</div>
							<img src={`/src/assets/news/${news.image}`} className="z-[1] rounded-xl pointer-events-none aspect-[1/1.5] object-cover shadow-sm" />
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger>
										<h2 className="z-[1] font-medium text-lg xl:text-3xl not-italic truncate font-sans">{news.title}</h2>
									</TooltipTrigger>
									<TooltipContent>
										<p>{news.title}</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</li>
					))}
				</ol>
			</SectionWrapper>
			{selectedNews && <Modal title={selectedNews.title} content={selectedNews.content} image={selectedNews.image} isOpen={modalOpen} onClose={closeModal} />}
		</>
	);
};

export default News;
