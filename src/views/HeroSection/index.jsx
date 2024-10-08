import { useState, useEffect } from "react";

const HeroSection = () => {
	const [images, setImages] = useState([]);

	useEffect(() => {
		const importImages = async () => {
			let images = import.meta.glob(`/public/uploads/paintings/*.webp`);
			// add further images from folder src/assets/paintings
			images = { ...import.meta.glob(`/src/assets/paintings/*.webp`) };
			const imageArray = await Promise.all(
				Object.keys(images).map(async (key) => {
					const module = await images[key]();
					return module.default;
				})
			);
			setImages(imageArray);
		};

		importImages();
	}, []);

	return (
		<div className="h-screen w-full overflow-hidden flex-col bg-white relative pb-8 flex justify-end items-end">
			<div className="hero-mask self-baseline gap-4 mb-24 flex relative">
				<div className="absolute inset-0 z-10 bg-white [-webkit-mask:linear-gradient(90deg,_rgba(255,_255,_255,_1)_0%,_rgba(255,_255,_255,_0.25)_10%,_rgba(255,_255,_255,_0)_11%,_rgba(255,_255,_255,_0)_50%,_rgba(255,_255,_255,_1)_88%,_rgba(255,_255,_255,_0.25)_89%,_rgba(255,_255,_255,_1)_100%)]"></div>
				<ul className="animate-marquee h-[--size] flex my-auto gap-4 py-4">
					{images.map((image, index) => (
						<li key={index} className="childrenItem h-full aspect-[1] snap-center"> 
							<img className="object-cover aspect-[10/16]" src={image} alt={`image-${index}`} />
						</li>
					))}
				</ul>
				<ul className="scale-125 animate-marquee2 h-[--size] flex my-auto gap-4 py-4 xl:scale-125">
					{images.map((image, index) => (
						<li key={index} className="childrenItem h-full aspect-[1] snap-center">
							<img className="object-cover aspect-[10/16]" src={image} alt={`image-${index}`} />
						</li>
					))}
				</ul>
			</div>
			<h1 className="container font-main text-6xl sm:px-6 md:px-12 lg:px-6 mx-auto font-thin italic">
				Tamara <span className="font-normal">Siebert</span>
			</h1>
		</div>
	);
};

export default HeroSection;
