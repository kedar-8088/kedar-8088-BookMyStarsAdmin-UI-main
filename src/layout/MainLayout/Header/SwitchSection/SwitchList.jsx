import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';

const ListItemWrapper = ({ children }) => {
    return (
        <Box
            sx={{
                p: 1,
                borderBottom: '1px solid',
                borderColor: 'divider',
                cursor: 'pointer',
                '&:hover': {
                    bgcolor: 'primary.light'
                }
            }}
        >
            {children}
        </Box>
    );
};

ListItemWrapper.propTypes = {
    children: PropTypes.node
};

const SwitchList = ({ setSelectedSwitch, setOpen }) => {
    const theme = useTheme();
    const navigate = useNavigate();

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

    return (
        <List
            sx={{
                width: '100%',
                maxWidth: 330,
                py: 0,
                borderRadius: '10px',
                [theme.breakpoints.down('md')]: {
                    maxWidth: 300
                },
                '& .MuiListItemSecondaryAction-root': {
                    top: 22
                },
                '& .MuiDivider-root': {
                    my: 0
                },
                '& .list-container': {
                    pl: 7
                }
            }}
        >
            <ListItemWrapper>
                <ListItem alignItems="center" onClick={handleDashboard}>
                    <ListItemText primary="Dashboard" />
                </ListItem>
            </ListItemWrapper>
            <ListItemWrapper>
                <ListItem alignItems="center" onClick={handleProfessional}>
                    <ListItemText primary="Professional" />
                </ListItem>
            </ListItemWrapper>
        </List>
    );
};

SwitchList.propTypes = {
    setSelectedSwitch: PropTypes.func.isRequired,
    setOpen: PropTypes.func.isRequired
};

export default SwitchList;
