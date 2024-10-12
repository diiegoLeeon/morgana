import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';

const LottieBackground: React.FC = () => {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    fetch('https://lottie.host/8bc1f200-5179-4ffe-90fc-38e857c8e92c/I4HrUbg9lc.json')
      .then(response => response.json())
      .then(data => setAnimationData(data))
      .catch(error => console.error('Error loading Lottie animation:', error));
  }, []);

  if (!animationData) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[-1]">
      <Lottie
        animationData={animationData}
        loop={true}
        autoplay={true}
        style={{ width: '100%', height: '100%' }}
        rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
      />
    </div>
  );
};

export default LottieBackground;