import SectionWrapper from "../../components/SectionWrapper"
import profileImage from "../../assets/personal/profile.webp"

export const Biography = () => {
  return (
    <SectionWrapper title="Biografie">
      <div className="flex flex-col lg:flex-row gap-14 justify-center">
        <div className="flex flex-col gap-14">
          <div style={{ backgroundImage: `url(${profileImage})` }}  className="relative rotate-[-3deg] hover:rotate-0 hover:scale-125 transition-all duration-300 ease-in-out w-[402px] h-[335px] rounded-[8px] bg-cover bg-[50%_50%] [box-shadow:_0px_0px_0px_4px_rgba(0,_0,_0,_0.06),_0px_36.257px_36.257px_-18.128px_rgba(0,_0,_0,_0.06),_0px_18.128px_18.128px_-9.064px_rgba(0,_0,_0,_0.06),_0px_9.064px_9.064px_-4.532px_rgba(0,_0,_0,_0.06),_0px_4.532px_4.532px_-2.266px_rgba(0,_0,_0,_0.06),_0px_1.511px_1.511px_-0.755px_rgba(0,_0,_0,_0.06)]"></div>
          <div className="tracking-tight font-secondary font-regular leading-8 text-2xl w-[400px]">
            Tamara Siebert ist eine <span className="font-main italic font-thin text-sky-400">zeitgenössische Malerin</span>, deren Werke von einer faszinierenden Mischung aus Tradition und Moderne geprägt sind.
          </div>
        </div>
        <div className="flex flex-col">
          <div className="text-lg tracking-normal leading-8 max-w-[740px] space-y-4">
            <p>
              Ihre Kunst spiegelt ihre Herkunft wider - 1970 geboren und aufgewachsen in
              Südsibirien, hat sie ihre russischen Wurzeln nie vergessen. Heute lebt und
              arbeitet die Künstlerin im Süden Deutschlands. Derzeit ist sie als
              freischaffende Künstlerin und seit 2013 als Leiterin der Kunstschule Harmonie
              in Künzelsau tätig. Sie verbindet ihre Leidenschaft für die Kunst mit der
              Freude, anderen Menschen ihre Fähigkeiten und Erfahrungen weiterzugeben.
            </p>
            <p>
              Als Künstlerin sieht sie sich selbst als Vermittlerin zwischen ihrer Umgebung
              und dem Papier. Mit akademischen Techniken der Öl-, Aquarell- und Acrylmalerei
              verleiht Tamara ihren Gemälden eine klassische Note. Ihre Pinselstriche sind
              präzise und ihre Kompositionen ausgewogen. Doch gleichzeitig bricht sie mit
              Konventionen und verleiht jedem Werk ihren unverwechselbaren, modernen Stil.
            </p>
            <p>
              Ihre künstlerischen Prozesse variieren erheblich zwischen gegenständlichen und
              abstrakten Werken. Bei den gegenständlichen Arbeiten beginnt jedes Werk mit
              einer konkreten Vision, bei ihren Monotypie-Drucken dagegen ist der Ansatz
              viel spontaner. Form und Farbe lässt sie freien Lauf und beobachtet neugierig
              welches Werk sich entwickelt. Die Künstlerin zeigt sich begeistert von der
              Möglichkeit, innerhalb kürzester Zeit aus einem leeren Blatt Papier ein
              vollendetes Kunstwerk zu erschaffen.
            </p>
            <p>
              Tamara Siebert verbringt viel Zeit in der Natur und lässt sich durch
              Beobachtungen von ihrem Facettenreichtum für ihre Werke inspirieren. Seit etwa
              fünf Jahren zieht es sie regelmäßig hinaus, um in der freien Natur zu malen –
              ein Vorgehen, das sie als das &quot;größte Atelier der Welt&quot; bezeichnet.
              Inspiriert von der impressionistischen Malerei, setzt sie ihre künstlerischen
              Ideen direkt vor Ort um. Das Ergebnis sind außergewöhnlich stimmungsvolle
              Gemälde, die die Schönheit und den atmosphärischen Wandel der Natur auf
              eindrucksvolle Weise widerspiegeln.
            </p>
            <p>
              Derzeit vertieft sie ihr Können in der Meisterklasse von Professor Markus
              Lüpertz, einem der renommiertesten zeitgenössischen deutschen Künstler. Ihr
              Ziel ist es, ihre künstlerische Ausdrucksform kontinuierlich zu schärfen und
              zu verfeinern.
            </p>
          </div>

        </div>
      </div>
    </SectionWrapper>
  )
}

export default Biography