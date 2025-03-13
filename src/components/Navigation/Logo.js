import React from 'react';
import { Link } from 'react-router-dom';

const Logo = () => {
  console.log("Próba załadowania logo");
  
  return (
    <Link to="/" className="block relative" style={{ height: '60px', overflow: 'visible' }}>
      <div className="absolute" style={{ left: '20px', top: '50%', transform: 'translateY(-50%)' }}>
        <img
          src="/images/Logo_auto.sell.svg"
          alt="AUTOSELL"
          style={{
            height: '80px', // Powiększone logo
            width: 'auto',
            maxWidth: 'none' // Zapobiega ograniczeniom szerokości
          }}
          onError={(e) => {
            console.error("Błąd ładowania obrazu logo");
            e.target.style.display = 'none';
          }}
          onLoad={() => console.log("Logo załadowane pomyślnie")}
        />
      </div>
    </Link>
  );
};

export default Logo;