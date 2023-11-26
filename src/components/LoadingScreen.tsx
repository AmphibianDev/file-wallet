import { useLayoutEffect, PropsWithChildren, Suspense } from 'react';
import LoadingScreenCSS from './LoadingScreen.module.css';
import { create } from 'zustand';

const useLoadingState = create<{
  isDone: boolean;
  isClosed: boolean;
  finishLoading: () => void;
}>((set) => ({
  isDone: false,
  isClosed: false,
  finishLoading: () => {
    set({ isDone: true });
    setTimeout(() => {
      set({ isClosed: true });
    }, 1000);
  }
}));

const LoadingScreenLoading = () => {
  useLayoutEffect(() => {
    document.body.style.height = '100vh';
    document.body.style.overflow = 'hidden';
  }, []);
  return null;
};

// This component communicates with the LoadingScreen component through the
// store to let it know when the app is out of suspense.
const LoadingScreenLoaded = () => {
  const { finishLoading } = useLoadingState();

  useLayoutEffect(() => {
    finishLoading();
    document.body.style.height = '';
    document.body.style.overflow = '';
  }, [finishLoading]);

  return null;
};

const LoadingScreenView = () => {
  const { isDone, isClosed } = useLoadingState();

  if (isClosed) return null;

  return (
    <div className={LoadingScreenCSS.container} data-closing={isDone}>
      <span className="sr-only">Loading the page</span>
      <div className={LoadingScreenCSS.pulsatingCube} />
    </div>
  );
};

const LoadingScreen = ({ children }: PropsWithChildren) => (
  <>
    <LoadingScreenView />
    <Suspense fallback={<LoadingScreenLoading />}>
      <LoadingScreenLoaded />
      {children}
    </Suspense>
  </>
)

export default LoadingScreen;
