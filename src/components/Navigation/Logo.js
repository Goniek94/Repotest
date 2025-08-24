import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center h-12 -ml-12 sm:-ml-8">
      <img
        src="/images/Autosell12.svg"
        alt="AUTOSELL"
        className="w-80 h-auto object-contain transition-transform duration-300 hover:scale-[1.03]"
        onError={(e) => {
          // Fallback do innych dostępnych logo
          const fallbackImages = [
            '/images/autosell.svg',
            '/images/autosell1.svg',
            '/images/AUTOSELL_logo_v1.png',
            '/images/Autosell.png'
          ];
          
          let tried = 0;
          const tryNextImage = () => {
            if (tried < fallbackImages.length) {
              e.target.src = fallbackImages[tried];
              tried++;
            } else {
              // Jeśli wszystkie obrazy zawiodą, pokaż tekst
              e.target.outerHTML = `
                <span class="text-base font-bold uppercase text-[#35530A]">
                  AUTO<span class="text-yellow-500">SELL</span>
                </span>
              `;
            }
          };
          
          e.target.onerror = tryNextImage;
          tryNextImage();
        }}
      />
    </Link>
  );
};

export default Logo;
