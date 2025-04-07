//components/Footer.js

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  FaTwitter, FaInstagram, FaLinkedin, FaGithub,
  FaLink, FaQrcode, FaChartLine, FaLock, FaTerminal,
  FaRegClock, FaTrash, FaCode, FaBook, FaUsers,
  FaEnvelope
} from "react-icons/fa";

const Footer = () => {
  const featureLinks = [
    { id: 'url-shortening', name: 'URL Shortening' },
    { id: 'qr-generation', name: 'QR Code Generation' },
    { id: 'analytics', name: 'Link Analytics' },
    { id: 'custom-aliases', name: 'Custom Aliases' },
    { id: 'bulk-shortening', name: 'Bulk Shortening'},
    { id: 'expiration', name: 'Link Expiration' },
    { id: 'deletion', name: 'Secure Deletion' }
  ];

  return (
    <footer className="bg-slate-900 border-t border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid text-amber-50 grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Features Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-blue-400 flex items-center gap-2">
              <FaLink className="text-xl" />
              Features
            </h3>
            <ul className="space-y-3">
              {featureLinks.map((link) => (
                <li key={link.id}>
                  <Link 
                    href={`/features#${link.id}`}
                    className="flex items-center gap-2 hover:text-blue-300 transition-colors"
                  >
                    {link.icon}
                    <span className="text-slate-200 hover:text-blue-300">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>


          {/* Resources Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-purple-400 flex items-center gap-2">
              <FaCode className="text-xl" />
              Resources
            </h3>
            <ul className="space-y-3 text-slate-200">
              <li className="hover:text-purple-300 transition-colors">
                <Link href="">API Documentation</Link>
              </li>
              <li className="hover:text-purple-300 transition-colors">
                <Link href="">Developer Blog</Link>
              </li>
              <li className="hover:text-purple-300 transition-colors">
                <Link href="">Help Center</Link>
              </li>
              <li className="hover:text-purple-300 transition-colors">
                <Link href="">Integrations</Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-green-400 flex items-center gap-2">
              <FaUsers className="text-xl" />
              Company
            </h3>
            <ul className="space-y-3 text-slate-200">
              <li className="hover:text-green-300 transition-colors">
                <Link href="">About Us</Link>
              </li>
              <li className="hover:text-green-300 transition-colors">
                <Link href="">Careers</Link>
              </li>
              <li className="hover:text-green-300 transition-colors">
                <Link href="">Partners</Link>
              </li>
              <li className="hover:text-green-300 transition-colors">
                <Link href="">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-orange-400 flex items-center gap-2">
              <FaLock className="text-xl" />
              Legal
            </h3>
            <ul className="space-y-3 text-slate-200">
              <li className="hover:text-orange-300 transition-colors">
                <Link href="">Privacy Policy</Link>
              </li>
              <li className="hover:text-orange-300 transition-colors">
                <Link href="">Terms of Service</Link>
              </li>
              <li className="hover:text-orange-300 transition-colors">
                <Link href="">Cookie Policy</Link>
              </li>
              <li className="hover:text-orange-300 transition-colors">
                <Link href="">Disclaimer</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social & Branding Section */}
        <div className="mt-12 pt-8 border-t border-slate-700/50">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 mb-6 md:mb-0">
              <Image
                src="/images/Linkly.png"
                width={140}
                height={40}
                alt="Linkly Logo"
                className="hover:scale-105 transition-transform"
              />
              <span className="text-slate-400">•</span>
              <div className="flex space-x-4">
                <a href="#" className="text-slate-400 hover:text-blue-400">
                  <FaTwitter size={20} />
                </a>
                <a href="#" className="text-slate-400 hover:text-pink-400">
                  <FaInstagram size={20} />
                </a>
                <a href="#" className="text-slate-400 hover:text-blue-600">
                  <FaLinkedin size={20} />
                </a>
                <a href="#" className="text-slate-400 hover:text-slate-200">
                  <FaGithub size={20} />
                </a>
              </div>
            </div>
            
            <div className="text-slate-400 text-sm">
              © {new Date().getFullYear()} Linkly Technologies. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;