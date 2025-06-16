import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider, 
  FormGroup, 
  FormControlLabel, 
  Switch, 
  Button, 
  CircularProgress, 
  Alert, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  Grid,
  useTheme
} from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon, 
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useSnackbar } from 'notistack';

import { 
  getNotificationGroups, 
  getNotificationGroupNames, 
  getNotificationTypeName, 
  getNotificationIcon, 
  getNotificationColor,
  getDefaultNotificationPreferences
} from '../../utils/NotificationTypes';

/**
 * Komponent preferencji powiadomień
 * @param {Object} props - Właściwości komponentu
 * @param {Function} props.onBack - Funkcja wywoływana po kliknięciu przycisku powrotu
 * @returns {JSX.Element}
 */
const NotificationPreferences = ({ onBack }) => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  
  // Stan komponentu
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null);
  
  // Grupy powiadomień
  const notificationGroups = getNotificationGroups();
  const groupNames = getNotificationGroupNames();
  
  // Pobieranie preferencji powiadomień
  useEffect(() => {
    fetchPreferences();
  }, []);
  
  // Pobieranie preferencji powiadomień z API
  const fetchPreferences = async () => {
    try {
      setLoading(true);
      
      // Pobieramy preferencje użytkownika
      const response = await axios.get('/api/users/me');
      const userPreferences = response.data.notificationPreferences;
      
      // Jeśli użytkownik nie ma jeszcze preferencji, używamy domyślnych
      if (!userPreferences) {
        setPreferences(getDefaultNotificationPreferences());
      } else {
        setPreferences(userPreferences);
      }
      
      setError(null);
    } catch (err) {
      console.error('Błąd podczas pobierania preferencji powiadomień:', err);
      setError('Nie udało się pobrać preferencji powiadomień. Spróbuj ponownie później.');
      
      // Ustawiamy domyślne preferencje
      setPreferences(getDefaultNotificationPreferences());
    } finally {
      setLoading(false);
    }
  };
  
  // Zapisywanie preferencji powiadomień
  const savePreferences = async () => {
    try {
      setSaving(true);
      
      // Zapisujemy preferencje użytkownika
      await axios.put('/api/notifications/preferences', preferences);
      
      enqueueSnackbar('Preferencje powiadomień zostały zapisane', { variant: 'success' });
      setError(null);
    } catch (err) {
      console.error('Błąd podczas zapisywania preferencji powiadomień:', err);
      setError('Nie udało się zapisać preferencji powiadomień. Spróbuj ponownie później.');
      enqueueSnackbar('Nie udało się zapisać preferencji powiadomień', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };
  
  // Zmiana wartości przełącznika
  const handleSwitchChange = (channel, type, value) => {
    setPreferences({
      ...preferences,
      [channel]: {
        ...preferences[channel],
        [type]: value
      }
    });
  };
  
  // Zmiana wartości przełącznika dla całej grupy
  const handleGroupSwitchChange = (channel, group, value) => {
    const newPreferences = { ...preferences };
    
    // Aktualizujemy wszystkie typy w grupie
    notificationGroups[group].forEach(type => {
      const preferenceKey = typeToPreferenceKey(type);
      if (preferenceKey) {
        newPreferences[channel][preferenceKey] = value;
      }
    });
    
    setPreferences(newPreferences);
  };
  
  // Konwersja typu powiadomienia na klucz preferencji
  const typeToPreferenceKey = (type) => {
    // Konwertujemy typ na camelCase
    const parts = type.split('_');
    return parts.map((part, index) => 
      index === 0 
        ? part.toLowerCase() 
        : part.charAt(0) + part.slice(1).toLowerCase()
    ).join('');
  };
  
  // Sprawdzenie, czy wszystkie typy w grupie mają tę samą wartość
  const isGroupEnabled = (channel, group) => {
    if (!preferences) return false;
    
    const types = notificationGroups[group];
    const values = types.map(type => {
      const preferenceKey = typeToPreferenceKey(type);
      return preferenceKey ? preferences[channel][preferenceKey] : false;
    });
    
    return values.every(v => v === true);
  };
  
  // Sprawdzenie, czy niektóre typy w grupie są włączone
  const isGroupPartiallyEnabled = (channel, group) => {
    if (!preferences) return false;
    
    const types = notificationGroups[group];
    const values = types.map(type => {
      const preferenceKey = typeToPreferenceKey(type);
      return preferenceKey ? preferences[channel][preferenceKey] : false;
    });
    
    return values.some(v => v === true) && !values.every(v => v === true);
  };
  
  // Obsługa zmiany rozwinięcia akordeonu
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : null);
  };
  
  // Renderowanie zawartości
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box>
      {/* Nagłówek */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box display="flex" alignItems="center">
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={onBack}
            sx={{ mr: 2 }}
          >
            Powrót
          </Button>
          
          <Typography variant="h5" component="h1" fontWeight="bold">
            Preferencje powiadomień
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={savePreferences}
          disabled={saving}
        >
          {saving ? 'Zapisywanie...' : 'Zapisz preferencje'}
        </Button>
      </Box>
      
      {/* Błąd */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {/* Opis */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="body1">
          Dostosuj swoje preferencje powiadomień poniżej. Możesz wybrać, które powiadomienia chcesz otrzymywać i w jakiej formie.
        </Typography>
      </Paper>
      
      {/* Kanały powiadomień */}
      <Grid container spacing={3}>
        {/* Email */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: 8 }}>
                email
              </span>
              Powiadomienia email
            </Typography>
            
            <Typography variant="body2" color="text.secondary" paragraph>
              Powiadomienia wysyłane na Twój adres email. Idealne dla ważnych informacji, które nie wymagają natychmiastowej reakcji.
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            {Object.keys(notificationGroups).map(group => (
              <Accordion
                key={`email-${group}`}
                expanded={expanded === `email-${group}`}
                onChange={handleAccordionChange(`email-${group}`)}
                sx={{ mb: 1 }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" width="100%" pr={2}>
                    <Typography>{groupNames[group]}</Typography>
                    
                    <FormControlLabel
                      control={
                        <Switch
                          checked={isGroupEnabled('email', group)}
                          indeterminate={isGroupPartiallyEnabled('email', group)}
                          onChange={(e) => handleGroupSwitchChange('email', group, e.target.checked)}
                          onClick={(e) => e.stopPropagation()}
                          onFocus={(e) => e.stopPropagation()}
                        />
                      }
                      label=""
                      sx={{ m: 0 }}
                    />
                  </Box>
                </AccordionSummary>
                
                <AccordionDetails>
                  <FormGroup>
                    {notificationGroups[group].map(type => {
                      const preferenceKey = typeToPreferenceKey(type);
                      return (
                        <FormControlLabel
                          key={`email-${type}`}
                          control={
                            <Switch
                              checked={preferences.email[preferenceKey] || false}
                              onChange={(e) => handleSwitchChange('email', preferenceKey, e.target.checked)}
                            />
                          }
                          label={getNotificationTypeName(type)}
                        />
                      );
                    })}
                  </FormGroup>
                </AccordionDetails>
              </Accordion>
            ))}
          </Paper>
        </Grid>
        
        {/* Push */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: 8 }}>
                notifications
              </span>
              Powiadomienia w aplikacji
            </Typography>
            
            <Typography variant="body2" color="text.secondary" paragraph>
              Powiadomienia wyświetlane w aplikacji. Idealne dla bieżących informacji, które chcesz zobaczyć podczas korzystania z serwisu.
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            {Object.keys(notificationGroups).map(group => (
              <Accordion
                key={`push-${group}`}
                expanded={expanded === `push-${group}`}
                onChange={handleAccordionChange(`push-${group}`)}
                sx={{ mb: 1 }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" width="100%" pr={2}>
                    <Typography>{groupNames[group]}</Typography>
                    
                    <FormControlLabel
                      control={
                        <Switch
                          checked={isGroupEnabled('push', group)}
                          indeterminate={isGroupPartiallyEnabled('push', group)}
                          onChange={(e) => handleGroupSwitchChange('push', group, e.target.checked)}
                          onClick={(e) => e.stopPropagation()}
                          onFocus={(e) => e.stopPropagation()}
                        />
                      }
                      label=""
                      sx={{ m: 0 }}
                    />
                  </Box>
                </AccordionSummary>
                
                <AccordionDetails>
                  <FormGroup>
                    {notificationGroups[group].map(type => {
                      const preferenceKey = typeToPreferenceKey(type);
                      return (
                        <FormControlLabel
                          key={`push-${type}`}
                          control={
                            <Switch
                              checked={preferences.push[preferenceKey] || false}
                              onChange={(e) => handleSwitchChange('push', preferenceKey, e.target.checked)}
                            />
                          }
                          label={getNotificationTypeName(type)}
                        />
                      );
                    })}
                  </FormGroup>
                </AccordionDetails>
              </Accordion>
            ))}
          </Paper>
        </Grid>
        
        {/* SMS */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: 8 }}>
                sms
              </span>
              Powiadomienia SMS
            </Typography>
            
            <Typography variant="body2" color="text.secondary" paragraph>
              Powiadomienia wysyłane jako wiadomości SMS. Idealne dla krytycznych informacji, które wymagają natychmiastowej uwagi.
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            {Object.keys(notificationGroups).map(group => (
              <Accordion
                key={`sms-${group}`}
                expanded={expanded === `sms-${group}`}
                onChange={handleAccordionChange(`sms-${group}`)}
                sx={{ mb: 1 }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" width="100%" pr={2}>
                    <Typography>{groupNames[group]}</Typography>
                    
                    <FormControlLabel
                      control={
                        <Switch
                          checked={isGroupEnabled('sms', group)}
                          indeterminate={isGroupPartiallyEnabled('sms', group)}
                          onChange={(e) => handleGroupSwitchChange('sms', group, e.target.checked)}
                          onClick={(e) => e.stopPropagation()}
                          onFocus={(e) => e.stopPropagation()}
                        />
                      }
                      label=""
                      sx={{ m: 0 }}
                    />
                  </Box>
                </AccordionSummary>
                
                <AccordionDetails>
                  <FormGroup>
                    {notificationGroups[group].map(type => {
                      const preferenceKey = typeToPreferenceKey(type);
                      return (
                        <FormControlLabel
                          key={`sms-${type}`}
                          control={
                            <Switch
                              checked={preferences.sms[preferenceKey] || false}
                              onChange={(e) => handleSwitchChange('sms', preferenceKey, e.target.checked)}
                            />
                          }
                          label={getNotificationTypeName(type)}
                        />
                      );
                    })}
                  </FormGroup>
                </AccordionDetails>
              </Accordion>
            ))}
          </Paper>
        </Grid>
      </Grid>
      
      {/* Przycisk zapisz */}
      <Box display="flex" justifyContent="flex-end" mt={3}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={savePreferences}
          disabled={saving}
          size="large"
        >
          {saving ? 'Zapisywanie...' : 'Zapisz preferencje'}
        </Button>
      </Box>
    </Box>
  );
};

export default NotificationPreferences;
