import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { IconUser, IconUsers, IconCertificate, IconSettings } from '@tabler/icons-react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { BaseUrl } from 'BaseUrl';
import { fetchBanner } from 'views/API/BannerApi';

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

// ==============================|| PROFESSIONAL DASHBOARD ||============================== //

const Professional = () => {
    const [advertisement, setAdvertisement] = useState([]);
    const [bannerLoading, setBannerLoading] = useState(true);

    const user = JSON.parse(sessionStorage.getItem('user'));
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user?.accessToken}`
    };

    useEffect(() => {
        const FetchData = async () => {
            setBannerLoading(true);
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
                setBannerLoading(false);
            }
        };

        FetchData();
    }, []);

    const stats = [
        {
            title: 'Total Professionals',
            value: '1,234',
            icon: <IconUsers size={40} color="#1976d2" />,
            color: '#1976d2'
        },
        {
            title: 'Active Professionals',
            value: '987',
            icon: <IconUser size={40} color="#2e7d32" />,
            color: '#2e7d32'
        },
        {
            title: 'Pending Verification',
            value: '156',
            icon: <IconCertificate size={40} color="#ed6c02" />,
            color: '#ed6c02'
        },
        {
            title: 'Suspended',
            value: '23',
            icon: <IconSettings size={40} color="#d32f2f" />,
            color: '#d32f2f'
        }
    ];

    return (
        <Box sx={{ mt: 4 }}>
            <Grid container spacing={3}>
                

                <Grid item xs={12}>
                    <MainCard border={false} content={false} sx={{ width: '100%', height: 450 }}>
                        <Box sx={{ width: '100%', height: '100%' }}>
                            <Grid container direction="column" sx={{ width: '100%', height: '100%' }}>
                                <Grid item xs={12} sx={{ width: '100%', height: '100%' }}>
                                    {bannerLoading ? (
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
                </Grid>

                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                '&:hover': {
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                    transform: 'translateY(-2px)',
                                    transition: 'all 0.3s ease'
                                }
                            }}
                        >
                            <CardContent
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    flexGrow: 1,
                                    p: 3
                                }}
                            >
                                <Box sx={{ mb: 2 }}>{stat.icon}</Box>
                                <Typography
                                    variant="h4"
                                    component="div"
                                    sx={{
                                        fontWeight: 'bold',
                                        color: stat.color,
                                        mb: 1
                                    }}
                                >
                                    {stat.value}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {stat.title}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}

                <Grid item xs={12}>
                    <MainCard title="Quick Actions">
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card
                                    sx={{
                                        p: 2,
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            bgcolor: 'primary.light',
                                            color: 'primary.contrastText'
                                        }
                                    }}
                                >
                                    <Typography variant="h6">View All Professionals</Typography>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card
                                    sx={{
                                        p: 2,
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            bgcolor: 'success.light',
                                            color: 'success.contrastText'
                                        }
                                    }}
                                >
                                    <Typography variant="h6">Verify Applications</Typography>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card
                                    sx={{
                                        p: 2,
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            bgcolor: 'warning.light',
                                            color: 'warning.contrastText'
                                        }
                                    }}
                                >
                                    <Typography variant="h6">Manage Categories</Typography>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card
                                    sx={{
                                        p: 2,
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            bgcolor: 'info.light',
                                            color: 'info.contrastText'
                                        }
                                    }}
                                >
                                    <Typography variant="h6">Reports & Analytics</Typography>
                                </Card>
                            </Grid>
                        </Grid>
                    </MainCard>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Professional;
