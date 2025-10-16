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
import { fetchShoeSizes, addShoeSize, deleteShoeSize, getShoeSizeById, updateShoeSize, getShoeSizeCount } from 'views/API/ShoeSizeApi';
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
    Badge
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DeleteForever, Edit, CheckCircle, Cancel, ViewList, ViewModule, DirectionsWalk } from '@mui/icons-material';
import Swal from 'sweetalert2';

const columns = [
    { id: 'shoeSizeId', label: 'ID' },
    { id: 'shoeSizeName', label: 'Shoe Size Name', minWidth: 120 },
    { id: 'sizeSystem', label: 'Size System', minWidth: 100 },
    { id: 'sizeValue', label: 'Size Value', minWidth: 100 },
    { id: 'sizeUnit', label: 'Size Unit', minWidth: 100 },
    { id: 'shoeSizeDescription', label: 'Description', minWidth: 200 },
    { id: 'isActive', label: 'Status', align: 'center' },
    { id: 'insertedDate', label: 'Created Date', align: 'right' },
    { id: 'updatedDate', label: 'Updated Date', align: 'right' },
    { id: 'actions', label: 'Actions', align: 'right' }
];

const ShoeSize = () => {
    const theme = useTheme();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [shoeSizes, setShoeSizes] = useState([]);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'card'
    const [userdata, setUserData] = useState({
        shoeSizeName: '',
        shoeSizeDescription: '',
        sizeSystem: '',
        sizeUnit: '',
        sizeValue: '',
        isActive: true
    });
    const [errors, setErrors] = useState({});
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [shoeSizeId, setShoeSizeId] = useState(null);
    const [totalCount, setTotalCount] = useState(0);
    const [shoeSizeCount, setShoeSizeCount] = useState(0);

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

            const res = await fetchShoeSizes(headers, page, rowsPerPage);

            // Support both possible response shapes: { body: { data } } or { data }
            const responseBody = res?.data?.body ?? res?.data;
            const dataNode = responseBody?.data;
            const fetchedData = dataNode?.content || dataNode?.shoeSizes || dataNode || [];
            const totalCountFromApi = dataNode?.totalElements || dataNode?.totalCount || Array.isArray(fetchedData) ? fetchedData.length : 0;

            if (fetchedData && Array.isArray(fetchedData)) {
                const tableData = fetchedData.map((p) => {
                    // Handle isActive field similar to other components
                    const isActiveValue = p.isActive !== undefined ? p.isActive : p.active !== undefined ? p.active : true;
                    console.log(`Shoe Size ${p.shoeSizeName} - isActive field: ${p.isActive}, active field: ${p.active}, final value: ${isActiveValue}`);
                    
                    return {
                        shoeSizeId: p.shoeSizeId,
                        shoeSizeName: p.shoeSizeName || 'N/A',
                        shoeSizeDescription: p.shoeSizeDescription || 'N/A',
                        sizeSystem: p.sizeSystem || 'N/A',
                        sizeValue: p.sizeValue || 'N/A',
                        sizeUnit: p.sizeUnit || 'N/A',
                        isActive: isActiveValue ? 'Active' : 'Inactive',
                        insertedDate: p.insertedDate ? moment(p.insertedDate).format('L') : 'N/A',
                        updatedDate: p.updatedDate ? moment(p.updatedDate).format('L') : 'N/A'
                    };
                });

                setShoeSizes(tableData);
                setTotalCount(typeof totalCountFromApi === 'number' ? totalCountFromApi : 0);
            } else {
                setShoeSizes([]);
                setTotalCount(0);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            Swal.fire('Error', 'Failed to load shoe sizes. Please try again.', 'error');
            setShoeSizes([]);
            setTotalCount(0);
        }
    };

    const fetchShoeSizeCount = async () => {
        try {
            const res = await getShoeSizeCount(headers);
            const responseBody = res?.data?.body ?? res?.data;
            const count = responseBody?.data || responseBody || 0;
            
            // Ensure count is a number
            const numericCount = typeof count === 'number' ? count : 
                                typeof count === 'string' ? parseInt(count, 10) || 0 : 0;
            setShoeSizeCount(numericCount);
        } catch (error) {
            console.error('Error fetching shoe size count:', error);
            setShoeSizeCount(0);
        }
    };

    useEffect(() => {
        FetchData();
        fetchShoeSizeCount();
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
                        shoeSizeId: shoeSizeId,
                        shoeSizeName: userdata.shoeSizeName?.trim() || '',
                        shoeSizeDescription: userdata.shoeSizeDescription?.trim() || '',
                        sizeSystem: userdata.sizeSystem?.trim() || '',
                        sizeUnit: userdata.sizeUnit?.trim() || '',
                        sizeValue: userdata.sizeValue?.trim() || '',
                        isActive: Boolean(userdata.isActive),
                        updatedBy: user?.userId ? {
                            userId: user.userId,
                            userName: user.userName || user.username || 'admin'
                        } : {
                            userId: 1,
                            userName: 'admin'
                        }
                    };
                    await updateShoeSize(updatedData, headers);
                } else {
                    const newData = {
                        shoeSizeName: userdata.shoeSizeName?.trim() || '',
                        shoeSizeDescription: userdata.shoeSizeDescription?.trim() || '',
                        sizeSystem: userdata.sizeSystem?.trim() || '',
                        sizeUnit: userdata.sizeUnit?.trim() || '',
                        sizeValue: userdata.sizeValue?.trim() || '',
                        isActive: Boolean(userdata.isActive),
                        insertedBy: user?.userId ? {
                            userId: user.userId,
                            userName: user.userName || user.username || 'admin'
                        } : {
                            userId: 1,
                            userName: 'admin'
                        }
                    };
                    await addShoeSize(newData, headers);
                }
                setUserData({ shoeSizeName: '', shoeSizeDescription: '', sizeSystem: '', sizeUnit: '', sizeValue: '', isActive: true });
                setRefreshTrigger((prev) => !prev);
                setOpen(false);
            } catch (error) {
                console.error('Error saving shoe size:', error);
                Swal.fire('Error', 'Failed to save shoe size. Please try again.', 'error');
            }
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!userdata.shoeSizeName || userdata.shoeSizeName.trim() === '') {
            newErrors.shoeSizeName = 'Enter the shoe size name';
        }

        if (!userdata.shoeSizeDescription || userdata.shoeSizeDescription.trim() === '') {
            newErrors.shoeSizeDescription = 'Enter the shoe size description';
        }

        if (!userdata.sizeSystem || userdata.sizeSystem.trim() === '') {
            newErrors.sizeSystem = 'Select a size system';
        }

        if (!userdata.sizeValue || userdata.sizeValue.trim() === '') {
            newErrors.sizeValue = 'Enter the size value';
        }

        if (!userdata.sizeUnit || userdata.sizeUnit.trim() === '') {
            newErrors.sizeUnit = 'Select a size unit';
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

    const handleAddShoeSize = () => {
        setEditMode(false);
        setUserData({
            shoeSizeName: '',
            shoeSizeDescription: '',
            sizeSystem: '',
            sizeUnit: '',
            sizeValue: '',
            isActive: true
        });
        setErrors({});
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        setEditMode(false);
        setUserData({
            shoeSizeName: '',
            shoeSizeDescription: '',
            sizeSystem: '',
            sizeUnit: '',
            sizeValue: '',
            isActive: true
        });
        setErrors({});
        setShoeSizeId(null);
    };

    const handleEdit = async (shoeSizeId) => {
        setEditMode(true);
        setOpen(true);
        try {
            const res = await getShoeSizeById(shoeSizeId, headers);
            // Support both possible response shapes: { body: { data } } or { data }
            const responseBody = res?.data?.body ?? res?.data;
            const det = responseBody?.data || responseBody;

            if (det && det.shoeSizeId) {
                console.log('Shoe Size details for edit:', det);
                const isActiveValue = det.isActive !== undefined ? det.isActive : det.active !== undefined ? det.active : true;
                setShoeSizeId(det.shoeSizeId);
                setUserData({
                    shoeSizeName: det.shoeSizeName || '',
                    shoeSizeDescription: det.shoeSizeDescription || '',
                    sizeSystem: det.sizeSystem || '',
                    sizeUnit: det.sizeUnit || '',
                    sizeValue: det.sizeValue || '',
                    isActive: Boolean(isActiveValue)
                });
            } else {
                Swal.fire('Error', 'Failed to load shoe size details', 'error');
                setOpen(false);
            }
        } catch (error) {
            console.error('Error fetching shoe size details:', error);
            Swal.fire('Error', 'Failed to load shoe size details. Please try again.', 'error');
            setOpen(false);
        }
    };

    const handleDelete = async (shoeSizeId) => {
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
                    await deleteShoeSize(shoeSizeId, headers);
                    setRefreshTrigger((prev) => !prev);
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'Shoe Size has been deleted.',
                        icon: 'success'
                    });
                } catch (error) {
                    Swal.fire({
                        title: 'Error!',
                        text: 'There was a problem deleting the shoe size.',
                        icon: 'error'
                    });
                    console.error('Error deleting shoe size:', error);
                }
            }
        });
    };

    const renderCardView = () => (
        <Grid container spacing={3}>
            {shoeSizes.length === 0 ? (
                <Grid item xs={12}>
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="h6" color="textSecondary">
                            No shoe sizes found
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Shoe sizes array length: {shoeSizes.length}
                        </Typography>
                    </Box>
                </Grid>
            ) : (
                shoeSizes.map((shoeSize) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={shoeSize.shoeSizeId}>
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                background: 'linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%)',
                                color: '#F57C00',
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
                                            bgcolor: 'rgba(245, 124, 0, 0.2)',
                                            mr: 2,
                                            width: 40,
                                            height: 40,
                                            color: '#F57C00'
                                        }}
                                    >
                                        <DirectionsWalk />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5, color: '#F57C00' }}>
                                            {shoeSize.shoeSizeName}
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                                            <Chip
                                                label={shoeSize.sizeSystem}
                                                size="small"
                                                sx={{
                                                    bgcolor: 'rgba(245, 124, 0, 0.2)',
                                                    color: '#F57C00',
                                                    fontWeight: 'bold'
                                                }}
                                            />
                                            <Chip
                                                label={`${shoeSize.sizeValue} ${shoeSize.sizeUnit}`}
                                                size="small"
                                                sx={{
                                                    bgcolor: 'rgba(245, 124, 0, 0.2)',
                                                    color: '#F57C00',
                                                    fontWeight: 'bold'
                                                }}
                                            />
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                            <Chip
                                                label={shoeSize.isActive}
                                                size="small"
                                                sx={{
                                                    bgcolor:
                                                        shoeSize.isActive === 'Active' ? 'rgba(76, 175, 80, 0.9)' : 'rgba(244, 67, 54, 0.9)',
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
                                        color: '#F57C00',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {shoeSize.shoeSizeDescription}
                                </Typography>

                                <Divider sx={{ my: 1, bgcolor: 'rgba(245, 124, 0, 0.2)' }} />

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                    <Typography variant="caption" sx={{ opacity: 0.7, color: '#F57C00' }}>
                                        ID: {shoeSize.shoeSizeId}
                                    </Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.7, color: '#F57C00' }}>
                                        {shoeSize.insertedDate}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="caption" sx={{ opacity: 0.7, color: '#F57C00' }}>
                                        Updated: {shoeSize.updatedDate}
                                    </Typography>
                                    <Box>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleEdit(shoeSize.shoeSizeId)}
                                            sx={{ color: '#F57C00', '&:hover': { bgcolor: 'rgba(245, 124, 0, 0.1)' } }}
                                        >
                                            <Edit fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleDelete(shoeSize.shoeSizeId)}
                                            sx={{ color: '#F57C00', '&:hover': { bgcolor: 'rgba(245, 124, 0, 0.1)' } }}
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
                        {shoeSizes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} align="center">
                                    <Box sx={{ py: 2 }}>
                                        <div>No shoe sizes found</div>
                                        <div style={{ fontSize: '12px', color: 'gray' }}>Shoe sizes array length: {shoeSizes.length}</div>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ) : (
                            shoeSizes.map((row) => (
                                <TableRow hover role="checkbox" tabIndex={-1} key={row.shoeSizeId}>
                                    {columns.map((column) => (
                                        <TableCell key={column.id} align={column.align}>
                                            {column.id === 'actions' ? (
                                                <>
                                                    <IconButton onClick={() => handleEdit(row.shoeSizeId)} style={{ color: '#00afb5' }}>
                                                        <Edit />
                                                    </IconButton>
                                                    <IconButton onClick={() => handleDelete(row.shoeSizeId)} color="error">
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
                                            ) : column.id === 'shoeSizeDescription' ? (
                                                <Box
                                                    sx={{
                                                        maxWidth: 200,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
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
                            <span>Shoe Size Management</span>
                            <Badge badgeContent={typeof shoeSizeCount === 'number' ? shoeSizeCount : 0} color="primary">
                                <DirectionsWalk color="action" />
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
                                onClick={handleAddShoeSize}
                            >
                                Add Shoe Size
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
                    {editMode ? 'Edit Shoe Size' : 'Add Shoe Size'}
                </DialogTitle>
                <Box component="form" onSubmit={postData} noValidate sx={{ p: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Shoe Size Name"
                                name="shoeSizeName"
                                value={userdata.shoeSizeName}
                                onChange={changeHandler}
                                error={!!errors.shoeSizeName}
                                helperText={errors.shoeSizeName}
                                placeholder="e.g., Size 8, Size 9, Size 10"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth error={!!errors.sizeSystem}>
                                <InputLabel>Size System</InputLabel>
                                <Select name="sizeSystem" value={userdata.sizeSystem} onChange={changeHandler} label="Size System">
                                    <MenuItem value="">
                                        <em>Select size system</em>
                                    </MenuItem>
                                    <MenuItem value="US">US</MenuItem>
                                    <MenuItem value="UK">UK</MenuItem>
                                    <MenuItem value="EU">EU</MenuItem>
                                    <MenuItem value="CM">CM</MenuItem>
                                </Select>
                                {errors.sizeSystem && (
                                    <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>{errors.sizeSystem}</Box>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Size Value"
                                name="sizeValue"
                                value={userdata.sizeValue}
                                onChange={changeHandler}
                                error={!!errors.sizeValue}
                                helperText={errors.sizeValue}
                                placeholder="e.g., 8, 9, 10, 42, 43"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth error={!!errors.sizeUnit}>
                                <InputLabel>Size Unit</InputLabel>
                                <Select name="sizeUnit" value={userdata.sizeUnit} onChange={changeHandler} label="Size Unit">
                                    <MenuItem value="">
                                        <em>Select size unit</em>
                                    </MenuItem>
                                    <MenuItem value="inches">Inches</MenuItem>
                                    <MenuItem value="cm">Centimeters</MenuItem>
                                    <MenuItem value="mm">Millimeters</MenuItem>
                                    <MenuItem value="number">Number</MenuItem>
                                </Select>
                                {errors.sizeUnit && (
                                    <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>{errors.sizeUnit}</Box>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Shoe Size Description"
                                name="shoeSizeDescription"
                                value={userdata.shoeSizeDescription}
                                onChange={changeHandler}
                                error={!!errors.shoeSizeDescription}
                                helperText={errors.shoeSizeDescription}
                                placeholder="Describe the shoe size characteristics and measurements"
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

export default ShoeSize;
