import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { IconUser, IconUsers, IconCertificate, IconSettings } from '@tabler/icons-react';

const ProfessionalManagement = () => {
    const stats = [
        {
            title: 'Total Professionals',
            value: '1,234',
            icon: <IconUsers size={40} color="#1976d2" />,
            color: '#1976d2'
        },
        {
            title: 'Active Professionals',
            value: '987',
            icon: <IconUser size={40} color="#2e7d32" />,
            color: '#2e7d32'
        },
        {
            title: 'Pending Verification',
            value: '156',
            icon: <IconCertificate size={40} color="#ed6c02" />,
            color: '#ed6c02'
        },
        {
            title: 'Suspended',
            value: '23',
            icon: <IconSettings size={40} color="#d32f2f" />,
            color: '#d32f2f'
        }
    ];

    return (
        <Box sx={{ mt: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <MainCard title="Professional  Dashboard">
                        <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
                            Manage all professional accounts, verifications, and settings from this centralized dashboard.
                        </Typography>
                    </MainCard>
                </Grid>

                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                '&:hover': {
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                    transform: 'translateY(-2px)',
                                    transition: 'all 0.3s ease'
                                }
                            }}
                        >
                            <CardContent
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    flexGrow: 1,
                                    p: 3
                                }}
                            >
                                <Box sx={{ mb: 2 }}>{stat.icon}</Box>
                                <Typography
                                    variant="h4"
                                    component="div"
                                    sx={{
                                        fontWeight: 'bold',
                                        color: stat.color,
                                        mb: 1
                                    }}
                                >
                                    {stat.value}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {stat.title}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}

                <Grid item xs={12}>
                    <MainCard title="Quick Actions">
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card
                                    sx={{
                                        p: 2,
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            bgcolor: 'primary.light',
                                            color: 'primary.contrastText'
                                        }
                                    }}
                                >
                                    <Typography variant="h6">View All Professionals</Typography>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card
                                    sx={{
                                        p: 2,
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            bgcolor: 'success.light',
                                            color: 'success.contrastText'
                                        }
                                    }}
                                >
                                    <Typography variant="h6">Verify Applications</Typography>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card
                                    sx={{
                                        p: 2,
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            bgcolor: 'warning.light',
                                            color: 'warning.contrastText'
                                        }
                                    }}
                                >
                                    <Typography variant="h6">Manage Categories</Typography>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card
                                    sx={{
                                        p: 2,
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            bgcolor: 'info.light',
                                            color: 'info.contrastText'
                                        }
                                    }}
                                >
                                    <Typography variant="h6">Reports & Analytics</Typography>
                                </Card>
                            </Grid>
                        </Grid>
                    </MainCard>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ProfessionalManagement;
