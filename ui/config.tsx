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
    domain: '',
    allowSignups: false,
    adminToken: '',
    port: '8100',
    smtpHost: '',
    smtpFrom: '',
    smtpPort: '587',
    smtpUsername: '',
    smtpPassword: '',
  });

  useEffect(() => {
    if (initialConfig) {
      setConfig(initialConfig);
    } else {
      loadConfig();
    }
  }, [initialConfig]);

  const handleSave = async () => {
    if (isPreInstall) {
      // For pre-installation, just call onSave with the config
      onSave?.(config);
    } else {
      try {
        await fetch(`${apiURL}/config`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(config),
        });
        // Only restart if not in pre-installation mode
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
            value={config?.domain || ''}
            onChange={(e) => setConfig({ ...config, domain: e.target.value })}
            helperText="Full URL where Vaultwarden will be accessible"
          />
          <FormControlLabel
            control={
              <Switch
                checked={config?.allowSignups || false}
                onChange={(e) => setConfig({ ...config, allowSignups: e.target.checked })}
              />
            }
            label="Allow Signups"
          />
          <TextField
            fullWidth
            label="Admin Token"
            value={config?.adminToken || ''}
            onChange={(e) => setConfig({ ...config, adminToken: e.target.value })}
            type="password"
          />
          <TextField
            fullWidth
            label="Port"
            value={config?.port || 8100}
            onChange={(e) => setConfig({ ...config, port: e.target.value })}
          />
          <Typography variant="subtitle2" sx={{ mt: 2 }}>
            Email Configuration (Optional)
          </Typography>
          <TextField
            fullWidth
            label="SMTP Host"
            value={config?.smtpHost || ''}
            onChange={(e) => setConfig({ ...config, smtpHost: e.target.value })}
          />
          <TextField
            fullWidth
            label="SMTP From"
            value={config?.smtpFrom || ''}
            onChange={(e) => setConfig({ ...config, smtpFrom: e.target.value })}
          />
          <TextField
            fullWidth
            label="SMTP Port"
            value={config?.smtpPort || ''}
            onChange={(e) => setConfig({ ...config, smtpPort: e.target.value })}
          />
          <TextField
            fullWidth
            label="SMTP Username"
            value={config?.smtpUsername || ''}
            onChange={(e) => setConfig({ ...config, smtpUsername: e.target.value })}
          />
          <TextField
            fullWidth
            label="SMTP Password"
            value={config?.smtpPassword || ''}
            onChange={(e) => setConfig({ ...config, smtpPassword: e.target.value })}
            type="password"
          />
          <Button variant="contained" onClick={handleSave}>
            Save Configuration
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
