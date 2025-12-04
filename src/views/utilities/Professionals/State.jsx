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
import { fetchStates, addState, deleteState, getStateById, updateState, searchStateByName, getStateCount, activateState, deactivateState } from 'views/professionals API/StateApi';
import { getAllCountries } from 'views/professionals API/CountryApi';
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
import { DeleteForever, Edit, CheckCircle, Cancel, ViewList, ViewModule, LocationOn } from '@mui/icons-material';
import Swal from 'sweetalert2';

const columns = [
    { id: 'stateId', label: 'ID' },
    { id: 'stateName', label: 'State Name', minWidth: 150 },
    { id: 'stateCode', label: 'State Code', minWidth: 120 },
    { id: 'countryName', label: 'Country', minWidth: 120 },
    { id: 'isActive', label: 'Status', align: 'center' },
    { id: 'insertedDate', label: 'Created Date', align: 'right' },
    { id: 'updatedDate', label: 'Updated Date', align: 'right' },
    { id: 'actions', label: 'Actions', align: 'right' }
];

const State = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [states, setStates] = useState([]);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'card'
    const [userdata, setUserData] = useState({
        stateName: '',
        stateCode: '',
        countryId: '',
        isActive: true
    });
    const [errors, setErrors] = useState({});
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [stateId, setStateId] = useState(null);
    const [totalCount, setTotalCount] = useState(0);
    const [countries, setCountries] = useState([]);

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

            const res = await fetchStates(headers, page, rowsPerPage);

            // Support both possible response shapes: { body: { data } } or { data }
            // Response structure: { code, status, message, error, data: { states: [], totalCount, pageNumber, pageSize } }
            const responseBody = res?.data?.body ?? res?.data;
            const dataNode = responseBody?.data;
            const fetchedData = dataNode?.content || dataNode?.states || dataNode || [];
            // Extract totalCount - handle both totalElements (Spring pagination) and totalCount (custom pagination)
            const totalCountFromApi = dataNode?.totalElements ?? dataNode?.totalCount ?? (Array.isArray(fetchedData) ? fetchedData.length : 0);

            if (fetchedData && Array.isArray(fetchedData)) {
                console.log('States data:', fetchedData);
                console.log('Available countries:', countries);
                
                const tableData = fetchedData.map((p) => {
                    console.log('Processing state:', p);
                    console.log('Available countries for lookup:', countries);
                    
                    // Get countryId from state data

                    const stateCountryId = p.countryId;
                    console.log(`State ${p.stateName} - stateCountryId: ${stateCountryId}`);
                    
                    // Find country name by countryId
                    const country = countries.find(c => c.countryId == stateCountryId);
                    
                    const countryName = country ? country.countryName : (p.countryName || 'N/A');
                    
                    console.log(`State ${p.stateName} - found country:`, country, 'countryName:', countryName);
                    
                    // Handle isActive field similar to Country.jsx
                    const isActiveValue = p.isActive !== undefined ? p.isActive : p.active !== undefined ? p.active : true;
                    console.log(`State ${p.stateName} - isActive field: ${p.isActive}, active field: ${p.active}, final value: ${isActiveValue}`);
                    
                    return {
                        stateId: p.stateId,
                        stateName: p.stateName || 'N/A',
                        stateCode: p.stateCode || 'N/A',
                        countryName: countryName,
                        isActive: isActiveValue ? 'Active' : 'Inactive',
                        insertedDate: p.insertedDate ? moment(p.insertedDate).format('L') : 'N/A',
                        updatedDate: p.updatedDate ? moment(p.updatedDate).format('L') : 'N/A'
                    };
                });

                setStates(tableData);
                setTotalCount(totalCountFromApi);
            } else {
                setStates([]);
                setTotalCount(0);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            Swal.fire('Error', 'Failed to load states. Please try again.', 'error');
            setStates([]);
            setTotalCount(0);
        }
    };

    const fetchCountries = async () => {
        try {
            const res = await getAllCountries(headers);
            console.log('Countries API response:', res.data);
            
            // Support both possible response shapes: { body: { data } } or { data }
            const responseBody = res?.data?.body ?? res?.data;
            console.log('Response body:', responseBody);
            const dataNode = responseBody?.data;
            console.log('Data node:', dataNode);
            const fetchedCountries = dataNode || [];
            
            console.log('Fetched countries:', fetchedCountries);
            
            if (Array.isArray(fetchedCountries)) {
                // Process countries data similar to Country.jsx
                const processedCountries = fetchedCountries.map((country) => ({
                    countryId: country.countryId,
                    countryName: country.countryName || 'N/A',
                    countryCode: country.countryCode || 'N/A',
                    isActive: country.isActive !== undefined ? country.isActive : true
                }));
                console.log('Processed countries:', processedCountries);
                setCountries(processedCountries);
            }
        } catch (error) {
            console.error('Error fetching countries:', error);
        }
    };

    useEffect(() => {
        // First fetch countries, then states
        const loadData = async () => {
            try {
                await fetchCountries();
                // Wait a bit to ensure countries are set
                setTimeout(() => {
                    FetchData();
                }, 100);
            } catch (error) {
                console.error('Error loading data:', error);
            }
        };
        loadData();
    }, [refreshTrigger, page, rowsPerPage]);

    // Separate useEffect to refresh states when countries change
    useEffect(() => {
        if (countries.length > 0) {
            console.log('Countries loaded, refreshing states data');
            FetchData();
        } else {
            console.log('No countries loaded yet, countries length:', countries.length);
        }
    }, [countries]);

    const postData = async (e) => {
        e.preventDefault();
        const formErrors = validateForm();

        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
        } else {
            try {
                if (editMode) {
                    if (stateId == null) {
                        console.error('Cannot update: missing stateId');
                        Swal.fire('Error', 'Cannot update: missing state ID', 'error');
                        return;
                    }
                    const updatedData = {
                        stateId: stateId,
                        stateName: userdata.stateName?.trim() || '',
                        stateCode: userdata.stateCode?.trim() || '',
                        countryId: userdata.countryId,
                        isActive: Boolean(userdata.isActive),
                        updatedBy: user?.userId ? {
                            userId: user.userId,
                            userName: user.userName || user.username || 'admin'
                        } : {
                            userId: 1,
                            userName: 'admin'
                        }
                    };
                    console.log('Sending update data:', updatedData);
                    await updateState(updatedData, headers);
                } else {
                    const newData = {
                        stateName: userdata.stateName?.trim() || '',
                        stateCode: userdata.stateCode?.trim().toUpperCase() || '',
                        countryId: parseInt(userdata.countryId, 10),
                        isActive: Boolean(userdata.isActive),
                        insertedBy: user?.userId ? {
                            userId: parseInt(user.userId, 10),
                            userName: user.userName || user.username || 'admin'
                        } : {
                            userId: 1,
                            userName: 'admin'
                        }
                    };
                    console.log('Sending add data:', newData);
                    await addState(newData, headers);
                }
                setUserData({ stateName: '', stateCode: '', countryId: '', isActive: true });
                setErrors({});
                setRefreshTrigger((prev) => !prev);
                handleCloseDialog();
            } catch (error) {
                console.error('Error saving state:', error);
                Swal.fire('Error', 'Failed to save state. Please try again.', 'error');
            }
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!userdata.stateName || userdata.stateName.trim() === '') {
            newErrors.stateName = 'Enter the state name';
        }

        if (!userdata.stateCode || userdata.stateCode.trim() === '') {
            newErrors.stateCode = 'Enter the state code';
        }

        if (!userdata.countryId || userdata.countryId === '') {
            newErrors.countryId = 'Select a country';
        }

        // Additional validation for update mode
        if (editMode && !stateId) {
            newErrors.general = 'State ID is required for update';
        }

        // Validate state code format (2-3 characters, uppercase)
        if (userdata.stateCode && !/^[A-Z]{2,3}$/.test(userdata.stateCode.toUpperCase())) {
            newErrors.stateCode = 'State code must be 2-3 uppercase letters';
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

    const handleAddState = () => {
        setEditMode(false);
        setUserData({
            stateName: '',
            stateCode: '',
            countryId: '',
            isActive: true
        });
        setErrors({});
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        setEditMode(false);
        setUserData({
            stateName: '',
            stateCode: '',
            countryId: '',
            isActive: true
        });
        setErrors({});
        setStateId(null);
    };

    const handleEdit = async (stateId) => {
        setEditMode(true);
        setOpen(true);
        try {
            console.log('Fetching state details for editing, ID:', stateId);
            const res = await getStateById(stateId, headers);
            console.log('Edit state response:', res);
            // Support both possible response shapes
            const responseBody = res?.data?.body ?? res?.data;
            console.log('Response body:', responseBody);
            const det = responseBody?.data || responseBody;

            if (det && det.stateId) {
                console.log('State details for edit:', det);
                const isActiveValue = det.isActive !== undefined ? det.isActive : det.active !== undefined ? det.active : true;
                setStateId(det.stateId);
                setUserData({
                    stateName: det.stateName || '',
                    stateCode: det.stateCode || '',
                    countryId: det.countryId || '',
                    isActive: Boolean(isActiveValue)
                });
            } else {
                Swal.fire('Error', 'Failed to load state details', 'error');
                setOpen(false);
            }
        } catch (error) {
            console.error('Error fetching state details:', error);
            Swal.fire('Error', 'Failed to load state details. Please try again.', 'error');
            setOpen(false);
        }
    };

    const handleActivate = async (stateId) => {
        try {
            await activateState(stateId, headers);
            setRefreshTrigger(prev => !prev);
        } catch (error) {
            console.error('Error activating state:', error);
        }
    };

    const handleDeactivate = async (stateId) => {
        try {
            await deactivateState(stateId, headers);
            setRefreshTrigger(prev => !prev);
        } catch (error) {
            console.error('Error deactivating state:', error);
        }
    };

    const handleDelete = async (stateId) => {
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
                    await deleteState(stateId, headers);
                    setRefreshTrigger((prev) => !prev);
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'State has been deleted.',
                        icon: 'success'
                    });
                } catch (error) {
                    Swal.fire({
                        title: 'Error!',
                        text: 'There was a problem deleting the state.',
                        icon: 'error'
                    });
                    console.error('Error deleting state:', error);
                }
            }
        });
    };
    
    const renderCardView = () => (
        <Grid container spacing={3}>
            {states.length === 0 ? (
                <Grid item xs={12}>
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="h6" color="textSecondary">
                            No states found
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            States array length: {states.length}
                        </Typography>
                    </Box>
                </Grid>
            ) : (
                states.map((state) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={state.stateId}>
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
                                        <LocationOn />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5, color: '#880E4F' }}>
                                            {state.stateName}
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                            <Chip
                                                label={state.stateCode}
                                                size="small"
                                                sx={{
                                                    bgcolor: 'rgba(136, 14, 79, 0.2)',
                                                    color: '#880E4F',
                                                    fontWeight: 'bold',
                                                    fontSize: '0.7rem'
                                                }}
                                            />
                                            <Chip
                                                label={state.isActive}
                                                size="small"
                                                sx={{
                                                    bgcolor:
                                                        state.isActive === 'Active' ? 'rgba(76, 175, 80, 0.9)' : 'rgba(244, 67, 54, 0.9)',
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
                                    {state.stateDescription}
                                </Typography>

                                <Divider sx={{ my: 1, bgcolor: 'rgba(136, 14, 79, 0.2)' }} />

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                    <Typography variant="caption" sx={{ opacity: 0.7, color: '#880E4F' }}>
                                        ID: {state.stateId}
                                    </Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.7, color: '#880E4F' }}>
                                        {state.insertedDate}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="caption" sx={{ opacity: 0.7, color: '#880E4F' }}>
                                        Updated: {state.updatedDate}
                                    </Typography>
                                    <Box>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleEdit(state.stateId)}
                                            sx={{ color: '#880E4F', '&:hover': { bgcolor: 'rgba(136, 14, 79, 0.1)' } }}
                                        >
                                            <Edit fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleDelete(state.stateId)}
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

    const renderListView = () => {
        // Filter columns for mobile view
        const visibleColumns = isMobile 
            ? columns.filter(col => ['stateId', 'stateName', 'stateCode', 'actions'].includes(col.id))
            : isTablet
            ? columns.filter(col => !['insertedDate', 'updatedDate'].includes(col.id))
            : columns;

        return (
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer 
                    sx={{ 
                        maxHeight: 440,
                        overflowX: 'auto',
                        '&::-webkit-scrollbar': {
                            height: '8px',
                        },
                        '&::-webkit-scrollbar-track': {
                            backgroundColor: '#f1f1f1',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: '#888',
                            borderRadius: '4px',
                        },
                        '&::-webkit-scrollbar-thumb:hover': {
                            backgroundColor: '#555',
                        }
                    }}
                >
                    <Table 
                        stickyHeader 
                        aria-label="sticky table"
                        sx={{
                            minWidth: isMobile ? 600 : '100%',
                        }}
                    >
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
                                                textAlign: 'center'
                                            })
                                        }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {states.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={visibleColumns.length} align="center">
                                        <Box sx={{ py: 2 }}>
                                            <div>No states found</div>
                                            <div style={{ fontSize: '12px', color: 'gray' }}>States array length: {states.length}</div>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                states.map((row) => (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.stateId}>
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
                                                {column.id === 'actions' ? (
                                                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                                        <IconButton 
                                                            size={isMobile ? 'small' : 'medium'}
                                                            onClick={() => handleEdit(row.stateId)} 
                                                            style={{ color: '#00afb5' }}
                                                        >
                                                            <Edit fontSize={isMobile ? 'small' : 'medium'} />
                                                        </IconButton>
                                                        <IconButton 
                                                            size={isMobile ? 'small' : 'medium'}
                                                            onClick={() => handleDelete(row.stateId)} 
                                                            color="error"
                                                        >
                                                            <DeleteForever fontSize={isMobile ? 'small' : 'medium'} />
                                                        </IconButton>
                                                        <IconButton 
                                                            size={isMobile ? 'small' : 'medium'}
                                                            onClick={() => row.isActive === 'Active' ? 
                                                                handleDeactivate(row.stateId) : 
                                                                handleActivate(row.stateId)}
                                                            color={row.isActive === 'Active' ? 'warning' : 'success'}
                                                        >
                                                            {row.isActive === 'Active' ? (
                                                                <Cancel fontSize={isMobile ? 'small' : 'medium'} />
                                                            ) : (
                                                                <CheckCircle fontSize={isMobile ? 'small' : 'medium'} />
                                                            )}
                                                        </IconButton>
                                                    </Box>
                                                ) : column.id === 'isActive' ? (
                                                    <Box
                                                        sx={{
                                                            backgroundColor: row[column.id] === 'Active' ? '#4caf50' : '#f44336',
                                                            color: 'white',
                                                            padding: isMobile ? '2px 6px' : '4px 8px',
                                                            borderRadius: '4px',
                                                            fontSize: isMobile ? '10px' : '12px',
                                                            fontWeight: 'bold',
                                                            display: 'inline-block'
                                                        }}
                                                    >
                                                        {row[column.id]}
                                                    </Box>
                                                ) : (
                                                    <Typography 
                                                        variant="body2" 
                                                        sx={{ 
                                                            fontSize: isMobile ? 12 : 14,
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            maxWidth: isMobile ? 120 : 'none'
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
                        '& .MuiTablePagination-toolbar': {
                            flexWrap: 'wrap',
                            gap: 1
                        },
                        '& .MuiTablePagination-selectLabel': {
                            fontSize: isMobile ? 12 : 14
                        },
                        '& .MuiTablePagination-displayedRows': {
                            fontSize: isMobile ? 12 : 14
                        }
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
                                State Management
                            </Typography>
                            <Badge badgeContent={totalCount} color="primary">
                                <LocationOn color="action" />
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
                                sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    fontSize: { xs: '13px', sm: '15px' },
                                    whiteSpace: 'nowrap',
                                    width: { xs: '100%', sm: 'auto' }
                                }}
                                onClick={handleAddState}
                            >
                                {isMobile ? 'Add' : 'Add State'}
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
                disableEscapeKeyDown={false}
                aria-labelledby="state-dialog-title"
                aria-describedby="state-dialog-description"
            >
                <DialogTitle 
                    id="state-dialog-title"
                    sx={{ fontWeight: 'bold', fontSize: '1.25rem', backgroundColor: '#f5f5f5' }}
                >
                    {editMode ? 'Edit State' : 'Add State'}
                </DialogTitle>
                <Box component="form" onSubmit={postData} noValidate sx={{ p: { xs: 2, sm: 3 } }}>
                    {errors.general && (
                        <Box sx={{ mb: 2, p: 1, bgcolor: 'error.light', color: 'error.contrastText', borderRadius: 1 }}>
                            {errors.general}
                        </Box>
                    )}
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="State Name"
                                name="stateName"
                                value={userdata.stateName}
                                onChange={changeHandler}
                                error={!!errors.stateName}
                                helperText={errors.stateName}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="State Code"
                                name="stateCode"
                                value={userdata.stateCode}
                                onChange={changeHandler}
                                error={!!errors.stateCode}
                                helperText={errors.stateCode}
                                placeholder="e.g., CA, NY, TX"
                                inputProps={{
                                    style: { textTransform: 'uppercase' }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth error={!!errors.countryId}>
                                <InputLabel>Country</InputLabel>
                                <Select name="countryId" value={userdata.countryId} onChange={changeHandler} label="Country">
                                    <MenuItem value="">
                                        <em>Select a country</em>
                                    </MenuItem>
                                    {countries.map((country) => (
                                        <MenuItem key={country.countryId} value={country.countryId}>
                                            {country.countryName}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.countryId && (
                                    <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>{errors.countryId}</Box>
                                )}
                            </FormControl>
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
export default State;
