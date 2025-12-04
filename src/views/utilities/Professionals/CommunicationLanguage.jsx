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
    fetchCommunicationLanguages,
    addCommunicationLanguage,
    deleteCommunicationLanguage,
    getCommunicationLanguageById,
    updateCommunicationLanguage,
    getCommunicationLanguageCount,
    getAllCommunicationLanguages,
    checkLanguageExists
} from 'views/professionals API/CommunicationLanguageApi';
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
    Badge,
    useMediaQuery
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DeleteForever, Edit, CheckCircle, Cancel, ViewList, ViewModule, Language } from '@mui/icons-material';
import Swal from 'sweetalert2';

const columns = [
    { id: 'languageId', label: 'ID' },
    { id: 'languageName', label: 'Language Name', minWidth: 150 },
    { id: 'languageDescription', label: 'Description', minWidth: 200 },
    { id: 'isDelete', label: 'Status', align: 'center' },
    { id: 'insertedDate', label: 'Created Date', align: 'right' },
    { id: 'updatedDate', label: 'Updated Date', align: 'right' },
    { id: 'actions', label: 'Actions', align: 'right' }
];

const CommunicationLanguage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [languages, setLanguages] = useState([]);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'card'
    const [userdata, setUserData] = useState({
        languageName: '',
        languageDescription: '',
        isDelete: false
    });
    const [errors, setErrors] = useState({});
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [languageId, setLanguageId] = useState(null);
    const [totalCount, setTotalCount] = useState(0);
    const [languageCount, setLanguageCount] = useState(0);

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

            const res = await fetchCommunicationLanguages(headers, page, rowsPerPage);
            
            // API now returns normalized response: { items, total, raw }
            const fetchedData = res.items || [];
            const totalCountFromApi = res.total || 0;

            console.log('Language API Response:', {
                items: fetchedData,
                total: totalCountFromApi,
                page,
                rowsPerPage
            });

            if (fetchedData && Array.isArray(fetchedData)) {
                const tableData = fetchedData.map((p) => {
                    // Handle isDelete field - if isDelete is true, status is "Deleted", otherwise "Active"
                    const isDeleteValue = p.isDelete !== undefined ? p.isDelete : false;
                    
                    return {
                        languageId: p.languageId,
                        languageName: p.languageName || 'N/A',
                        languageDescription: p.languageDescription || 'N/A',
                        isDelete: isDeleteValue ? 'Inactive' : 'Active',
                        insertedDate: p.insertedDate ? moment(p.insertedDate).format('L') : 'N/A',
                        updatedDate: p.updatedDate ? moment(p.updatedDate).format('L') : 'N/A'
                    };
                });

                setLanguages(tableData);
                setTotalCount(totalCountFromApi);
            } else {
                setLanguages([]);
                setTotalCount(0);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                statusText: error.response?.statusText
            });
            Swal.fire('Error', 'Failed to load languages. Please try again.', 'error');
            setLanguages([]);
            setTotalCount(0);
        }
    };

    const fetchLanguageCount = async () => {
        try {
            const res = await getCommunicationLanguageCount(headers);
            // API now returns normalized response with count property
            const count = res.count ?? 0;
            
            // Ensure count is a number
            const numericCount = typeof count === 'number' ? count : 
                                typeof count === 'string' ? parseInt(count, 10) || 0 : 0;
            setLanguageCount(numericCount);
        } catch (error) {
            console.error('Error fetching language count:', error);
            setLanguageCount(0);
        }
    };

    useEffect(() => {
        FetchData();
        fetchLanguageCount();
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
                        languageId: languageId,
                        languageName: userdata.languageName?.trim() || '',
                        languageDescription: userdata.languageDescription?.trim() || '',
                        isDelete: Boolean(userdata.isDelete),
                        updatedBy: {
                            userId: user?.userId || 1,
                            userName: user?.userName || user?.username || 'admin'
                        }
                    };
                    console.log('Update Data Debug:', {
                        updatedData,
                        languageId,
                        editMode,
                        userdata
                    });
                    const updateResult = await updateCommunicationLanguage(updatedData, headers);
                    
                    if (updateResult.success) {
                        console.log('Language updated successfully:', updateResult.message);
                        Swal.fire('Success', updateResult.message, 'success');
                    } else {
                        throw new Error(updateResult.message || 'Update operation failed');
                    }
                } else {
                    // Debug user information
                    console.log('User from sessionStorage:', user);
                    console.log('User userId:', user?.userId);
                    console.log('User userName:', user?.userName);
                    console.log('User username:', user?.username);
                    
                    // Check if language already exists before creating
                    const languageName = userdata.languageName?.trim();
                    if (languageName) {
                        try {
                            const exists = await checkLanguageExists(languageName, headers);
                            if (exists) {
                                Swal.fire('Error', `Language "${languageName}" already exists. Please choose a different name.`, 'error');
                                return;
                            }
                        } catch (error) {
                            console.log('Language existence check failed, proceeding with creation:', error.message);
                            // Continue with creation if check fails
                        }
                    }
                    
                    // Minimal payload to avoid backend constraint violations
                    const newData = {
                        languageName: languageName || '',
                        languageDescription: userdata.languageDescription?.trim() || '',
                        // Backend enforces FK on created_by; send numeric user id if available
                        createdBy: typeof user?.userId === 'number' ? user.userId : parseInt(user?.userId, 10) || 1
                    };
                    console.log('Add Data Debug:', {
                        newData,
                        userdata,
                        userInfo: user
                    });
                    const addResult = await addCommunicationLanguage(newData, headers);
                    
                    if (addResult.success) {
                        console.log('Language added successfully:', addResult.message);
                        Swal.fire('Success', addResult.message, 'success');
                    } else {
                        throw new Error(addResult.message || 'Add operation failed');
                    }
                }
                setUserData({ languageName: '', languageDescription: '', isDelete: false });
                setRefreshTrigger((prev) => !prev);
                setOpen(false);
            } catch (error) {
                console.error('Error saving communication language:', error);
                
                // Handle specific error cases matching Java controller responses
                const serverData = error?.response?.data;
                let serverMessage = 'Failed to save language. Please try again.';
                
                if (serverData) {
                    // Handle ClientResponseBean error structure: { code, status, message, error, data }
                    serverMessage = serverData?.message || serverData?.error || serverMessage;
                    
                    // Handle specific error cases from Java controller
                    if (serverData?.message?.includes('Language name is required')) {
                        serverMessage = 'Language name is required and cannot be empty';
                    } else if (serverData?.message?.includes('already exists')) {
                        serverMessage = 'Language with this name already exists';
                    } else if (serverData?.message?.includes('constraint violation')) {
                        serverMessage = 'Invalid data provided - constraint violation';
                    } else if (serverData?.message?.includes('authentication required')) {
                        serverMessage = 'User authentication required - please login and try again';
                    } else if (serverData?.message?.includes('Invalid data provided')) {
                        serverMessage = serverData.message;
                    }
                }
                // Surface duplicate gracefully if 409 without message details
                if (error?.response?.status === 409 && (!serverMessage || serverMessage === 'Failed to save language. Please try again.')) {
                    serverMessage = 'Language already exists or violates a unique constraint.';
                }
                
                Swal.fire('Error', serverMessage, 'error');
            }
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Match Java controller validation: Language name is required and cannot be empty
        if (!userdata.languageName || userdata.languageName.trim() === '') {
            newErrors.languageName = 'Language name is required and cannot be empty';
        }

        // Additional validation for language name length and format (max 100 chars as per model)
        if (userdata.languageName && userdata.languageName.trim().length < 2) {
            newErrors.languageName = 'Language name must be at least 2 characters long';
        }

        if (userdata.languageName && userdata.languageName.trim().length > 100) {
            newErrors.languageName = 'Language name must be less than 100 characters';
        }

        // Language description validation (max 500 chars as per model)
        if (userdata.languageDescription && userdata.languageDescription.trim().length > 500) {
            newErrors.languageDescription = 'Language description must be less than 500 characters';
        }

        return newErrors;
    };

    const changeHandler = (e) => {
        const { name, value, checked } = e.target;
        if (name === 'isActive') {
            setUserData({
                ...userdata,
                isDelete: !checked
            });
        } else {
            setUserData({
                ...userdata,
                [name]: name === 'isDelete' ? checked : value
            });
        }

        setErrors({
            ...errors,
            [name]: null
        });
    };


    const handleAddLanguage = () => {
        setEditMode(false);
        setUserData({
            languageName: '',
            languageDescription: '',
            isDelete: false
        });
        setErrors({});
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        setEditMode(false);
        setUserData({
            languageName: '',
            languageDescription: '',
            isDelete: false
        });
        setErrors({});
        setLanguageId(null);
    };

    const handleEdit = async (languageId) => {
        setEditMode(true);
        setOpen(true);
        try {
            const res = await getCommunicationLanguageById(languageId, headers);
            // Handle updated API response structure: { language, ... }
            const det = res.language || res?.data?.data || res?.data;

            if (det && det.languageId) {
                console.log('Communication Language details for edit:', det);
                const isDeleteValue = det.isDelete !== undefined ? det.isDelete : false;
                setLanguageId(det.languageId);
                setUserData({
                    languageName: det.languageName || '',
                    languageDescription: det.languageDescription || '',
                    isDelete: Boolean(isDeleteValue)
                });
            } else {
                Swal.fire('Error', 'Failed to load language details', 'error');
                setOpen(false);
            }
        } catch (error) {
            console.error('Error fetching communication language details:', error);
            Swal.fire('Error', 'Failed to load language details. Please try again.', 'error');
            setOpen(false);
        }
    };

    const handleDelete = async (languageId) => {
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
                    await deleteCommunicationLanguage(languageId, headers);
                    setRefreshTrigger((prev) => !prev);
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'Communication language has been deleted.',
                        icon: 'success'
                    });
                } catch (error) {
                    Swal.fire({
                        title: 'Error!',
                        text: 'There was a problem deleting the communication language.',
                        icon: 'error'
                    });
                    console.error('Error deleting communication language:', error);
                }
            }
        });
    };

    const renderCardView = () => (
        <Grid container spacing={3}>
            {languages.length === 0 ? (
                <Grid item xs={12}>
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="h6" color="textSecondary">
                            No communication languages found
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Languages array length: {languages.length}
                        </Typography>
                    </Box>
                </Grid>
            ) : (
                languages.map((language) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={language.languageId}>
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
                                        <Language />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5, color: '#880E4F' }}>
                                            {language.languageName}
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                            <Chip
                                                label={language.isDelete}
                                                size="small"
                                                sx={{
                                                    bgcolor:
                                                        language.isDelete === 'Active'
                                                            ? 'rgba(76, 175, 80, 0.9)'
                                                            : 'rgba(244, 67, 54, 0.9)',
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
                                    {language.languageDescription}
                                </Typography>

                                <Divider sx={{ my: 1, bgcolor: 'rgba(136, 14, 79, 0.2)' }} />

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                    <Typography variant="caption" sx={{ opacity: 0.7, color: '#880E4F' }}>
                                        ID: {language.languageId}
                                    </Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.7, color: '#880E4F' }}>
                                        {language.insertedDate}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="caption" sx={{ opacity: 0.7, color: '#880E4F' }}>
                                        Updated: {language.updatedDate}
                                    </Typography>
                                    <Box>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleEdit(language.languageId)}
                                            sx={{ color: '#880E4F', '&:hover': { bgcolor: 'rgba(136, 14, 79, 0.1)' } }}
                                        >
                                            <Edit fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleDelete(language.languageId)}
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
            ? columns.filter(col => ['languageId', 'languageName', 'actions'].includes(col.id))
            : isTablet
            ? columns.filter(col => !['insertedDate', 'updatedDate', 'languageDescription'].includes(col.id))
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
                            {languages.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={visibleColumns.length} align="center">
                                        <Box sx={{ py: 2 }}>
                                            <div>No communication languages found</div>
                                            <div style={{ fontSize: '12px', color: 'gray' }}>Languages array length: {languages.length}</div>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                languages.map((row) => (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.languageId}>
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
                                                            onClick={() => handleEdit(row.languageId)} 
                                                            style={{ color: '#00afb5' }}
                                                        >
                                                            <Edit fontSize={isMobile ? 'small' : 'medium'} />
                                                        </IconButton>
                                                        <IconButton 
                                                            size={isMobile ? 'small' : 'medium'}
                                                            onClick={() => handleDelete(row.languageId)} 
                                                            color="error"
                                                        >
                                                            <DeleteForever fontSize={isMobile ? 'small' : 'medium'} />
                                                        </IconButton>
                                                    </Box>
                                                ) : column.id === 'isDelete' ? (
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
                                                ) : column.id === 'languageDescription' ? (
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            backgroundColor: '#f5f5f5',
                                                            color: '#333',
                                                            padding: isMobile ? '2px 4px' : '4px 8px',
                                                            borderRadius: '4px',
                                                            fontSize: isMobile ? '10px' : '12px',
                                                            maxWidth: isMobile ? 120 : 200,
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap',
                                                            display: 'inline-block'
                                                        }}
                                                        title={row[column.id]}
                                                    >
                                                        {row[column.id]}
                                                    </Typography>
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
                                Communication Language Management
                            </Typography>
                            <Badge badgeContent={typeof languageCount === 'number' ? languageCount : 0} color="primary">
                                <Language color="action" />
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
                                onClick={handleAddLanguage}
                            >
                                {isMobile ? 'Add' : 'Add Language'}
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
                disableEnforceFocus 
                disableRestoreFocus
            >
                <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.25rem', backgroundColor: '#f5f5f5' }}>
                    {editMode ? 'Edit Communication Language' : 'Add Communication Language'}
                </DialogTitle>
                <Box component="form" onSubmit={postData} noValidate sx={{ p: { xs: 2, sm: 3 } }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Language Name"
                                name="languageName"
                                value={userdata.languageName}
                                onChange={changeHandler}
                                error={!!errors.languageName}
                                helperText={errors.languageName}
                                placeholder="e.g., English, Spanish, French"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Language Description"
                                name="languageDescription"
                                value={userdata.languageDescription}
                                onChange={changeHandler}
                                error={!!errors.languageDescription}
                                helperText={errors.languageDescription}
                                placeholder="Enter language description"
                                multiline
                                rows={3}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={<Switch checked={!userdata.isDelete} onChange={changeHandler} name="isActive" color="primary" />}
                                label="Is Active"
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

export default CommunicationLanguage;
