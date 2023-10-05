import { useState, useEffect } from 'react';
import LoadingScreenCSS from './LoadingScreen.module.css';

type Props = {
  isDone: boolean;
};

const LoadingScreen = ({ isDone }: Props) => {
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    // Disable scrolling when component mounts
    document.body.style.height = '100vh';
    document.body.style.overflow = 'hidden';
  }, []);

  useEffect(() => {
    if (isDone) {
      const handler = setTimeout(() => {
        setIsClosed(true);

        // Revert scrolling
        document.body.style.height = '';
        document.body.style.overflow = '';
      }, 1000);

      return () => {
        clearTimeout(handler);
      };
    }
  }, [isDone]);

  if (isClosed) return null;

  return (
    <div className={LoadingScreenCSS.container} data-closing={isDone}>
      <span className="sr-only">Loading the page</span>
      <div className={LoadingScreenCSS.pulsatingCube}></div>
    </div>
  );
};

export default LoadingScreen;
