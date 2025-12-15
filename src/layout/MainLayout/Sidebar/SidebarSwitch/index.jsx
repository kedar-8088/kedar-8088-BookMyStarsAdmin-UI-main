import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import { IconLayoutGrid, IconUsers, IconBriefcase } from '@tabler/icons-react';

const SidebarSwitch = () => {
    const theme = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const customization = useSelector((state) => state.customization);
    const [selectedSwitch, setSelectedSwitch] = useState('');
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const path = location.pathname;
        if (path.includes('/dashboard')) {
            setSelectedSwitch('Dashboard');
        } else if (path.includes('/professional')) {
            setSelectedSwitch('Professional');
        } else if (path.includes('/lms')) {
            setSelectedSwitch('LMS');
        } else if (path.includes('/hiring-talent')) {
            setSelectedSwitch('Hiring Talent');
        }
    }, [location]);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleDashboard = () => {
        setSelectedSwitch('Dashboard');
        navigate('/dashboard');
        setOpen(false);
    };

    const handleProfessional = () => {
        setSelectedSwitch('Professional');
        navigate('/professional');
        setOpen(false);
    };

    const handleLMS = () => {
        setSelectedSwitch('LMS');
        navigate('/lms');
        setOpen(false);
    };

    const handleHiringTalent = () => {
        setSelectedSwitch('Hiring Talent');
        navigate('/hiring-talent');
        setOpen(false);
    };

    const isMini = customization.mini;

    return (
        <Box
            sx={{
                px: isMini ? 1 : 1.5,
                py: isMini ? 1.5 : 1.5,
                borderBottom: isMini ? 'none' : '1px solid',
                borderColor: 'divider',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 0.75
            }}
        >
            {!isMini && (
                <>
                    <Divider sx={{ width: '100%', mb: 0.75 }} />
                    <Typography
                        variant="caption"
                        sx={{
                            ...theme.typography.menuCaption,
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            px: 1.5,
                            pt: 1.5,
                            pb: 0.75,
                            width: '100%',
                            textAlign: 'left'
                        }}
                        display="block"
                    >
                        Switch Menu 
                    </Typography>
                </>
            )}
            <IconButton
                onClick={isMini ? (selectedSwitch === 'Hiring Talent' ? handleHiringTalent : selectedSwitch === 'Professional' ? handleProfessional : handleDashboard) : handleToggle}
                sx={{
                    width: 36,
                    height: 36,
                    borderRadius: `${customization.borderRadius}px`,
                    ...(selectedSwitch && {
                        background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
                        color: theme.palette.common.white,
                        '&:hover': {
                            background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
                            opacity: 0.9
                        }
                    }),
                    ...(!selectedSwitch && {
                        border: '1px solid',
                        borderColor: theme.palette.divider,
                        color: theme.palette.text.primary,
                        '&:hover': {
                            borderColor: '#DA498D',
                            backgroundColor: theme.palette.secondary.light,
                            color: '#DA498D'
                        }
                    })
                }}
            >
                <IconLayoutGrid stroke={1.5} size="1.1rem" />
            </IconButton>
            {!isMini && (
                <Collapse in={open} sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, width: '100%', mt: 0.75 }}>
                    <Button
                        fullWidth
                        variant={selectedSwitch === 'Dashboard' ? 'contained' : 'outlined'}
                        startIcon={<IconLayoutGrid stroke={1.5} size="1.1rem" />}
                        onClick={handleDashboard}
                        sx={{
                            justifyContent: 'flex-start',
                            textTransform: 'none',
                            borderRadius: `${customization.borderRadius}px`,
                            py: 0.875,
                            px: 1.5,
                            fontSize: '0.875rem',
                            ...(selectedSwitch === 'Dashboard' && {
                                background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
                                color: theme.palette.common.white,
                                '&:hover': {
                                    background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
                                    opacity: 0.9
                                }
                            }),
                            ...(selectedSwitch !== 'Dashboard' && {
                                borderColor: theme.palette.divider,
                                color: theme.palette.text.primary,
                                '&:hover': {
                                    borderColor: '#DA498D',
                                    backgroundColor: theme.palette.secondary.light,
                                    color: '#DA498D'
                                }
                            })
                        }}
                    >
                        Dashboard
                    </Button>
                    <Button
                        fullWidth
                        variant={selectedSwitch === 'Professional' ? 'contained' : 'outlined'}
                        startIcon={<IconUsers stroke={1.5} size="1.1rem" />}
                        onClick={handleProfessional}
                        sx={{
                            justifyContent: 'flex-start',
                            textTransform: 'none',
                            borderRadius: `${customization.borderRadius}px`,
                            py: 0.875,
                            px: 1.5,
                            fontSize: '0.875rem',
                            ...(selectedSwitch === 'Professional' && {
                                background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
                                color: theme.palette.common.white,
                                '&:hover': {
                                    background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
                                    opacity: 0.9
                                }
                            }),
                            ...(selectedSwitch !== 'Professional' && {
                                borderColor: theme.palette.divider,
                                color: theme.palette.text.primary,
                                '&:hover': {
                                    borderColor: '#DA498D',
                                    backgroundColor: theme.palette.secondary.light,
                                    color: '#DA498D'
                                }
                            })
                        }}
                    >
                        Professional
                    </Button>
                    <Button
                        fullWidth
                        variant={selectedSwitch === 'LMS' ? 'contained' : 'outlined'}
                        startIcon={<IconLayoutGrid stroke={1.5} size="1.1rem" />}
                        onClick={handleLMS}
                        sx={{
                            justifyContent: 'flex-start',
                            textTransform: 'none',
                            borderRadius: `${customization.borderRadius}px`,
                            py: 0.875,
                            px: 1.5,
                            fontSize: '0.875rem',
                            ...(selectedSwitch === 'LMS' && {
                                background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
                                color: theme.palette.common.white,
                                '&:hover': {
                                    background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
                                    opacity: 0.9
                                }
                            }),
                            ...(selectedSwitch !== 'LMS' && {
                                borderColor: theme.palette.divider,
                                color: theme.palette.text.primary,
                                '&:hover': {
                                    borderColor: '#DA498D',
                                    backgroundColor: theme.palette.secondary.light,
                                    color: '#DA498D'
                                }
                            })
                        }}
                    >
                        LMS
                    </Button>
                    <Button
                        fullWidth
                        variant={selectedSwitch === 'Hiring Talent' ? 'contained' : 'outlined'}
                        startIcon={<IconBriefcase stroke={1.5} size="1.1rem" />}
                        onClick={handleHiringTalent}
                        sx={{
                            justifyContent: 'flex-start',
                            textTransform: 'none',
                            borderRadius: `${customization.borderRadius}px`,
                            py: 0.875,
                            px: 1.5,
                            fontSize: '0.875rem',
                            ...(selectedSwitch === 'Hiring Talent' && {
                                background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
                                color: theme.palette.common.white,
                                '&:hover': {
                                    background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
                                    opacity: 0.9
                                }
                            }),
                            ...(selectedSwitch !== 'Hiring Talent' && {
                                borderColor: theme.palette.divider,
                                color: theme.palette.text.primary,
                                '&:hover': {
                                    borderColor: '#DA498D',
                                    backgroundColor: theme.palette.secondary.light,
                                    color: '#DA498D'
                                }
                            })
                        }}
                    >
                        Hiring Talent
                    </Button>
                </Box>
            </Collapse>
            )}
        </Box>
    );
};

export default SidebarSwitch;

