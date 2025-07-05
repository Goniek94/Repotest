import React from 'react';
import { Link } from 'react-router-dom';
import UserSettingsPanel from './UserSettingsPanel';

/**
 * Komponent zarządzający ustawieniami użytkownika
 * Zawiera nowy panel ustawień z zakładkami
 */
const UserSettings = () => {
  return (
    <div>
      <UserSettingsPanel />
    </div>
  );
};

export default UserSettings;
