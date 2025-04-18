
export const formatSocialUrl = (type: string, url: string): string => {
  switch (type) {
    case 'whatsapp':
      return url.startsWith('https://') ? url : `https://wa.me/${url.replace(/[^0-9]/g, '')}`;
    case 'website':
    case 'globe':
      return url.startsWith('http') ? url : `https://${url}`;
    case 'email':
    case 'mail':
      return url.startsWith('mailto:') ? url : `mailto:${url}`;
    case 'twitter':
      return !url.startsWith('http') ? `https://twitter.com/${url.replace('@', '')}` : url;
    case 'github':
      return !url.startsWith('http') ? `https://github.com/${url.replace('@', '')}` : url;
    case 'linkedin':
      return !url.startsWith('http') ? `https://linkedin.com/in/${url.replace('@', '')}` : url;
    case 'location':
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(url)}`;
    default:
      return !url.startsWith('http') ? `https://${url}` : url;
  }
};

export const getSocialIconUrl = (type: string): string => {
  const iconMap: Record<string, string> = {
    linkedin: "https://cdn-icons-png.flaticon.com/512/145/145807.png",
    whatsapp: "https://cdn-icons-png.flaticon.com/512/5968/5968841.png",
    twitter: "https://cdn-icons-png.flaticon.com/512/5969/5969020.png",
    facebook: "https://cdn-icons-png.flaticon.com/512/5968/5968764.png",
    instagram: "https://cdn-icons-png.flaticon.com/512/15707/15707749.png",
    github: "https://cdn-icons-png.flaticon.com/512/1051/1051326.png",
    youtube: "https://cdn-icons-png.flaticon.com/512/3670/3670147.png",
    telegram: "https://cdn-icons-png.flaticon.com/512/5968/5968804.png",
    bluesky: "https://www.iconpacks.net/icons/free-icons-7/free-bluesky-blue-round-circle-logo-icon-24461.png",
    location: "https://cdn-icons-png.flaticon.com/512/355/355980.png",
    website: "https://cdn-icons-png.flaticon.com/512/3059/3059997.png",
    discord: "https://cdn-icons-png.flaticon.com/512/5968/5968756.png"
  };
  
  return iconMap[type] || "https://cdn-icons-png.flaticon.com/512/3059/3059997.png";
};
