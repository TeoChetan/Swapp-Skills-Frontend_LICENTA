import { aboutUsPageText } from "../../Assets/texts";
import { ReactComponent as HomeLogo } from "../../Assets/crown.svg";
import FooterSocialComponent from "../../Layouts/footerSocials.component";

const AboutUsPage = () => {
  return (
    <div>
      <div className="flex flex-col items-center w-full">
        <div className="bg-blue-navy text-white text-center text-3xl sm:text-5xl md:text-6xl font-montserrat p-20 sm:p-36 md:p-56 font-bold w-full">
          About Skills-Swap
        </div>
        <div className="flex justify-center w-full -mt-10 sm:-mt-16 md:-mt-20">
          <div className="rounded-full bg-gray-300 p-6 sm:p-8 md:p-10">
            <HomeLogo className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 hover:animate-spin" />
          </div>
        </div>
        <h1 className="text-black text-xl sm:text-2xl md:text-2xl font-bold text-center mt-20 md:mt-36 my-5">
          Our Story
        </h1>
        <p className="text-balance text-center break-words mb-20 md:mb-48 px-4 sm:px-16 md:mx-64 text-lg sm:text-xl md:text-xl">
          {aboutUsPageText}
        </p>
      </div>
      <FooterSocialComponent />
    </div>
  );
};

export default AboutUsPage;
