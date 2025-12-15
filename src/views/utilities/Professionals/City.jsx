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
    import MainCard from '../../../ui-component/cards/MainCard';
    import { gridSpacing } from '../../../store/constant';
    import { 
        fetchCities, 
        addCity, 
        deleteCity, 
        getCityById, 
        updateCity,
        getCityCount,
        activateCity,
        deactivateCity,
        getAllCities,
        getActiveCities
    } from '../../professionals API/CityApi';
    import { getAllStates } from '../../professionals API/StateApi';
    import { getAllCountries } from '../../professionals API/CountryApi';
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
    import { DeleteForever, Edit, CheckCircle, Cancel, ViewList, ViewModule, LocationCity } from '@mui/icons-material';
    import Swal from 'sweetalert2';

    const columns = [
        { id: 'cityId', label: 'ID' },
        { id: 'cityName', label: 'City Name', minWidth: 150 },
        { id: 'stateName', label: 'State', minWidth: 120 },
        { id: 'countryName', label: 'Country', minWidth: 120 },
        { id: 'isActive', label: 'Status', align: 'center' },
        { id: 'insertedDate', label: 'Created Date', align: 'right' },
        { id: 'updatedDate', label: 'Updated Date', align: 'right' },
        { id: 'actions', label: 'Actions', align: 'right' }
    ];

    const City = () => {
        const theme = useTheme();
        const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
        const isTablet = useMediaQuery(theme.breakpoints.down('md'));
        const [page, setPage] = useState(0);
        const [rowsPerPage, setRowsPerPage] = useState(10);
        const [cities, setCities] = useState([]);
        const [open, setOpen] = useState(false);
        const [editMode, setEditMode] = useState(false);
        const [viewMode, setViewMode] = useState('list'); // 'list' or 'card'
        const [userdata, setUserData] = useState({
            cityName: '',
            countryId: '',
            stateId: '',
            isActive: true
        });
        const [errors, setErrors] = useState({});
        const [refreshTrigger, setRefreshTrigger] = useState(false);
        const [cityId, setCityId] = useState(null);
        const [totalCount, setTotalCount] = useState(0);
        const [states, setStates] = useState([]);
        const [countries, setCountries] = useState([]);
        const [filteredStates, setFilteredStates] = useState([]);
        const [cityCount, setCityCount] = useState(0);

        const fetchStates = async () => {
            try {
                const res = await getAllStates(headers);
                // Support both possible response shapes
                const responseBody = res?.data?.body ?? res?.data;
                const dataNode = responseBody?.data;
                const fetchedStates = dataNode || [];
                
                if (Array.isArray(fetchedStates)) {
                    setStates(fetchedStates);
                    setFilteredStates(fetchedStates); // Initially show all states
                }
            } catch (error) {
                console.error('Error fetching states:', error);
            }
        };

        const fetchCountries = async () => {
            try {
                const res = await getAllCountries(headers);
                // Support both possible response shapes
                const responseBody = res?.data?.body ?? res?.data;
                const dataNode = responseBody?.data;
                const fetchedCountries = dataNode || [];
                
                if (Array.isArray(fetchedCountries)) {
                    setCountries(fetchedCountries);
                }
            } catch (error) {
                console.error('Error fetching countries:', error);
            }
        };

        const fetchCityCount = async () => {
            try {
                const res = await getCityCount();
                const responseBody = res?.data?.body ?? res?.data;
                const count = responseBody?.data || responseBody || 0;
                
                console.log('City Count Debug:', {
                    responseBody,
                    count,
                    typeOfCount: typeof count
                });
                
                // Ensure count is a number
                const numericCount = typeof count === 'number' ? count : 
                                    typeof count === 'string' ? parseInt(count, 10) || 0 : 0;
                setCityCount(numericCount);
            } catch (error) {
                console.error('Error fetching city count:', error);
                setCityCount(0);
            }
        };

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

                const res = await fetchCities(null, page, rowsPerPage);

                // Support both possible response shapes: { body: { data } } or { data }
                const responseBody = res?.data?.body ?? res?.data;
                const dataNode = responseBody?.data;
                
                // Handle different response structures
                let fetchedData = [];
                let totalCountFromApi = 0;
                
                if (dataNode) {
                    if (Array.isArray(dataNode)) {
                        fetchedData = dataNode;
                        totalCountFromApi = dataNode.length;
                    } else if (dataNode.content && Array.isArray(dataNode.content)) {
                        // Handle paginated response structure
                        fetchedData = dataNode.content;
                        totalCountFromApi = dataNode.totalElements || dataNode.totalCount || dataNode.content.length;
                    } else if (dataNode.cities && Array.isArray(dataNode.cities)) {
                        fetchedData = dataNode.cities;
                        totalCountFromApi = dataNode.totalElements || dataNode.totalCount || dataNode.cities.length;
                    } else if (Array.isArray(dataNode)) {
                        fetchedData = dataNode;
                        totalCountFromApi = dataNode.length;
                    }
                } else if (Array.isArray(responseBody)) {
                    fetchedData = responseBody;
                    totalCountFromApi = responseBody.length;
                }

                console.log('API Response Debug:', {
                    responseBody,
                    dataNode,
                    fetchedData,
                    totalCountFromApi,
                    typeOfTotalCount: typeof totalCountFromApi,
                    paginationInfo: dataNode ? {
                        content: dataNode.content,
                        totalElements: dataNode.totalElements,
                        totalPages: dataNode.totalPages,
                        empty: dataNode.empty,
                        first: dataNode.first,
                        last: dataNode.last
                    } : null,
                    statesCount: states.length,
                    countriesCount: countries.length
                });

                if (fetchedData && Array.isArray(fetchedData)) {
                    const tableData = fetchedData.map((p) => {
                        // Find state name by stateId
                        const state = states.find(s => s.stateId === p.stateId);
                        const stateName = state ? state.stateName : (p.stateName || 'N/A');
                        
                        // Find country name by countryId
                        const country = countries.find(c => c.countryId === p.countryId);
                        const countryName = country ? country.countryName : (p.countryName || 'N/A');
                        
                        return {
                            cityId: p.cityId,
                            cityName: p.cityName || 'N/A',
                            stateName: stateName,
                            countryName: countryName,
                            stateId: p.stateId,
                            countryId: p.countryId,
                            isActive: p.isActive ? 'Active' : 'Inactive',
                            insertedDate: p.insertedDate ? moment(p.insertedDate).format('L') : 'N/A',
                            updatedDate: p.updatedDate ? moment(p.updatedDate).format('L') : 'N/A'
                        };
                    });

                    setCities(tableData);
                    setTotalCount(typeof totalCountFromApi === 'number' ? totalCountFromApi : 0);
                } else {
                    setCities([]);
                    setTotalCount(0);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                Swal.fire('Error', 'Failed to load cities. Please try again.', 'error');
                setCities([]);
                setTotalCount(0);
            }
        };

        useEffect(() => {
            fetchStates();
            fetchCountries();
            fetchCityCount();
        }, []);

        useEffect(() => {
            if (states.length > 0 && countries.length > 0) {
                FetchData();
            }
        }, [refreshTrigger, page, rowsPerPage, states, countries]);

        const postData = async (e) => {
            e.preventDefault();
            const formErrors = validateForm();

            if (Object.keys(formErrors).length > 0) {
                setErrors(formErrors);
            } else {
                try {
                    if (editMode) {
                        if (cityId == null) {
                            console.error('Cannot update: missing cityId');
                            Swal.fire('Error', 'Cannot update: missing city ID', 'error');
                            return;
                        }
                        const updatedData = {
                            cityId: parseInt(cityId),
                            cityName: userdata.cityName?.trim() || '',
                            countryId: parseInt(userdata.countryId),
                            stateId: parseInt(userdata.stateId),
                            isActive: Boolean(userdata.isActive),
                            isDelete: false,
                            updatedBy: {
                                userId: user?.userId ? parseInt(user.userId) : 1,
                                userName: user?.userName || user?.username || 'admin'
                            }
                        };
                        console.log('Update city data:', updatedData);
                        console.log('Sending update data:', updatedData);
                        await updateCity(cityId, updatedData);
                        Swal.fire('Success', 'City updated successfully!', 'success');
                    } else {
                        const newData = {
                            cityName: userdata.cityName?.trim() || '',
                            countryId: parseInt(userdata.countryId),
                            stateId: parseInt(userdata.stateId),
                            isActive: Boolean(userdata.isActive),
                            isDelete: false,
                            insertedBy: {
                                userId: user?.userId ? parseInt(user.userId) : 1,
                                userName: user?.userName || user?.username || 'admin'
                            }
                        };
                        console.log('Add city data:', newData);
                        console.log('Sending add data:', newData);
                        await addCity(newData);
                        Swal.fire('Success', 'City added successfully!', 'success');
                    }
                    setUserData({ cityName: '', countryId: '', stateId: '', isActive: true });
                    setErrors({});
                    setOpen(false);
                    // Force refresh by updating the trigger and resetting page
                    setTimeout(() => {
                        setRefreshTrigger((prev) => !prev);
                        setPage(0); // Reset to first page to see new data
                    }, 100); // Small delay to ensure API call completes
                } catch (error) {
                    console.error('Error saving city:', error);
                    // Prefer server-provided message when available
                    const serverMsg = error?.response?.data?.message || error?.response?.data?.error ||
                        (error?.response?.data ? JSON.stringify(error.response.data) : null);
                    const errMsg = serverMsg || error?.message || 'Failed to save city. Please try again.';
                    Swal.fire('Error', errMsg, 'error');
                }
            }
        };

        const validateForm = () => {
            const newErrors = {};

            if (!userdata.cityName || userdata.cityName.trim() === '') {
                newErrors.cityName = 'Enter the city name';
            }

            if (!userdata.countryId || userdata.countryId === '') {
                newErrors.countryId = 'Select a country';
            }

            if (!userdata.stateId || userdata.stateId === '') {
                newErrors.stateId = 'Select a state';
            }

            // Additional validation for update mode
            if (editMode && !cityId) {
                newErrors.general = 'City ID is required for update';
            }

            return newErrors;
        };

        const changeHandler = (e) => {
            const { name, value, checked } = e.target;

            if (name === 'countryId') {
                // When country changes, reset state and filter states
                setUserData({
                    ...userdata,
                    countryId: value,
                    stateId: '' // Reset state when country changes
                });

                // Filter states based on selected country
                if (value) {
                    const filtered = states.filter((state) => state.countryId === parseInt(value));
                    setFilteredStates(filtered);
                } else {
                    setFilteredStates([]);
                }
            } else {
                setUserData({
                    ...userdata,
                    [name]: name === 'isActive' ? checked : value
                });
            }

            setErrors({
                ...errors,
                [name]: null
            });
        };

        const handleAddCity = () => {
            setEditMode(false);
            setUserData({
                cityName: '',
                countryId: '',
                stateId: '',
                isActive: true
            });
            setErrors({});
            setOpen(true);
        };

        const handleCloseDialog = () => {
            setOpen(false);
            setEditMode(false);
            setUserData({
                cityName: '',
                countryId: '',
                stateId: '',
                isActive: true
            });
            setErrors({});
            setCityId(null);
        };

        const handleEdit = async (cityId) => {
            setEditMode(true);
            setOpen(true);
            try {
                const res = await getCityById(cityId);
                // Support both possible response shapes
                const responseBody = res?.data?.body ?? res?.data;
                const det = responseBody?.data || responseBody;

                if (det && det.cityId) {
                    setCityId(det.cityId);
                    setUserData({
                        cityName: det.cityName || '',
                        countryId: det.countryId || '',
                        stateId: det.stateId || '',
                        isActive: Boolean(det.isActive)
                    });
                    
                    // Filter states based on the city's country
                    if (det.countryId) {
                        const filtered = states.filter((state) => state.countryId === parseInt(det.countryId));
                        setFilteredStates(filtered);
                    }
                } else {
                    Swal.fire('Error', 'Failed to load city details', 'error');
                    setOpen(false);
                }
            } catch (error) {
                console.error('Error fetching city details:', error);
                Swal.fire('Error', 'Failed to load city details. Please try again.', 'error');
                setOpen(false);
            }
        };

        const handleDelete = async (cityId) => {
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
                        await deleteCity(cityId);
                        setRefreshTrigger((prev) => !prev);
                        Swal.fire({
                            title: 'Deleted!',
                            text: 'City has been deleted.',
                            icon: 'success'
                        });
                    } catch (error) {
                        Swal.fire({
                            title: 'Error!',
                            text: 'There was a problem deleting the city.',
                            icon: 'error'
                        });
                        console.error('Error deleting city:', error);
                    }
                }
            });
        };



        const renderCardView = () => (
            <Grid container spacing={3}>
                {cities.length === 0 ? (
                    <Grid item xs={12}>
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Typography variant="h6" color="textSecondary">
                                No cities found
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Total cities: {totalCount} | Current page: {page + 1}
                            </Typography>
                        </Box>
                    </Grid>
                ) : (
                    cities.map((city) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={city.cityId}>
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
                                            <LocationCity />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5, color: '#880E4F' }}>
                                                {city.cityName}
                                            </Typography>
                                            <Chip
                                                label={city.isActive}
                                                size="small"
                                                sx={{
                                                    bgcolor: city.isActive === 'Active' ? 'rgba(76, 175, 80, 0.9)' : 'rgba(244, 67, 54, 0.9)',
                                                    color: 'white',
                                                    fontWeight: 'bold'
                                                }}
                                            />
                                        </Box>
                                    </Box>

                                    <Box sx={{ mb: 2 }}>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                opacity: 0.8,
                                                color: '#880E4F',
                                                mb: 1,
                                                fontWeight: 'medium'
                                            }}
                                        >
                                            📍 {city.stateName}, {city.countryName}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                opacity: 0.7,
                                                color: '#880E4F',
                                                fontSize: '0.75rem'
                                            }}
                                        >
                                            {city.cityDescription || 'No description available'}
                                        </Typography>
                                    </Box>

                                    <Divider sx={{ my: 1, bgcolor: 'rgba(136, 14, 79, 0.2)' }} />

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                        <Typography variant="caption" sx={{ opacity: 0.7, color: '#880E4F' }}>
                                            ID: {city.cityId}
                                        </Typography>
                                        <Typography variant="caption" sx={{ opacity: 0.7, color: '#880E4F' }}>
                                            {city.insertedDate}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="caption" sx={{ opacity: 0.7, color: '#880E4F' }}>
                                            Updated: {city.updatedDate}
                                        </Typography>
                                        <Box>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleEdit(city.cityId)}
                                                sx={{ color: '#880E4F', '&:hover': { bgcolor: 'rgba(136, 14, 79, 0.1)' } }}
                                            >
                                                <Edit fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDelete(city.cityId)}
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
            const visibleColumns = isMobile 
                ? columns.filter(col => ['cityId', 'cityName', 'stateName', 'actions'].includes(col.id))
                : isTablet
                ? columns.filter(col => !['insertedDate', 'updatedDate'].includes(col.id))
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
                                {cities.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={visibleColumns.length} align="center">
                                            <Box sx={{ py: 2 }}>
                                                <div>No cities found</div>
                                                <div style={{ fontSize: '12px', color: 'gray' }}>
                                                    Total cities: {totalCount} | Current page: {page + 1}
                                                </div>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    cities.map((row) => (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.cityId}>
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
                                                                onClick={() => handleEdit(row.cityId)} 
                                                                style={{ color: '#00afb5' }}
                                                            >
                                                                <Edit fontSize={isMobile ? 'small' : 'medium'} />
                                                            </IconButton>
                                                            <IconButton 
                                                                size={isMobile ? 'small' : 'medium'}
                                                                onClick={() => handleDelete(row.cityId)} 
                                                                color="error"
                                                            >
                                                                <DeleteForever fontSize={isMobile ? 'small' : 'medium'} />
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
                                    City Management
                                </Typography>
                                <Badge badgeContent={typeof cityCount === 'number' ? cityCount : 0} color="primary">
                                    <LocationCity color="action" />
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
                                    onClick={handleAddCity}
                                >
                                    {isMobile ? 'Add' : 'Add City'}
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
                    onClose={() => setOpen(false)} 
                    fullWidth 
                    maxWidth={isMobile ? 'xs' : 'md'}
                    fullScreen={isMobile}
                >
                    <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.25rem', backgroundColor: '#f5f5f5' }}>
                        {editMode ? 'Edit City' : 'Add City'}
                    </DialogTitle>
                    <Box component="form" onSubmit={postData} noValidate sx={{ p: { xs: 2, sm: 3 } }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="City Name"
                                    name="cityName"
                                    value={userdata.cityName}
                                    onChange={changeHandler}
                                    error={!!errors.cityName}
                                    helperText={errors.cityName}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
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
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth error={!!errors.stateId}>
                                    <InputLabel>State</InputLabel>
                                    <Select
                                        name="stateId"
                                        value={userdata.stateId}
                                        onChange={changeHandler}
                                        label="State"
                                        disabled={!userdata.countryId}
                                    >
                                        <MenuItem value="">
                                            <em>Select a state</em>
                                        </MenuItem>
                                        {filteredStates.map((state) => (
                                            <MenuItem key={state.stateId} value={state.stateId}>
                                                {state.stateName}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.stateId && <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>{errors.stateId}</Box>}
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
                            <Button onClick={() => setOpen(false)} style={{ color: '#00afb5' }}>
                                Cancel
                            </Button>
                        </DialogActions>
                    </Box>
                </Dialog>
            </Box>
        );
    };
    export default City;
