import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
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

const ConfigTextField = React.memo(({ label, value, onChange, type = 'text', helperText = '' }) => (
  <TextField
    fullWidth
    label={label}
    value={value || ''}
    onChange={onChange}
    type={type}
    helperText={helperText}
    autoComplete="off"
    inputProps={{ autoComplete: 'off' }}
  />
));

ConfigTextField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  helperText: PropTypes.string,
};

function PluginConfig({ config: initialConfig, onChange, onSave, isPreInstall = false }) {
  var [config, setConfig] = useState(
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

  useEffect(() => {
    if (initialConfig) {
      setConfig(initialConfig);
    } else {
      loadConfig();
    }
  }, [initialConfig]);

  const handleChange = React.useCallback(
    (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      const newConfig = { ...config, [key]: value };
      setConfig(newConfig);
      onChange?.(newConfig);
    },
    [config, onChange]
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
      config = data;
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
          <ConfigTextField
            label="Domain"
            value={config.DOMAIN}
            onChange={handleChange('DOMAIN')}
            helperText="Full URL where Vaultwarden will be accessible"
          />
          <FormControlLabel
            control={
              <Switch
                checked={config.ALLOW_SIGNUPS || false}
                onChange={handleChange('ALLOW_SIGNUPS')}
              />
            }
            label="Allow Signups"
          />
          <ConfigTextField
            label="Admin Token"
            value={config.ADMIN_TOKEN}
            onChange={handleChange('ADMIN_TOKEN')}
            type="password"
            helperText="Token for accessing the admin panel"
          />
          <ConfigTextField
            label="Port"
            value={config.PORT}
            onChange={handleChange('PORT')}
            helperText="Port for the Vaultwarden server"
          />
          <Typography variant="subtitle2" sx={{ mt: 2 }}>
            Email Configuration (Optional)
          </Typography>
          <ConfigTextField
            label="SMTP Host"
            value={config.SMTP_HOST}
            onChange={handleChange('SMTP_HOST')}
            helperText="SMTP server host"
          />
          <ConfigTextField
            label="SMTP From"
            value={config.SMTP_FROM}
            onChange={handleChange('SMTP_FROM')}
            helperText="Email address to send emails from"
          />
          <ConfigTextField
            label="SMTP Port"
            value={config.SMTP_PORT}
            onChange={handleChange('SMTP_PORT')}
            helperText="SMTP server port"
          />
          <ConfigTextField
            label="SMTP Username"
            value={config.SMTP_USERNAME}
            onChange={handleChange('SMTP_USERNAME')}
            helperText="SMTP server username"
          />
          <ConfigTextField
            label="SMTP Password"
            value={config.SMTP_PASSWORD}
            onChange={handleChange('SMTP_PASSWORD')}
            type="password"
            helperText="SMTP server password"
          />
          <Button variant="contained" onClick={handleSave}>
            {isPreInstall ? 'Install with Configuration' : 'Save Configuration'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
