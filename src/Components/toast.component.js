import { useEffect } from "react"

export const Toast = ({message,isVisible,setIsVisible})=>{
    useEffect(()=>{
        if(isVisible){
            const timer = setTimeout(()=>{
                setIsVisible(false);
            },5000)
            return ()=> clearTimeout(timer);
        }
    },[isVisible,setIsVisible]);
    if(!isVisible) return null;

    return(
        <div className="fixed bottom-5 right-5 md:right-10 p-4 bg-black text-white rounded-lg shadow-lg z-50 tranzition-opacity duration-500 easi-in-out">
        {message}
        </div>
    );
};