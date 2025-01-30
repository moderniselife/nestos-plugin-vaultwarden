import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Card,
  CardContent,
  Typography,
} from '@mui/material';

const currentDomain = new URL(window.location.href);
const apiURL = `http://${currentDomain.hostname}:3000/api/plugins/vaultwarden`;

function PluginConfig({ config: initialConfig, onChange, onSave, isPreInstall = false }) {
  const configRef = React.useRef(
    initialConfig || {
      DOMAIN: '',
      ALLOW_SIGNUPS: false,
      ADMIN_TOKEN: '',
      PORT: '8100',
      SMTP_HOST: '',
      SMTP_FROM: '',
      SMTP_PORT: '587',
      SMTP_USERNAME: '',
      SMTP_PASSWORD: '',
    }
  );

  // Use local state only for forcing updates
  const [, forceUpdate] = React.useState({});

  useEffect(() => {
    if (initialConfig) {
      configRef.current = initialConfig;
      forceUpdate({});
    } else {
      loadConfig();
    }
  }, [initialConfig]);

  const updateConfig = React.useCallback(
    (key, value) => {
      configRef.current = { ...configRef.current, [key]: value };
      onChange?.(configRef.current);
      forceUpdate({});
    },
    [onChange]
  );

  const handleSave = async () => {
    if (isPreInstall) {
      onSave?.(configRef.current);
    } else {
      try {
        await fetch(`${apiURL}/config`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(configRef.current),
        });
        await fetch(`${apiURL}/restart`, {
          method: 'POST',
        });
      } catch (error) {
        console.error('Failed to save configuration:', error);
      }
    }
  };

  const loadConfig = async () => {
    try {
      const response = await fetch(`${apiURL}/config`);
      const data = await response.json();
      configRef.current = data;
      forceUpdate({});
    } catch (error) {
      console.error('No configuration found:', error);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Vaultwarden Configuration
        </Typography>
        <Box component="form" sx={{ '& > :not(style)': { m: 1 } }}>
          <TextField
            fullWidth
            label="Domain"
            value={configRef.current.DOMAIN || ''}
            onChange={(e) => updateConfig('DOMAIN', e.target.value)}
            helperText="Full URL where Vaultwarden will be accessible"
            autoComplete="off"
            inputProps={{ autoComplete: 'off' }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={configRef.current.ALLOW_SIGNUPS || false}
                onChange={(e) => updateConfig('ALLOW_SIGNUPS', e.target.checked)}
              />
            }
            label="Allow Signups"
          />
          <TextField
            fullWidth
            label="Admin Token"
            value={configRef.current.ADMIN_TOKEN || ''}
            onChange={(e) => updateConfig('ADMIN_TOKEN', e.target.value)}
            type="password"
            autoComplete="off"
            inputProps={{ autoComplete: 'off' }}
          />
          <TextField
            fullWidth
            label="Port"
            value={configRef.current.PORT || 8100}
            onChange={(e) => updateConfig('PORT', e.target.value)}
            autoComplete="off"
            inputProps={{ autoComplete: 'off' }}
          />
          <Typography variant="subtitle2" sx={{ mt: 2 }}>
            Email Configuration (Optional)
          </Typography>
          <TextField
            fullWidth
            label="SMTP Host"
            value={configRef.current.SMTP_HOST || ''}
            onChange={(e) => updateConfig('SMTP_HOST', e.target.value)}
            autoComplete="off"
            inputProps={{ autoComplete: 'off' }}
          />
          <TextField
            fullWidth
            label="SMTP From"
            value={configRef.current.SMTP_FROM || ''}
            onChange={(e) => updateConfig('SMTP_FROM', e.target.value)}
            autoComplete="off"
            inputProps={{ autoComplete: 'off' }}
          />
          <TextField
            fullWidth
            label="SMTP Port"
            value={configRef.current.SMTP_PORT || ''}
            onChange={(e) => updateConfig('SMTP_PORT', e.target.value)}
            autoComplete="off"
            inputProps={{ autoComplete: 'off' }}
          />
          <TextField
            fullWidth
            label="SMTP Username"
            value={configRef.current.SMTP_USERNAME || ''}
            onChange={(e) => updateConfig('SMTP_USERNAME', e.target.value)}
            autoComplete="off"
            inputProps={{ autoComplete: 'off' }}
          />
          <TextField
            fullWidth
            label="SMTP Password"
            value={configRef.current.SMTP_PASSWORD || ''}
            onChange={(e) => updateConfig('SMTP_PASSWORD', e.target.value)}
            autoComplete="off"
            inputProps={{ autoComplete: 'off' }}
            type="password"
          />
          <Button
            variant="contained"
            onClick={() => (isPreInstall ? onSave?.(configRef.current) : handleSave())}
          >
            {isPreInstall ? 'Install with Configuration' : 'Save Configuration'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
