/**
 * Stałe dla folderów wiadomości
 */

export const DEFAULT_FOLDER = 'odebrane';

export const FOLDER_MAP = {
  'odebrane': 'inbox',
  'wyslane': 'sent',
  'wazne': 'starred',
  'archiwum': 'archived',
  'multimedia': 'multimedia',
  'linki': 'links'
};

export const FOLDER_LABELS = {
  'odebrane': 'Odebrane',
  'wyslane': 'Wysłane', 
  'wazne': 'Ważne',
  'archiwum': 'Archiwum',
  'multimedia': 'Multimedia',
  'linki': 'Linki'
};

export const API_FOLDER_MAP = {
  'inbox': 'odebrane',
  'sent': 'wyslane',
  'starred': 'wazne',
  'archived': 'archiwum',
  'multimedia': 'multimedia',
  'links': 'linki'
};

export const UI_FOLDERS = Object.keys(FOLDER_LABELS);
