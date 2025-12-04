import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { fetchMaritalStatuses, addMaritalStatus, deleteMaritalStatus, getMaritalStatusById, updateMaritalStatus, getMaritalStatusCount } from 'views/professionals API/MaritalStatusApi';
import { useState, useEffect } from 'react';
import moment from 'moment';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    TextField,
    Container,
    IconButton,
    Switch,
    FormControlLabel,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Card,
    CardContent,
    Typography,
    Chip,
    Avatar,
    Divider,
    ToggleButton,
    ToggleButtonGroup,
    Badge,
    useMediaQuery
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DeleteForever, Edit, CheckCircle, Cancel, ViewList, ViewModule, Favorite } from '@mui/icons-material';
import Swal from 'sweetalert2';

const columns = [
    { id: 'maritalStatusId', label: 'ID' },
    { id: 'maritalStatusName', label: 'Marital Status Name', minWidth: 150 },
    { id: 'maritalStatusDescription', label: 'Description', minWidth: 200 },
    { id: 'isActive', label: 'Status', align: 'center' },
    { id: 'insertedDate', label: 'Created Date', align: 'right' },
    { id: 'updatedDate', label: 'Updated Date', align: 'right' },
    { id: 'actions', label: 'Actions', align: 'right' }
];

const MaritalStatus = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [maritalStatuses, setMaritalStatuses] = useState([]);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'card'
    const [userdata, setUserData] = useState({
        maritalStatusName: '',
        maritalStatusDescription: '',
        isActive: true
    });
    const [errors, setErrors] = useState({});
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [maritalStatusId, setMaritalStatusId] = useState(null);
    const [totalCount, setTotalCount] = useState(0);
    const [maritalStatusCount, setMaritalStatusCount] = useState(0);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleViewModeChange = (event, newViewMode) => {
        if (newViewMode !== null) {
            setViewMode(newViewMode);
        }
    };

    const user = JSON.parse(sessionStorage.getItem('user'));
    const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + user?.accessToken
    };

    const FetchData = async () => {
        try {
            // Check if user is authenticated
            if (!user || !user.accessToken) {
                console.error('User not authenticated');
                Swal.fire('Error', 'Please login to continue', 'error');
                return;
            }

            const res = await fetchMaritalStatuses(headers, page, rowsPerPage);

            // Support both possible response shapes: { body: { data } } or { data }
            const responseBody = res?.data?.body ?? res?.data;
            const dataNode = responseBody?.data;
            const fetchedData = dataNode?.content || dataNode?.maritalStatuses || dataNode || [];
            const totalCountFromApi = dataNode?.totalElements || dataNode?.totalCount || Array.isArray(fetchedData) ? fetchedData.length : 0;

            if (fetchedData && Array.isArray(fetchedData)) {
                const tableData = fetchedData.map((p) => {
                    // Since the backend doesn't have an isActive field, we'll show all as Active
                    // or remove the status column entirely
                    console.log(`Marital Status ${p.maritalStatusName} - Raw data:`, p);
                    
                    return {
                        maritalStatusId: p.maritalStatusId,
                        maritalStatusName: p.maritalStatusName || 'N/A',
                        maritalStatusDescription: p.maritalStatusDescription || 'N/A',
                        isActive: 'Active', // Default to Active since backend doesn't have this field
                        insertedDate: p.insertedDate ? moment(p.insertedDate).format('L') : 'N/A',
                        updatedDate: p.updatedDate ? moment(p.updatedDate).format('L') : 'N/A'
                    };
                });

                setMaritalStatuses(tableData);
                setTotalCount(typeof totalCountFromApi === 'number' ? totalCountFromApi : 0);
            } else {
                setMaritalStatuses([]);
                setTotalCount(0);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            Swal.fire('Error', 'Failed to load marital statuses. Please try again.', 'error');
            setMaritalStatuses([]);
            setTotalCount(0);
        }
    };

    const fetchMaritalStatusCount = async () => {
        try {
            const res = await getMaritalStatusCount(headers);
            const responseBody = res?.data?.body ?? res?.data;
            const count = responseBody?.data || responseBody || 0;
            
            // Ensure count is a number
            const numericCount = typeof count === 'number' ? count : 
                                typeof count === 'string' ? parseInt(count, 10) || 0 : 0;
            setMaritalStatusCount(numericCount);
        } catch (error) {
            console.error('Error fetching marital status count:', error);
            setMaritalStatusCount(0);
        }
    };

    useEffect(() => {
        FetchData();
        fetchMaritalStatusCount();
    }, [refreshTrigger, page, rowsPerPage]);

    // Prevent aria-hidden warning by ensuring no background element keeps focus when dialog opens
    useEffect(() => {
        if (open) {
            try {
                document.activeElement && document.activeElement.blur();
            } catch (_) {}
        }
    }, [open]);

    const postData = async (e) => {
        e.preventDefault();
        const formErrors = validateForm();

        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
        } else {
            try {
                if (editMode) {
                    const updatedData = {
                        maritalStatusId: maritalStatusId,
                        maritalStatusName: userdata.maritalStatusName?.trim() || '',
                        maritalStatusDescription: userdata.maritalStatusDescription?.trim() || ''
                        // Removed isActive field to avoid Hibernate proxy serialization issues
                        // The backend should handle the active status internally
                    };
                    const result = await updateMaritalStatus(updatedData, headers);
                    if (result?.success) {
                        Swal.fire('Success', result.message, 'success');
                    }
                } else {
                    const newData = {
                        maritalStatusName: userdata.maritalStatusName?.trim() || '',
                        maritalStatusDescription: userdata.maritalStatusDescription?.trim() || ''
                        // Removed isActive and insertedBy fields to avoid Hibernate proxy serialization issues
                        // The backend should handle these fields internally
                    };
                    await addMaritalStatus(newData, headers);
                }
                setUserData({ maritalStatusName: '', maritalStatusDescription: '', isActive: true });
                setRefreshTrigger((prev) => !prev);
                setOpen(false);
            } catch (error) {
                console.error('Error saving marital status:', error);
                
                // Get more detailed error information
                let errorMessage = 'Failed to save marital status. Please try again.';
                
                if (error?.response?.data?.message) {
                    errorMessage = error.response.data.message;
                } else if (error?.response?.data?.error) {
                    errorMessage = error.response.data.error;
                } else if (error?.message) {
                    errorMessage = error.message;
                }
                
                console.log('Detailed error info:', {
                    status: error?.response?.status,
                    statusText: error?.response?.statusText,
                    data: error?.response?.data,
                    message: error?.message
                });
                
                // Log the full error response data separately for better visibility
                console.log('Full error response data:', JSON.stringify(error?.response?.data, null, 2));
                
                Swal.fire('Error', errorMessage, 'error');
            }
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!userdata.maritalStatusName || userdata.maritalStatusName.trim() === '') {
            newErrors.maritalStatusName = 'Enter the marital status name';
        }

        if (!userdata.maritalStatusDescription || userdata.maritalStatusDescription.trim() === '') {
            newErrors.maritalStatusDescription = 'Enter the marital status description';
        }

        return newErrors;
    };

    const changeHandler = (e) => {
        const { name, value, checked } = e.target;
        setUserData({
            ...userdata,
            [name]: name === 'isActive' ? checked : value
        });

        setErrors({
            ...errors,
            [name]: null
        });
    };

    const handleAddMaritalStatus = () => {
        setEditMode(false);
        setUserData({
            maritalStatusName: '',
            maritalStatusDescription: '',
            isActive: true
        });
        setErrors({});
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        setEditMode(false);
        setUserData({
            maritalStatusName: '',
            maritalStatusDescription: '',
            isActive: true
        });
        setErrors({});
        setMaritalStatusId(null);
    };

    const handleEdit = async (maritalStatusId) => {
        setEditMode(true);
        setOpen(true);
        try {
            const res = await getMaritalStatusById(maritalStatusId, headers);
            // Support both possible response shapes: { body: { data } } or { data }
            const responseBody = res?.data?.body ?? res?.data;
            const det = responseBody?.data || responseBody;

            if (det && det.maritalStatusId) {
                console.log('Marital Status details for edit:', det);
                
                // Since backend doesn't have isActive field, default to true
                console.log('Edit - Raw marital status data:', det);
                
                setMaritalStatusId(det.maritalStatusId);
                setUserData({
                    maritalStatusName: det.maritalStatusName || '',
                    maritalStatusDescription: det.maritalStatusDescription || '',
                    isActive: true // Default to true since backend doesn't have this field
                });
            } else {
                Swal.fire('Error', 'Failed to load marital status details', 'error');
                setOpen(false);
            }
        } catch (error) {
            console.error('Error fetching marital status details:', error);
            Swal.fire('Error', 'Failed to load marital status details. Please try again.', 'error');
            setOpen(false);
        }
    };

    const handleDelete = async (maritalStatusId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteMaritalStatus(maritalStatusId, headers);
                    setRefreshTrigger((prev) => !prev);
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'Marital Status has been deleted.',
                        icon: 'success'
                    });
                } catch (error) {
                    Swal.fire({
                        title: 'Error!',
                        text: 'There was a problem deleting the marital status.',
                        icon: 'error'
                    });
                    console.error('Error deleting marital status:', error);
                }
            }
        });
    };

    const renderCardView = () => (
        <Grid container spacing={isMobile ? 2 : 3}>
            {maritalStatuses.length === 0 ? (
                <Grid item xs={12}>
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="h6" color="textSecondary">
                            No marital statuses found
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Marital statuses array length: {maritalStatuses.length}
                        </Typography>
                    </Box>
                </Grid>
            ) : (
                maritalStatuses.map((maritalStatus) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={maritalStatus.maritalStatusId}>
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                background: 'linear-gradient(135deg, #FCE4EC 0%, #F8BBD9 100%)',
                                color: '#C2185B',
                                position: 'relative',
                                overflow: 'hidden',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                                    transition: 'all 0.3s ease'
                                }
                            }}
                        >
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    width: 100,
                                    height: 100,
                                    background: 'rgba(255,255,255,0.3)',
                                    borderRadius: '50%',
                                    transform: 'translate(30px, -30px)'
                                }}
                            />
                            <CardContent sx={{ flexGrow: 1, position: 'relative', zIndex: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Avatar
                                        sx={{
                                            bgcolor: 'rgba(194, 24, 91, 0.2)',
                                            mr: 2,
                                            width: 40,
                                            height: 40,
                                            color: '#C2185B'
                                        }}
                                    >
                                        <Favorite />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5, color: '#C2185B' }}>
                                            {maritalStatus.maritalStatusName}
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                            <Chip
                                                label={maritalStatus.isActive}
                                                size="small"
                                                sx={{
                                                    bgcolor:
                                                        maritalStatus.isActive === 'Active' ? 'rgba(76, 175, 80, 0.9)' : 'rgba(244, 67, 54, 0.9)',
                                                    color: 'white',
                                                    fontWeight: 'bold'
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                </Box>

                                <Typography
                                    variant="body2"
                                    sx={{
                                        mb: 2,
                                        opacity: 0.8,
                                        color: '#C2185B',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {maritalStatus.maritalStatusDescription}
                                </Typography>

                                <Divider sx={{ my: 1, bgcolor: 'rgba(194, 24, 91, 0.2)' }} />

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                    <Typography variant="caption" sx={{ opacity: 0.7, color: '#C2185B' }}>
                                        ID: {maritalStatus.maritalStatusId}
                                    </Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.7, color: '#C2185B' }}>
                                        {maritalStatus.insertedDate}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="caption" sx={{ opacity: 0.7, color: '#C2185B' }}>
                                        Updated: {maritalStatus.updatedDate}
                                    </Typography>
                                    <Box>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleEdit(maritalStatus.maritalStatusId)}
                                            sx={{ color: '#C2185B', '&:hover': { bgcolor: 'rgba(194, 24, 91, 0.1)' } }}
                                        >
                                            <Edit fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleDelete(maritalStatus.maritalStatusId)}
                                            sx={{ color: '#C2185B', '&:hover': { bgcolor: 'rgba(194, 24, 91, 0.1)' } }}
                                        >
                                            <DeleteForever fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))
            )}
        </Grid>
    );

    const renderListView = () => {
        const visibleColumns = isMobile 
            ? columns.filter(col => ['maritalStatusId', 'maritalStatusName', 'actions'].includes(col.id))
            : isTablet
            ? columns.filter(col => !['insertedDate', 'updatedDate', 'maritalStatusDescription'].includes(col.id))
            : columns;

        return (
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer 
                    sx={{ 
                        maxHeight: 440,
                        overflowX: 'auto',
                        '&::-webkit-scrollbar': { height: '8px' },
                        '&::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1' },
                        '&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: '4px' },
                        '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#555' }
                    }}
                >
                    <Table stickyHeader aria-label="sticky table" sx={{ minWidth: isMobile ? 600 : '100%' }}>
                        <TableHead>
                            <TableRow>
                                {visibleColumns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        sx={{ 
                                            minWidth: isMobile ? (column.minWidth ? Math.min(column.minWidth, 100) : 'auto') : column.minWidth,
                                            fontWeight: 600,
                                            fontSize: isMobile ? 13 : 15,
                                            whiteSpace: 'nowrap',
                                            ...(column.id === 'actions' && {
                                                textAlign: 'right'
                                            })
                                        }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {maritalStatuses.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={visibleColumns.length} align="center">
                                        <Box sx={{ py: 2 }}>
                                            <div>No marital statuses found</div>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                maritalStatuses.map((row) => (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.maritalStatusId}>
                                        {visibleColumns.map((column) => (
                                            <TableCell 
                                                key={column.id} 
                                                align={column.align}
                                                sx={{ 
                                                    fontSize: isMobile ? 12 : 14, 
                                                    whiteSpace: 'nowrap',
                                                    ...(column.id === 'actions' && {
                                                        textAlign: 'right'
                                                    })
                                                }}
                                            >
                                                {column.id === 'isActive' ? (
                                                    <Box
                                                        sx={{
                                                            backgroundColor: row.isActive === 'Active' ? '#4caf50' : '#f44336',
                                                            color: 'white',
                                                            padding: isMobile ? '2px 6px' : '4px 8px',
                                                            borderRadius: '4px',
                                                            fontSize: isMobile ? '10px' : '12px',
                                                            fontWeight: 'bold',
                                                            textAlign: 'center',
                                                            display: 'inline-block',
                                                            minWidth: isMobile ? 60 : 80
                                                        }}
                                                    >
                                                        {row.isActive}
                                                    </Box>
                                                ) : column.id === 'actions' ? (
                                                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                                        <IconButton 
                                                            size={isMobile ? 'small' : 'medium'}
                                                            onClick={() => handleEdit(row.maritalStatusId)} 
                                                            style={{ color: '#00afb5' }}
                                                        >
                                                            <Edit fontSize={isMobile ? 'small' : 'medium'} />
                                                        </IconButton>
                                                        <IconButton 
                                                            size={isMobile ? 'small' : 'medium'}
                                                            onClick={() => handleDelete(row.maritalStatusId)} 
                                                            color="error"
                                                        >
                                                            <DeleteForever fontSize={isMobile ? 'small' : 'medium'} />
                                                        </IconButton>
                                                    </Box>
                                                ) : (
                                                    <Typography 
                                                        variant="body2" 
                                                        sx={{ 
                                                            fontSize: isMobile ? 12 : 14,
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            maxWidth: isMobile ? 150 : 'none'
                                                        }}
                                                    >
                                                        {row[column.id]}
                                                    </Typography>
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={isMobile ? [10, 25] : [10, 25, 100]}
                    component="div"
                    count={totalCount}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{
                        overflowX: 'auto',
                        '& .MuiTablePagination-toolbar': { flexWrap: 'wrap', gap: 1 },
                        '& .MuiTablePagination-selectLabel': { fontSize: isMobile ? 12 : 14 },
                        '& .MuiTablePagination-displayedRows': { fontSize: isMobile ? 12 : 14 }
                    }}
                />
            </Paper>
        );
    };

    return (
        <Box sx={{ mt: 4, px: { xs: 1, sm: 2 } }}>
            <MainCard
                title={
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'space-between', 
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        gap: 2,
                        width: '100%'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                            <Typography variant="h4" sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>
                                Marital Status Management
                            </Typography>
                            <Badge badgeContent={typeof maritalStatusCount === 'number' ? maritalStatusCount : 0} color="primary">
                                <Favorite color="action" />
                            </Badge>
                        </Box>
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1,
                            flexWrap: 'wrap',
                            width: { xs: '100%', sm: 'auto' },
                            justifyContent: { xs: 'flex-start', sm: 'flex-end' }
                        }}>
                            <ToggleButtonGroup value={viewMode} exclusive onChange={handleViewModeChange} size="small">
                                <ToggleButton value="list" aria-label="list view">
                                    <ViewList />
                                </ToggleButton>
                                <ToggleButton value="card" aria-label="card view">
                                    <ViewModule />
                                </ToggleButton>
                            </ToggleButtonGroup>
                            <Button
                                variant="contained"
                                style={{ backgroundColor: '#00afb5', color: 'white' }}
                                sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    fontSize: { xs: '13px', sm: '15px' },
                                    whiteSpace: 'nowrap',
                                    width: { xs: '100%', sm: 'auto' }
                                }}
                                onClick={handleAddMaritalStatus}
                            >
                                {isMobile ? 'Add' : 'Add Marital Status'}
                                <AddIcon sx={{ color: '#fff', ml: 0.5 }} />
                            </Button>
                        </Box>
                    </Box>
                }
            >
                <Grid container spacing={gridSpacing}></Grid>
                {viewMode === 'card' ? renderCardView() : renderListView()}
            </MainCard>
            <Dialog 
                open={open} 
                onClose={handleCloseDialog} 
                fullWidth 
                maxWidth={isMobile ? 'xs' : 'md'}
                fullScreen={isMobile}
            >
                <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.25rem', backgroundColor: '#f5f5f5' }}>
                    {editMode ? 'Edit Marital Status' : 'Add Marital Status'}
                </DialogTitle>
                <Box component="form" onSubmit={postData} noValidate sx={{ p: { xs: 2, sm: 3 } }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Marital Status Name"
                                name="maritalStatusName"
                                value={userdata.maritalStatusName}
                                onChange={changeHandler}
                                error={!!errors.maritalStatusName}
                                helperText={errors.maritalStatusName}
                                placeholder="e.g., Single, Married, Divorced, Widowed"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Marital Status Description"
                                name="maritalStatusDescription"
                                value={userdata.maritalStatusDescription}
                                onChange={changeHandler}
                                error={!!errors.maritalStatusDescription}
                                helperText={errors.maritalStatusDescription}
                                placeholder="Describe the marital status and its characteristics"
                                multiline
                                rows={4}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={<Switch checked={userdata.isActive} onChange={changeHandler} name="isActive" color="primary" />}
                                label="Active Status"
                            />
                        </Grid>
                    </Grid>
                    <DialogActions>
                        <Button type="submit" variant="contained" style={{ backgroundColor: '#00afb5', color: 'white' }}>
                            {editMode ? 'Update' : 'Add'}
                        </Button>
                        <Button onClick={handleCloseDialog} style={{ color: '#00afb5' }}>
                            Cancel
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </Box>
    );
};

export default MaritalStatus;
