function Loader({ size = 'md', text = 'Loading...' }) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`spinner ${sizeClasses[size]}`}></div>
      {text && <p className="text-sm text-gray-500 animate-pulse-slow">{text}</p>}
    </div>
  );
}

export default Loader;

