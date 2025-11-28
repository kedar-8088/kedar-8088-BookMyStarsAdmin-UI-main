import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';

// project imports
import NavItem from '../NavItem';
import NavCollapse from '../NavCollapse';

// ==============================|| SIDEBAR MENU LIST GROUP ||============================== //

const NavGroup = ({ item }) => {
    const theme = useTheme();
    const customization = useSelector((state) => state.customization);
    const isMini = customization.mini;

    // menu list collapse & items
    const items = item.children?.map((menu) => {
        switch (menu.type) {
            case 'collapse':
                return <NavCollapse key={menu.id} menu={menu} level={1} />;
            case 'item':
                return <NavItem key={menu.id} item={menu} level={1} />;
            case 'divider':
                return <Divider key={menu.id} sx={{ mt: 0.25, mb: 1.25 }} />;
            default:
                return (
                    <Typography key={menu.id} variant="h6" color="error" align="center">
                        Menu Items Error
                    </Typography>
                );
        }
    });

    return (
        <>
            <List
                subheader={
                    !isMini && item.title && (
                        <Typography 
                            variant="caption" 
                            sx={{ 
                                ...theme.typography.menuCaption,
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                px: 1.5,
                                pt: 1.5,
                                pb: 0.75
                            }} 
                            display="block"
                        >
                            {item.title}
                            {item.caption && (
                                <Typography 
                                    variant="caption" 
                                    sx={{ 
                                        ...theme.typography.subMenuCaption,
                                        fontSize: '0.7rem',
                                        display: 'block',
                                        mt: 0.25
                                    }}
                                >
                                    {item.caption}
                                </Typography>
                            )}
                        </Typography>
                    )
                }
            >
                {items}
            </List>

            {/* group divider */}
            {!isMini && <Divider sx={{ mt: 0.5, mb: 0.75 }} />}
        </>
    );
};

NavGroup.propTypes = {
    item: PropTypes.object
};

export default NavGroup;
