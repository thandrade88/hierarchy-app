import { useState } from 'react';

export default function ImageLoader({ src, alt, className }: { src: string; alt: string; className: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div>
      {isLoading && alt}
      {hasError && alt}
      
      {!isLoading && !hasError && (
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
          console.error('Error loading image:', src);
        }}
        style={{ display: isLoading ? 'none' : 'block' }}
        className={className}
      />
      )}
    </div>
  );

    

}