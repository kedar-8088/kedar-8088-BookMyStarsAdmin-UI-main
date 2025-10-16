import React, { useState } from 'react';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Button,
    Avatar
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { IconCheck, IconX, IconEye, IconCertificate } from '@tabler/icons-react';

const Verification = () => {
    const [verifications] = useState([
        {
            id: 1,
            name: 'John Doe',
            email: 'john.doe@example.com',
            category: 'Web Development',
            status: 'pending',
            submittedDate: '2024-01-15',
            avatar: 'JD'
        },
        {
            id: 2,
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            category: 'Graphic Design',
            status: 'approved',
            submittedDate: '2024-01-14',
            avatar: 'JS'
        },
        {
            id: 3,
            name: 'Mike Johnson',
            email: 'mike.johnson@example.com',
            category: 'Mobile Development',
            status: 'rejected',
            submittedDate: '2024-01-13',
            avatar: 'MJ'
        },
        {
            id: 4,
            name: 'Sarah Wilson',
            email: 'sarah.wilson@example.com',
            category: 'UI/UX Design',
            status: 'pending',
            submittedDate: '2024-01-12',
            avatar: 'SW'
        }
    ]);

    const getStatusChip = (status) => {
        switch (status) {
            case 'approved':
                return <Chip label="Approved" color="success" size="small" />;
            case 'rejected':
                return <Chip label="Rejected" color="error" size="small" />;
            case 'pending':
                return <Chip label="Pending" color="warning" size="small" />;
            default:
                return <Chip label="Unknown" color="default" size="small" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved':
                return '#2e7d32';
            case 'rejected':
                return '#d32f2f';
            case 'pending':
                return '#ed6c02';
            default:
                return '#666';
        }
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <MainCard title="Professional Verification Management">
                        <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
                            Review and manage professional verification applications. Approve or reject applications based on submitted
                            documents and qualifications.
                        </Typography>
                    </MainCard>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <IconCertificate size={30} color="#1976d2" />
                                <Typography variant="h6" sx={{ ml: 1 }}>
                                    Verification Stats
                                </Typography>
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                                    156
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Pending Verifications
                                </Typography>
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
                                    89
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Approved This Month
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="h4" color="error.main" sx={{ fontWeight: 'bold' }}>
                                    12
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Rejected This Month
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={8}>
                    <MainCard title="Recent Verification Applications">
                        <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Professional</TableCell>
                                        <TableCell>Category</TableCell>
                                        <TableCell>Submitted</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {verifications.map((verification) => (
                                        <TableRow key={verification.id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Avatar sx={{ mr: 2, bgcolor: getStatusColor(verification.status) }}>
                                                        {verification.avatar}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="subtitle2">{verification.name}</Typography>
                                                        <Typography variant="body2" color="textSecondary">
                                                            {verification.email}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">{verification.category}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">{verification.submittedDate}</Typography>
                                            </TableCell>
                                            <TableCell>{getStatusChip(verification.status)}</TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        startIcon={<IconEye size={16} />}
                                                        sx={{ minWidth: 'auto' }}
                                                    >
                                                        View
                                                    </Button>
                                                    {verification.status === 'pending' && (
                                                        <>
                                                            <Button
                                                                size="small"
                                                                variant="contained"
                                                                color="success"
                                                                startIcon={<IconCheck size={16} />}
                                                                sx={{ minWidth: 'auto' }}
                                                            >
                                                                Approve
                                                            </Button>
                                                            <Button
                                                                size="small"
                                                                variant="contained"
                                                                color="error"
                                                                startIcon={<IconX size={16} />}
                                                                sx={{ minWidth: 'auto' }}
                                                            >
                                                                Reject
                                                            </Button>
                                                        </>
                                                    )}
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </MainCard>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Verification;
