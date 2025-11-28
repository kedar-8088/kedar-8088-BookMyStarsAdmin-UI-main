import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

// project imports
import NavItem from '../NavItem';

// assets
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';

// ==============================|| SIDEBAR MENU LIST COLLAPSE ITEMS ||============================== //

const NavCollapse = ({ menu, level }) => {
    const theme = useTheme();
    const customization = useSelector((state) => state.customization);
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(null);

    const handleClick = () => {
        setOpen(!open);
        setSelected(!selected ? menu.id : null);

        // Check if the menu ID is either 'mcqPapers' or 'papers' and navigate to the first child URL
        if (menu?.id === 'mcqPapers' && menu?.id === 'papers') {
            navigate(menu.children[0]?.url);
        }
    };

    const { pathname } = useLocation();
    const checkOpenForParent = (child, id) => {
        child.forEach((item) => {
            if (item.url === pathname) {
                setOpen(true);
                setSelected(id);
            }
        });
    };

    // menu collapse for sub-levels
    useEffect(() => {
        setOpen(false);
        setSelected(null);
        if (menu.children) {
            menu.children.forEach((item) => {
                if (item.children?.length) {
                    checkOpenForParent(item.children, menu.id);
                }
                if (item.url === pathname) {
                    setSelected(menu.id);
                    setOpen(true);
                }
            });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname, menu.children]);

    // menu collapse & item
    const menus = menu.children?.map((item) => {
        switch (item.type) {
            case 'collapse':
                return <NavCollapse key={item.id} menu={item} level={level + 1} />;
            case 'item':
                return <NavItem key={item.id} item={item} level={level + 1} />;
            default:
                return (
                    <Typography key={item.id} variant="h6" color="error" align="center">
                        Menu Items Error
                    </Typography>
                );
        }
    });

    const Icon = menu.icon;
    const menuIcon = menu.icon ? (
        <Icon strokeWidth={1.5} size="1.2rem" style={{ marginTop: 'auto', marginBottom: 'auto' }} />
    ) : (
        <FiberManualRecordIcon
            sx={{
                width: selected === menu.id ? 8 : 6,
                height: selected === menu.id ? 8 : 6
            }}
            fontSize={level > 0 ? 'inherit' : 'medium'}
        />
    );

    const isMini = customization.mini;

    return (
        <>
            <ListItemButton
                sx={{
                    borderRadius: `${customization.borderRadius}px`,
                    mb: 0.375,
                    alignItems: 'center',
                    justifyContent: isMini ? 'center' : 'flex-start',
                    backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
                    py: level > 1 ? 0.75 : 0.875,
                    pl: isMini ? '8px' : `${level * 20}px`,
                    pr: isMini ? '8px' : '12px',
                    minHeight: 40
                }}
                selected={selected === menu.id}
                onClick={handleClick}
            >
                <ListItemIcon 
                    sx={{ 
                        my: 'auto', 
                        minWidth: isMini ? 0 : (!menu.icon ? 18 : 32),
                        justifyContent: 'center',
                        mr: isMini ? 0 : 0.75
                    }}
                >
                    {menuIcon}
                </ListItemIcon>
                {!isMini && (
                    <ListItemText
                        primary={
                            <Typography 
                                variant={selected === menu.id ? 'body1' : 'body2'} 
                                color="inherit" 
                                sx={{ 
                                    my: 'auto',
                                    fontSize: '0.875rem',
                                    fontWeight: selected === menu.id ? 600 : 400
                                }}
                            >
                                {menu.title}
                            </Typography>
                        }
                        secondary={
                            menu.caption && (
                                <Typography variant="caption" sx={{ ...theme.typography.subMenuCaption, fontSize: '0.75rem' }} display="block" gutterBottom>
                                    {menu.caption}
                                </Typography>
                            )
                        }
                    />
                )}
                {!isMini && (
                    open ? (
                        <IconChevronUp stroke={1.5} size="0.9rem" style={{ marginTop: 'auto', marginBottom: 'auto' }} />
                    ) : (
                        <IconChevronDown stroke={1.5} size="0.9rem" style={{ marginTop: 'auto', marginBottom: 'auto' }} />
                    )
                )}
            </ListItemButton>
            {!isMini && (
                <Collapse in={open} timeout="auto" unmountOnExit>
                <List
                    component="div"
                    disablePadding
                    sx={{
                        position: 'relative',
                        '&:after': {
                            content: "''",
                            position: 'absolute',
                            left: '28px',
                            top: 0,
                            height: '100%',
                            width: '1px',
                            opacity: 1,
                            background: theme.palette.primary.light
                        }
                    }}
                >
                    {menus}
                </List>
            </Collapse>
            )}
        </>
    );
};

NavCollapse.propTypes = {
    menu: PropTypes.object,
    level: PropTypes.number
};

export default NavCollapse;
