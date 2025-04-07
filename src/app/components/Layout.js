"use client";
import Image from "next/image";

export default function Layout({ children }) {
  return (
    <div className="relative max-w-full overflow-x-hidden min-h-screen">
      {/* Background Rectangles */}
      <Image
        className='fixed z-0 top-0 right-10'
        src='/images/Rectangle 4 (1).png'
        height={250}
        width={350}
        alt='cube1'
      />
      <Image
        className='fixed top-80 right-60 z-0'
        src='/images/Rectangle 4.png'
        height={250}
        width={350}
        alt='cube2'
      />
      <Image
        className='fixed z-0 top-28 left-10'
        src='/images/Rectangle 5 (1).png'
        height={100}
        width={350}
        alt='cube3'
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}