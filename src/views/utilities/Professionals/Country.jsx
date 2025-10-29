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
import {
    fetchCountries,
    addCountry,
    deleteCountry,
    getCountryById,
    updateCountry,
    activateCountry,
    deactivateCountry
} from 'views/API/CountryApi';
import { BaseUrl } from 'BaseUrl';
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
    Card,
    CardContent,
    Typography,
    Chip,
    Avatar,
    Divider,
    ToggleButton,
    ToggleButtonGroup,
    Badge
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DeleteForever, Edit, CheckCircle, Cancel, ViewList, ViewModule, Public } from '@mui/icons-material';
import Swal from 'sweetalert2';

const columns = [
    { id: 'countryId', label: 'ID' },
    { id: 'countryName', label: 'Country Name', minWidth: 150 },
    { id: 'countryCode', label: 'Country Code', minWidth: 120 },
    { id: 'isActive', label: 'Status', align: 'center' },
    { id: 'insertedDate', label: 'Created Date', align: 'right' },
    { id: 'updatedDate', label: 'Updated Date', align: 'right' },
    { id: 'actions', label: 'Actions', align: 'right' }
];

const Country = () => {
    const theme = useTheme();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [countries, setCountries] = useState([]);
    const [rawCountriesData, setRawCountriesData] = useState([]); // Store original API data
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'card'
    const [userdata, setUserData] = useState({
        countryName: '',
        countryCode: '',
        isActive: true
    });
    const [errors, setErrors] = useState({});
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [countryId, setCountryId] = useState(null);
    const [totalCount, setTotalCount] = useState(0);

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
    console.log('Current user data:', user);
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

            console.log('Fetching countries with page:', page, 'rowsPerPage:', rowsPerPage);
            const res = await fetchCountries(headers, page, rowsPerPage);
            console.log('Full API response:', res.data); // Debug log

            // Support both possible response shapes: { body: { data } } or { data }
            const responseBody = res?.data?.body ?? res?.data;
            console.log('Response body:', responseBody); // Debug log
            const dataNode = responseBody?.data;
            console.log('Data node:', dataNode); // Debug log
            const fetchedData = dataNode?.content || dataNode?.countries || dataNode || [];
            const totalCountFromApi = dataNode?.totalElements || dataNode?.totalCount || Array.isArray(fetchedData) ? fetchedData.length : 0;

            console.log('Fetched data:', fetchedData);
            console.log('Total count from API:', totalCountFromApi);

            if (fetchedData && Array.isArray(fetchedData)) {
                // Store raw data for editing purposes
                setRawCountriesData(fetchedData);
                
                const tableData = fetchedData.map((p) => {
                    console.log('Country data:', p); // Debug log
                    const isActiveValue = p.isActive !== undefined ? p.isActive : p.active !== undefined ? p.active : true;
                    return {
                        countryId: p.countryId,
                        countryName: p.countryName || 'N/A',
                        countryCode: p.countryCode || 'N/A',
                        isActive: isActiveValue ? 'Active' : 'Inactive',
                        insertedDate: p.insertedDate ? moment(p.insertedDate).format('L') : 'N/A',
                        updatedDate: p.updatedDate ? moment(p.updatedDate).format('L') : 'N/A'
                    };
                });

                console.log('Processed table data:', tableData);
                setCountries(tableData);
                setTotalCount(totalCountFromApi);
            } else {
                console.log('No valid data found, setting empty arrays');
                setCountries([]);
                setRawCountriesData([]);
                setTotalCount(0);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            
            // More specific error handling
            let errorMessage = 'Failed to load countries. Please try again.';
            if (error?.response?.status === 401) {
                errorMessage = 'Authentication failed. Please login again.';
            } else if (error?.response?.status === 403) {
                errorMessage = 'You do not have permission to access countries.';
            } else if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            
            Swal.fire('Error', errorMessage, 'error');
            setCountries([]);
            setRawCountriesData([]);
            setTotalCount(0);
        }
    };

    useEffect(() => {
        FetchData();
    }, [refreshTrigger, page, rowsPerPage]);

    const postData = async (e) => {
        e.preventDefault();
        const formErrors = validateForm();

        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
        } else {
            try {
                if (editMode) {
                    if (countryId == null) {
                        console.error('Cannot update: missing countryId');
                        Swal.fire('Error', 'Cannot update: missing country ID', 'error');
                        return;
                    }
                    // Try different data structures for update
                    const updatedData = {
                        countryId: parseInt(countryId),
                        countryName: userdata.countryName?.trim() || '',
                        countryCode: userdata.countryCode?.trim() || '',
                        isActive: Boolean(userdata.isActive),
                        updatedBy: user?.userId ? {
                            userId: parseInt(user.userId),
                            userName: user.userName || user.username || 'admin'
                        } : {
                            userId: 1,
                            userName: 'admin'
                        }
                    };
                    
                    // Alternative simpler structure
                    const simpleUpdatedData = {
                        countryId: parseInt(countryId),
                        countryName: userdata.countryName?.trim() || '',
                        countryCode: userdata.countryCode?.trim() || '',
                        isActive: Boolean(userdata.isActive)
                    };
                    console.log('Sending update data:', updatedData);
                    console.log('Headers being sent:', headers);
                    const updateResult = await updateCountry(updatedData, headers);
                    
                    if (updateResult.success) {
                        console.log('Country updated successfully:', updateResult.message);
                        Swal.fire('Success', updateResult.message, 'success');
                    } else {
                        throw new Error(updateResult.message || 'Update operation failed');
                    }
                } else {
                    const newData = {
                        countryName: userdata.countryName?.trim() || '',
                        countryCode: userdata.countryCode?.trim() || '',
                        isActive: Boolean(userdata.isActive),
                        insertedBy: user?.userId ? {
                            userId: user.userId,
                            userName: user.userName || user.username || 'admin'
                        } : {
                            userId: 1,
                            userName: 'admin'
                        }
                    };
                    console.log('Sending add data:', newData);
                    await addCountry(newData, headers);
                }
                setUserData({ countryName: '', countryCode: '', isActive: true });
                setErrors({});
                setRefreshTrigger((prev) => !prev);
                handleCloseDialog();
            } catch (error) {
                console.error('Error saving country:', error);
                Swal.fire('Error', 'Failed to save country. Please try again.', 'error');
            }
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!userdata.countryName || userdata.countryName.trim() === '') {
            newErrors.countryName = 'Enter the country name';
        }

        if (!userdata.countryCode || userdata.countryCode.trim() === '') {
            newErrors.countryCode = 'Enter the country code';
        }

        // Additional validation for update mode
        if (editMode && !countryId) {
            newErrors.general = 'Country ID is required for update';
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

    const handleAddCountry = () => {
        setEditMode(false);
        setUserData({
            countryName: '',
            countryCode: '',
            isActive: true
        });
        setErrors({});
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        setEditMode(false);
        setUserData({
            countryName: '',
            countryCode: '',
            isActive: true
        });
        setErrors({});
        setCountryId(null);
    };

    const handleEdit = async (countryId) => {
        // Validate countryId
        if (!countryId || countryId <= 0) {
            console.error('Invalid country ID:', countryId);
            Swal.fire('Error', 'Invalid country ID', 'error');
            return;
        }

        // Check if user is authenticated
        if (!user || !user.accessToken) {
            console.error('User not authenticated');
            Swal.fire('Error', 'Please login to continue', 'error');
            return;
        }

        // First, try to find the country in the raw data
        const existingCountry = rawCountriesData.find(country => country.countryId === countryId);
        
        if (existingCountry) {
            console.log('Using existing country data for edit:', existingCountry);
            setEditMode(true);
            setOpen(true);
            setCountryId(countryId);
            const isActiveValue = existingCountry.isActive !== undefined ? existingCountry.isActive : existingCountry.active !== undefined ? existingCountry.active : true;
            setUserData({
                countryName: existingCountry.countryName || '',
                countryCode: existingCountry.countryCode || '',
                isActive: Boolean(isActiveValue)
            });
            return;
        }

        // If not found in list, try API call as fallback
        setEditMode(true);
        setOpen(true);
        try {
            console.log('Country not found in list, attempting API call for ID:', countryId);
            const res = await getCountryById(countryId, headers);
            console.log('API response for country details:', res);
            
            // Support both possible response shapes
            const responseBody = res?.data?.body ?? res?.data;
            const det = responseBody?.data || responseBody;

            if (det && det.countryId) {
                console.log('Country details for edit:', det);
                const isActiveValue = det.isActive !== undefined ? det.isActive : det.active !== undefined ? det.active : true;
                setCountryId(det.countryId);
                setUserData({
                    countryName: det.countryName || '',
                    countryCode: det.countryCode || '',
                    isActive: Boolean(isActiveValue)
                });
            } else {
                console.error('Invalid country data received:', det);
                Swal.fire('Error', 'Invalid country data received from server', 'error');
                setOpen(false);
            }
        } catch (error) {
            console.error('Error fetching country details:', error);
            
            // More specific error handling
            let errorMessage = 'Failed to load country details. Please try again.';
            if (error?.response?.status === 404) {
                errorMessage = `Country with ID ${countryId} not found. It may have been deleted.`;
                // Refresh the data to remove the deleted country from the list
                setRefreshTrigger((prev) => !prev);
            } else if (error?.response?.status === 401) {
                errorMessage = 'Authentication failed. Please login again.';
            } else if (error?.response?.status === 403) {
                errorMessage = 'You do not have permission to access this country.';
            } else if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            
            Swal.fire('Error', errorMessage, 'error');
            setOpen(false);
        }
    };

    const handleDelete = async (countryId) => {
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
                    console.log('=== HANDLE DELETE DEBUG ===');
                    console.log('User confirmed deletion for country ID:', countryId);
                    console.log('Headers being sent:', headers);
                    
                    const deleteResult = await deleteCountry(countryId, headers);
                    
                    console.log('=== DELETE RESULT ===');
                    console.log('Delete result:', deleteResult);
                    
                    if (deleteResult.success) {
                        console.log('✅ Country deleted successfully, refreshing data...');
                        
                        // Verify deletion by checking if country still exists in our data
                        const countryStillExists = rawCountriesData.find(country => country.countryId === countryId);
                        console.log('Country still exists in local data:', countryStillExists);
                        
                        setRefreshTrigger((prev) => !prev);
                        Swal.fire({
                            title: 'Deleted!',
                            text: deleteResult.message || 'Country has been deleted successfully.',
                            icon: 'success'
                        });
                    } else {
                        console.log('❌ Delete result indicates failure');
                        throw new Error(deleteResult.message || 'Delete operation failed');
                    }
                } catch (error) {
                    console.log('=== DELETE ERROR IN COMPONENT ===');
                    console.error('Error deleting country:', error);
                    console.log('Error message:', error.message);
                    console.log('Error stack:', error.stack);
                    
                    Swal.fire({
                        title: 'Error!',
                        text: error.message || 'There was a problem deleting the country.',
                        icon: 'error'
                    });
                }
            } else {
                console.log('User cancelled deletion');
            }
        });
    };

    const handleActivate = async (countryId) => {
        try {
            await activateCountry(countryId, headers);
            setRefreshTrigger((prev) => !prev);
        } catch (error) {
            console.error('Error activating country:', error);
        }
    };

    const handleDeactivate = async (countryId) => {
        try {
            await deactivateCountry(countryId, headers);
            setRefreshTrigger((prev) => !prev);
        } catch (error) {
            console.error('Error deactivating country:', error);
        }
    };

    const renderCardView = () => (
        <Grid container spacing={3}>
            {countries.length === 0 ? (
                <Grid item xs={12}>
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="h6" color="textSecondary">
                            No countries found
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Countries array length: {countries.length}
                        </Typography>
                    </Box>
                </Grid>
            ) : (
                countries.map((country) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={country.countryId}>
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                background: 'linear-gradient(135deg, #F48FB1 0%, #F8BBD9 100%)',
                                color: '#880E4F',
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
                                            bgcolor: 'rgba(136, 14, 79, 0.2)',
                                            mr: 2,
                                            width: 40,
                                            height: 40,
                                            color: '#880E4F'
                                        }}
                                    >
                                        <Public />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5, color: '#880E4F' }}>
                                            {country.countryName}
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                            <Chip
                                                label={country.countryCode}
                                                size="small"
                                                sx={{
                                                    bgcolor: 'rgba(136, 14, 79, 0.2)',
                                                    color: '#880E4F',
                                                    fontWeight: 'bold',
                                                    fontSize: '0.7rem'
                                                }}
                                            />
                                            <Chip
                                                label={country.isActive}
                                                size="small"
                                                sx={{
                                                    bgcolor:
                                                        country.isActive === 'Active' ? 'rgba(76, 175, 80, 0.9)' : 'rgba(244, 67, 54, 0.9)',
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
                                        color: '#880E4F',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {country.countryDescription}
                                </Typography>

                                <Divider sx={{ my: 1, bgcolor: 'rgba(136, 14, 79, 0.2)' }} />

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                    <Typography variant="caption" sx={{ opacity: 0.7, color: '#880E4F' }}>
                                        ID: {country.countryId}
                                    </Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.7, color: '#880E4F' }}>
                                        {country.insertedDate}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="caption" sx={{ opacity: 0.7, color: '#880E4F' }}>
                                        Updated: {country.updatedDate}
                                    </Typography>
                                    <Box>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleEdit(country.countryId)}
                                            sx={{ color: '#880E4F', '&:hover': { bgcolor: 'rgba(136, 14, 79, 0.1)' } }}
                                        >
                                            <Edit fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleDelete(country.countryId)}
                                            sx={{ color: '#880E4F', '&:hover': { bgcolor: 'rgba(136, 14, 79, 0.1)' } }}
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

    const renderListView = () => (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth, fontWeight: 600, fontSize: 15 }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {countries.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} align="center">
                                    <Box sx={{ py: 2 }}>
                                        <div>No countries found</div>
                                        <div style={{ fontSize: '12px', color: 'gray' }}>Countries array length: {countries.length}</div>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ) : (
                            countries.map((row) => (
                                <TableRow hover role="checkbox" tabIndex={-1} key={row.countryId}>
                                    {columns.map((column) => (
                                        <TableCell key={column.id} align={column.align}>
                                            {column.id === 'actions' ? (
                                                <>
                                                    <IconButton onClick={() => handleEdit(row.countryId)} style={{ color: '#00afb5' }}>
                                                        <Edit />
                                                    </IconButton>
                                                    <IconButton onClick={() => handleDelete(row.countryId)} color="error">
                                                        <DeleteForever />
                                                    </IconButton>
                                                </>
                                            ) : column.id === 'isActive' ? (
                                                <Box
                                                    sx={{
                                                        backgroundColor: row[column.id] === 'Active' ? '#4caf50' : '#f44336',
                                                        color: 'white',
                                                        padding: '4px 8px',
                                                        borderRadius: '4px',
                                                        fontSize: '12px',
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    {row[column.id]}
                                                </Box>
                                            ) : (
                                                row[column.id]
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
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={totalCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );

    return (
        <Box sx={{ mt: 4 }}>
            <MainCard
                title={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <span>Country Management</span>
                            <Badge badgeContent={totalCount} color="primary">
                                <Public color="action" />
                            </Badge>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <ToggleButtonGroup
                                value={viewMode}
                                exclusive
                                onChange={handleViewModeChange}
                                size="small"
                                sx={{ bgcolor: 'background.paper' }}
                            >
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
                                sx={{ display: 'flex', alignItems: 'center', fontSize: '15px' }}
                                onClick={handleAddCountry}
                            >
                                Add Country
                                <AddIcon sx={{ color: '#fff' }} />
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
                maxWidth="md"
                disableEscapeKeyDown={false}
                aria-labelledby="country-dialog-title"
                aria-describedby="country-dialog-description"
            >
                <DialogTitle 
                    id="country-dialog-title"
                    sx={{ fontWeight: 'bold', fontSize: '1.25rem', backgroundColor: '#f5f5f5' }}
                >
                    {editMode ? 'Edit Country' : 'Add Country'}
                </DialogTitle>
                <Box component="form" onSubmit={postData} noValidate sx={{ p: 3 }}>
                    {errors.general && (
                        <Box sx={{ mb: 2, p: 1, bgcolor: 'error.light', color: 'error.contrastText', borderRadius: 1 }}>
                            {errors.general}
                        </Box>
                    )}
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Country Name"
                                name="countryName"
                                value={userdata.countryName}
                                onChange={changeHandler}
                                error={!!errors.countryName}
                                helperText={errors.countryName}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Country Code"
                                name="countryCode"
                                value={userdata.countryCode}
                                onChange={changeHandler}
                                error={!!errors.countryCode}
                                helperText={errors.countryCode}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={<Switch checked={Boolean(userdata.isActive)} onChange={changeHandler} name="isActive" color="primary" />}
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

export default Country;
