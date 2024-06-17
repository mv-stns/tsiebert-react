import SectionWrapper from "../../components/SectionWrapper";
import Sparkasse from "./icons/sparkasse";
import Star from "./icons/star";
import Volksbank from "./icons/volksbank";
import Kuenzelsau from "./icons/kuenzelsau";
import Flyeralarm from "./icons/flyeralarm";
import Akdbk from "./icons/akdbk";

function partners() {
	return (
    <>
		<SectionWrapper className="overflow-hidden" title={"Partners"} viewType="alternative">
			<div className="flex gap-14 flex-col w-full">
				<div className="flex gap-3 items-center">
					<div className="w-full h-[2px] bg-gray-100"></div>
					<Star />
					<div className="w-full h-[2px] bg-gray-100"></div>
				</div>
			</div>
			<h2 className="not-italic mx-auto font-sans font-medium uppercase tracking-wide text-2xl text-center md:text-base text-slate-600">Partner, die bereits seit Jahren mit mir Hand in Hand zusammen Arbeiten</h2>
		</SectionWrapper>
			<SectionWrapper className="overflow-hidden">
        <div className="flex grayscale w-screen gap-12 sm:gap-16">
                <div className="flex sm:gap-16 gap-12 animate-marquee">
                  <div>
                    <Kuenzelsau />
                  </div>
                  <div>
                    <Akdbk />
                  </div>
                  <div>
                    <Sparkasse />
                  </div>
                  <div>
                    <Volksbank />
                  </div>
                  <div>
                    <Flyeralarm />
                  </div>
                </div>
                <div className="sm:gap-16 gap-12 flex animate-marquee2">
                  <div>
                    <Kuenzelsau />
                  </div>
                  <div>
                    <Akdbk />
                  </div>
                  <div>
                    <Sparkasse />
                  </div>
                  <div>
                    <Volksbank />
                  </div>
                  <div>
                    <Flyeralarm />
                  </div>
                </div>
                <div className="sm:gap-16 gap-12 flex animate-marquee2">
                  <div>
                    <Kuenzelsau />
                  </div>
                  <div>
                    <Akdbk />
                  </div>
                  <div>
                    <Sparkasse />
                  </div>
                  <div>
                    <Volksbank />
                  </div>
                  <div>
                    <Flyeralarm />
                  </div>
                </div>
              </div>
      </SectionWrapper>
    </>
	);
}

export default partners;
