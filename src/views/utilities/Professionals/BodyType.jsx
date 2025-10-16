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
    fetchBodyTypes, 
    addBodyType, 
    deleteBodyType, 
    getBodyTypeById, 
    updateBodyType,
    searchBodyTypesByName,
    getBodyTypeCount
} from 'views/API/BodyTypeApi';
import { BaseUrl } from 'BaseUrl';
import { useState, useEffect, useRef } from 'react';
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
    InputAdornment,
    Chip,
    ToggleButton,
    ToggleButtonGroup,
    Badge,
    Card,
    CardContent,
    Typography,
    Divider,
    Switch,
    FormControlLabel
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DeleteForever, Edit, ViewList, ViewModule } from '@mui/icons-material';
import Swal from 'sweetalert2';

const columns = [
    { id: 'bodyTypeId', label: 'ID', minWidth: 80 },
    { id: 'bodyTypeName', label: 'Body Type Name', minWidth: 150 },
    { id: 'bodyTypeDescription', label: 'Description', minWidth: 200 },
    { id: 'isActive', label: 'Status', minWidth: 100 },
    { id: 'insertedDate', label: 'Created Date', align: 'right', minWidth: 120 },
    { id: 'updatedDate', label: 'Updated Date', align: 'right', minWidth: 120 },
    { id: 'actions', label: 'Actions', align: 'right', minWidth: 120 }
];

