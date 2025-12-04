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
import { fetchEyeColors, addEyeColor, deleteEyeColor, getEyeColorById, updateEyeColor, getEyeColorCount } from 'views/professionals API/EyeColorApi';
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
import { DeleteForever, Edit, CheckCircle, Cancel, ViewList, ViewModule, Visibility } from '@mui/icons-material';
import Swal from 'sweetalert2';

const columns = [
    { id: 'eyeColorId', label: 'ID' },
    { id: 'eyeColorName', label: 'Eye Color Name', minWidth: 150 },
    { id: 'eyeColorDescription', label: 'Description', minWidth: 200 },
    { id: 'isActive', label: 'Status', align: 'center' },
    { id: 'insertedDate', label: 'Created Date', align: 'right' },
    { id: 'updatedDate', label: 'Updated Date', align: 'right' },
    { id: 'actions', label: 'Actions', align: 'right' }
];

// Color mapping function to convert color names to hex values
const getEyeColorValue = (colorName) => {
    if (!colorName) return '#9E9E9E'; // Default gray
    
    const colorMap = {
        // Standard colors
        'black': '#2C2C2C',
        'brown': '#8B4513',
        'hazel': '#C9A961',
        'amber': '#FFBF00',
        'blue': '#2196F3',
        'green': '#4CAF50',
        'gray': '#9E9E9E',
        'grey': '#9E9E9E',
        'red': '#F44336',
        'violet': '#9C27B0',
        'purple': '#9C27B0',
        'yellow': '#FFEB3B',
        'orange': '#FF9800',
        'pink': '#E91E63',
        'white': '#F5F5F5',
        
        // Variations
        'light blue': '#64B5F6',
        'dark blue': '#1976D2',
        'light brown': '#A0522D',
        'dark brown': '#5D4037',
        'light green': '#81C784',
        'dark green': '#388E3C',
        'light gray': '#BDBDBD',
        'dark gray': '#616161',
        'light grey': '#BDBDBD',
        'dark grey': '#616161',
    };
    
    // Normalize color name: lowercase and trim
    const normalizedName = colorName.toLowerCase().trim();
    
    // Try exact match first
    if (colorMap[normalizedName]) {
        return colorMap[normalizedName];
    }
    
    // Try partial match (e.g., "light blue" contains "blue")
    for (const [key, value] of Object.entries(colorMap)) {
        if (normalizedName.includes(key) || key.includes(normalizedName)) {
            return value;
        }
    }
    
    // If no match found, return gray as default
    return '#9E9E9E';
};

