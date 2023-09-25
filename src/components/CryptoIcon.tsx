import { useEffect, useRef, useState } from 'react';
import { RiCopperCoinFill } from 'react-icons/ri';
import { useCryptoIconStore } from './CryptoIcon.store';

type Props = {
  iconName: string;
  resolution: '32' | '128';
  color: 'black' | 'white' | 'color';
  alwaysVisible?: boolean;
  scrollParentRef?: React.RefObject<HTMLElement>;
  className?: string;
};

const CryptoIcon = ({
  iconName,
  resolution,
  color,
  alwaysVisible,
  scrollParentRef,
  className,
  ...rest
}: Props) => {
  const [isVisible, setIsVisible] = useState(alwaysVisible);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const availableIcons = useCryptoIconStore(state => state.availableIcons);
  const fetchAvailableIcons = useCryptoIconStore(
    state => state.fetchAvailableIcons
  );
  const placeholderRef = useRef<HTMLImageElement>(null);

  const imageUrl = `https://cdn.jsdelivr.net/npm/cryptocurrency-icons/${resolution}/${color}/${iconName.toLowerCase()}.png`;

  useEffect(() => {
    fetchAvailableIcons();
  }, [fetchAvailableIcons]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      // for loading icons 200px before they are visible
      { root: scrollParentRef?.current, rootMargin: '0px 0px 200px 0px' }
    );

    const placeholder = placeholderRef.current;
    if (placeholder) {
      observer.observe(placeholder);
      return () => observer.unobserve(placeholder);
    }
  }, [scrollParentRef]);

  useEffect(() => {
    if (isVisible && availableIcons.has(iconName.toUpperCase())) {
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => setIsImageLoaded(true);
    }
  }, [isVisible, availableIcons, iconName, imageUrl]);

  if (
    !isVisible ||
    !availableIcons.has(iconName.toUpperCase()) ||
    !isImageLoaded
  )
    return (
      <div ref={placeholderRef} className={className}>
        <RiCopperCoinFill
          alt="generic crypto icon"
          style={{ width: '100%', height: '100%' }}
          {...rest}
        />
      </div>
    );

  return (
    <img
      src={imageUrl}
      alt={`${iconName} icon`}
      className={className}
      {...rest}
    />
  );
};

export default CryptoIcon;
