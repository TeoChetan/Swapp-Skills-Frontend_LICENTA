import { Link } from "react-router-dom";

const LinkCustom = ({text,to}) => {
    return (
      <Link
        className="text-blue-nova hover:text-gray-900 border border-blue-nova focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800"
        to={to}
        >
        {text}
      </Link>
    );
  };
  export default LinkCustom;