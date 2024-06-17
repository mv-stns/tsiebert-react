import SectionWrapper from "../../components/SectionWrapper";
import TimeEntry from "./components/TimeEntry/index";

const artisticCareer = [
	{ date: "2022", description: "Grund- und Aufbaustudium: Zeichnung & Malerei bei Prof. Markus Lüpertz an der Akademie der Bildenden Künste, Kolbermoor" },
	{ date: "2017", description: "Mitglied beim Kunstverein Galerie am Markt Schwäbisch Hall e.V." },
	{ date: "2013", description: 'Seminar bei Voka „Spontanrealismus - das Acryl-Power", Kunstakademie Bad Reichenhall' },
	{ date: "2013 - heute", description: "Leiterin und Lehrerin der Kunstschule Harmonie in Künzelsau", link: "https://www.kunstschule-harmonie.de" },
	{ date: "2012", description: "Mitglied bei der Haller Akademie der Künste e.V. Schwäbisch Hall" },
	{ date: "2012", description: "Unterricht bei Nikolai Lagoida zur altmeisterlicher Ölmalerei" },
	{ date: "2011", description: "Akt und Porträt bei Michael Klenk, Haller Akademie der Künste e.V." },
	{ date: "2010", description: "Seminare bei Hans Gottfried von Stockhausen" },
	{ date: "2008", description: 'Akt und Porträt bei Milan Markovich in der Akademie Geras. Lernzeit bei Alena Vogel „Kunstwerkstatt" in Niedernhall' },
];

const artisticEntries = artisticCareer.map((entry, index) => {
	return <TimeEntry key={index} date={entry.date} description={entry.description} link={entry.link} />;
});

const exhibitions = [
	{ date: "2024", description: "Abschlussausstellung der Meisterklasse in Kolbermoor bei Prof. Markus Lüpertz.", isCurrentEvent: true },
	{ date: "2023", description: '"Sichtweisen" - Mitgliederausstellung im Kunstverein Schwäbisch Hall.' },
	{ date: "2021", description: '"Ganz nah - ganz fern II" - Ausstellung in Sommerhausen.' },
	{ date: "2021", description: '"Land und Leute" - Ausstellung in Ochsenfurt.' },
	{ date: "2020", description: '"Facetten der Natur" - Ausstellung im Rathaus Röttingen.' },
	{ date: "2018", description: 'Kunstausstellung und Kinderkunstworkshop "Stadt.Land.Wü." im Pavillon der Landesgartenschau Würzburg.' },
	{ date: "2018", description: '"Ganz nah - ganz fern" - Ausstellung im Rathaus Sommerhausen.' },
	{ date: "2015", description: 'Weitere Kunstprojekte mit OX.Art in Ochsenfurt, u.a. "Nacht der Museen" im Oberen Turm.' },
	{ date: "2014", description: '"Mensch-Zeit-Raum" - Ausstellung in der Sparkasse Hohenlohekreis, Künzelsau.' },
	{ date: "2014", description: '"Kunst in der Altstadt von Ochsenfurt" - Gruppenausstellung "Ox.Art" in Ochsenfurt.' },
	{ date: "2013", description: '"Kunst in der Passage" - Herbstausstellung in der Klingentorpassage Ochsenfurt.' },
	{ date: "2011", description: '"Träume inneren Friedens" - Ausstellung im Rathaus Dörzbach.' },
	{ date: "2010", description: '"Ton in Ton - Unterwegs in der Natur" - Ausstellung bei der AOK Künzelsau.' },
];

const exhibitionEntries = exhibitions.map((entry, index) => {
	return <TimeEntry key={index} date={entry.date} description={entry.description} isCurrentEvent={entry.isCurrentEvent} />;
});

const Vita = () => {
	return (
		<SectionWrapper title="Vita">
			<div className="gap-14 flex flex-col md:flex-row">
				<div className="flex flex-col w-full gap-3 timeline">
					<h2>künstlerischer Werdegang</h2>

					<ol className="relative border-s border-gray-200">{artisticEntries}</ol>
				</div>

				<div className="flex flex-col w-full gap-3 timeline">
					<h2 className="">Ausstellungen</h2>
					<ol className="relative border-s border-gray-200">{exhibitionEntries}</ol>
				</div>
			</div>
		</SectionWrapper>
	);
};

export default Vita;
