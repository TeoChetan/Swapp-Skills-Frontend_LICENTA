
const BUTTON_TYPE_CLASSES ={
  google: 'google-sign-in',
  inverted: 'inverted',
}



const Button = ({children, buttonType, ...inputOptions}) => {
    return (
      <button
        className={`flex justify-center items-center button-container mt-5 font-bold text-black hover:text-dark border border-gray-800 hover:scale-110 hover:shadow-2xl  focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-2xl text-sm px-10 py-2 text-center mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800 ${BUTTON_TYPE_CLASSES[buttonType]}`} {...inputOptions}
        >
        {children}
      </button>
    );
  };
  export default Button;