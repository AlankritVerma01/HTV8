import React from 'react';

function LoadingSpinner() {
  return (
    <div className="flex flex-col mb-4 justify-center items-center h-screen">
        <h2 className='font-poppins text-3xl mb-2 text-white margin-auto'>Let Us Cook... &#x1F468;&#x200D;&#x1F373;</h2>
      <div className="animate-spin rounded-full h-32 w-32 border-t-4 mb-4 border-b-4 border-pp"></div>
    </div>
  );
}

export default LoadingSpinner;