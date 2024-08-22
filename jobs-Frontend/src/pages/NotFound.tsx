import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-w-full">
      <div className="flex flex-col items-center justify-center w-full min-w-full text-center">
        <h1 className="m-0 font-semibold text-gray-600 text-8xl">404</h1>
        <p className="my-6 text-2xl text-gray-600">
          Oops! The page you are looking for does not exist.
        </p>
        <button
          type="button"
          className=" hover:bg-sky-300 cursor-pointer text-base text-white bg-sky-400 border-none rounded-md py-3 px-5"
          onClick={() => navigate("/")}
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
