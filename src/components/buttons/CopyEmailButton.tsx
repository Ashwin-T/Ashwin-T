import { useState } from 'react';
import { FaCopy, FaCheck } from 'react-icons/fa';

const CopyEmailButton = () => {
  const [copied, setCopied] = useState(false);
  
  const handleCopyEmail = () => {
    navigator.clipboard.writeText("atalwalkar719@gmail.com");
    setCopied(true);
    
    // Reset the copied state after 2 seconds
    setTimeout(() => {
      setCopied(false);
    }, 3500);
  };
  
  return (
    <div className="flex items-center gap-2">
      <button 
        onClick={handleCopyEmail}
        className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        {copied ? (
          <>
            <FaCheck size={15} /> Copied!
          </>
        ) : (
          <>
            <FaCopy size={15} /> Copy Email
          </>
        )}
      </button>
    </div>
  );
};

export default CopyEmailButton;