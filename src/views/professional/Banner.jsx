import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

// material-ui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

// project imports
import MainCard from 'ui-component/cards/MainCard';

// react-responsive-carousel
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import carousel styles
import { BaseUrl } from 'BaseUrl';

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

const fetchBanner = async (headers) => {
    try {
        const response = await fetch(`${BaseUrl}/bookmystarsadmin/advertisement/v1/queryAllAdvertisement`, {
            method: 'GET',
            headers: headers
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching banner data:', error);
        return [];
    }
};

const Banner = () => {
    const [advertisement, setAdvertisement] = useState([]);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(sessionStorage.getItem('user'));
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user?.accessToken}`
    };

    useEffect(() => {
        const FetchData = async () => {
            setLoading(true);
            try {
                const fetchedData = await fetchBanner(headers);
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
            } finally {
                setLoading(false);
            }
        };

        FetchData();
    }, []);

    return (
        <MainCard border={false} content={false} sx={{ mt: 4, width: '100%', height: 450 }}>
            <Box sx={{ width: '100%', height: '100%' }}>
                <Grid container direction="column" sx={{ width: '100%', height: '100%' }}>
                    <Grid item xs={12} sx={{ width: '100%', height: '100%' }}>
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>
                        ) : (
                            <Carousel
                                showThumbs={false}
                                showArrows={true}
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
                                style={{ width: '100%', height: 450 }}
                            >
                                {advertisement.length > 0 ? (
                                    advertisement.map((ad) =>
                                        ad.filePath ? (
                                            <div key={ad.advertisementId} style={{ width: '100%', height: 450 }}>
                                                <AuthImage filePath={ad.filePath} />
                                            </div>
                                        ) : null
                                    )
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '20px' }}>No Data</div>
                                )}
                            </Carousel>
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
