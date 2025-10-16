import React, { useState } from 'react';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    Switch,
    FormControlLabel,
    Divider,
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Alert
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { IconDeviceFloppy, IconRefresh } from '@tabler/icons-react';

const Settings = () => {
    const [settings, setSettings] = useState({
        autoApproval: false,
        emailNotifications: true,
        verificationRequired: true,
        maxProfessionals: 1000,
        approvalThreshold: 'medium',
        defaultCategory: 'all'
    });

    const [showSuccess, setShowSuccess] = useState(false);

    const handleSettingChange = (setting) => (event) => {
        setSettings((prev) => ({
            ...prev,
            [setting]: event.target.type === 'checkbox' ? event.target.checked : event.target.value
        }));
    };

    const handleSave = () => {
        // Here you would typically save to backend
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const handleReset = () => {
        setSettings({
            autoApproval: false,
            emailNotifications: true,
            verificationRequired: true,
            maxProfessionals: 1000,
            approvalThreshold: 'medium',
            defaultCategory: 'all'
        });
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <MainCard title="Professional Settings">
                        <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
                            Configure professional management settings, approval processes, and system preferences.
                        </Typography>
                    </MainCard>
                </Grid>

                {showSuccess && (
                    <Grid item xs={12}>
                        <Alert severity="success" onClose={() => setShowSuccess(false)}>
                            Settings saved successfully!
                        </Alert>
                    </Grid>
                )}

                <Grid item xs={12} md={6}>
                    <MainCard title="Approval Settings">
                        <Box sx={{ mb: 3 }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.autoApproval}
                                        onChange={handleSettingChange('autoApproval')}
                                        color="primary"
                                    />
                                }
                                label="Auto-approve professionals"
                            />
                            <Typography variant="body2" color="textSecondary" sx={{ ml: 4, mt: 1 }}>
                                Automatically approve professionals without manual review
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.verificationRequired}
                                        onChange={handleSettingChange('verificationRequired')}
                                        color="primary"
                                    />
                                }
                                label="Require verification"
                            />
                            <Typography variant="body2" color="textSecondary" sx={{ ml: 4, mt: 1 }}>
                                Require document verification for all professionals
                            </Typography>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ mb: 3 }}>
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>Approval Threshold</InputLabel>
                                <Select
                                    value={settings.approvalThreshold}
                                    label="Approval Threshold"
                                    onChange={handleSettingChange('approvalThreshold')}
                                >
                                    <MenuItem value="low">Low (Basic verification)</MenuItem>
                                    <MenuItem value="medium">Medium (Standard verification)</MenuItem>
                                    <MenuItem value="high">High (Strict verification)</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <TextField
                                fullWidth
                                label="Maximum Professionals"
                                type="number"
                                value={settings.maxProfessionals}
                                onChange={handleSettingChange('maxProfessionals')}
                                helperText="Maximum number of professionals allowed in the system"
                            />
                        </Box>
                    </MainCard>
                </Grid>

                <Grid item xs={12} md={6}>
                    <MainCard title="Notification Settings">
                        <Box sx={{ mb: 3 }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.emailNotifications}
                                        onChange={handleSettingChange('emailNotifications')}
                                        color="primary"
                                    />
                                }
                                label="Email notifications"
                            />
                            <Typography variant="body2" color="textSecondary" sx={{ ml: 4, mt: 1 }}>
                                Send email notifications for new applications and approvals
                            </Typography>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ mb: 3 }}>
                            <FormControl fullWidth>
                                <InputLabel>Default Category</InputLabel>
                                <Select
                                    value={settings.defaultCategory}
                                    label="Default Category"
                                    onChange={handleSettingChange('defaultCategory')}
                                >
                                    <MenuItem value="all">All Categories</MenuItem>
                                    <MenuItem value="web-development">Web Development</MenuItem>
                                    <MenuItem value="mobile-development">Mobile Development</MenuItem>
                                    <MenuItem value="graphic-design">Graphic Design</MenuItem>
                                    <MenuItem value="ui-ux-design">UI/UX Design</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                System Information
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">Total Professionals:</Typography>
                                <Typography variant="body2" color="primary">
                                    1,234
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">Pending Verifications:</Typography>
                                <Typography variant="body2" color="warning.main">
                                    156
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">System Status:</Typography>
                                <Typography variant="body2" color="success.main">
                                    Active
                                </Typography>
                            </Box>
                        </Box>
                    </MainCard>
                </Grid>

                <Grid item xs={12}>
                    <MainCard>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                            <Button variant="outlined" startIcon={<IconRefresh size={20} />} onClick={handleReset}>
                                Reset to Default
                            </Button>
                            <Button variant="contained" startIcon={<IconDeviceFloppy size={20} />} onClick={handleSave}>
                                Save Settings
                            </Button>
                        </Box>
                    </MainCard>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Settings;
