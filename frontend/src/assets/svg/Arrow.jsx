const Arrow = ({ className = "", currentColor }) => {
  return (
    <svg
      className={`ml-2 w-6 h-6 transition-transform duration-200 ${className} fill-n-1`}
      viewBox={"0 0 24 24"}
      fill={currentColor}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M8.293 5.293a1 1 0 0 1 1.414 0l6 6a1 1 0 0 1 0 1.414l-6 6a1 1 0 0 1-1.414-1.414L13.586 12 8.293 6.707a1 1 0 0 1 0-1.414z" />
    </svg>
  );
};

export default Arrow;
