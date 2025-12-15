import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '@mui/material/IconButton';

// material-ui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

// project imports
import MainCard from 'ui-component/cards/MainCard';

// react-responsive-carousel
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import carousel styles
import { BaseUrl } from 'BaseUrl';
import { fetchBanner } from 'views/professionals API/BannerApi';

// assets
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

// AuthImage component to fetch images with authentication
const AuthImage = ({ filePath }) => {
    const [src, setSrc] = useState('');
    const user = JSON.parse(sessionStorage.getItem('user'));

    useEffect(() => {
        if (!filePath) return;

        const fetchImage = async () => {
            try {
                const response = await axios.get(`${BaseUrl}/bookmystarsadmin/file/downloadFile/?filePath=${encodeURIComponent(filePath)}`, {
                    headers: {
                        Authorization: `Bearer ${user?.accessToken}`
                    },
                    responseType: 'blob'
                });
                const blob = new Blob([response.data], { type: response.headers['content-type'] });
                const imageUrl = URL.createObjectURL(blob);
                setSrc(imageUrl);
            } catch (error) {
                console.error('Error fetching image:', error);
                if (error.response?.status === 404) {
                    console.warn(`Image not found: ${filePath}`);
                }
                setSrc('');
            }
        };

        fetchImage();

        return () => {
            if (src) {
                URL.revokeObjectURL(src);
            }
        };
    }, [filePath, user?.accessToken]);

    return src ? (
        <img
            src={src}
            style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
            }}
            alt="Advertisement"
        />
    ) : (
        'Loading...'
    );
};


const Banner = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    const [advertisement, setAdvertisement] = useState([]);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(sessionStorage.getItem('user'));
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user?.accessToken}`
    };

    // Responsive banner height
    const bannerHeight = isMobile ? 180 : isTablet ? 250 : 300;
    const arrowSize = isMobile ? 28 : 36;
    const arrowIconSize = isMobile ? '1rem' : '1.2rem';
    const arrowPosition = isMobile ? 8 : 16;

    // Custom arrow renderers
    const renderArrowPrev = (onClickHandler, hasPrev, label) =>
        hasPrev && (
            <IconButton
                onClick={onClickHandler}
                title={label}
                sx={{
                    position: 'absolute',
                    left: arrowPosition,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 2,
                    width: arrowSize,
                    height: arrowSize,
                    borderRadius: '50%',
                    backgroundColor: theme.palette.secondary.light,
                    color: theme.palette.common.white,
                    border: 'none',
                    boxShadow: theme.shadows[2],
                    '&:hover': {
                        backgroundColor: theme.palette.secondary.dark,
                        color: theme.palette.common.white
                    },
                    display: { xs: 'flex', sm: 'flex' }
                }}
            >
                <IconChevronLeft stroke={2} size={arrowIconSize} />
            </IconButton>
        );

    const renderArrowNext = (onClickHandler, hasNext, label) =>
        hasNext && (
            <IconButton
                onClick={onClickHandler}
                title={label}
                sx={{
                    position: 'absolute',
                    right: arrowPosition,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 2,
                    width: arrowSize,
                    height: arrowSize,
                    borderRadius: '50%',
                    backgroundColor: theme.palette.secondary.light,
                    color: theme.palette.common.white,
                    border: 'none',
                    boxShadow: theme.shadows[2],
                    '&:hover': {
                        backgroundColor: theme.palette.secondary.dark,
                        color: theme.palette.common.white
                    },
                    display: { xs: 'flex', sm: 'flex' }
                }}
            >
                <IconChevronRight stroke={2} size={arrowIconSize} />
            </IconButton>
        );

    useEffect(() => {
        const FetchData = async () => {
            setLoading(true);
            try {
                const response = await fetchBanner(0, 10, headers);
                // Handle paginated response structure
                const responseData = response.data;
                const fetchedData = responseData.content || [];
                
                if (fetchedData.length > 0) {
                    const tableData = fetchedData.map((p) => ({
                        advertisementId: p.advertisementId,
                        filePath: p.filePath || null
                    }));
                    setAdvertisement(tableData);
                } else {
                    setAdvertisement([]);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setAdvertisement([]);
            } finally {
                setLoading(false);
            }
        };

        FetchData();
    }, []);

    return (
        <MainCard 
            border={false} 
            content={false} 
            sx={{ 
                mt: { xs: 2, sm: 3, md: 4 }, 
                width: '100%', 
                height: { xs: 180, sm: 250, md: 300 },
                mx: { xs: 1, sm: 0 }
            }}
        >
            <Box sx={{ width: '100%', height: '100%' }}>
                <Grid container direction="column" sx={{ width: '100%', height: '100%' }}>
                    <Grid item xs={12} sx={{ width: '100%', height: '100%' }}>
                        {loading ? (
                            <Box sx={{ textAlign: 'center', padding: { xs: '10px', sm: '20px' } }}>Loading...</Box>
                        ) : (
                            <Box sx={{ position: 'relative', width: '100%', height: { xs: 180, sm: 250, md: 300 } }}>
                                <Carousel
                                    showThumbs={false}
                                    showArrows={!isMobile}
                                    showIndicators={true}
                                    showStatus={false}
                                    infiniteLoop
                                    autoPlay
                                    interval={3000}
                                    transitionTime={500}
                                    stopOnHover={true}
                                    dynamicHeight={false}
                                    swipeable={true}
                                    emulateTouch={true}
                                    renderArrowPrev={renderArrowPrev}
                                    renderArrowNext={renderArrowNext}
                                    style={{ width: '100%', height: bannerHeight }}
                                >
                                    {advertisement.length > 0 ? (
                                        advertisement.map((ad) =>
                                            ad.filePath ? (
                                                <div key={ad.advertisementId} style={{ width: '100%', height: bannerHeight }}>
                                                    <AuthImage filePath={ad.filePath} />
                                                </div>
                                            ) : null
                                        )
                                    ) : (
                                        <Box sx={{ textAlign: 'center', padding: { xs: '10px', sm: '20px' } }}>No Data</Box>
                                    )}
                                </Carousel>
                            </Box>
                        )}
                    </Grid>
                </Grid>
            </Box>
        </MainCard>
    );
};

Banner.propTypes = {
    isLoading: PropTypes.bool
};

export default Banner;