const EyeColor = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [eyeColors, setEyeColors] = useState([]);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'card'
    const [userdata, setUserData] = useState({
        eyeColorName: '',
        eyeColorDescription: '',
        isActive: true
    });
    const [errors, setErrors] = useState({});
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [eyeColorId, setEyeColorId] = useState(null);
    const [totalCount, setTotalCount] = useState(0);
    const [eyeColorCount, setEyeColorCount] = useState(0);

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

            const res = await fetchEyeColors(headers, page, rowsPerPage);

            // Support both possible response shapes: { body: { data } } or { data }
            const responseBody = res?.data?.body ?? res?.data;
            const dataNode = responseBody?.data;
            const fetchedData = dataNode?.content || dataNode?.eyeColors || dataNode || [];
            const totalCountFromApi = dataNode?.totalElements || dataNode?.totalCount || Array.isArray(fetchedData) ? fetchedData.length : 0;

            if (fetchedData && Array.isArray(fetchedData)) {
                const tableData = fetchedData.map((p) => {
                    // Handle isActive field similar to other components
                    // Check for isActive, active, or default to true
                    const isActiveValue = p.isActive !== undefined 
                        ? Boolean(p.isActive) 
                        : p.active !== undefined 
                        ? Boolean(p.active) 
                        : true;
                    
                    return {
                        eyeColorId: p.eyeColorId,
                        eyeColorName: p.eyeColorName || 'N/A',
                        eyeColorDescription: p.eyeColorDescription || 'N/A',
                        isActive: isActiveValue ? 'Active' : 'Inactive',
                        insertedDate: p.insertedDate ? moment(p.insertedDate).format('L') : 'N/A',
                        updatedDate: p.updatedDate ? moment(p.updatedDate).format('L') : 'N/A'
                    };
                });

                setEyeColors(tableData);
                setTotalCount(typeof totalCountFromApi === 'number' ? totalCountFromApi : 0);
            } else {
                setEyeColors([]);
                setTotalCount(0);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            Swal.fire('Error', 'Failed to load eye colors. Please try again.', 'error');
            setEyeColors([]);
            setTotalCount(0);
        }
    };

    const fetchEyeColorCount = async () => {
        try {
            const res = await getEyeColorCount(headers);
            const responseBody = res?.data?.body ?? res?.data;
            const count = responseBody?.data || responseBody || 0;
            
            // Ensure count is a number
            const numericCount = typeof count === 'number' ? count : 
                                typeof count === 'string' ? parseInt(count, 10) || 0 : 0;
            setEyeColorCount(numericCount);
        } catch (error) {
            console.error('Error fetching eye color count:', error);
            setEyeColorCount(0);
        }
    };

    useEffect(() => {
        FetchData();
        fetchEyeColorCount();
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
                    // Only send the fields that are actually needed for the update
                    // The backend should handle updatedBy from the authenticated user in headers
                    const updatedData = {
                        eyeColorId: eyeColorId,
                        eyeColorName: userdata.eyeColorName?.trim() || '',
                        eyeColorDescription: userdata.eyeColorDescription?.trim() || '',
                        isActive: Boolean(userdata.isActive)
                    };
                    await updateEyeColor(updatedData, headers);
                } else {
                    // Only send the fields that are actually needed for creation
                    // The backend should handle insertedBy from the authenticated user in headers
                    const newData = {
                        eyeColorName: userdata.eyeColorName?.trim() || '',
                        eyeColorDescription: userdata.eyeColorDescription?.trim() || '',
                        isActive: Boolean(userdata.isActive)
                    };
                    await addEyeColor(newData, headers);
                }
                setUserData({ eyeColorName: '', eyeColorDescription: '', isActive: true });
                setRefreshTrigger((prev) => !prev);
                setOpen(false);
            } catch (error) {
                console.error('Error saving eye color:', error);
                Swal.fire('Error', 'Failed to save eye color. Please try again.', 'error');
            }
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!userdata.eyeColorName || userdata.eyeColorName.trim() === '') {
            newErrors.eyeColorName = 'Enter the eye color name';
        }

        if (!userdata.eyeColorDescription || userdata.eyeColorDescription.trim() === '') {
            newErrors.eyeColorDescription = 'Enter the eye color description';
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

    const handleAddEyeColor = () => {
        setEditMode(false);
        setUserData({
            eyeColorName: '',
            eyeColorDescription: '',
            isActive: true
        });
        setErrors({});
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        setEditMode(false);
        setUserData({
            eyeColorName: '',
            eyeColorDescription: '',
            isActive: true
        });
        setErrors({});
        setEyeColorId(null);
    };

    const handleEdit = async (eyeColorId) => {
        setEditMode(true);
        setOpen(true);
        try {
            const res = await getEyeColorById(eyeColorId, headers);
            // Support both possible response shapes: { body: { data } } or { data }
            const responseBody = res?.data?.body ?? res?.data;
            const det = responseBody?.data || responseBody;

            if (det && det.eyeColorId) {
                console.log('Eye Color details for edit:', det);
                const isActiveValue = det.isActive !== undefined ? det.isActive : det.active !== undefined ? det.active : true;
                setEyeColorId(det.eyeColorId);
                setUserData({
                    eyeColorName: det.eyeColorName || '',
                    eyeColorDescription: det.eyeColorDescription || '',
                    isActive: Boolean(isActiveValue)
                });
            } else {
                Swal.fire('Error', 'Failed to load eye color details', 'error');
                setOpen(false);
            }
        } catch (error) {
            console.error('Error fetching eye color details:', error);
            Swal.fire('Error', 'Failed to load eye color details. Please try again.', 'error');
            setOpen(false);
        }
    };

    const handleDelete = async (eyeColorId) => {
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
                    await deleteEyeColor(eyeColorId, headers);
                    setRefreshTrigger((prev) => !prev);
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'Eye Color has been deleted.',
                        icon: 'success'
                    });
                } catch (error) {
                    Swal.fire({
                        title: 'Error!',
                        text: 'There was a problem deleting the eye color.',
                        icon: 'error'
                    });
                    console.error('Error deleting eye color:', error);
                }
            }
        });
    };


    const renderCardView = () => (
        <Grid container spacing={3}>
            {eyeColors.length === 0 ? (
                <Grid item xs={12}>
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="h6" color="textSecondary">
                            No eye colors found
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Eye colors array length: {eyeColors.length}
                        </Typography>
                    </Box>
                </Grid>
            ) : (
                eyeColors.map((eyeColor) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={eyeColor.eyeColorId}>
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                background: 'linear-gradient(135deg, #E1F5FE 0%, #B3E5FC 100%)',
                                color: '#01579B',
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
                                            bgcolor: getEyeColorValue(eyeColor.eyeColorName),
                                            mr: 2,
                                            width: 50,
                                            height: 50,
                                            border: '3px solid',
                                            borderColor: eyeColor.isActive === 'Active' ? '#4caf50' : '#f44336',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: '100%',
                                                height: '100%',
                                                borderRadius: '50%',
                                                backgroundColor: getEyeColorValue(eyeColor.eyeColorName),
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            {eyeColor.isActive === 'Active' && (
                                                <CheckCircle sx={{ color: 'white', fontSize: '20px', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }} />
                                            )}
                                        </Box>
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5, color: '#01579B' }}>
                                            {eyeColor.eyeColorName}
                                        </Typography>
                                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                                <Chip
                                                    label={eyeColor.isActive}
                                                    size="small"
                                                    sx={{
                                                        bgcolor:
                                                            eyeColor.isActive === 'Active' ? 'rgba(76, 175, 80, 0.9)' : 'rgba(244, 67, 54, 0.9)',
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
                                        color: '#01579B',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {eyeColor.eyeColorDescription}
                                </Typography>

                                <Divider sx={{ my: 1, bgcolor: 'rgba(1, 87, 155, 0.2)' }} />

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                    <Typography variant="caption" sx={{ opacity: 0.7, color: '#01579B' }}>
                                        ID: {eyeColor.eyeColorId}
                                    </Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.7, color: '#01579B' }}>
                                        {eyeColor.insertedDate}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="caption" sx={{ opacity: 0.7, color: '#01579B' }}>
                                        Updated: {eyeColor.updatedDate}
                                    </Typography>
                                    <Box>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleEdit(eyeColor.eyeColorId)}
                                            sx={{ color: '#01579B', '&:hover': { bgcolor: 'rgba(1, 87, 155, 0.1)' } }}
                                        >
                                            <Edit fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleDelete(eyeColor.eyeColorId)}
                                            sx={{ color: '#01579B', '&:hover': { bgcolor: 'rgba(1, 87, 155, 0.1)' } }}
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
            ? columns.filter(col => ['eyeColorId', 'eyeColorName', 'actions'].includes(col.id))
            : isTablet
            ? columns.filter(col => !['insertedDate', 'updatedDate', 'eyeColorDescription'].includes(col.id))
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
                            {eyeColors.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={visibleColumns.length} align="center">
                                        <Box sx={{ py: 2 }}>
                                            <div>No eye colors found</div>
                                            <div style={{ fontSize: '12px', color: 'gray' }}>Eye colors array length: {eyeColors.length}</div>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                eyeColors.map((row) => (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.eyeColorId}>
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
                                                            onClick={() => handleEdit(row.eyeColorId)} 
                                                            style={{ color: '#00afb5' }}
                                                        >
                                                            <Edit fontSize={isMobile ? 'small' : 'medium'} />
                                                        </IconButton>
                                                        <IconButton 
                                                            size={isMobile ? 'small' : 'medium'}
                                                            onClick={() => handleDelete(row.eyeColorId)} 
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
                                                ) : column.id === 'eyeColorDescription' ? (
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            maxWidth: isMobile ? 120 : 200,
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap',
                                                            fontSize: isMobile ? 12 : 14
                                                        }}
                                                    >
                                                        {row[column.id]}
                                                    </Typography>
                                                ) : column.id === 'eyeColorName' ? (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Box
                                                            sx={{
                                                                width: isMobile ? 24 : 30,
                                                                height: isMobile ? 24 : 30,
                                                                borderRadius: '50%',
                                                                backgroundColor: getEyeColorValue(row.eyeColorName),
                                                                border: '2px solid',
                                                                borderColor: row.isActive === 'Active' ? '#4caf50' : '#f44336',
                                                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                flexShrink: 0
                                                            }}
                                                        >
                                                            {row.isActive === 'Active' && (
                                                                <CheckCircle sx={{ color: 'white', fontSize: isMobile ? '14px' : '16px', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }} />
                                                            )}
                                                        </Box>
                                                        <Typography 
                                                            variant="body2" 
                                                            sx={{ 
                                                                fontSize: isMobile ? 12 : 14,
                                                                fontWeight: 500
                                                            }}
                                                        >
                                                            {row[column.id]}
                                                        </Typography>
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
                                Eye Color Management
                            </Typography>
                            <Badge badgeContent={typeof eyeColorCount === 'number' ? eyeColorCount : 0} color="primary">
                                <Visibility color="action" />
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
                                onClick={handleAddEyeColor}
                            >
                                {isMobile ? 'Add' : 'Add Eye Color'}
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
                    {editMode ? 'Edit Eye Color' : 'Add Eye Color'}
                </DialogTitle>
                <Box component="form" onSubmit={postData} noValidate sx={{ p: { xs: 2, sm: 3 } }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Eye Color Name"
                                    name="eyeColorName"
                                    value={userdata.eyeColorName}
                                    onChange={changeHandler}
                                    error={!!errors.eyeColorName}
                                    helperText={errors.eyeColorName}
                                    placeholder="e.g., Brown, Blue, Green, Hazel"
                                />
                                {userdata.eyeColorName && (
                                    <Box
                                        sx={{
                                            width: 60,
                                            height: 60,
                                            borderRadius: '50%',
                                            backgroundColor: getEyeColorValue(userdata.eyeColorName),
                                            border: '3px solid',
                                            borderColor: userdata.isActive ? '#4caf50' : '#f44336',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mt: 1,
                                            flexShrink: 0
                                        }}
                                    >
                                        {userdata.isActive && (
                                            <CheckCircle sx={{ color: 'white', fontSize: '24px', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }} />
                                        )}
                                    </Box>
                                )}
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Eye Color Description"
                                name="eyeColorDescription"
                                value={userdata.eyeColorDescription}
                                onChange={changeHandler}
                                error={!!errors.eyeColorDescription}
                                helperText={errors.eyeColorDescription}
                                placeholder="Describe the eye color characteristics"
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

export default EyeColor;
