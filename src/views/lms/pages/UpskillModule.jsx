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
    createUpskillModule,
    updateUpskillModule,
    deleteUpskillModuleById,
    getUpskillModuleByModuleId,
    getAllUpskillModules,
    getAllUpskillModulesByPagination
} from 'views/lms/api/UpskillModuleApi';
import { getAllUpskillCourses } from 'views/lms/api/UpskillCourseApi';
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
    useMediaQuery,
    MenuItem,
    Select,
    FormControl,
    InputLabel
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DeleteForever, Edit, ViewList, ViewModule, MenuBook } from '@mui/icons-material';
import Swal from 'sweetalert2';

const columns = [
    { id: 'moduleId', label: 'ID' },
    { id: 'moduleName', label: 'Module Name', minWidth: 150 },
    { id: 'moduleDescription', label: 'Description', minWidth: 200 },
    { id: 'courseName', label: 'Course', minWidth: 120 },
    { id: 'isActive', label: 'Status', align: 'center' },
    { id: 'insertedDate', label: 'Created Date', align: 'right' },
    { id: 'updatedDate', label: 'Updated Date', align: 'right' },
    { id: 'actions', label: 'Actions', align: 'right' }
];

const UpskillModule = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [modules, setModules] = useState([]);
    const [rawModulesData, setRawModulesData] = useState([]);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [viewMode, setViewMode] = useState('list');
    const [courses, setCourses] = useState([]);
    const [userdata, setUserData] = useState({
        moduleName: '',
        moduleDescription: '',
        courseId: '',
        isActive: true
    });
    const [errors, setErrors] = useState({});
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [moduleId, setModuleId] = useState(null);
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
    const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + user?.accessToken
    };

    const fetchCourses = async () => {
        try {
            if (!user || !user.accessToken) {
                return;
            }
            const res = await getAllUpskillCourses(headers);
            const responseBody = res?.data?.body ?? res?.data;
            const dataNode = responseBody?.data || responseBody;
            let fetchedCourses = [];
            
            if (Array.isArray(dataNode)) {
                fetchedCourses = dataNode;
            } else if (dataNode.content && Array.isArray(dataNode.content)) {
                fetchedCourses = dataNode.content;
            } else if (dataNode.courses && Array.isArray(dataNode.courses)) {
                fetchedCourses = dataNode.courses;
            }
            
            setCourses(fetchedCourses.filter(course => course.isActive !== false));
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const FetchData = async () => {
        try {
            if (!user || !user.accessToken) {
                console.error('User not authenticated');
                Swal.fire('Error', 'Please login to continue', 'error');
                return;
            }

            const res = await getAllUpskillModulesByPagination(headers, page, rowsPerPage);

            console.log('=== UPSKILL MODULE FETCH DEBUG ===');
            console.log('Full API response:', res);
            console.log('Response data:', res.data);

            const responseBody = res?.data?.body ?? res?.data;
            const dataNode = responseBody?.data || responseBody;
            
            console.log('Response body:', responseBody);
            console.log('Data node:', dataNode);
            
            let fetchedData = [];
            let totalCountFromApi = 0;
            
            if (dataNode) {
                if (Array.isArray(dataNode)) {
                    fetchedData = dataNode;
                    totalCountFromApi = dataNode.length;
                } else if (dataNode.content && Array.isArray(dataNode.content)) {
                    fetchedData = dataNode.content;
                    totalCountFromApi = dataNode.totalElements || dataNode.totalCount || dataNode.content.length;
                } else if (dataNode.modules && Array.isArray(dataNode.modules)) {
                    fetchedData = dataNode.modules;
                    totalCountFromApi = dataNode.totalElements || dataNode.totalCount || dataNode.modules.length;
                }
            } else if (Array.isArray(responseBody)) {
                fetchedData = responseBody;
                totalCountFromApi = responseBody.length;
            }

            if (fetchedData && Array.isArray(fetchedData)) {
                console.log('Fetched data:', fetchedData);
                console.log('Total count from API:', totalCountFromApi);
                
                setRawModulesData(fetchedData);
                
                const tableData = fetchedData.map((p) => {
                    const isActiveValue = p.isActive !== null && p.isActive !== undefined ? p.isActive : p.active !== null && p.active !== undefined ? p.active : true;
                    
                    const processedModule = {
                        moduleId: p.moduleId,
                        moduleName: p.moduleName || 'N/A',
                        moduleDescription: p.moduleDescription || 'N/A',
                        courseId: p.courseId,
                        courseName: p.courseName || p.course?.courseName || 'N/A',
                        isActive: Boolean(isActiveValue),
                        insertedDate: p.insertedDate ? moment(p.insertedDate).format('L') : 'N/A',
                        updatedDate: p.updatedDate ? moment(p.updatedDate).format('L') : 'N/A'
                    };
                    
                    return processedModule;
                });

                console.log('Processed table data:', tableData);
                setModules(tableData);
                setTotalCount(typeof totalCountFromApi === 'number' ? totalCountFromApi : 0);
            } else {
                console.warn('No valid data found in response');
                setModules([]);
                setTotalCount(0);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            Swal.fire('Error', 'Failed to load upskill modules. Please try again.', 'error');
            setModules([]);
            setTotalCount(0);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        FetchData();
    }, [refreshTrigger, page, rowsPerPage]);

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
                        moduleId: moduleId,
                        moduleName: userdata.moduleName?.trim() || '',
                        moduleDescription: userdata.moduleDescription?.trim() || '',
                        courseId: userdata.courseId,
                        isActive: Boolean(userdata.isActive)
                    };
                    console.log('Update Data Debug:', {
                        updatedData,
                        moduleId,
                        editMode,
                        userdata
                    });
                    const updateResult = await updateUpskillModule(updatedData, headers);
                    
                    if (updateResult.success) {
                        console.log('Module updated successfully:', updateResult.message);
                        Swal.fire('Success', updateResult.message, 'success');
                    } else {
                        throw new Error(updateResult.message || 'Update operation failed');
                    }
                } else {
                    const newData = {
                        moduleName: userdata.moduleName?.trim() || '',
                        moduleDescription: userdata.moduleDescription?.trim() || '',
                        courseId: userdata.courseId,
                        isActive: Boolean(userdata.isActive),
                        createdBy: user?.userId ? {
                            userId: parseInt(user.userId, 10),
                            userName: user.userName || user.username || 'admin'
                        } : {
                            userId: 1,
                            userName: 'admin'
                        }
                    };
                    console.log('Add Data Debug:', {
                        newData,
                        userdata
                    });
                    const addResult = await createUpskillModule(newData, headers);
                    
                    if (addResult.success) {
                        console.log('Module added successfully:', addResult.message);
                        Swal.fire('Success', addResult.message, 'success');
                    } else {
                        throw new Error(addResult.message || 'Add operation failed');
                    }
                }
                setUserData({ moduleName: '', moduleDescription: '', courseId: '', isActive: true });
                console.log('Triggering data refresh after update...');
                setRefreshTrigger((prev) => !prev);
                setOpen(false);
            } catch (error) {
                console.error('Error saving module:', error);
                Swal.fire('Error', error.message || 'Failed to save module. Please try again.', 'error');
            }
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!userdata.moduleName || userdata.moduleName.trim() === '') {
            newErrors.moduleName = 'Enter the module name';
        }

        if (!userdata.courseId || userdata.courseId === '') {
            newErrors.courseId = 'Select a course';
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

    const handleAddModule = () => {
        setEditMode(false);
        setUserData({
            moduleName: '',
            moduleDescription: '',
            courseId: '',
            isActive: true
        });
        setErrors({});
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        setEditMode(false);
        setUserData({
            moduleName: '',
            moduleDescription: '',
            courseId: '',
            isActive: true
        });
        setErrors({});
        setModuleId(null);
    };

    const handleEdit = async (moduleId) => {
        setEditMode(true);
        setOpen(true);
        try {
            const res = await getUpskillModuleByModuleId(moduleId, headers);
            const responseBody = res?.data?.body ?? res?.data;
            const det = responseBody?.data || responseBody;

            if (det && det.moduleId) {
                console.log('Module details for edit:', det);
                const isActiveValue = det.isActive !== null && det.isActive !== undefined ? det.isActive : det.active !== null && det.active !== undefined ? det.active : true;
                setModuleId(det.moduleId);
                setUserData({
                    moduleName: det.moduleName || '',
                    moduleDescription: det.moduleDescription || '',
                    courseId: det.courseId || det.course?.courseId || '',
                    isActive: Boolean(isActiveValue)
                });
            } else {
                Swal.fire('Error', 'Failed to load module details', 'error');
                setOpen(false);
            }
        } catch (error) {
            console.error('Error fetching module details:', error);
            Swal.fire('Error', 'Failed to load module details. Please try again.', 'error');
            setOpen(false);
        }
    };

    const handleDelete = async (moduleId) => {
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
                    console.log('Deleting module with ID:', moduleId);
                    const deleteResult = await deleteUpskillModuleById(moduleId, headers);
                    
                    if (deleteResult.success) {
                        console.log('Module deleted successfully:', deleteResult.message);
                        setRefreshTrigger((prev) => !prev);
                        Swal.fire({
                            title: 'Deleted!',
                            text: deleteResult.message || 'Module has been deleted successfully.',
                            icon: 'success'
                        });
                    } else {
                        throw new Error(deleteResult.message || 'Delete operation failed');
                    }
                } catch (error) {
                    console.error('Error deleting module:', error);
                    Swal.fire({
                        title: 'Error!',
                        text: error.message || 'There was a problem deleting the module.',
                        icon: 'error'
                    });
                }
            }
        });
    };

    const renderCardView = () => (
        <Grid container spacing={isMobile ? 2 : 3}>
            {modules.length === 0 ? (
                <Grid item xs={12}>
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="h6" color="textSecondary">
                            No modules found
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Modules array length: {modules.length}
                        </Typography>
                    </Box>
                </Grid>
            ) : (
                modules.map((module) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={module.moduleId}>
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
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
                                            bgcolor: 'rgba(255,255,255,0.2)',
                                            mr: 2,
                                            width: 40,
                                            height: 40
                                        }}
                                    >
                                        <MenuBook />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                            {module.moduleName}
                                        </Typography>
                                        <Chip
                                            label={module.isActive ? 'Active' : 'Inactive'}
                                            size="small"
                                            sx={{
                                                bgcolor: module.isActive ? 'rgba(76, 175, 80, 0.9)' : 'rgba(244, 67, 54, 0.9)',
                                                color: 'white',
                                                fontWeight: 'bold'
                                            }}
                                        />
                                    </Box>
                                </Box>

                                <Typography
                                    variant="body2"
                                    sx={{
                                        mb: 1,
                                        opacity: 0.9,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {module.moduleDescription}
                                </Typography>

                                <Chip
                                    label={module.courseName}
                                    size="small"
                                    sx={{
                                        mb: 2,
                                        bgcolor: 'rgba(255,255,255,0.2)',
                                        color: 'white'
                                    }}
                                />

                                <Divider sx={{ my: 1, bgcolor: 'rgba(255,255,255,0.2)' }} />

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                        ID: {module.moduleId}
                                    </Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                        {module.insertedDate}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                        Updated: {module.updatedDate}
                                    </Typography>
                                    <Box>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleEdit(module.moduleId)}
                                            sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
                                        >
                                            <Edit fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleDelete(module.moduleId)}
                                            sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
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
            ? columns.filter(col => ['moduleId', 'moduleName', 'actions'].includes(col.id))
            : isTablet
            ? columns.filter(col => !['insertedDate', 'updatedDate', 'moduleDescription'].includes(col.id))
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
                            {modules.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={visibleColumns.length} align="center">
                                        <Box sx={{ py: 2 }}>
                                            <div>No modules found</div>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                modules.map((row) => (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.moduleId}>
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
                                                            backgroundColor: row.isActive ? '#4caf50' : '#f44336',
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
                                                        {row.isActive ? 'Active' : 'Inactive'}
                                                    </Box>
                                                ) : column.id === 'actions' ? (
                                                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                                        <IconButton 
                                                            size={isMobile ? 'small' : 'medium'}
                                                            onClick={() => handleEdit(row.moduleId)} 
                                                            style={{ color: '#00afb5' }}
                                                        >
                                                            <Edit fontSize={isMobile ? 'small' : 'medium'} />
                                                        </IconButton>
                                                        <IconButton 
                                                            size={isMobile ? 'small' : 'medium'}
                                                            onClick={() => handleDelete(row.moduleId)} 
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
                                Upskill Module Management
                            </Typography>
                            <Badge badgeContent={totalCount} color="primary">
                                <MenuBook color="action" />
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
                                onClick={handleAddModule}
                            >
                                {isMobile ? 'Add' : 'Add Module'}
                                <AddIcon sx={{ color: '#fff', ml: 0.5 }} />
                            </Button>
                        </Box>
                    </Box>
                }
            >
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
                    {editMode ? 'Edit Upskill Module' : 'Add Upskill Module'}
                </DialogTitle>
                <Box component="form" onSubmit={postData} noValidate sx={{ p: { xs: 2, sm: 3 } }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Module Name"
                                name="moduleName"
                                value={userdata.moduleName}
                                onChange={changeHandler}
                                error={!!errors.moduleName}
                                helperText={errors.moduleName}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Module Description"
                                name="moduleDescription"
                                value={userdata.moduleDescription}
                                onChange={changeHandler}
                                error={!!errors.moduleDescription}
                                helperText={errors.moduleDescription}
                                multiline
                                rows={3}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth error={!!errors.courseId}>
                                <InputLabel>Course</InputLabel>
                                <Select
                                    name="courseId"
                                    value={userdata.courseId}
                                    onChange={changeHandler}
                                    label="Course"
                                >
                                    {courses.map((course) => (
                                        <MenuItem key={course.courseId} value={course.courseId}>
                                            {course.courseName}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.courseId && (
                                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                                        {errors.courseId}
                                    </Typography>
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

export default UpskillModule;

