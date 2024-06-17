import React from "react";

interface TimeEntryProps {
    date: number;
    description: string;
    isCurrentEvent?: boolean;
    link?: string;
}

const TimeEntry = ({ date, description, isCurrentEvent, link }: TimeEntryProps) => {
    return (
        <li className="mb-10 ms-4">
            <div className={`absolute size-3 rounded-full mt-1.5 -start-1.5 border border-white ${isCurrentEvent ? 'bg-sky-500 animate-ping' : 'bg-gray-200'}`}></div>
            {isCurrentEvent && <div className="absolute size-3 rounded-full mt-1.5 -start-1.5 bg-sky-400"></div>}
            <time className="mb-1 text-sm font-normal leading-none text-gray-400">{date}</time>
            {link ? (
                <p className="mb-4 text-base font-normal"><a href={link} target="_blank" className="underline-offset-4 hover:text-[hsla(196,80%,40%,1)] transition-colors duration-200 ease-in-out after:content-['_↗'] text-[hsla(196,80%,56%,1)] underline">{description}</a></p>
            ) : (
                <p className="mb-4 text-base font-normal text-gray-950">{description}</p>
            )}
        </li>
    );
};

export default TimeEntry;
