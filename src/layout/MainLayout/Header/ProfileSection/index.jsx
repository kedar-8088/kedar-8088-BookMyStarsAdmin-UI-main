import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import {
    Avatar,
    Box,
    Chip,
    ClickAwayListener,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    Popper,
    Stack,
    Typography
} from '@mui/material';
import PerfectScrollbar from 'react-perfect-scrollbar';
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import { IconLogout, IconSettings, IconChevronDown } from '@tabler/icons-react';
import axios from 'axios';
import { BaseUrl } from 'BaseUrl';
import Swal from 'sweetalert2';

const ProfileSection = () => {
    const theme = useTheme();
    const customization = useSelector((state) => state.customization);
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [userName, setUserName] = useState('');
    const [userInfo, setUserInfo] = useState('');

    const anchorRef = useRef(null);
    const prevOpen = useRef(open);

    useEffect(() => {
        const loggedInUser = JSON.parse(sessionStorage.getItem('user'));
        if (loggedInUser && loggedInUser.accessToken) {
            setUserName(loggedInUser.userName);
            fetchUserInfo(loggedInUser.userName, loggedInUser.accessToken);
        }
    }, []);

    useEffect(() => {
        if (prevOpen.current && !open) {
            anchorRef.current?.focus();
        }
        prevOpen.current = open;
    }, [open]);

    const fetchUserInfo = async (userName, accessToken) => {
        try {
            const response = await axios.get(`${BaseUrl}/bookmystarsadmin/login/v1/queryUserProfileByUserName/${userName}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setUserInfo(response.data);
        } catch (error) {}
    };

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const handleListItemClick = (event, index, route = '') => {
        setSelectedIndex(index);
        handleClose(event);
        if (route) navigate(route);
    };

    const handleLogout = () => {
        Swal.fire({
            title: 'Do you want to Logout?',
            showDenyButton: true,
            confirmButtonText: 'Yes',
            denyButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                sessionStorage.removeItem('user');
                navigate('/');
            }
        });
    };
    // Get first letter of username for avatar
    const getInitial = (name) => {
        return name ? name.charAt(0).toUpperCase() : 'A';
    };

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    ml: 2,
                    mr: 2,
                    cursor: 'pointer',
                    borderRadius: '24px',
                    px: 1,
                    py: 0.5,
                    transition: 'all .2s ease-in-out',
                    '&:hover': {
                        backgroundColor: theme.palette.action.hover
                    }
                }}
                onClick={handleToggle}
                ref={anchorRef}
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
            >
                <Avatar
                    sx={{
                        width: 36,
                        height: 36,
                        background: 'linear-gradient(135deg, #69247C 0%, #DA498D 100%)',
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: '1rem',
                        cursor: 'pointer'
                    }}
                >
                    {getInitial(userName)}
                </Avatar>
                <Typography
                    variant="body1"
                    sx={{
                        fontWeight: 500,
                        color: theme.palette.text.primary,
                        display: { xs: 'none', sm: 'block' }
                    }}
                >
                    {userName || 'admin1'}
                </Typography>
                <IconChevronDown
                    stroke={1.5}
                    size="1.2rem"
                    style={{
                        color: theme.palette.text.secondary,
                        transition: 'transform 0.2s',
                        transform: open ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}
                />
            </Box>
            <Popper
                placement="bottom-end"
                open={open}
                anchorEl={anchorRef.current}
                transition
                disablePortal
                popperOptions={{
                    modifiers: [
                        {
                            name: 'offset',
                            options: { offset: [0, 14] }
                        }
                    ]
                }}
            >
                {({ TransitionProps }) => (
                    <Transitions in={open} {...TransitionProps}>
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                                    <Box sx={{ p: 1.5, pb: 0.5 }}>
                                        <Stack direction="row" spacing={0.5} alignItems="center">
                                            <Typography variant="body1" sx={{ fontWeight: 400, fontSize: '0.875rem' }}>
                                                Hello,
                                            </Typography>
                                            <Typography component="span" variant="body1" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                                                {userName}
                                            </Typography>
                                        </Stack>
                                    </Box>
                                    <Box sx={{ px: 1, pb: 1 }}>
                                        <List
                                            component="nav"
                                            sx={{
                                                width: '100%',
                                                maxWidth: 220,
                                                minWidth: 180,
                                                backgroundColor: 'transparent',
                                                [theme.breakpoints.down('md')]: {
                                                    minWidth: 180,
                                                    maxWidth: 220
                                                },
                                                '& .MuiListItemButton-root': {
                                                    py: 0.75,
                                                    px: 1,
                                                    minHeight: 40
                                                }
                                            }}
                                        >
                                            <ListItemButton
                                                sx={{ borderRadius: `${customization.borderRadius}px` }}
                                                selected={selectedIndex === 0}
                                                onClick={(event) => handleListItemClick(event, 0, '#')}
                                            >
                                                <ListItemIcon sx={{ minWidth: 36 }}>
                                                    <IconSettings stroke={1.5} size="1.2rem" style={{ color: '#DA498D' }} />
                                                </ListItemIcon>
                                                <ListItemText 
                                                    primary={<Typography variant="body2" sx={{ fontSize: '0.875rem' }}>Account Settings</Typography>} 
                                                />
                                            </ListItemButton>
                                            <ListItemButton
                                                sx={{ borderRadius: `${customization.borderRadius}px` }}
                                                selected={selectedIndex === 4}
                                                onClick={handleLogout}
                                            >
                                                <ListItemIcon sx={{ minWidth: 36 }}>
                                                    <IconLogout stroke={1.5} size="1.2rem" style={{ color: '#DA498D' }} />
                                                </ListItemIcon>
                                                <ListItemText 
                                                    primary={<Typography variant="body2" sx={{ fontSize: '0.875rem' }}>Logout</Typography>} 
                                                />
                                            </ListItemButton>
                                        </List>
                                    </Box>
                                </MainCard>
                            </ClickAwayListener>
                        </Paper>
                    </Transitions>
                )}
            </Popper>
        </>
    );
};

export default ProfileSection;
