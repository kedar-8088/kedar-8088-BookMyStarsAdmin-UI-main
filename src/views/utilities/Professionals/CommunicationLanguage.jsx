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
    getCommunicationLanguageCount
} from 'views/API/CommunicationLanguageApi';
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
import { DeleteForever, Edit, CheckCircle, Cancel, ViewList, ViewModule, Language } from '@mui/icons-material';
import Swal from 'sweetalert2';

const columns = [
    { id: 'languageId', label: 'ID' },
    { id: 'languageName', label: 'Language Name', minWidth: 150 },
    { id: 'languageCode', label: 'Language Code', minWidth: 120 },
    { id: 'isActive', label: 'Status', align: 'center' },
    { id: 'insertedDate', label: 'Created Date', align: 'right' },
    { id: 'updatedDate', label: 'Updated Date', align: 'right' },
    { id: 'actions', label: 'Actions', align: 'right' }
];

const CommunicationLanguage = () => {
    const theme = useTheme();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [languages, setLanguages] = useState([]);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'card'
    const [userdata, setUserData] = useState({
        languageName: '',
        languageCode: '',
        isActive: true
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

            let res;
            try {
                res = await fetchCommunicationLanguages(headers, page, rowsPerPage);
            } catch (apiError) {
                console.error('API Error:', apiError);
                // Try alternative API call
                try {
                    console.log('Trying alternative API call...');
                    res = await getAllCommunicationLanguages(headers);
                } catch (altError) {
                    console.error('Alternative API also failed:', altError);
                    throw apiError; // Throw original error
                }
            }

            // If API returned normalized shape { items, total, raw }, prefer that
            if (res && res.items !== undefined) {
                console.log('Language API normalized response received:', { items: res.items, total: res.total });
            }

            // Debug API response (legacy/raw)
            console.log('Language API Response Debug:', {
                status: res?.raw?.status ?? res?.status,
                statusText: res?.raw?.statusText ?? res?.statusText,
                fullResponse: res?.raw ?? res,
                data: res?.raw?.data ?? res?.data,
                body: (res?.raw?.data ?? res?.data)?.body,
                responseBody: (res?.raw?.data ?? res?.data)?.body ?? (res?.raw?.data ?? res?.data),
                page,
                rowsPerPage,
                url: res?.raw?.config?.url ?? res?.config?.url
            });

            // Support both possible response shapes: normalized {items,total} OR axios response { data: { data: ... } }
            const responseBody = (res && res.items !== undefined) ? { data: { content: res.items, totalElements: res.total } } : (res?.raw?.data?.body ?? res?.data?.body ?? res?.raw?.data ?? res?.data);
            const dataNode = (res && res.items !== undefined) ? responseBody.data : responseBody?.data;
            
            // Handle different response structures
            let fetchedData = [];
            let totalCountFromApi = 0;
            
            console.log('Data extraction debug:', {
                dataNode,
                isArray: Array.isArray(dataNode),
                responseBody,
                isResponseArray: Array.isArray(responseBody)
            });
            
            if (dataNode) {
                if (Array.isArray(dataNode)) {
                    fetchedData = dataNode;
                    totalCountFromApi = dataNode.length;
                } else if (dataNode.content && Array.isArray(dataNode.content)) {
                    fetchedData = dataNode.content;
                    totalCountFromApi = dataNode.totalElements || dataNode.totalCount || dataNode.content.length;
                } else if (dataNode.languages && Array.isArray(dataNode.languages)) {
                    fetchedData = dataNode.languages;
                    totalCountFromApi = dataNode.totalElements || dataNode.totalCount || dataNode.languages.length;
                } else if (dataNode.languageList && Array.isArray(dataNode.languageList)) {
                    fetchedData = dataNode.languageList;
                    totalCountFromApi = dataNode.totalElements || dataNode.totalCount || dataNode.languageList.length;
                } else if (Array.isArray(dataNode)) {
                    fetchedData = dataNode;
                    totalCountFromApi = dataNode.length;
                }
            } else if (Array.isArray(responseBody)) {
                fetchedData = responseBody;
                totalCountFromApi = responseBody.length;
            } else if (responseBody && Array.isArray(responseBody)) {
                fetchedData = responseBody;
                totalCountFromApi = responseBody.length;
            }

            console.log('Final fetchedData:', {
                fetchedData,
                length: fetchedData?.length,
                isArray: Array.isArray(fetchedData),
                firstItem: fetchedData?.[0]
            });

            if (fetchedData && Array.isArray(fetchedData)) {
                // Debug individual language objects
                console.log('Language Objects Debug:', {
                    fetchedData: fetchedData.slice(0, 2), // Show first 2 items
                    firstItemKeys: fetchedData.length > 0 ? Object.keys(fetchedData[0]) : []
                });

                const tableData = fetchedData.map((p, index) => {
                    // Debug each individual language object
                    console.log(`Language Object ${index}:`, {
                        original: p,
                        keys: Object.keys(p),
                        languageCode: p.languageCode,
                        language_code: p.language_code,
                        code: p.code,
                        langCode: p.langCode,
                        languageCodeValue: p.languageCode,
                        allValues: Object.values(p)
                    });

                    // Try to find the language code field dynamically
                    let languageCodeValue = 'N/A';
                    const possibleCodeFields = ['languageCode', 'language_code', 'code', 'langCode', 'lang_code', 'languageCodeValue', 'lang', 'isoCode', 'iso_code'];
                    
                    // First, let's see all available fields and their values
                    console.log('All fields and values:', Object.entries(p));
                    
                    for (const field of possibleCodeFields) {
                        if (p[field] && p[field] !== '' && p[field] !== null && p[field] !== undefined) {
                            languageCodeValue = p[field];
                            console.log(`Found language code in field '${field}':`, languageCodeValue);
                            break;
                        }
                    }
                    
                    // If still N/A, let's check if there's any field that looks like a code
                    if (languageCodeValue === 'N/A') {
                        for (const [key, value] of Object.entries(p)) {
                            if (typeof value === 'string' && value.length <= 5 && /^[a-zA-Z]+$/.test(value)) {
                                console.log(`Potential language code found in field '${key}':`, value);
                                languageCodeValue = value;
                                break;
                            }
                        }
                    }

                    // Handle isActive field similar to other components
                    const isActiveValue = p.isActive !== undefined ? p.isActive : p.active !== undefined ? p.active : true;
                    console.log(`Communication Language ${p.languageName} - isActive field: ${p.isActive}, active field: ${p.active}, final value: ${isActiveValue}`);
                    
                    return {
                        languageId: p.languageId,
                        languageName: p.languageName || 'N/A',
                        languageCode: languageCodeValue,
                        isActive: isActiveValue ? 'Active' : 'Inactive',
                        insertedDate: p.insertedDate ? moment(p.insertedDate).format('L') : 'N/A',
                        updatedDate: p.updatedDate ? moment(p.updatedDate).format('L') : 'N/A'
                    };
                });

                setLanguages(tableData);
                setTotalCount(typeof totalCountFromApi === 'number' ? totalCountFromApi : 0);
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
            const responseBody = res?.data?.body ?? res?.data;
            const count = responseBody?.data || responseBody || 0;
            
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
                        languageCode: userdata.languageCode?.trim() || '',
                        isActive: Boolean(userdata.isActive)
                    };
                    console.log('Update Data Debug:', {
                        updatedData,
                        languageId,
                        editMode,
                        userdata
                    });
                    await updateCommunicationLanguage(updatedData, headers);
                } else {
                    const newData = {
                        languageName: userdata.languageName?.trim() || '',
                        languageCode: userdata.languageCode?.trim() || '',
                        isActive: Boolean(userdata.isActive)
                    };
                    console.log('Add Data Debug:', {
                        newData,
                        userdata
                    });
                    await addCommunicationLanguage(newData, headers);
                }
                setUserData({ languageName: '', languageCode: '', isActive: true });
                setRefreshTrigger((prev) => !prev);
                setOpen(false);
            } catch (error) {
                console.error('Error saving communication language:', error);
                // Try to show server-provided validation message if present
                const serverData = error?.response?.data;
                let serverMessage = 'Failed to save language. Please try again.';
                if (serverData) {
                    serverMessage = serverData?.message || serverData?.error || serverData?.body?.message || serverData?.body?.error || serverMessage;
                }
                Swal.fire('Error', serverMessage, 'error');
            }
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!userdata.languageName || userdata.languageName.trim() === '') {
            newErrors.languageName = 'Enter the language name';
        }

        if (!userdata.languageCode || userdata.languageCode.trim() === '') {
            newErrors.languageCode = 'Enter the language code';
        }

        // Validate language code format (2-3 characters, lowercase)
        if (userdata.languageCode && !/^[a-z]{2,3}$/.test(userdata.languageCode.toLowerCase())) {
            newErrors.languageCode = 'Language code must be 2-3 lowercase letters';
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


    const handleAddLanguage = () => {
        setEditMode(false);
        setUserData({
            languageName: '',
            languageCode: '',
            isActive: true
        });
        setErrors({});
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        setEditMode(false);
        setUserData({
            languageName: '',
            languageCode: '',
            isActive: true
        });
        setErrors({});
        setLanguageId(null);
    };

    const handleEdit = async (languageId) => {
        setEditMode(true);
        setOpen(true);
        try {
            const res = await getCommunicationLanguageById(languageId, headers);
            // Support both possible response shapes: { body: { data } } or { data }
            const responseBody = res?.data?.body ?? res?.data;
            const det = responseBody?.data || responseBody;

            if (det && det.languageId) {
                console.log('Communication Language details for edit:', det);
                const isActiveValue = det.isActive !== undefined ? det.isActive : det.active !== undefined ? det.active : true;
                setLanguageId(det.languageId);
                setUserData({
                    languageName: det.languageName || '',
                    languageCode: det.languageCode || '',
                    isActive: Boolean(isActiveValue)
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
                                                label={language.languageCode}
                                                size="small"
                                                sx={{
                                                    bgcolor: 'rgba(136, 14, 79, 0.2)',
                                                    color: '#880E4F',
                                                    fontWeight: 'bold',
                                                    fontSize: '0.7rem'
                                                }}
                                            />
                                            <Chip
                                                label={language.isActive}
                                                size="small"
                                                sx={{
                                                    bgcolor:
                                                        language.isActive === 'Active'
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
                        {languages.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} align="center">
                                    <Box sx={{ py: 2 }}>
                                        <div>No communication languages found</div>
                                        <div style={{ fontSize: '12px', color: 'gray' }}>Languages array length: {languages.length}</div>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ) : (
                            languages.map((row) => (
                                <TableRow hover role="checkbox" tabIndex={-1} key={row.languageId}>
                                    {columns.map((column) => (
                                        <TableCell key={column.id} align={column.align}>
                                            {column.id === 'actions' ? (
                                                <>
                                                    <IconButton onClick={() => handleEdit(row.languageId)} style={{ color: '#00afb5' }}>
                                                        <Edit />
                                                    </IconButton>
                                                    <IconButton onClick={() => handleDelete(row.languageId)} color="error">
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
                                            ) : column.id === 'languageCode' ? (
                                                <Box
                                                    sx={{
                                                        backgroundColor: '#e3f2fd',
                                                        color: '#1976d2',
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
                            <span>Communication Language Management</span>
                            <Badge badgeContent={typeof languageCount === 'number' ? languageCount : 0} color="primary">
                                <Language color="action" />
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
                                onClick={handleAddLanguage}
                            >
                                Add Language
                                <AddIcon sx={{ color: '#fff' }} />
                            </Button>
                        </Box>
                    </Box>
                }
            >
                <Grid container spacing={gridSpacing}></Grid>
                {viewMode === 'card' ? renderCardView() : renderListView()}
            </MainCard>
            <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="md">
                <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.25rem', backgroundColor: '#f5f5f5' }}>
                    {editMode ? 'Edit Communication Language' : 'Add Communication Language'}
                </DialogTitle>
                <Box component="form" onSubmit={postData} noValidate sx={{ p: 3 }}>
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
                                label="Language Code"
                                name="languageCode"
                                value={userdata.languageCode}
                                onChange={changeHandler}
                                error={!!errors.languageCode}
                                helperText={errors.languageCode}
                                placeholder="e.g., en, es, fr"
                                inputProps={{
                                    style: { textTransform: 'lowercase' }
                                }}
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

export default CommunicationLanguage;
