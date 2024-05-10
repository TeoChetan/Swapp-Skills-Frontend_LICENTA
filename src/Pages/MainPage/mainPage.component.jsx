import UserCarousel from "../../Components/userCarousel.component";
import { UserPanel } from "../../Components/userPanel.component";

const MainPage = () => {
    return (
        <div className="flex flex-col lg:flex-row w-full min-h-screen">
            <div className="lg:w-64 w-full">
                <UserPanel></UserPanel>
            </div>
            <div className="flex-1 flex justify-center items-center">
                <UserCarousel></UserCarousel>
            </div>
        </div>
    );
};

export default MainPage;
