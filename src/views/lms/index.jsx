import React from 'react';
import { Grid, Card, CardContent, Typography, Box, Chip, LinearProgress, Avatar, Stack } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { IconBook, IconSchool, IconCertificate, IconUsers, IconArrowRight, IconChartBar, IconFileText, IconUserCheck } from '@tabler/icons-react';
import Banner from './Banner';

// ==============================|| LMS DASHBOARD ||============================== //

const LMS = () => {

    const stats = [
        {
            title: 'Total Courses',
            value: '0',
            icon: <IconBook size={32} />,
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            bgColor: '#667eea',
            change: '+12%',
            trend: 'up'
        },
        {
            title: 'Active Students',
            value: '0',
            icon: <IconUsers size={32} />,
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            bgColor: '#f5576c',
            change: '+8%',
            trend: 'up'
        },
        {
            title: 'Certificates Issued',
            value: '0',
            icon: <IconCertificate size={32} />,
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            bgColor: '#4facfe',
            change: '+23%',
            trend: 'up'
        },
        {
            title: 'Instructors',
            value: '0',
            icon: <IconSchool size={32} />,
            gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            bgColor: '#43e97b',
            change: '+5%',
            trend: 'up'
        }
    ];

    const quickActions = [
        {
            title: 'Manage Courses',
            description: 'Create and manage course content',
            icon: <IconBook size={28} />,
            color: '#667eea',
            bgGradient: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)'
        },
        {
            title: 'Student Management',
            description: 'View and manage student enrollments',
            icon: <IconUserCheck size={28} />,
            color: '#f5576c',
            bgGradient: 'linear-gradient(135deg, #f093fb15 0%, #f5576c15 100%)'
        },
        {
            title: 'Content Library',
            description: 'Access learning materials and resources',
            icon: <IconFileText size={28} />,
            color: '#4facfe',
            bgGradient: 'linear-gradient(135deg, #4facfe15 0%, #00f2fe15 100%)'
        },
        {
            title: 'Reports & Analytics',
            description: 'View detailed analytics and reports',
            icon: <IconChartBar size={28} />,
            color: '#43e97b',
            bgGradient: 'linear-gradient(135deg, #43e97b15 0%, #38f9d715 100%)'
        }
    ];

    return (
        <Box sx={{ mt: { xs: 2, sm: 3, md: 4 }, width: '100%', px: { xs: 1, sm: 2, md: 0 } }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Banner />
                </Grid>

                {/* Stats Cards with New Design */}
                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={6} lg={3} key={index}>
                        <Card
                            sx={{
                                height: '100%',
                                position: 'relative',
                                overflow: 'hidden',
                                background: stat.gradient,
                                color: 'white',
                                borderRadius: 3,
                                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
                                }
                            }}
                        >
                            <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                    <Box
                                        sx={{
                                            width: 56,
                                            height: 56,
                                            borderRadius: 2,
                                            background: 'rgba(255,255,255,0.2)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backdropFilter: 'blur(10px)'
                                        }}
                                    >
                                        {stat.icon}
                                    </Box>
                                    <Chip
                                        label={stat.change}
                                        size="small"
                                        sx={{
                                            background: 'rgba(255,255,255,0.3)',
                                            color: 'white',
                                            fontWeight: 600,
                                            fontSize: '0.75rem'
                                        }}
                                    />
                                </Box>
                                <Typography
                                    variant="h3"
                                    sx={{
                                        fontWeight: 700,
                                        mb: 0.5,
                                        fontSize: { xs: '1.75rem', sm: '2rem' }
                                    }}
                                >
                                    {stat.value}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        opacity: 0.9,
                                        fontWeight: 500,
                                        fontSize: '0.95rem'
                                    }}
                                >
                                    {stat.title}
                                </Typography>
                            </CardContent>
                            <Box
                                sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    height: '4px',
                                    background: 'rgba(255,255,255,0.3)'
                                }}
                            />
                        </Card>
                    </Grid>
                ))}

                {/* Welcome Section */}
                <Grid item xs={12}>
                    <MainCard
                        sx={{
                            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                            borderRadius: 3,
                            border: 'none'
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                            <Box>
                                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#2d3748' }}>
                                    Welcome to LMS Dashboard
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#4a5568', maxWidth: '600px' }}>
                                    Manage your learning ecosystem efficiently. Track courses, students, and learning progress all in one place.
                                </Typography>
                            </Box>
                            <Avatar
                                sx={{
                                    width: 80,
                                    height: 80,
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    boxShadow: '0 8px 16px rgba(102, 126, 234, 0.3)'
                                }}
                            >
                                <IconSchool size={40} />
                            </Avatar>
                        </Box>
                    </MainCard>
                </Grid>

                {/* Quick Actions with New Design */}
                <Grid item xs={12}>
                    <MainCard title="Quick Actions" sx={{ borderRadius: 3 }}>
                        <Grid container spacing={3}>
                            {quickActions.map((action, index) => (
                                <Grid item xs={12} sm={6} md={3} key={index}>
                                    <Card
                                        sx={{
                                            height: '100%',
                                            borderRadius: 2,
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            background: action.bgGradient,
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                                                borderColor: action.color,
                                                '& .action-icon': {
                                                    transform: 'scale(1.1) rotate(5deg)'
                                                },
                                                '& .action-arrow': {
                                                    transform: 'translateX(4px)'
                                                }
                                            }
                                        }}
                                    >
                                        <CardContent sx={{ p: 3 }}>
                                            <Box
                                                className="action-icon"
                                                sx={{
                                                    width: 56,
                                                    height: 56,
                                                    borderRadius: 2,
                                                    background: `${action.color}15`,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    mb: 2,
                                                    color: action.color,
                                                    transition: 'all 0.3s ease'
                                                }}
                                            >
                                                {action.icon}
                                            </Box>
                                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#2d3748' }}>
                                                {action.title}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#718096', mb: 2, minHeight: 40 }}>
                                                {action.description}
                                            </Typography>
                                            <Box
                                                className="action-arrow"
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    color: action.color,
                                                    fontWeight: 600,
                                                    fontSize: '0.875rem',
                                                    transition: 'all 0.3s ease'
                                                }}
                                            >
                                                Get Started
                                                <IconArrowRight size={18} style={{ marginLeft: 4 }} />
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </MainCard>
                </Grid>

                {/* Progress Section */}
                <Grid item xs={12} md={6}>
                    <MainCard title="Learning Progress" sx={{ borderRadius: 3 }}>
                        <Stack spacing={3}>
                            <Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        Course Completion Rate
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600 }}>
                                        75%
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={75}
                                    sx={{
                                        height: 8,
                                        borderRadius: 4,
                                        backgroundColor: '#e2e8f0',
                                        '& .MuiLinearProgress-bar': {
                                            borderRadius: 4,
                                            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
                                        }
                                    }}
                                />
                            </Box>
                            <Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        Student Engagement
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 600 }}>
                                        68%
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={68}
                                    sx={{
                                        height: 8,
                                        borderRadius: 4,
                                        backgroundColor: '#e2e8f0',
                                        '& .MuiLinearProgress-bar': {
                                            borderRadius: 4,
                                            background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)'
                                        }
                                    }}
                                />
                            </Box>
                            <Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        Certificate Issuance
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'warning.main', fontWeight: 600 }}>
                                        52%
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={52}
                                    sx={{
                                        height: 8,
                                        borderRadius: 4,
                                        backgroundColor: '#e2e8f0',
                                        '& .MuiLinearProgress-bar': {
                                            borderRadius: 4,
                                            background: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)'
                                        }
                                    }}
                                />
                            </Box>
                        </Stack>
                    </MainCard>
                </Grid>

                {/* Recent Activity */}
                <Grid item xs={12} md={6}>
                    <MainCard title="Recent Activity" sx={{ borderRadius: 3 }}>
                        <Stack spacing={2}>
                            {[
                                { text: 'New course "Web Development Basics" created', time: '2 hours ago' },
                                { text: '15 students enrolled in "Data Science Fundamentals"', time: '5 hours ago' },
                                { text: '8 certificates issued for completed courses', time: '1 day ago' },
                                { text: 'New instructor "John Doe" added to platform', time: '2 days ago' }
                            ].map((activity, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        background: index === 0 ? '#f7fafc' : 'transparent',
                                        border: index === 0 ? '1px solid' : 'none',
                                        borderColor: 'divider',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            background: '#f7fafc',
                                            transform: 'translateX(4px)'
                                        }
                                    }}
                                >
                                    <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                                        {activity.text}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                        {activity.time}
                                    </Typography>
                                </Box>
                            ))}
                        </Stack>
                    </MainCard>
                </Grid>
            </Grid>
        </Box>
    );
};

export default LMS;

