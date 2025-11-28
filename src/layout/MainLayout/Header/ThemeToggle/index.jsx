import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import { IconBrightnessUp, IconMoon } from '@tabler/icons-react';
import { SET_NAV_TYPE } from 'store/actions';

const ThemeToggle = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const customization = useSelector((state) => state.customization);
    const navType = customization.navType || 'light';

    const handleToggle = () => {
        const newNavType = navType === 'light' ? 'dark' : 'light';
        dispatch({ type: SET_NAV_TYPE, navType: newNavType });
    };

    return (
        <Box
            sx={{
                ml: 2,
                mr: 2,
                [theme.breakpoints.down('md')]: {
                    mr: 2
                }
            }}
        >
            <ButtonBase sx={{ borderRadius: '12px' }} onClick={handleToggle}>
                <Avatar
                    variant="rounded"
                    sx={{
                        ...theme.typography.commonAvatar,
                        ...theme.typography.mediumAvatar,
                        transition: 'all .2s ease-in-out',
                        background: theme.palette.secondary.light,
                        color: theme.palette.secondary.dark,
                        border: '1px solid',
                        borderColor: theme.palette.secondary.light,
                        '&:hover': {
                            background: theme.palette.secondary.dark,
                            color: theme.palette.secondary.light,
                            borderColor: theme.palette.secondary.dark
                        }
                    }}
                    color="inherit"
                >
                    {navType === 'light' ? (
                        <IconMoon stroke={1.5} size="1.3rem" />
                    ) : (
                        <IconBrightnessUp stroke={1.5} size="1.3rem" />
                    )}
                </Avatar>
            </ButtonBase>
        </Box>
    );
};

export default ThemeToggle;

