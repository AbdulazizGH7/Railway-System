import React from 'react';
import PulseLoader from "react-spinners/PulseLoader";

function Spinner({ loading }) {
    if (!loading) return null; // Return null if not loading
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional semi-transparent background
        zIndex: 9999, // Ensure it stays on top
      }}
    >
      <PulseLoader
        color={"white"}
        loading={loading}
        size={20}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
}

export default Spinner;