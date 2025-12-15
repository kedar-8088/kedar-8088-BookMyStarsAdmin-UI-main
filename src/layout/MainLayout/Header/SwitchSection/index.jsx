import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Chip from '@mui/material/Chip';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import PerfectScrollbar from 'react-perfect-scrollbar';
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import { IconLayoutDashboard } from '@tabler/icons-react';
import SwitchList from './SwitchList';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const SwitchSection = () => {
    const theme = useTheme();
    const matchesXs = useMediaQuery(theme.breakpoints.down('md'));

    const [open, setOpen] = useState(false);
    const [selectedSwitch, setSelectedSwitch] = useState('');
    const anchorRef = useRef(null);
    const location = useLocation();

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

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }
        prevOpen.current = open;
    }, [open]);

    return (
        <>
            <Box
                sx={{
                    ml: 2,
                    mr: 2,
                    display: 'flex',
                    alignItems: 'center',
                    [theme.breakpoints.down('md')]: {
                        mr: 2
                    }
                }}
            >
                <ButtonBase
                    sx={{
                        borderRadius: '12px',
                        overflow: 'hidden',
                        '&:hover': {
                            background: 'none'
                        }
                    }}
                >
                    <Avatar
                        variant="rounded"
                        sx={{
                            ...theme.typography.commonAvatar,
                            ...theme.typography.mediumAvatar,
                            transition: 'all .2s ease-in-out',
                            background: theme.palette.secondary.light,
                            color: theme.palette.secondary.dark,
                            '&[aria-controls="menu-list-grow"],&:hover': {
                                background: theme.palette.secondary.dark,
                                color: theme.palette.secondary.light
                            }
                        }}
                        ref={anchorRef}
                        aria-controls={open ? 'menu-list-grow' : undefined}
                        aria-haspopup="true"
                        onClick={handleToggle}
                        color="inherit"
                    >
                        <IconLayoutDashboard stroke={1.5} size="1.3rem" style={{ color: '#DA498D' }} />
                    </Avatar>
                </ButtonBase>
                {selectedSwitch && (
                    <Typography
                        variant="subtitle1"
                        sx={{
                            ml: 1,
                            fontSize: { xs: '0.75rem', sm: '1rem' },
                            display: { xs: 'block', sm: 'flex' },
                            whiteSpace: { xs: 'nowrap', sm: 'normal' },
                            overflow: { xs: 'hidden', sm: 'visible' },
                            textOverflow: { xs: 'ellipsis', sm: 'clip' }
                        }}
                    >
                        {selectedSwitch}
                    </Typography>
                )}
            </Box>
            <Popper
                placement={matchesXs ? 'bottom' : 'bottom-end'}
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                popperOptions={{
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [matchesXs ? 5 : 0, 20]
                            }
                        }
                    ]
                }}
            >
                {({ TransitionProps }) => (
                    <Transitions position={matchesXs ? 'top' : 'top-right'} in={open} {...TransitionProps}>
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MainCard
                                    border={false}
                                    elevation={16}
                                    content={false}
                                    boxShadow
                                    shadow={theme.shadows[16]}
                                    sx={{ width: 200 }}
                                >
                                    <Grid container direction="column" spacing={2}>
                                        <Grid item xs={12}>
                                            <Grid container alignItems="center" justifyContent="space-between" sx={{ pt: 2, px: 2 }}>
                                                <Grid item>
                                                    <Stack direction="row" spacing={2}>
                                                        <Typography variant="subtitle1">All Switches</Typography>
                                                        <Chip
                                                            size="small"
                                                            label="03"
                                                            sx={{
                                                                color: theme.palette.background.default,
                                                                bgcolor: theme.palette.success.dark
                                                            }}
                                                        />
                                                    </Stack>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <PerfectScrollbar
                                                style={{ height: '100%', maxHeight: 'calc(110vh - 205px)', overflowX: 'hidden' }}
                                            >
                                                <Grid container direction="column" spacing={2}>
                                                    <Grid item xs={12} p={0}>
                                                        <Divider sx={{ my: 0 }} />
                                                    </Grid>
                                                </Grid>
                                                <SwitchList setSelectedSwitch={setSelectedSwitch} setOpen={setOpen} />
                                            </PerfectScrollbar>
                                        </Grid>
                                    </Grid>
                                    <Divider />
                                    {/* <CardActions sx={{ p: 1.25, justifyContent: 'center' }}>
                    <Button size="small" disableElevation>
                      View All
                    </Button>
                  </CardActions> */}
                                </MainCard>
                            </ClickAwayListener>
                        </Paper>
                    </Transitions>
                )}
            </Popper>
        </>
    );
};

export default SwitchSection;
