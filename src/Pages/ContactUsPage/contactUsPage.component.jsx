import React from "react";
import FooterSocialComponent from "../../Layouts/footerSocials.component";
import { useCSRFToken } from "../../utils/firebase.utils";
import { useState } from "react";
import { toast,ToastContainer } from "react-toastify";

const ContactUsPage = () => {
  const csrfToken = useCSRFToken();
  const [formData, setFormData] = useState({
    from: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:8080/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN':csrfToken,
        },
        body: JSON.stringify(formData),
        credentials: "include"
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('Your message has been sent successfully!');
        setFormData({ from: '', toEmail: '', subject: '', message: '' }); 
      } else {
        throw new Error(data.message || 'Something went wrong');
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };


   

  return (
    <div className="bg-polar-sky">
      <div className="min-h-screen flex flex-col md:flex-row pt-12 md:pt-32 px-4 md:px-0">
        <div className="flex flex-col justify-center flex-1 md:ml-10 lg:mr-48 md:-mt-48">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Get in Touch with Us</h2>
          <p className="mb-4 text-lg text-break md:mr-32">
            If you have any questions, suggestions, or simply want to say hi,
            feel free to contact us at the following email address.
          </p>
        </div>
        <div className="flex-1 p-8">
          <div className="max-w-md mx-auto">
            <h3 className="text-2xl font-bold mb-6">Send Us a Message</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <input
                  type="email"
                  name="from"
                  placeholder="Email"
                  className="w-full p-2 bg-transparent border border-black rounded focus:border-gray-900"
                  onChange={handleChange}
                  value={formData.from || ""}
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  className="w-full p-2 bg-transparent border border-black rounded focus:border-gray-900"
                  onChange={handleChange}
                  value={formData.subject || ""}
                />
              </div>
              <div className="mb-6">
                <textarea
                  name="message"
                  rows="4"
                  placeholder="Type your message here..."
                  className="w-full p-2 bg-transparent border border-black rounded focus:border-gray-900"
                  onChange={handleChange}
                  value={formData.message || ""}
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full p-3 bg-polar-sky border border-black text-black rounded hover:bg-gray-300"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
      <FooterSocialComponent />
    </div>
  );
};

export default ContactUsPage;
