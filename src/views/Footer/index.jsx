import React from "react";

const Footer = () => {
	return (
		<footer id="footer" className="flex flex-col items-start gap-[4px] px-4 sm:px-12 py-0 relative mx-auto border-t border-gray-100 text-xs md:text-base whitespace-nowrap">
			<div className="py-8 flex justify-between w-full text-medium">
				<div className="uppercase">
					© Tamara Siebert <span className="text-slate-400 font-sans">{new Date().getFullYear()}</span>
				</div>
				<div className="uppercase">
					<ol className="flex gap-4">
						<li>
							<a href="/datenschutz" className="underline-offset-4 hover:text-[hsla(196,80%,40%,1)] transition-colors duration-200 ease-in-out after:content-['_↗'] text-[hsla(196,80%,56%,1)] underline">
								Datenschutz
							</a>
						</li>
						<li>
							<a href="/impressum" className="underline-offset-4 hover:text-[hsla(196,80%,40%,1)] transition-colors duration-200 ease-in-out after:content-['_↗'] text-[hsla(196,80%,56%,1)] underline">
								Impressum
							</a>
						</li>
					</ol>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
