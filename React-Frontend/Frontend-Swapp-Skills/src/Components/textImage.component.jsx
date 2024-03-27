const TextImage = ({ src, alt, text }) => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-center ">
      <div className="flex flex-col items-center ">
        <img src={src} alt={alt} className="max-w-xs rounded-full"></img>
        <p className="p-4 text-pretty text-left max-w-xs w-48 text-lg font-montserrat">
          {text}
        </p>
      </div>
    </div>
  );
};
export default TextImage;
