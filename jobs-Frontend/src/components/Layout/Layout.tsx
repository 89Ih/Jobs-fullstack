import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import useMediaQuery from "@mui/material/useMediaQuery";


type Props = {
  children: React.ReactNode;
};
export const Layout = ({ children }: Props) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const matches = useMediaQuery("(max-width:700px)");
  const updateProgressBar = () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercentage = (scrollTop / scrollHeight) * 100;
    setScrollProgress(scrollPercentage);
  };

  useEffect(() => {
    window.addEventListener('scroll', updateProgressBar);
    return () => window.removeEventListener('scroll', updateProgressBar);
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <header
        className="top-0 sticky min-h-20 min-w-full shadow-gray-200 shadow-md bg-gray-50 flex flex-col justify-center z-10">

        <div className={`${matches ? ' px-[10px]':'px-4'} w-full inline-flex justify-between items-center`}>
          <Link onClick={() => window.scroll(0, 0)} to={'/'} className='text-2xl font-semibold'>
            <span className='text-slate-800 text-2xl'>Job</span>
            <span className='text-slate-500 text-2xl'>Seeker</span></Link>
          <div>
            <svg  width={matches ?"30px":"50px"} height={matches ?"30px":"50px"} viewBox="0 0 24 24" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <path fillRule="evenodd" clipRule="evenodd" d="M19.5 8.25H4.5V6.75H19.5V8.25Z" fill="rgb(51 65 85)"></path>
                <path fillRule="evenodd" clipRule="evenodd" d="M19.5 12.75H4.5V11.25H19.5V12.75Z" fill="rgb(51 65 85)">
                </path>
                <path fillRule="evenodd" clipRule="evenodd" d="M19.5 17.25H4.5V15.75H19.5V17.25Z" fill="rgb(51 65 85)">
                </path>
              </g>
            </svg>
          </div>
        </div>
        <progress className='h-[3px] w-full top-20 sticky' id="progressBar" max="100" value={scrollProgress}></progress>
      </header>
      <main>{children}</main>
      <footer className="min-w-full mt-20">
        <div className="footer-content border-t border-solid border-gray-300 text-gray-600 flex flex-col items-center py-5 font-semibold">
          <p className="text-base">&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
          <div className="social-icons">
            <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
              <FacebookIcon />
            </a>
            <a href="https://twitter.com" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
              <TwitterIcon />
            </a>
            <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
              <InstagramIcon />
            </a>
            <a href="https://linkedin.com" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
              <LinkedInIcon />
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};