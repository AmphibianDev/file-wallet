import { useEffect, useRef, useState } from 'react';
import { RiCopperCoinFill } from 'react-icons/ri';
import { useCryptoIconStore } from './CryptoIcon.store';

type Props = {
  iconName: string;
  resolution: '32' | '128';
  color: 'black' | 'white' | 'color';
  alwaysVisible?: boolean;
  className?: string;
};

const CryptoIcon = ({
  iconName,
  resolution,
  color,
  alwaysVisible,
  className,
  ...rest
}: Props) => {
  const [isVisible, setIsVisible] = useState(alwaysVisible);
  const availableIcons = useCryptoIconStore(state => state.availableIcons);
  const fetchAvailableIcons = useCryptoIconStore(
    state => state.fetchAvailableIcons
  );
  const placeholderRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    fetchAvailableIcons();
  }, [fetchAvailableIcons]);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      });
    });

    if (placeholderRef.current) {
      observer.observe(placeholderRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  if (!isVisible || !availableIcons.has(iconName.toUpperCase()))
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
      src={`https://cdn.jsdelivr.net/npm/cryptocurrency-icons/${resolution}/${color}/${iconName.toLowerCase()}.png`}
      alt={`${iconName} icon`}
      className={className}
      {...rest}
    />
  );
};

export default CryptoIcon;
