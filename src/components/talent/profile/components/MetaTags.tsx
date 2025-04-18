
import { useEffect } from 'react';

interface MetaTagsProps {
  avatarUrl: string | undefined;
}

const MetaTags: React.FC<MetaTagsProps> = ({ avatarUrl }) => {
  useEffect(() => {
    if (!avatarUrl) return;

    const existingThumbnailTags = document.querySelectorAll('meta[property="og:image"], meta[name="thumbnail"]');
    existingThumbnailTags.forEach(tag => tag.remove());
    
    const ogImage = document.createElement('meta');
    ogImage.setAttribute('property', 'og:image');
    ogImage.setAttribute('content', avatarUrl);
    document.head.appendChild(ogImage);
    
    const thumbnail = document.createElement('meta');
    thumbnail.setAttribute('name', 'thumbnail');
    thumbnail.setAttribute('content', avatarUrl);
    document.head.appendChild(thumbnail);
    
    const appleIcon = document.createElement('link');
    appleIcon.setAttribute('rel', 'apple-touch-icon');
    appleIcon.setAttribute('href', avatarUrl);
    document.head.appendChild(appleIcon);

    return () => {
      document.head.removeChild(ogImage);
      document.head.removeChild(thumbnail);
      document.head.removeChild(appleIcon);
    };
  }, [avatarUrl]);

  return null;
};

export default MetaTags;
