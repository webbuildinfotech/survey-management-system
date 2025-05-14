import React from "react";
import "../styles/Footer.css";
import {
  FaTwitter,
  FaLinkedinIn,
  FaWhatsapp,
  FaFacebookF,
  FaInstagram,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaFacebook } from "react-icons/fa6";
import { RoutePaths } from "../routes/Path";
const FooterSection = ({ children, index }) => {
  return <div>{children}</div>;
};
const Footer = () => {
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-6 pt-10 pb-8">
        <div className="flex flex-col lg:flex-row flex-wrap gap-12 justify-between">
          <FooterSection index={0}>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-blue-400 text-sm pb-2 w-fit">
                Gritter
              </h3>
              <div className="flex items-start space-x-3 text-gray-600 text-sm w-60">
                <span>
                  Hello, we are ABC. trying to make an effort to put the right
                  people for you to get the best results. Just insight
                </span>
              </div>

              <div className="flex space-x-4 pt-2">
                <a
                  href="https://facebook.com/webbuildinfotech/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:scale-110 transition-all duration-200"
                >
                  <FaFacebookF />
                </a>
                <a
                  href="https://twitter.com/ChaudhariSimal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 twitter-fly"
                >
                  <FaTwitter />
                </a>
                <a
                  href="https://wa.me/919265128409"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:scale-110 transition-all duration-200"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://linkedin.com/company/webbuildinfotech/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:scale-110 transition-all duration-200"
                >
                  <FaLinkedinIn />
                </a>
              </div>
            </div>
          </FooterSection>

          <FooterSection index={1}>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-blue-400 text-sm pb-2 w-fit">
                Product
              </h3>
              <nav>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li className="hover:text-blue-600 transition-colors duration-200">
                    Autocapture
                  </li>
                  <li className="hover:text-blue-600 transition-colors duration-200">
                    Data Governance
                  </li>
                  <li className="hover:text-blue-600 transition-colors duration-200">
                    Virtual Events
                  </li>
                  <li className="hover:text-blue-600 transition-colors duration-200">
                    Virtual Users
                  </li>
                  <li className="hover:text-blue-600 transition-colors duration-200">
                    Behavioral Analytics
                  </li>
                  <li className="hover:text-blue-600 transition-colors duration-200">
                    Connect
                  </li>
                </ul>
              </nav>
            </div>
          </FooterSection>

          <FooterSection index={2}>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-blue-400 text-sm pb-2 w-fit">
                Explore
              </h3>
              <nav>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li className="hover:text-blue-600 transition-colors duration-200">
                    Resources
                  </li>
                  <li className="hover:text-blue-600 transition-colors duration-200">
                    Blog
                  </li>
                  <li className="hover:text-blue-600 transition-colors duration-200">
                    Documents
                  </li>
                </ul>
              </nav>
            </div>
          </FooterSection>

          <FooterSection index={3}>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-blue-400 text-sm pb-2 w-fit">
                Company
              </h3>
              <nav>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li className="hover:text-blue-600 transition-colors duration-200">
                    About us
                  </li>
                  <li className="hover:text-blue-600 transition-colors duration-200">
                    Partners
                  </li>
                  <li className="hover:text-blue-600 transition-colors duration-200">
                    Customers
                  </li>
                  <li className="hover:text-blue-600 transition-colors duration-200">
                    Contact us
                  </li>
                </ul>
              </nav>
            </div>
          </FooterSection>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
