import React from 'react';
import { Github, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-black/50 backdrop-blur-sm py-4 px-4 text-center text-sm text-gray-400">
      <p className="flex items-center justify-center gap-2">
        Made with ♥ by Aayush518
        <a
          href="https://github.com/Aayush518"
          target="_blank"
          rel="noopener noreferrer"
          className="text-pink-500 hover:text-pink-400 transition-colors"
        >
          <Github className="w-4 h-4" />
        </a>
        <a
          href="https://linkedin.com/in/Aayush518"
          target="_blank"
          rel="noopener noreferrer"
          className="text-pink-500 hover:text-pink-400 transition-colors"
        >
          <Linkedin className="w-4 h-4" />
        </a>
      </p>
    </footer>
  );
};