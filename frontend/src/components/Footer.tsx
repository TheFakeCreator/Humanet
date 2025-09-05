import React from 'react';
import Link from 'next/link';
import { Github, Twitter, Linkedin, MessageCircle, Mail, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'About', href: '/about' },
    { name: 'Documentation', href: '/docs' },
    { name: 'Roadmap', href: '/roadmap' },
    { name: 'Blog', href: '/blog' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact', href: '/contact' },
  ];

  const socialLinks = [
    {
      name: 'Discord',
      href: 'https://discord.gg/humanet',
      icon: MessageCircle,
      color: 'hover:text-indigo-500',
    },
    {
      name: 'Twitter',
      href: 'https://x.com/humanet',
      icon: Twitter,
      color: 'hover:text-blue-400',
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/company/humanet',
      icon: Linkedin,
      color: 'hover:text-blue-600',
    },
    {
      name: 'GitHub',
      href: 'https://github.com/TheFakeCreator/Humanet',
      icon: Github,
      color: 'hover:text-gray-400',
    },
    {
      name: 'Email',
      href: 'mailto:hello@humanet.dev',
      icon: Mail,
      color: 'hover:text-green-500',
    },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">H</span>
              </div>
              <span className="text-xl font-bold">Humanet</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Where ideas evolve through collaboration. Join our community of innovators 
              building the next generation of solutions together.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-gray-400 transition-colors ${social.color}`}
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Community</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/ideas"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Browse Ideas
                </Link>
              </li>
              <li>
                <Link
                  href="/ideas/new"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Submit Idea
                </Link>
              </li>
              <li>
                <Link
                  href="/users"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Top Contributors
                </Link>
              </li>
              <li>
                <Link
                  href="/guidelines"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Community Guidelines
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © {currentYear} Humanet. All rights reserved.
          </div>
          <div className="flex items-center space-x-6 text-sm">
            <Link
              href="/privacy"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
            <div className="flex items-center text-gray-400">
              Made with <Heart className="w-4 h-4 mx-1 text-red-500" /> by the Humanet Team
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
