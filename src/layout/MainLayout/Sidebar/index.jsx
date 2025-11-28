import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';
import { BrowserView, MobileView } from 'react-device-detect';

// project imports
import MenuList from './MenuList';
import LogoSection from '../LogoSection';
import SidebarSwitch from './SidebarSwitch';
import { SET_MINI } from 'store/actions';

// assets
import { IconChevronsLeft, IconChevronsRight } from '@tabler/icons-react';

import { drawerWidth, miniDrawerWidth } from 'store/constant';

// ==============================|| SIDEBAR DRAWER ||============================== //

const Sidebar = ({ drawerOpen, drawerToggle, window }) => {
    const theme = useTheme();
    const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));
    const customization = useSelector((state) => state.customization);
    const dispatch = useDispatch();
    const isMini = customization.mini;
    const currentWidth = isMini ? miniDrawerWidth : drawerWidth;

    const handleMiniToggle = () => {
        dispatch({ type: SET_MINI, mini: !isMini });
    };

    const drawer = (
        <>
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                <Box sx={{ display: 'flex', p: 2, mx: 'auto' }}>
                    <LogoSection />
                </Box>
            </Box>
            <BrowserView>
                <PerfectScrollbar
                    component="div"
                    style={{
                        height: !matchUpMd ? 'calc(100vh - 56px)' : 'calc(100vh - 88px)',
                        paddingLeft: isMini ? '8px' : '12px',
                        paddingRight: isMini ? '8px' : '12px'
                    }}
                >
                    <SidebarSwitch />
                    <MenuList />
                </PerfectScrollbar>
            </BrowserView>
            <MobileView>
                <Box sx={{ px: 2 }}>
                    <SidebarSwitch />
                    <MenuList />
                </Box>
            </MobileView>
        </>
    );

    const container = window !== undefined ? () => window.document.body : undefined;

    return (
        <Box component="nav" sx={{ flexShrink: { md: 0 }, width: matchUpMd ? currentWidth : 'auto' }} aria-label="mailbox folders">
            <Drawer
                container={container}
                variant={matchUpMd ? 'persistent' : 'temporary'}
                anchor="left"
                open={drawerOpen}
                onClose={drawerToggle}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: currentWidth,
                        background: theme.palette.background.default,
                        color: theme.palette.text.primary,
                        borderRight: 'none',
                        overflow: 'visible',
                        transition: theme.transitions.create('width', {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.enteringScreen
                        }),
                        [theme.breakpoints.up('md')]: {
                            top: '88px',
                            height: 'calc(100vh - 88px)'
                        }
                    }
                }}
                ModalProps={{ keepMounted: true }}
                color="inherit"
            >
                {drawer}
            </Drawer>
            {/* Toggle button on right edge of sidebar */}
            {matchUpMd && drawerOpen && (
                <IconButton
                    onClick={handleMiniToggle}
                    sx={{
                        position: 'absolute',
                        left: currentWidth - 20,
                        top: 'calc(50% + 44px)',
                        transform: 'translateY(-50%)',
                        width: 40,
                        height: 40,
                        borderRadius: '8px',
                        backgroundColor: theme.palette.secondary.light,
                        color: theme.palette.secondary.dark,
                        border: '1px solid',
                        borderColor: theme.palette.secondary.light,
                        boxShadow: theme.shadows[2],
                        zIndex: 1300,
                        transition: theme.transitions.create('left', {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.enteringScreen
                        }),
                        '&:hover': {
                            backgroundColor: theme.palette.secondary.dark,
                            color: theme.palette.secondary.light,
                            borderColor: theme.palette.secondary.dark
                        }
                    }}
                >
                    {isMini ? (
                        <IconChevronsRight stroke={2} size="1.3rem" />
                    ) : (
                        <IconChevronsLeft stroke={2} size="1.3rem" />
                    )}
                </IconButton>
            )}
        </Box>
    );
};

Sidebar.propTypes = {
    drawerOpen: PropTypes.bool,
    drawerToggle: PropTypes.func,
    window: PropTypes.object
};

export default Sidebar;