const BodyType = () => {
    const theme = useTheme();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [bodyTypes, setBodyTypes] = useState([]);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [viewMode, setViewMode] = useState('list');
    const [bodyTypeCount, setBodyTypeCount] = useState(0);
    const [userdata, setUserData] = useState({
        bodyTypeName: '',
        bodyTypeDescription: '',
        isActive: true
    });
    const [errors, setErrors] = useState({});
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [bodyTypeId, setBodyTypeId] = useState(null);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const user = JSON.parse(sessionStorage.getItem('user'));
    const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + (user?.accessToken || '')
    };

    const handleViewModeChange = (event, newViewMode) => {
        if (newViewMode !== null) setViewMode(newViewMode);
    };

    const FetchData = async () => {
        try {
            setLoading(true);
            const res = await fetchBodyTypes(page, rowsPerPage, headers);

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
                    fetchedData = dataNode.content;
                    totalCountFromApi = dataNode.totalElements || dataNode.totalCount || dataNode.content.length;
                } else if (dataNode.bodyTypes && Array.isArray(dataNode.bodyTypes)) {
                    fetchedData = dataNode.bodyTypes;
                    totalCountFromApi = dataNode.totalElements || dataNode.totalCount || dataNode.bodyTypes.length;
                } else if (Array.isArray(dataNode)) {
                    fetchedData = dataNode;
                    totalCountFromApi = dataNode.length;
                }
            } else if (Array.isArray(responseBody)) {
                fetchedData = responseBody;
                totalCountFromApi = responseBody.length;
            }

            if (fetchedData && Array.isArray(fetchedData)) {
                const mappedData = fetchedData.map((p) => ({
                    bodyTypeId: p.bodyTypeId,
                    bodyTypeName: p.bodyTypeName || 'N/A',
                    bodyTypeDescription: p.bodyTypeDescription || 'N/A',
                    isActive: p.isActive !== undefined ? p.isActive : true,
                    insertedDate: p.insertedDate ? moment(p.insertedDate).format('L') : 'N/A',
                    updatedDate: p.updatedDate ? moment(p.updatedDate).format('L') : 'N/A'
                }));

                setBodyTypes(mappedData);
                setTotalCount(typeof totalCountFromApi === 'number' ? totalCountFromApi : 0);
            } else {
                setBodyTypes([]);
                setTotalCount(0);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            Swal.fire('Error', 'Failed to load body types. Please try again.', 'error');
            setBodyTypes([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    };

    const FetchCount = async () => {
        try {
            const res = await getBodyTypeCount(headers);
            const responseBody = res?.data?.body ?? res?.data;
            const count = responseBody?.data || responseBody || 0;
            
            // Ensure count is a number
            const numericCount = typeof count === 'number' ? count : 
                                typeof count === 'string' ? parseInt(count, 10) || 0 : 0;
            setBodyTypeCount(numericCount);
        } catch (error) {
            console.error('Error fetching count:', error);
            setBodyTypeCount(0);
        }
    };

    useEffect(() => {
        FetchData();
        FetchCount();
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
                        ...userdata,
                        bodyTypeId,
                        updatedBy: { userId: user.userId }
                    };
                    console.log('Update Data Debug:', {
                        updatedData,
                        bodyTypeId,
                        editMode,
                        userdata
                    });
                    await updateBodyType(updatedData, headers);
                } else {
                    const newData = {
                        ...userdata,
                        createdBy: { userId: user.userId }
                    };
                    await addBodyType(newData, headers);
                }
                setUserData({ bodyTypeName: '', bodyTypeDescription: '', isActive: true });
                setRefreshTrigger((prev) => !prev);
                setOpen(false);
                setErrors({});
            } catch (error) {
                console.error('Error saving body type:', error);
            }
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!userdata.bodyTypeName || userdata.bodyTypeName.trim() === '') {
            newErrors.bodyTypeName = 'Enter the body type name';
        }

        if (!userdata.bodyTypeDescription || userdata.bodyTypeDescription.trim() === '') {
            newErrors.bodyTypeDescription = 'Enter the description';
        }

        return newErrors;
    };

    const changeHandler = (e) => {
        const { name, value, type, checked } = e.target;
        setUserData({
            ...userdata,
            [name]: type === 'checkbox' ? checked : value,
            createdBy: { userId: user.userId }
        });

        setErrors({
            ...errors,
            [name]: null
        });
    };

    const handleAddBodyType = () => {
        setEditMode(false);
        setUserData({
            bodyTypeName: '',
            bodyTypeDescription: '',
            isActive: true
        });
        setOpen(true);
    };

    const handleEdit = async (bodyTypeId) => {
        setEditMode(true);
        setOpen(true);
        try {
            const res = await getBodyTypeById(bodyTypeId, headers);
            // Support both possible response shapes: { body: { data } } or { data }
            const responseBody = res?.data?.body ?? res?.data;
            const det = responseBody?.data || responseBody;

            console.log('Edit API Response Debug:', {
                res: res?.data,
                responseBody,
                det,
                bodyTypeId
            });

            if (det && det.bodyTypeId) {
                setBodyTypeId(det.bodyTypeId);
                setUserData({
                    bodyTypeName: det.bodyTypeName || '',
                    bodyTypeDescription: det.bodyTypeDescription || '',
                    isActive: det.isActive !== undefined ? det.isActive : true
                });
            } else {
                Swal.fire('Error', 'Failed to load body type details', 'error');
                setOpen(false);
            }
        } catch (error) {
            console.error('Error fetching body type details:', error);
            Swal.fire('Error', 'Failed to load body type details. Please try again.', 'error');
            setOpen(false);
        }
    };

    const handleDelete = async (bodyTypeId) => {
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
                    await deleteBodyType(bodyTypeId, headers);
                    setRefreshTrigger((prev) => !prev);
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'Body type has been deleted.',
                        icon: 'success'
                    });
                } catch (error) {
                    Swal.fire({
                        title: 'Error!',
                        text: 'There was a problem deleting the record.',
                        icon: 'error'
                    });
                    console.error('Error deleting body type:', error);
                }
            }
        });
    };


    const renderCardView = () => (
        <Grid container spacing={3}>
            {bodyTypes.length === 0 ? (
                <Grid item xs={12}>
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="h6" color="textSecondary">
                            No body types found
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Body types array length: {bodyTypes.length}
                        </Typography>
                    </Box>
                </Grid>
            ) : (
                bodyTypes.map((bt) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={bt.bodyTypeId}>
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                background: 'linear-gradient(135deg, #B39DDB 0%, #EDE7F6 100%)',
                                color: '#311B92',
                                position: 'relative',
                                overflow: 'hidden',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                                    transition: 'all 0.3s ease'
                                }
                            }}
                        >
                            <CardContent sx={{ flexGrow: 1, position: 'relative', zIndex: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5, color: '#311B92' }}>
                                            {bt.bodyTypeName}
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                            <Chip
                                                label={bt.isActive ? 'Active' : 'Inactive'}
                                                size="small"
                                                sx={{
                                                    bgcolor: bt.isActive ? 'rgba(76, 175, 80, 0.9)' : 'rgba(244, 67, 54, 0.9)',
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
                                        color: '#311B92',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {bt.bodyTypeDescription}
                                </Typography>

                                <Divider sx={{ my: 1, bgcolor: 'rgba(49, 27, 146, 0.2)' }} />

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                    <Typography variant="caption" sx={{ opacity: 0.7, color: '#311B92' }}>
                                        ID: {bt.bodyTypeId}
                                    </Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.7, color: '#311B92' }}>
                                        {bt.insertedDate}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="caption" sx={{ opacity: 0.7, color: '#311B92' }}>
                                        Updated: {bt.updatedDate}
                                    </Typography>
                                    <Box>
                                        <IconButton size="small" onClick={() => handleEdit(bt.bodyTypeId)} sx={{ color: '#311B92' }}>
                                            <Edit fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small" onClick={() => handleDelete(bt.bodyTypeId)} sx={{ color: '#311B92' }}>
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

    return (
        <Box sx={{ mt: 4 }}>
        <MainCard
            title={
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <span>Body Type Management</span>
                        <Badge badgeContent={typeof bodyTypeCount === 'number' ? bodyTypeCount : 0} color="primary" />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                            sx={{ display: 'flex', alignItems: 'center', fontSize: '15px' }}
                            onClick={handleAddBodyType}
                        >
                            Add Body Type
                            <AddIcon sx={{ color: '#fff' }} />
                        </Button>
                    </Box>
                </Box>
            }
        >
            

            {viewMode === 'card' ? (
                renderCardView()
            ) : (
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
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} align="center">
                                            Loading...
                                        </TableCell>
                                    </TableRow>
                                ) : bodyTypes.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} align="center">
                                            No data found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    bodyTypes.map((row) => (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.bodyTypeId}>
                                            {columns.map((column) => (
                                                <TableCell key={column.id} align={column.align}>
                                                    {column.id === 'isActive' ? (
                                                        <Box
                                                            sx={{
                                                                backgroundColor: row.isActive ? '#4caf50' : '#f44336',
                                                                color: 'white',
                                                                padding: '4px 8px',
                                                                borderRadius: '4px',
                                                                fontSize: '12px',
                                                                fontWeight: 'bold',
                                                                textAlign: 'center',
                                                                display: 'inline-block',
                                                                minWidth: 80
                                                            }}
                                                        >
                                                            {row.isActive ? 'Active' : 'Inactive'}
                                                        </Box>
                                                    ) : column.id === 'actions' ? (
                                                        <>
                                                            <IconButton onClick={() => handleEdit(row.bodyTypeId)} style={{ color: '#00afb5' }}>
                                                                <Edit />
                                                            </IconButton>
                                                            <IconButton onClick={() => handleDelete(row.bodyTypeId)} color="error">
                                                                <DeleteForever />
                                                            </IconButton>
                                                        </>
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
            )}

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
                <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.25rem', backgroundColor: '#f5f5f5' }}>
                    {editMode ? 'Edit Body Type' : 'Add Body Type'}
                </DialogTitle>
                <Box component="form" onSubmit={postData} noValidate sx={{ p: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Body Type Name"
                                name="bodyTypeName"
                                value={userdata.bodyTypeName}
                                onChange={changeHandler}
                                error={!!errors.bodyTypeName}
                                helperText={errors.bodyTypeName}
                                autoFocus
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                name="bodyTypeDescription"
                                value={userdata.bodyTypeDescription}
                                onChange={changeHandler}
                                error={!!errors.bodyTypeDescription}
                                helperText={errors.bodyTypeDescription}
                                multiline
                                rows={3}
                                required
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
                        <Button onClick={() => setOpen(false)} style={{ color: '#00afb5' }}>
                            Cancel
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </MainCard>
        </Box>
    );
};

export default BodyType;
