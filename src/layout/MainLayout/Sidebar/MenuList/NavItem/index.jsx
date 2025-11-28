import PropTypes from 'prop-types';
import { forwardRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

// project imports
import { MENU_OPEN, SET_MENU } from 'store/actions';

// assets
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

// ==============================|| SIDEBAR MENU LIST ITEMS ||============================== //

const NavItem = ({ item, level }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { pathname } = useLocation();
    const customization = useSelector((state) => state.customization);
    const matchesSM = useMediaQuery(theme.breakpoints.down('lg'));

    const Icon = item.icon;
    const itemIcon = item?.icon ? (
        <Icon stroke={1.5} size="1.2rem" />
    ) : (
        <FiberManualRecordIcon
            sx={{
                width: customization.isOpen.findIndex((id) => id === item?.id) > -1 ? 8 : 6,
                height: customization.isOpen.findIndex((id) => id === item?.id) > -1 ? 8 : 6
            }}
            fontSize={level > 0 ? 'inherit' : 'medium'}
        />
    );

    let itemTarget = '_self';
    if (item.target) {
        itemTarget = '_blank';
    }

    let listItemProps = {
        component: forwardRef((props, ref) => <Link ref={ref} {...props} to={item.url || '#'} target={itemTarget} />),
        onClick: () => {
            if (item.type === 'collapse') {
                dispatch({ type: MENU_OPEN, id: item.id });
            }
        }
    };

    if (item?.external) {
        listItemProps = { component: 'a', href: item.url, target: itemTarget };
    }

    useEffect(() => {
        const currentIndex = document.location.pathname
            .toString()
            .split('/')
            .findIndex((id) => id === item.id);
        if (currentIndex > -1) {
            dispatch({ type: MENU_OPEN, id: item.id });
        }
        // eslint-disable-next-line
  }, [pathname]);

    const isMini = customization.mini;

    return (
        <ListItemButton
            {...listItemProps}
            disabled={item.disabled}
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
            selected={customization.isOpen.findIndex((id) => id === item.id) > -1}
        >
            <ListItemIcon 
                sx={{ 
                    my: 'auto', 
                    minWidth: isMini ? 0 : (!item?.icon ? 18 : 32),
                    justifyContent: 'center',
                    mr: isMini ? 0 : 0.75
                }}
            >
                {itemIcon}
            </ListItemIcon>
            {!isMini && (
                <ListItemText
                    primary={
                        <Typography 
                            variant={customization.isOpen.findIndex((id) => id === item.id) > -1 ? 'body1' : 'body2'} 
                            color="inherit"
                            sx={{ fontSize: '0.875rem', fontWeight: customization.isOpen.findIndex((id) => id === item.id) > -1 ? 600 : 400 }}
                        >
                            {item.title}
                        </Typography>
                    }
                    secondary={
                        item.caption && (
                            <Typography variant="caption" sx={{ ...theme.typography.subMenuCaption, fontSize: '0.75rem' }} display="block" gutterBottom>
                                {item.caption}
                            </Typography>
                        )
                    }
                />
            )}
            {!isMini && item.chip && (
                <Chip
                    color={item.chip.color}
                    variant={item.chip.variant}
                    size="small"
                    label={item.chip.label}
                    avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
                />
            )}
        </ListItemButton>
    );
};

NavItem.propTypes = {
    item: PropTypes.object,
    level: PropTypes.number
};

export default NavItem;
