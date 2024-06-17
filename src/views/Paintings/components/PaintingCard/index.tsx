import React from 'react';

const PaintingCard = ({ image, name, size, date, onPaintingClick }) => {
    const handleClick = () => {
        onPaintingClick({ image, name, size, date });
    };

    return (
        <li className="flex flex-col gap-2 relative group cursor-pointer" onClick={handleClick}>
            <div className="-inset-4 rounded-3xl absolute transition-colors duration-200 ease-in-out group-hover:bg-gray-200/60"></div>
            <div className="absolute top-4 right-4 md:opacity-0 md:group-hover:opacity-100 rounded-full bg-white z-10 size-12 flex items-center justify-center text-4xl md:rotate-90 md:group-hover:rotate-0 scale-100 md:group-hover:scale-110 transition-all duration-300 ease-in-out">
                <svg className="size-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.6699 9.62403L7.7939 17.5L6.5 16.2061L14.3751 8.33013H7.43428V6.5H17.5V16.5657H15.6699V9.62403Z" fill="#0A0D14" />
                </svg>
            </div>
            <img
                src={`/src/assets/paintings/${image}`}
                className="z-[1] rounded-xl pointer-events-none aspect-[5/6] object-cover shadow-[0px_52px_21px_0px_rgba(0,0,0,0.02),0px_29px_18px_0px_rgba(0,0,0,0.08),0px_13px_13px_0px_rgba(0,0,0,0.13),0px_3px_7px_0px_rgba(0,0,0,0.15)]"
            />
            <div className="z-[1] flex gap-1 items-center text-sm whitespace-nowrap">
                <h2 className="z-[1] font-semibold text-sm not-italic font-sans uppercase">{name}</h2>
                <span className="z-[1] font-light">{size}</span>
                <div className="z-[1] h-px w-full bg-[#CBD0D7] transition-all duration-200 ease-in-out group-hover:bg-[hsl(215deg,13%,50%,1)]"></div>
                <time className="z-[1] italic font-main">{date}</time>
            </div>
        </li>
    );
};

export default PaintingCard;
