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
  var [config, setConfig] = React.useState({
    DOMAIN: '',
    ALLOW_SIGNUPS: false,
    ADMIN_TOKEN: '',
    PORT: '8100',
    SMTP_HOST: '',
    SMTP_FROM: '',
    SMTP_PORT: '587',
    SMTP_USERNAME: '',
    SMTP_PASSWORD: '',
  });

  useEffect(() => {
    if (initialConfig) {
      setConfig(initialConfig);
    } else {
      loadConfig();
    }
  }, [initialConfig]);

  const updateConfig = React.useCallback(
    (newConfig) => {
      setConfig(newConfig);
      onChange?.(newConfig);
    },
    [onChange]
  );

  const handleSave = async () => {
    if (isPreInstall) {
      onSave?.(config);
    } else {
      try {
        await fetch(`${apiURL}/config`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(config),
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
      setConfig(data);
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
            value={config?.DOMAIN || ''}
            onChange={(e) => updateConfig({ ...config, DOMAIN: e.target.value })}
            helperText="Full URL where Vaultwarden will be accessible"
            autoComplete="off"
            inputProps={{ autoComplete: 'off' }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={config?.ALLOW_SIGNUPS || false}
                onChange={(e) => updateConfig({ ...config, ALLOW_SIGNUPS: e.target.checked })}
              />
            }
            label="Allow Signups"
          />
          <TextField
            fullWidth
            label="Admin Token"
            value={config?.ADMIN_TOKEN || ''}
            onChange={(e) => updateConfig({ ...config, ADMIN_TOKEN: e.target.value })}
            type="password"
            autoComplete="off"
            inputProps={{ autoComplete: 'off' }}
          />
          <TextField
            fullWidth
            label="Port"
            value={config?.PORT || 8100}
            onChange={(e) => updateConfig({ ...config, PORT: e.target.value })}
            autoComplete="off"
            inputProps={{ autoComplete: 'off' }}
          />
          <Typography variant="subtitle2" sx={{ mt: 2 }}>
            Email Configuration (Optional)
          </Typography>
          <TextField
            fullWidth
            label="SMTP Host"
            value={config?.SMTP_HOST || ''}
            onChange={(e) => updateConfig({ ...config, SMTP_HOST: e.target.value })}
            autoComplete="off"
            inputProps={{ autoComplete: 'off' }}
          />
          <TextField
            fullWidth
            label="SMTP From"
            value={config?.SMTP_FROM || ''}
            onChange={(e) => updateConfig({ ...config, SMTP_FROM: e.target.value })}
            autoComplete="off"
            inputProps={{ autoComplete: 'off' }}
          />
          <TextField
            fullWidth
            label="SMTP Port"
            value={config?.SMTP_PORT || ''}
            onChange={(e) => updateConfig({ ...config, SMTP_PORT: e.target.value })}
            autoComplete="off"
            inputProps={{ autoComplete: 'off' }}
          />
          <TextField
            fullWidth
            label="SMTP Username"
            value={config?.SMTP_USERNAME || ''}
            onChange={(e) => updateConfig({ ...config, SMTP_USERNAME: e.target.value })}
            autoComplete="off"
            inputProps={{ autoComplete: 'off' }}
          />
          <TextField
            fullWidth
            label="SMTP Password"
            value={config?.SMTP_PASSWORD || ''}
            onChange={(e) => updateConfig({ ...config, SMTP_PASSWORD: e.target.value })}
            autoComplete="off"
            inputProps={{ autoComplete: 'off' }}
            type="password"
          />
          <Button variant="contained" onClick={handleSave}>
            {isPreInstall ? 'Install with Configuration' : 'Save Configuration'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
