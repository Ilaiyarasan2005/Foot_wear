// components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-8">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} SoleStride Footwear. All rights reserved.</p>
        <p className="text-xs mt-2">Built with ❤️ using React & Tailwind CSS.</p>
      </div>
    </footer>
  );
};

export default Footer;