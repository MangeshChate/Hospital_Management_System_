import React from 'react';
import Lottie from 'react-lottie';
import animationData from '../../../public/assets/animationJson/Animation - 1731613270895.json';

const LoadingAnimation = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return <Lottie options={defaultOptions} height={200} width={200} />;
};

export default LoadingAnimation;
