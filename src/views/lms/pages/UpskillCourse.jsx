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
    createUpskillCourse,
    updateUpskillCourse,
    deleteUpskillCourseById,
    getUpskillCourseByCourseId,
    getAllUpskillCourses,
    getAllUpskillCoursesByPagination
} from 'views/lms/api/UpskillCourseApi';
import { getAllCategories } from 'views/professionals API/CategoryApi';
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
import { DeleteForever, Edit, ViewList, ViewModule, School } from '@mui/icons-material';
import Swal from 'sweetalert2';

const columns = [
    { id: 'courseId', label: 'ID' },
    { id: 'courseName', label: 'Course Name', minWidth: 150 },
    { id: 'courseDescription', label: 'Description', minWidth: 200 },
    { id: 'categoryName', label: 'Category', minWidth: 120 },
    { id: 'isActive', label: 'Status', align: 'center' },
    { id: 'insertedDate', label: 'Created Date', align: 'right' },
    { id: 'updatedDate', label: 'Updated Date', align: 'right' },
    { id: 'actions', label: 'Actions', align: 'right' }
];

const UpskillCourse = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [courses, setCourses] = useState([]);
    const [rawCoursesData, setRawCoursesData] = useState([]);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [viewMode, setViewMode] = useState('list');
    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(false);
    const [userdata, setUserData] = useState({
        courseName: '',
        courseDescription: '',
        categoryId: '',
        isActive: true
    });
    const [errors, setErrors] = useState({});
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [courseId, setCourseId] = useState(null);
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

    const fetchCategories = async () => {
        try {
            const currentUser = JSON.parse(sessionStorage.getItem('user')) || user;
            if (!currentUser || !currentUser.accessToken) {
                console.warn('User not authenticated, cannot fetch categories');
                return;
            }
            
            setCategoriesLoading(true);
            
            const currentHeaders = {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + currentUser.accessToken
            };
            
            console.log('=== FETCHING CATEGORIES ===');
            console.log('Headers:', { ...currentHeaders, Authorization: 'Bearer ***' });
            
            const res = await getAllCategories(currentHeaders);
            
            console.log('=== CATEGORY API RESPONSE ===');
            console.log('Full response:', res);
            console.log('Response data:', res?.data);
            console.log('Response status:', res?.status);
            
            const responseBody = res?.data?.body ?? res?.data;
            const dataNode = responseBody?.data || responseBody;
            
            console.log('Response body:', responseBody);
            console.log('Data node:', dataNode);
            console.log('Data node type:', Array.isArray(dataNode) ? 'Array' : typeof dataNode);
            
            let fetchedCategories = [];
            
            // Handle different response structures
            // Case 1: dataNode is an array, check if first element has categories property
            if (Array.isArray(dataNode) && dataNode.length > 0) {
                // Check if first element is a wrapper object with categories array
                if (dataNode[0]?.categories && Array.isArray(dataNode[0].categories)) {
                    console.log('Found categories in dataNode[0].categories');
                    fetchedCategories = dataNode[0].categories;
                } else {
                    // Otherwise, treat the array itself as categories
                    fetchedCategories = dataNode;
                }
            } 
            // Case 2: dataNode is an object with categories property
            else if (dataNode?.categories && Array.isArray(dataNode.categories)) {
                console.log('Found categories in dataNode.categories');
                fetchedCategories = dataNode.categories;
            } 
            // Case 3: dataNode is an object with content property
            else if (dataNode?.content && Array.isArray(dataNode.content)) {
                console.log('Found categories in dataNode.content');
                fetchedCategories = dataNode.content;
            } 
            // Case 4: responseBody is an array
            else if (Array.isArray(responseBody)) {
                console.log('Using responseBody as categories array');
                fetchedCategories = responseBody;
            } 
            // Case 5: responseBody has data property that's an array
            else if (responseBody?.data && Array.isArray(responseBody.data)) {
                // Check if it's a wrapper structure
                if (responseBody.data.length > 0 && responseBody.data[0]?.categories) {
                    console.log('Found categories in responseBody.data[0].categories');
                    fetchedCategories = responseBody.data[0].categories;
                } else {
                    console.log('Using responseBody.data as categories array');
                    fetchedCategories = responseBody.data;
                }
            }
            
            console.log('Fetched categories (before filter):', fetchedCategories);
            if (fetchedCategories.length > 0) {
                console.log('Sample category structure:', fetchedCategories[0]);
                console.log('Sample category keys:', Object.keys(fetchedCategories[0]));
            }
            
            // Filter active categories and ensure we have valid data
            const activeCategories = fetchedCategories.filter(cat => {
                if (!cat) {
                    console.log('Category is null/undefined:', cat);
                    return false;
                }
                
                // Check if category has required fields (try different possible field names)
                const hasId = !!(cat.categoryId || cat.id || cat.category?.categoryId);
                const hasName = !!(cat.categoryName || cat.name || cat.category?.categoryName);
                
                // Log category structure for debugging (only first few)
                if (fetchedCategories.indexOf(cat) < 3) {
                    console.log('Checking category:', {
                        raw: cat,
                        categoryId: cat.categoryId,
                        id: cat.id,
                        categoryName: cat.categoryName,
                        name: cat.name,
                        isActive: cat.isActive,
                        active: cat.active,
                        hasId,
                        hasName
                    });
                }
                
                if (!hasId) {
                    console.log('Category missing ID:', cat);
                    return false;
                }
                
                if (!hasName) {
                    console.log('Category missing name:', cat);
                    return false;
                }
                
                // Check active status - be more lenient (only exclude if explicitly false)
                // Default to true if not specified
                const isActive = cat.isActive !== undefined ? cat.isActive : 
                                cat.active !== undefined ? cat.active : 
                                cat.category?.isActive !== undefined ? cat.category.isActive : 
                                true; // Default to active if not specified
                
                if (isActive === false) {
                    if (fetchedCategories.indexOf(cat) < 3) {
                        console.log('Category is inactive (filtered out):', cat);
                    }
                    return false;
                }
                
                return true;
            });
            
            console.log('Active categories (after filter):', activeCategories);
            
            // Normalize category data to ensure consistent field names
            const normalizedCategories = activeCategories.map(cat => {
                // Handle different possible field structures
                const categoryId = cat.categoryId || cat.id || cat.category?.categoryId;
                const categoryName = cat.categoryName || cat.name || cat.category?.categoryName;
                const isActive = cat.isActive !== undefined ? cat.isActive : 
                                cat.active !== undefined ? cat.active : 
                                cat.category?.isActive !== undefined ? cat.category.isActive : true;
                
                return {
                    categoryId: categoryId,
                    categoryName: categoryName,
                    isActive: isActive,
                    // Keep original data for reference
                    ...cat
                };
            });
            
            console.log('Normalized categories:', normalizedCategories);
            console.log('Setting categories state with', normalizedCategories.length, 'categories');
            
            setCategories(normalizedCategories);
            setCategoriesLoading(false);
            
            if (activeCategories.length === 0) {
                console.warn('No active categories found. Check API response structure.');
            }
        } catch (error) {
            console.error('=== ERROR FETCHING CATEGORIES ===');
            console.error('Error:', error);
            console.error('Error response:', error?.response?.data);
            console.error('Error status:', error?.response?.status);
            setCategoriesLoading(false);
            Swal.fire({
                icon: 'warning',
                title: 'Warning',
                text: 'Failed to load categories. Please refresh the page.',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });
        }
    };

    const FetchData = async () => {
        try {
            if (!user || !user.accessToken) {
                console.error('User not authenticated');
                Swal.fire('Error', 'Please login to continue', 'error');
                return;
            }

            const res = await getAllUpskillCoursesByPagination(headers, page, rowsPerPage);

            console.log('=== UPSKILL COURSE FETCH DEBUG ===');
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
                } else if (dataNode.courses && Array.isArray(dataNode.courses)) {
                    fetchedData = dataNode.courses;
                    totalCountFromApi = dataNode.totalElements || dataNode.totalCount || dataNode.courses.length;
                }
            } else if (Array.isArray(responseBody)) {
                fetchedData = responseBody;
                totalCountFromApi = responseBody.length;
            }

            if (fetchedData && Array.isArray(fetchedData)) {
                console.log('Fetched data:', fetchedData);
                console.log('Total count from API:', totalCountFromApi);
                
                setRawCoursesData(fetchedData);
                
                const tableData = fetchedData.map((p) => {
                    const isActiveValue = p.isActive !== null && p.isActive !== undefined ? p.isActive : p.active !== null && p.active !== undefined ? p.active : true;
                    
                    // Extract categoryId from different possible structures
                    const categoryId = p.categoryId || p.category?.categoryId || p.category?.id || null;
                    
                    // Extract categoryName from different possible structures
                    const categoryName = p.categoryName || p.category?.categoryName || p.category?.name || 'N/A';
                    
                    console.log('Processing course:', {
                        courseId: p.courseId,
                        courseName: p.courseName,
                        rawCategory: p.category,
                        extractedCategoryId: categoryId,
                        extractedCategoryName: categoryName
                    });
                    
                    const processedCourse = {
                        courseId: p.courseId,
                        courseName: p.courseName || 'N/A',
                        courseDescription: p.courseDescription || 'N/A',
                        categoryId: categoryId,
                        categoryName: categoryName,
                        isActive: Boolean(isActiveValue),
                        insertedDate: p.insertedDate ? moment(p.insertedDate).format('L') : 'N/A',
                        updatedDate: p.updatedDate ? moment(p.updatedDate).format('L') : 'N/A'
                    };
                    
                    return processedCourse;
                });

                console.log('Processed table data:', tableData);
                setCourses(tableData);
                setTotalCount(typeof totalCountFromApi === 'number' ? totalCountFromApi : 0);
            } else {
                console.warn('No valid data found in response');
                setCourses([]);
                setTotalCount(0);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            Swal.fire('Error', 'Failed to load upskill courses. Please try again.', 'error');
            setCourses([]);
            setTotalCount(0);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        FetchData();
    }, [refreshTrigger, page, rowsPerPage]);

    useEffect(() => {
        if (open) {
            // Fetch categories when dialog opens to ensure fresh data
            fetchCategories();
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
                        courseId: courseId,
                        courseName: userdata.courseName?.trim() || '',
                        courseDescription: userdata.courseDescription?.trim() || '',
                        categoryId: userdata.categoryId,
                        isActive: Boolean(userdata.isActive)
                    };
                    console.log('Update Data Debug:', {
                        updatedData,
                        courseId,
                        editMode,
                        userdata
                    });
                    const updateResult = await updateUpskillCourse(updatedData, headers);
                    
                    if (updateResult.success) {
                        console.log('Course updated successfully:', updateResult.message);
                        Swal.fire('Success', updateResult.message, 'success');
                    } else {
                        throw new Error(updateResult.message || 'Update operation failed');
                    }
                } else {
                    const newData = {
                        courseName: userdata.courseName?.trim() || '',
                        courseDescription: userdata.courseDescription?.trim() || '',
                        categoryId: userdata.categoryId,
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
                    const addResult = await createUpskillCourse(newData, headers);
                    
                    if (addResult.success) {
                        console.log('Course added successfully:', addResult.message);
                        Swal.fire('Success', addResult.message, 'success');
                    } else {
                        throw new Error(addResult.message || 'Add operation failed');
                    }
                }
                setUserData({ courseName: '', courseDescription: '', categoryId: '', isActive: true });
                console.log('Triggering data refresh after update...');
                setRefreshTrigger((prev) => !prev);
                setOpen(false);
            } catch (error) {
                console.error('Error saving course:', error);
                Swal.fire('Error', error.message || 'Failed to save course. Please try again.', 'error');
            }
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!userdata.courseName || userdata.courseName.trim() === '') {
            newErrors.courseName = 'Enter the course name';
        }

        if (!userdata.categoryId || userdata.categoryId === '') {
            newErrors.categoryId = 'Select a category';
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

    const handleAddCourse = () => {
        setEditMode(false);
        setUserData({
            courseName: '',
            courseDescription: '',
            categoryId: '',
            isActive: true
        });
        setErrors({});
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        setEditMode(false);
        setUserData({
            courseName: '',
            courseDescription: '',
            categoryId: '',
            isActive: true
        });
        setErrors({});
        setCourseId(null);
    };

    const handleEdit = async (courseId) => {
        setEditMode(true);
        setOpen(true);
        try {
            const res = await getUpskillCourseByCourseId(courseId, headers);
            const responseBody = res?.data?.body ?? res?.data;
            const det = responseBody?.data || responseBody;

            if (det && det.courseId) {
                console.log('Course details for edit:', det);
                const isActiveValue = det.isActive !== null && det.isActive !== undefined ? det.isActive : det.active !== null && det.active !== undefined ? det.active : true;
                setCourseId(det.courseId);
                setUserData({
                    courseName: det.courseName || '',
                    courseDescription: det.courseDescription || '',
                    categoryId: det.categoryId || det.category?.categoryId || '',
                    isActive: Boolean(isActiveValue)
                });
            } else {
                Swal.fire('Error', 'Failed to load course details', 'error');
                setOpen(false);
            }
        } catch (error) {
            console.error('Error fetching course details:', error);
            Swal.fire('Error', 'Failed to load course details. Please try again.', 'error');
            setOpen(false);
        }
    };

    const handleDelete = async (courseId) => {
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
                    console.log('Deleting course with ID:', courseId);
                    const deleteResult = await deleteUpskillCourseById(courseId, headers);
                    
                    if (deleteResult.success) {
                        console.log('Course deleted successfully:', deleteResult.message);
                        setRefreshTrigger((prev) => !prev);
                        Swal.fire({
                            title: 'Deleted!',
                            text: deleteResult.message || 'Course has been deleted successfully.',
                            icon: 'success'
                        });
                    } else {
                        throw new Error(deleteResult.message || 'Delete operation failed');
                    }
                } catch (error) {
                    console.error('Error deleting course:', error);
                    Swal.fire({
                        title: 'Error!',
                        text: error.message || 'There was a problem deleting the course.',
                        icon: 'error'
                    });
                }
            }
        });
    };

    const renderCardView = () => (
        <Grid container spacing={isMobile ? 2 : 3}>
            {courses.length === 0 ? (
                <Grid item xs={12}>
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="h6" color="textSecondary">
                            No courses found
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Courses array length: {courses.length}
                        </Typography>
                    </Box>
                </Grid>
            ) : (
                courses.map((course) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={course.courseId}>
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
                                        <School />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                            {course.courseName}
                                        </Typography>
                                        <Chip
                                            label={course.isActive ? 'Active' : 'Inactive'}
                                            size="small"
                                            sx={{
                                                bgcolor: course.isActive ? 'rgba(76, 175, 80, 0.9)' : 'rgba(244, 67, 54, 0.9)',
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
                                    {course.courseDescription}
                                </Typography>

                                <Chip
                                    label={course.categoryName}
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
                                        ID: {course.courseId}
                                    </Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                        {course.insertedDate}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                        Updated: {course.updatedDate}
                                    </Typography>
                                    <Box>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleEdit(course.courseId)}
                                            sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
                                        >
                                            <Edit fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleDelete(course.courseId)}
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
            ? columns.filter(col => ['courseId', 'courseName', 'actions'].includes(col.id))
            : isTablet
            ? columns.filter(col => !['insertedDate', 'updatedDate', 'courseDescription'].includes(col.id))
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
                            {courses.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={visibleColumns.length} align="center">
                                        <Box sx={{ py: 2 }}>
                                            <div>No courses found</div>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                courses.map((row) => (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.courseId}>
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
                                                            onClick={() => handleEdit(row.courseId)} 
                                                            style={{ color: '#00afb5' }}
                                                        >
                                                            <Edit fontSize={isMobile ? 'small' : 'medium'} />
                                                        </IconButton>
                                                        <IconButton 
                                                            size={isMobile ? 'small' : 'medium'}
                                                            onClick={() => handleDelete(row.courseId)} 
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
                                Upskill Course Management
                            </Typography>
                            <Badge badgeContent={totalCount} color="primary">
                                <School color="action" />
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
                                onClick={handleAddCourse}
                            >
                                {isMobile ? 'Add' : 'Add Course'}
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
                    {editMode ? 'Edit Upskill Course' : 'Add Upskill Course'}
                </DialogTitle>
                <Box component="form" onSubmit={postData} noValidate sx={{ p: { xs: 2, sm: 3 } }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Course Name"
                                name="courseName"
                                value={userdata.courseName}
                                onChange={changeHandler}
                                error={!!errors.courseName}
                                helperText={errors.courseName}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Course Description"
                                name="courseDescription"
                                value={userdata.courseDescription}
                                onChange={changeHandler}
                                error={!!errors.courseDescription}
                                helperText={errors.courseDescription}
                                multiline
                                rows={3}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth error={!!errors.categoryId}>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    name="categoryId"
                                    value={userdata.categoryId || ''}
                                    onChange={changeHandler}
                                    label="Category"
                                    disabled={categoriesLoading || categories.length === 0}
                                >
                                    {categoriesLoading ? (
                                        <MenuItem value="" disabled>
                                            Loading categories...
                                        </MenuItem>
                                    ) : categories.length === 0 ? (
                                        <MenuItem value="" disabled>
                                            No categories available
                                        </MenuItem>
                                    ) : (
                                        categories.map((category, index) => {
                                            // Handle different possible field names
                                            const categoryId = category.categoryId || category.id || category.category?.categoryId;
                                            const categoryName = category.categoryName || category.name || category.category?.categoryName;
                                            
                                            return (
                                                <MenuItem key={categoryId || `category-${index}`} value={categoryId}>
                                                    {categoryName || 'Unnamed Category'}
                                                </MenuItem>
                                            );
                                        })
                                    )}
                                </Select>
                                {errors.categoryId && (
                                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                                        {errors.categoryId}
                                    </Typography>
                                )}
                                {categoriesLoading && (
                                    <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, ml: 1.75 }}>
                                        Loading categories...
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

export default UpskillCourse;

