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
import { fetchCategories, addCategory, deleteCategory, getCategoryById, updateCategory } from 'views/professionals API/CategoryApi';
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
import { DeleteForever, Edit, ViewList, ViewModule, Category as CategoryIcon } from '@mui/icons-material';
import Swal from 'sweetalert2';

const columns = [
    { id: 'categoryId', label: 'ID' },
    { id: 'categoryName', label: 'Category Name', minWidth: 150 },
    { id: 'categoryDescription', label: 'Description', minWidth: 200 },
    { id: 'isActive', label: 'Status', align: 'center' },
    { id: 'insertedDate', label: 'Created Date', align: 'right' },
    { id: 'updatedDate', label: 'Updated Date', align: 'right' },
    { id: 'actions', label: 'Actions', align: 'right' }
];

const Category = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [categories, setCategories] = useState([]);
    const [rawCategoriesData, setRawCategoriesData] = useState([]); // Store original API data
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'card'
    const [userdata, setUserData] = useState({
        categoryName: '',
        categoryDescription: '',
        isActive: true
    });
    const [errors, setErrors] = useState({});
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [categoryId, setCategoryId] = useState(null);
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

    const FetchData = async () => {
        try {
            // Check if user is authenticated
            if (!user || !user.accessToken) {
                console.error('User not authenticated');
                Swal.fire('Error', 'Please login to continue', 'error');
                return;
            }

            const res = await fetchCategories(headers, page, rowsPerPage);

            console.log('=== CATEGORY FETCH DEBUG ===');
            console.log('Full API response:', res);
            console.log('Response data:', res.data);

            // Support both possible response shapes: { body: { data } } or { data }
            const responseBody = res?.data?.body ?? res?.data;
            const dataNode = responseBody?.data;
            
            console.log('Response body:', responseBody);
            console.log('Data node:', dataNode);
            
            // Handle different response structures
            let fetchedData = [];
            let totalCountFromApi = 0;
            
            if (dataNode) {
                if (Array.isArray(dataNode)) {
                    fetchedData = dataNode;
                    totalCountFromApi = dataNode.length;
                } else if (dataNode.content && Array.isArray(dataNode.content)) {
                    fetchedData = dataNode.content;
                    totalCountFromApi = dataNode.totalElements || dataNode.totalCount || dataNode.content.length;
                } else if (dataNode.categories && Array.isArray(dataNode.categories)) {
                    fetchedData = dataNode.categories;
                    totalCountFromApi = dataNode.totalElements || dataNode.totalCount || dataNode.categories.length;
                } else if (Array.isArray(dataNode)) {
                    fetchedData = dataNode;
                    totalCountFromApi = dataNode.length;
                }
            } else if (Array.isArray(responseBody)) {
                fetchedData = responseBody;
                totalCountFromApi = responseBody.length;
            }

            if (fetchedData && Array.isArray(fetchedData)) {
                console.log('Fetched data:', fetchedData);
                console.log('Total count from API:', totalCountFromApi);
                
                // Store raw data for editing
                setRawCategoriesData(fetchedData);
                
                const tableData = fetchedData.map((p) => {
                    // Handle isActive field similar to Country.jsx and State.jsx
                    const isActiveValue = p.isActive !== null && p.isActive !== undefined ? p.isActive : p.active !== null && p.active !== undefined ? p.active : true;
                    console.log(`Category ${p.categoryName} - isActive field: ${p.isActive}, active field: ${p.active}, final value: ${isActiveValue}`);
                    
                    const processedCategory = {
                        categoryId: p.categoryId,
                        categoryName: p.categoryName || 'N/A',
                        categoryDescription: p.categoryDescription || 'N/A',
                        isActive: Boolean(isActiveValue), // Keep as boolean for consistency
                        insertedDate: p.insertedDate ? moment(p.insertedDate).format('L') : 'N/A',
                        updatedDate: p.updatedDate ? moment(p.updatedDate).format('L') : 'N/A'
                    };
                    
                    console.log(`Category ${p.categoryName} dates:`, {
                        originalInsertedDate: p.insertedDate,
                        originalUpdatedDate: p.updatedDate,
                        formattedInsertedDate: processedCategory.insertedDate,
                        formattedUpdatedDate: processedCategory.updatedDate
                    });
                    
                    return processedCategory;
                });

                console.log('Processed table data:', tableData);
                setCategories(tableData);
                setTotalCount(typeof totalCountFromApi === 'number' ? totalCountFromApi : 0);
            } else {
                console.warn('No valid data found in response');
                setCategories([]);
                setTotalCount(0);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            Swal.fire('Error', 'Failed to load categories. Please try again.', 'error');
            setCategories([]);
            setTotalCount(0);
        }
    };

    useEffect(() => {
        FetchData();
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
                        categoryId: categoryId,
                        categoryName: userdata.categoryName?.trim() || '',
                        categoryDescription: userdata.categoryDescription?.trim() || '',
                        isActive: Boolean(userdata.isActive),
                        isDelete: false, // Add required is_delete field
                        updatedBy: user?.userId ? {
                            userId: user.userId,
                            userName: user.userName || user.username || 'admin'
                        } : {
                            userId: 1,
                            userName: 'admin'
                        }
                    };
                    console.log('Update Data Debug:', {
                        updatedData,
                        categoryId,
                        editMode,
                        userdata
                    });
                    const updateResult = await updateCategory(updatedData, headers);
                    
                    if (updateResult.success) {
                        console.log('Category updated successfully:', updateResult.message);
                        console.log('Update result data:', updateResult.data);
                        Swal.fire('Success', updateResult.message, 'success');
                    } else {
                        throw new Error(updateResult.message || 'Update operation failed');
                    }
                } else {
                    const newData = {
                        categoryName: userdata.categoryName?.trim() || '',
                        categoryDescription: userdata.categoryDescription?.trim() || '',
                        isActive: Boolean(userdata.isActive),
                        isDelete: false, // Add required is_delete field
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
                    const addResult = await addCategory(newData, headers);
                    
                    if (addResult.success) {
                        console.log('Category added successfully:', addResult.message);
                        Swal.fire('Success', addResult.message, 'success');
                    } else {
                        throw new Error(addResult.message || 'Add operation failed');
                    }
                }
                setUserData({ categoryName: '', categoryDescription: '', isActive: true });
                console.log('Triggering data refresh after update...');
                setRefreshTrigger((prev) => !prev);
                setOpen(false);
            } catch (error) {
                console.error('Error saving category:', error);
                Swal.fire('Error', 'Failed to save category. Please try again.', 'error');
            }
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!userdata.categoryName || userdata.categoryName.trim() === '') {
            newErrors.categoryName = 'Enter the category name';
        }

        if (!userdata.categoryDescription || userdata.categoryDescription.trim() === '') {
            newErrors.categoryDescription = 'Enter the description';
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

    const handleAddCategory = () => {
        setEditMode(false);
        setUserData({
            categoryName: '',
            categoryDescription: '',
            isActive: true
        });
        setErrors({});
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        setEditMode(false);
        setUserData({
            categoryName: '',
            categoryDescription: '',
            isActive: true
        });
        setErrors({});
        setCategoryId(null);
    };


    const handleEdit = async (categoryId) => {
        setEditMode(true);
        setOpen(true);
        try {
            const res = await getCategoryById(categoryId, headers);
            // Support both possible response shapes: { body: { data } } or { data }
            const responseBody = res?.data?.body ?? res?.data;
            const det = responseBody?.data || responseBody;

            if (det && det.categoryId) {
                console.log('Category details for edit:', det);
                const isActiveValue = det.isActive !== null && det.isActive !== undefined ? det.isActive : det.active !== null && det.active !== undefined ? det.active : true;
                setCategoryId(det.categoryId);
                setUserData({
                    categoryName: det.categoryName || '',
                    categoryDescription: det.categoryDescription || '',
                    isActive: Boolean(isActiveValue)
                });
            } else {
                Swal.fire('Error', 'Failed to load category details', 'error');
                setOpen(false);
            }
        } catch (error) {
            console.error('Error fetching category details:', error);
            Swal.fire('Error', 'Failed to load category details. Please try again.', 'error');
            setOpen(false);
        }
    };

    const handleDelete = async (categoryId) => {
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
                    console.log('Deleting category with ID:', categoryId);
                    const deleteResult = await deleteCategory(categoryId, headers);
                    
                    if (deleteResult.success) {
                        console.log('Category deleted successfully:', deleteResult.message);
                        setRefreshTrigger((prev) => !prev);
                        Swal.fire({
                            title: 'Deleted!',
                            text: deleteResult.message || 'Category has been deleted successfully.',
                            icon: 'success'
                        });
                    } else {
                        throw new Error(deleteResult.message || 'Delete operation failed');
                    }
                } catch (error) {
                    console.error('Error deleting category:', error);
                    Swal.fire({
                        title: 'Error!',
                        text: error.message || 'There was a problem deleting the category.',
                        icon: 'error'
                    });
                }
            }
        });
    };

    const renderCardView = () => (
        <Grid container spacing={isMobile ? 2 : 3}>
            {categories.length === 0 ? (
                <Grid item xs={12}>
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="h6" color="textSecondary">
                            No categories found
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Categories array length: {categories.length}
                        </Typography>
                    </Box>
                </Grid>
            ) : (
                categories.map((category) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={category.categoryId}>
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
                                        <CategoryIcon />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5, color: '#880E4F' }}>
                                            {category.categoryName}
                                        </Typography>
                                        <Chip
                                            label={category.isActive ? 'Active' : 'Inactive'}
                                            size="small"
                                            sx={{
                                                bgcolor:
                                                    category.isActive ? 'rgba(76, 175, 80, 0.9)' : 'rgba(244, 67, 54, 0.9)',
                                                color: 'white',
                                                fontWeight: 'bold'
                                            }}
                                        />
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
                                    {category.categoryDescription}
                                </Typography>

                                <Divider sx={{ my: 1, bgcolor: 'rgba(136, 14, 79, 0.2)' }} />

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                    <Typography variant="caption" sx={{ opacity: 0.7, color: '#880E4F' }}>
                                        ID: {category.categoryId}
                                    </Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.7, color: '#880E4F' }}>
                                        {category.insertedDate}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="caption" sx={{ opacity: 0.7, color: '#880E4F' }}>
                                        Updated: {category.updatedDate}
                                    </Typography>
                                    <Box>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleEdit(category.categoryId)}
                                            sx={{ color: '#880E4F', '&:hover': { bgcolor: 'rgba(136, 14, 79, 0.1)' } }}
                                        >
                                            <Edit fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleDelete(category.categoryId)}
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
            ? columns.filter(col => ['categoryId', 'categoryName', 'actions'].includes(col.id))
            : isTablet
            ? columns.filter(col => !['insertedDate', 'updatedDate', 'categoryDescription'].includes(col.id))
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
                            {categories.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={visibleColumns.length} align="center">
                                        <Box sx={{ py: 2 }}>
                                            <div>No categories found</div>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                categories.map((row) => (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.categoryId}>
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
                                                            onClick={() => handleEdit(row.categoryId)} 
                                                            style={{ color: '#00afb5' }}
                                                        >
                                                            <Edit fontSize={isMobile ? 'small' : 'medium'} />
                                                        </IconButton>
                                                        <IconButton 
                                                            size={isMobile ? 'small' : 'medium'}
                                                            onClick={() => handleDelete(row.categoryId)} 
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
                                Category Management
                            </Typography>
                            <Badge badgeContent={totalCount} color="primary">
                                <CategoryIcon color="action" />
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
                                onClick={handleAddCategory}
                            >
                                {isMobile ? 'Add' : 'Add Category'}
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
                    {editMode ? 'Edit Category' : 'Add Category'}
                </DialogTitle>
                <Box component="form" onSubmit={postData} noValidate sx={{ p: { xs: 2, sm: 3 } }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Category Name"
                                name="categoryName"
                                value={userdata.categoryName}
                                onChange={changeHandler}
                                error={!!errors.categoryName}
                                helperText={errors.categoryName}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                name="categoryDescription"
                                value={userdata.categoryDescription}
                                onChange={changeHandler}
                                error={!!errors.categoryDescription}
                                helperText={errors.categoryDescription}
                                multiline
                                rows={3}
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

export default Category;
