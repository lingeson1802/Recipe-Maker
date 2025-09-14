import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6 mt-10">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Brand */}
        <div className="text-lg font-bold text-white">
          🍴 Meal Finder
        </div>

        {/* Links */}
        <div className="flex space-x-6">
          <a href="/" className="hover:text-white transition-colors">
            Home
          </a>
          <a href="/favorites" className="hover:text-white transition-colors">
            Favorites
          </a>
          <a href="/saved" className="hover:text-white transition-colors">
            Saved
          </a>
        </div>

        {/* Social Icons */}
        <div className="flex space-x-4">
          <a href="#" className="hover:text-white transition-colors">
            <FaFacebookF />
          </a>
          <a href="#" className="hover:text-white transition-colors">
            <FaTwitter />
          </a>
          <a href="#" className="hover:text-white transition-colors">
            <FaInstagram />
          </a>
        </div>
      </div>

      {/* Bottom text */}
      <div className="text-center text-sm text-gray-500 mt-4">
        © {new Date().getFullYear()} Meal Finder. All rights reserved.
      </div>
    </footer>
  );
}
