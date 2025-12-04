import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { IconUser, IconUsers, IconCertificate, IconSettings, IconEye, IconCheck, IconCategory, IconChartBar } from '@tabler/icons-react';
import Banner from './Banner';

// ==============================|| HIRING TALENT DASHBOARD ||============================== //

const HiringTalent = () => {

    const stats = [
        {
            title: 'Total Hiring Talents',
            value: '1,234',
            icon: <IconUsers size={28} stroke={2} />,
            color: '#1976d2'
        },
        {
            title: 'Active Hiring Talents',
            value: '987',
            icon: <IconUser size={28} stroke={2} />,
            color: '#2e7d32'
        },
        {
            title: 'Pending Verification',
            value: '156',
            icon: <IconCertificate size={28} stroke={2} />,
            color: '#ed6c02'
        },
        {
            title: 'Suspended',
            value: '23',
            icon: <IconSettings size={28} stroke={2} />,
            color: '#d32f2f'
        }
    ];

    return (
        <Box sx={{ mt: { xs: 1, sm: 1.5, md: 2 }, width: '100%', px: { xs: 1, sm: 2, md: 0 } }}>
            <Grid container spacing={{ xs: 2, sm: 3 }}>
                <Grid item xs={12}>
                    <Banner />
                </Grid>

                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                position: 'relative',
                                overflow: 'hidden',
                                borderRadius: '16px',
                                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                border: '1px solid rgba(0,0,0,0.05)',
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                cursor: 'pointer',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '4px',
                                    background: `linear-gradient(90deg, ${stat.color} 0%, ${stat.color}dd 100%)`,
                                    transform: 'scaleX(0)',
                                    transformOrigin: 'left',
                                    transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                                },
                                '&:hover': {
                                    transform: 'translateY(-8px) scale(1.02)',
                                    boxShadow: `0 12px 32px ${stat.color}33, 0 4px 16px rgba(0,0,0,0.12)`,
                                    borderColor: `${stat.color}40`,
                                    '&::before': {
                                        transform: 'scaleX(1)'
                                    },
                                    '& .icon-wrapper': {
                                        transform: 'scale(1.1) rotate(5deg)',
                                        background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}25 100%)`
                                    },
                                    '& .stat-value': {
                                        transform: 'scale(1.05)',
                                        color: stat.color
                                    }
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
                                    p: 2.5,
                                    position: 'relative',
                                    zIndex: 1
                                }}
                            >
                                <Box
                                    className="icon-wrapper"
                                    sx={{
                                        mb: 1.5,
                                        p: 1.25,
                                        borderRadius: '12px',
                                        background: `linear-gradient(135deg, ${stat.color}08 0%, ${stat.color}15 100%)`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        width: 48,
                                        height: 48,
                                        '& svg': {
                                            color: stat.color,
                                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                                        }
                                    }}
                                >
                                    {stat.icon}
                                </Box>
                                <Typography
                                    className="stat-value"
                                    variant="h5"
                                    component="div"
                                    sx={{
                                        fontWeight: 700,
                                        color: stat.color,
                                        mb: 0.75,
                                        fontSize: { xs: '1.5rem', sm: '1.75rem' },
                                        letterSpacing: '-0.02em',
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}dd 100%)`,
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent'
                                    }}
                                >
                                    {stat.value}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: 'text.secondary',
                                        fontWeight: 500,
                                        fontSize: '0.8rem',
                                        letterSpacing: '0.01em',
                                        lineHeight: 1.4
                                    }}
                                >
                                    {stat.title}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}

                <Grid item xs={12}>
                    <MainCard title="Quick Actions">
                        <Grid container spacing={2.5}>
                            {[
                                {
                                    title: 'View All Hiring Talents',
                                    icon: <IconEye size={20} stroke={2} />,
                                    color: '#1976d2',
                                    gradient: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)'
                                },
                                {
                                    title: 'Verify Applications',
                                    icon: <IconCheck size={20} stroke={2} />,
                                    color: '#2e7d32',
                                    gradient: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)'
                                },
                                {
                                    title: 'Manage Categories',
                                    icon: <IconCategory size={20} stroke={2} />,
                                    color: '#ed6c02',
                                    gradient: 'linear-gradient(135deg, #ed6c02 0%, #ff9800 100%)'
                                },
                                {
                                    title: 'Reports & Analytics',
                                    icon: <IconChartBar size={20} stroke={2} />,
                                    color: '#9c27b0',
                                    gradient: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)'
                                }
                            ].map((action, index) => (
                                <Grid item xs={12} sm={6} md={3} key={index}>
                                    <Card
                                        sx={{
                                            p: 2.5,
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            borderRadius: '12px',
                                            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                                            border: '1px solid rgba(0,0,0,0.08)',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                height: '3px',
                                                background: action.gradient,
                                                transform: 'scaleX(0)',
                                                transformOrigin: 'left',
                                                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                            },
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: `0 8px 24px ${action.color}33, 0 4px 12px rgba(0,0,0,0.1)`,
                                                borderColor: `${action.color}40`,
                                                background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
                                                '&::before': {
                                                    transform: 'scaleX(1)'
                                                },
                                                '& .action-icon': {
                                                    transform: 'scale(1.15)',
                                                    color: action.color
                                                },
                                                '& .action-text': {
                                                    color: action.color,
                                                    fontWeight: 600
                                                }
                                            }
                                        }}
                                    >
                                        <Box
                                            className="action-icon"
                                            sx={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mb: 1.5,
                                                p: 1.25,
                                                borderRadius: '10px',
                                                background: `linear-gradient(135deg, ${action.color}10 0%, ${action.color}20 100%)`,
                                                color: action.color,
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                width: 40,
                                                height: 40
                                            }}
                                        >
                                            {action.icon}
                                        </Box>
                                        <Typography
                                            className="action-text"
                                            variant="body1"
                                            sx={{
                                                color: 'text.primary',
                                                fontWeight: 500,
                                                fontSize: '0.9rem',
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                lineHeight: 1.4
                                            }}
                                        >
                                            {action.title}
                                        </Typography>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </MainCard>
                </Grid>
            </Grid>
        </Box>
    );
};

export default HiringTalent;

