import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const FooterSocialComponent = () => {
  return (
    <div className="flex flex-col justify-center items-center space-x-4 bg-black text-white py-20  ">
    <div className='flex m-5'>  
    <a href="https://facebook.com"   className="text-white text-2xl hover:text-gray-300 mx-1">
        <FaFacebookF />
      </a>
      <a href="https://twitter.com"  className="text-white text-2xl hover:text-gray-300 mx-1">
        <FaTwitter />
      </a>
      <a href="https://instagram.com"  className="text-white text-2xl hover:text-gray-300 mx-1">
        <FaInstagram />
      </a>
      <a href="https://youtube.com"  className="text-white text-2xl hover:text-gray-300 mx-1">
        <FaYoutube />
      </a>
      </div>
      <p className="text-white text-sm">
        "Empower, Share, Learn: Building Stronger Communities Together"
      </p>
    </div>
  );
};

export default FooterSocialComponent;
