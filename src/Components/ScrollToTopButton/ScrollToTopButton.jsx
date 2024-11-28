import React, { useState, useEffect } from 'react';

const ScrollToTopButton = () => {
  const [showButton, setShowButton] = useState(false);

  // Function to handle the scroll to top action
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Track the scroll position to show or hide the button
  useEffect(() => {
    const handleScroll = () => {
      // Show button when scroll position is greater than 100px
      if (window.scrollY > 100) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    showButton && (
      <button
        className="upIcon"
        onClick={scrollToTop}
        style={{
          position: 'fixed',
          right: '30px',
          bottom: '10px',
          zIndex: 99999,
          cursor: 'pointer',
          display: 'block', // button will be displayed only when `showButton` is true
          opacity: showButton ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}
      >
        ↑
      </button>
    )
  );
};

export default ScrollToTopButton;
