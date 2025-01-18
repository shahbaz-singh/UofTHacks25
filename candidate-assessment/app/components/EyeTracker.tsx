import React, { useEffect } from 'react';

const EyeTracker = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://api.gazerecorder.com/GazeCloudAPI.js';
    script.async = true;
    script.onload = () => {
      try {
        GazeCloudAPI.StartEyeTracking();

        GazeCloudAPI.OnCalibrationComplete = () => {
          console.log('Calibration complete');
        };

        GazeCloudAPI.OnGazeLost = () => {
          console.log('Gaze lost');
        };

        GazeCloudAPI.OnResult = (GazeData) => {
          console.log('Gaze Data:', GazeData);
        };
      } catch (error) {
        console.error('Error initializing eye tracking:', error);
      }
    };
    document.body.appendChild(script);

    return () => {
      try {
        GazeCloudAPI.StopEyeTracking();
      } catch (error) {
        console.error('Error stopping eye tracking:', error);
      }
      document.body.removeChild(script);
    };
  }, []);

  return <div>Eye Tracker Component</div>;
};

export default EyeTracker; 