import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as HomeLogo } from "../../Assets/crown.svg";
import {
  homepageText,
  contentTitle,
  contentText,
  contentTextStep1,
  contentTextStep2,
  contentTextStep3,
} from "../../Assets/texts";
import StudyPic from "../../Assets/studys.jpeg";
import SkillImage1 from "../../Assets/skill1.jpg";
import SkillImage2 from "../../Assets/skill2.jpg";
import SkillImage3 from "../../Assets/skill3.jpg";
import TextImage from "../../Components/textImage.component";
import topScroll from "../../Components/topScroll.function";
import LinkCustom from "../../Components/linkCustom.component";
import FooterSocialComponent from "../../Layouts/footerSocials.component";

const Home = () => {
  return (
    <Fragment>
      <header className="homepage pt-4 home-links-container flex justify-between">
        <Link className="logo-container flex" to="/">
          <HomeLogo className="logo ml-4" />
          <h1 className="text-xl font-bold text-gray-800 font-montserrat m-2">
            Swapp Skills
          </h1>
        </Link>
        <nav className="flex">
          <LinkCustom className="login-link m-2" to="/signin" text="Login" />
          <LinkCustom className="signup-link m-2" to="/signup" text="Sign-Up" />
        </nav>
      </header>

      <main>
        <section className="homepage-title items-center text-center sm:mx-5 sm:text-2xl md:mx-10 md:text-3xl lg:mx-20 font-montserrat">
          <h1 className="lg:text-4xl mt-48 lg:mx-20">
            Exchange your skills with
          </h1>
          <h1 className="mt-4 lg:text-4xl">
            <strong>SKILL SWAP</strong>
          </h1>
          <p className="text-wrap text-balance text-center mt-10 lg:text-lg">
            {homepageText}
          </p>
        </section>

        <section className="content bg-polar-sky">
          <div className="contentBlock flex flex-col lg:flex-row bg-blue-navy text-white mt-40">
            <div className="imageWrapper flex-1">
              <img
                className="w-full h-full"
                src={StudyPic}
                alt="StudyPicture"
              />
            </div>
            <div className="contentWrapper flex-1 p-10">
              <h1 className="contentTitle sm:text-2xl md:text-2xl lg:text-3xl w-96 break-words">
                {contentTitle}
              </h1>
              <p className="contentText text-wrap mt-8 max-w-md text-lg">
                {contentText}
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <hr className="bg-blue-nova h-0.5 w-1/2 mt-4" />
          </div>
          <h1 className="text-center font-montserrat sm:text-3xl pt-20 m-10 font-bold">
            How It Works
          </h1>

          <div className="explainSteps flex flex-col md:flex-row bg-polar-sky justify-around">
            <TextImage
              src={SkillImage1}
              alt="Step 1"
              text={contentTextStep1}
            />
            <TextImage
              src={SkillImage2}
              alt="Step 2"
              text={contentTextStep2}
            />
            <TextImage
              src={SkillImage3}
              alt="Step 3"
              text={contentTextStep3}
            />
          </div>
        </section>
      </main>

      <footer className="footer p-4 m-4">
        <h2 className="p-2 font-bold">Quick Links</h2>
        <button
          onClick={topScroll}
          className="text-blue-nova hover:text-gray-900 border border-blue-nova focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800"
        >
          Home
        </button>
        <LinkCustom className="p-2" to="/signup" text="Sign-Up" />
        <LinkCustom className="p-2" to="/login" text="Login" />
        <FooterSocialComponent />
      </footer>
    </Fragment>
  );
};

export default Home;
