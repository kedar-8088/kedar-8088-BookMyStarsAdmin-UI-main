import React from 'react';
import { Box, Typography } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';

// ==============================|| LMS MASTERS ||============================== //

const Masters = () => {
    return (
        <Box sx={{ mt: 4 }}>
            <MainCard title="LMS Masters">
                <Typography variant="body1" color="textSecondary">
                    Masters section - No items available.
                </Typography>
            </MainCard>
        </Box>
    );
};

export default Masters;

