import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import IconButton from '@mui/material/IconButton';

// project imports
import LogoSection from '../LogoSection';
import NotificationSection from './NotificationSection';
import ProfileSection from './ProfileSection';
import ThemeToggle from './ThemeToggle';

// assets
import { IconMenu2 } from '@tabler/icons-react';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = ({ handleLeftDrawerToggle }) => {
    const theme = useTheme();

    return (
        <>
            {/* hamburger menu icon - only visible on mobile */}
            <IconButton
                onClick={handleLeftDrawerToggle}
                sx={{
                    mr: 1,
                    color: theme.palette.primary.main,
                    display: { xs: 'flex', md: 'none' }, // Show only on mobile, hide on desktop
                    '&:hover': {
                        backgroundColor: theme.palette.action.hover
                    }
                }}
                aria-label="open drawer"
            >
                <IconMenu2 stroke={1.5} size="1.5rem" />
            </IconButton>

            {/* logo */}
            <Box
                sx={{
                    width: 228,
                    display: 'flex',
                    [theme.breakpoints.down('md')]: {
                        width: 'auto'
                    }
                }}
            >
                <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
                    <LogoSection />
                </Box>
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            {/* theme toggle, notification & profile */}
            <ThemeToggle />
            <NotificationSection />
            <ProfileSection />
        </>
    );
};

Header.propTypes = {
    handleLeftDrawerToggle: PropTypes.func
};

export default Header;
