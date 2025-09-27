import React from 'react';
import { BeatLoader } from 'react-spinners';

const MyLoader = ({ size = 15, color = "#ffffff" }) => {
  return (
    <BeatLoader color={color} loading={true} size={size} />
  );
};

export default MyLoader;
