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
        autoEnrollment: false,
        emailNotifications: true,
        certificateRequired: true,
        maxStudents: 5000,
        enrollmentThreshold: 'medium',
        defaultCourse: 'all'
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
            autoEnrollment: false,
            emailNotifications: true,
            certificateRequired: true,
            maxStudents: 5000,
            enrollmentThreshold: 'medium',
            defaultCourse: 'all'
        });
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <MainCard title="LMS Settings">
                        <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
                            Configure learning management system settings, enrollment processes, and system preferences.
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
                    <MainCard title="Enrollment Settings">
                        <Box sx={{ mb: 3 }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.autoEnrollment}
                                        onChange={handleSettingChange('autoEnrollment')}
                                        color="primary"
                                    />
                                }
                                label="Auto-enroll students"
                            />
                            <Typography variant="body2" color="textSecondary" sx={{ ml: 4, mt: 1 }}>
                                Automatically enroll students without manual approval
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.certificateRequired}
                                        onChange={handleSettingChange('certificateRequired')}
                                        color="primary"
                                    />
                                }
                                label="Require certificate completion"
                            />
                            <Typography variant="body2" color="textSecondary" sx={{ ml: 4, mt: 1 }}>
                                Require course completion for certificate issuance
                            </Typography>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ mb: 3 }}>
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>Enrollment Threshold</InputLabel>
                                <Select
                                    value={settings.enrollmentThreshold}
                                    label="Enrollment Threshold"
                                    onChange={handleSettingChange('enrollmentThreshold')}
                                >
                                    <MenuItem value="low">Low (Basic requirements)</MenuItem>
                                    <MenuItem value="medium">Medium (Standard requirements)</MenuItem>
                                    <MenuItem value="high">High (Strict requirements)</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <TextField
                                fullWidth
                                label="Maximum Students"
                                type="number"
                                value={settings.maxStudents}
                                onChange={handleSettingChange('maxStudents')}
                                helperText="Maximum number of students allowed in the system"
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
                                Send email notifications for enrollments and course updates
                            </Typography>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ mb: 3 }}>
                            <FormControl fullWidth>
                                <InputLabel>Default Course</InputLabel>
                                <Select
                                    value={settings.defaultCourse}
                                    label="Default Course"
                                    onChange={handleSettingChange('defaultCourse')}
                                >
                                    <MenuItem value="all">All Courses</MenuItem>
                                    <MenuItem value="beginner">Beginner Courses</MenuItem>
                                    <MenuItem value="intermediate">Intermediate Courses</MenuItem>
                                    <MenuItem value="advanced">Advanced Courses</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                System Information
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">Total Courses:</Typography>
                                <Typography variant="body2" color="primary">
                                    0
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">Active Students:</Typography>
                                <Typography variant="body2" color="warning.main">
                                    0
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

