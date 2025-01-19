import React, { useEffect, useState } from 'react';

const EyeTracker = () => {
  const [tracking, setTracking] = useState(true);

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

    const stopTrackingTimer = setTimeout(() => {
      setTracking(false);
    }, 55000); // 55 seconds

    return () => {
      clearTimeout(stopTrackingTimer);
      try {
        GazeCloudAPI.StopEyeTracking();
      } catch (error) {
        console.error('Error stopping eye tracking:', error);
      }
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!tracking) {
      try {
        GazeCloudAPI.StopEyeTracking();
        console.log('Tracking stopped after 55 seconds');
      } catch (error) {
        console.error('Error stopping eye tracking:', error);
      }
    }
  }, [tracking]);

  return <div></div>;
};

export default EyeTracker; 