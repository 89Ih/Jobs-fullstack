import { useEffect } from "react";
import "./Loading.css";
import { useNavigate } from "react-router-dom";

const time: number = 5000; // Ensure time is always a number

const Loading = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, time);

    // Clean up the timeout when the component unmounts
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="wrapper">
      <div className="spinner">
        <div className="bounce1"></div>
        <div className="bounce2"></div>
        <div className="bounce3"></div>
      </div>
    </div>
  );
};

export default Loading;
