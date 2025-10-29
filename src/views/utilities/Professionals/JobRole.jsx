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
import { fetchJobRoles, addJobRole, deleteJobRole, getJobRoleById, updateJobRole, getJobRoleCount } from 'views/API/JobRoleApi';
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
    Badge
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DeleteForever, Edit, CheckCircle, Cancel, ViewList, ViewModule, Work } from '@mui/icons-material';
import Swal from 'sweetalert2';

const columns = [
    { id: 'jobRoleId', label: 'ID' },
    { id: 'jobRoleName', label: 'Job Role Name', minWidth: 150 },
    { id: 'jobRoleDescription', label: 'Description', minWidth: 200 },
    { id: 'experienceLevel', label: 'Experience Level', minWidth: 120 },
    { id: 'actions', label: 'Actions', align: 'right' }
];

const experienceLevels = [
    { value: 'Entry', label: 'Entry Level' },
    { value: 'Mid', label: 'Mid Level' },
    { value: 'Senior', label: 'Senior Level' },
    { value: 'Lead', label: 'Lead Level' },
    { value: 'Manager', label: 'Manager Level' }
];

const JobRole = () => {
    const theme = useTheme();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [jobRoles, setJobRoles] = useState([]);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'card'
    const [userdata, setUserData] = useState({
        jobRoleName: '',
        jobRoleDescription: '',
        experienceLevel: ''
    });
    const [errors, setErrors] = useState({});
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [jobRoleId, setJobRoleId] = useState(null);
    const [totalCount, setTotalCount] = useState(0);
    const [roleCount, setRoleCount] = useState(0);

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

            const res = await fetchJobRoles(headers, page, rowsPerPage);

            // Support both possible response shapes: { body: { data } } or { data }
            const responseBody = res?.data?.body ?? res?.data;
            const dataNode = responseBody?.data;
            const fetchedData = dataNode?.content || dataNode?.roles || dataNode || [];
            const totalCountFromApi = dataNode?.totalElements || dataNode?.totalCount || Array.isArray(fetchedData) ? fetchedData.length : 0;

            if (fetchedData && Array.isArray(fetchedData)) {
                const tableData = fetchedData.map((p) => {
                    console.log(`Job Role ${p.jobRoleName || p.roleName} - Processing role data:`, p);
                    
                    return {
                        jobRoleId: p.jobRoleId || p.roleId,
                        jobRoleName: p.jobRoleName || p.roleName || 'N/A',
                        jobRoleDescription: p.jobRoleDescription || p.roleDescription || 'N/A',
                        experienceLevel: p.experienceLevel || 'Not Set'
                    };
                });

                setJobRoles(tableData);
                setTotalCount(typeof totalCountFromApi === 'number' ? totalCountFromApi : 0);
                // Also update role count from the same data
                setRoleCount(typeof totalCountFromApi === 'number' ? totalCountFromApi : 0);
            } else {
                setJobRoles([]);
                setTotalCount(0);
                setRoleCount(0);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            Swal.fire('Error', 'Failed to load roles. Please try again.', 'error');
            setJobRoles([]);
            setTotalCount(0);
            setRoleCount(0);
        }
    };

    const fetchRoleCount = async () => {
        try {
            // Since count endpoint doesn't exist, we'll get count from the main data fetch
            // This will be handled in FetchData function
            setRoleCount(0); // Default to 0, will be updated when data is fetched
        } catch (error) {
            console.error('Error fetching role count:', error);
            setRoleCount(0);
        }
    };

    useEffect(() => {
        FetchData();
        fetchRoleCount();
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
                        roleId: jobRoleId,
                        roleName: userdata.jobRoleName?.trim() || '',
                        roleDescription: userdata.jobRoleDescription?.trim() || '',
                        experienceLevel: userdata.experienceLevel || ''
                        // Removed isActive and updatedBy fields to avoid Hibernate proxy serialization issues
                        // The backend should handle these fields internally
                    };
                    const result = await updateJobRole(updatedData, headers);
                    if (result?.success) {
                        // Success message is already shown by the API function
                        setUserData({ jobRoleName: '', jobRoleDescription: '', experienceLevel: '' });
                        setRefreshTrigger((prev) => !prev);
                        setOpen(false);
                    }
                } else {
                    const newData = {
                        roleName: userdata.jobRoleName?.trim() || '',
                        roleDescription: userdata.jobRoleDescription?.trim() || '',
                        experienceLevel: userdata.experienceLevel || ''
                        // Removed isActive and insertedBy fields to avoid Hibernate proxy serialization issues
                        // The backend should handle these fields internally
                    };
                    const result = await addJobRole(newData, headers);
                    if (result?.success) {
                        // Success message is already shown by the API function
                        setUserData({ jobRoleName: '', jobRoleDescription: '', experienceLevel: '' });
                        setRefreshTrigger((prev) => !prev);
                        setOpen(false);
                    }
                }
            } catch (error) {
                console.error('Error saving job role:', error);
                // Error message is already shown by the API function
                // Don't show additional error message here to avoid duplicate alerts
            }
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!userdata.jobRoleName || userdata.jobRoleName.trim() === '') {
            newErrors.jobRoleName = 'Enter the job role name';
        }

        if (!userdata.jobRoleDescription || userdata.jobRoleDescription.trim() === '') {
            newErrors.jobRoleDescription = 'Enter the job role description';
        }

        // Make experience level optional - not all roles need experience levels
        // if (!userdata.experienceLevel || userdata.experienceLevel === '') {
        //     newErrors.experienceLevel = 'Select an experience level';
        // }

        return newErrors;
    };

    const changeHandler = (e) => {
        const { name, value, checked } = e.target;
        setUserData({
            ...userdata,
            [name]: value
        });

        setErrors({
            ...errors,
            [name]: null
        });
    };


    const handleAddJobRole = () => {
        setEditMode(false);
        setUserData({
            jobRoleName: '',
            jobRoleDescription: '',
            experienceLevel: ''
        });
        setErrors({});
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        setEditMode(false);
        setUserData({
            jobRoleName: '',
            jobRoleDescription: '',
            experienceLevel: ''
        });
        setErrors({});
        setJobRoleId(null);
    };

    const handleEdit = async (jobRoleId) => {
        setEditMode(true);
        setOpen(true);
        try {
            const res = await getJobRoleById(jobRoleId, headers);
            // Support both possible response shapes: { body: { data } } or { data }
            const responseBody = res?.data?.body ?? res?.data;
            const det = responseBody?.data || responseBody;

            if (det && (det.jobRoleId || det.roleId)) {
                console.log('Job Role details for edit:', det);
                setJobRoleId(det.jobRoleId || det.roleId);
                setUserData({
                    jobRoleName: det.jobRoleName || det.roleName || '',
                    jobRoleDescription: det.jobRoleDescription || det.roleDescription || '',
                    experienceLevel: det.experienceLevel || ''
                });
            } else {
                Swal.fire('Error', 'Failed to load role details', 'error');
                setOpen(false);
            }
        } catch (error) {
            console.error('Error fetching job role details:', error);
            Swal.fire('Error', 'Failed to load role details. Please try again.', 'error');
            setOpen(false);
        }
    };

    const handleDelete = async (jobRoleId) => {
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
                    const deleteResult = await deleteJobRole(jobRoleId, headers);
                    if (deleteResult?.success) {
                        // Success message is already shown by the API function
                        setRefreshTrigger((prev) => !prev);
                    }
                } catch (error) {
                    console.error('Error deleting job role:', error);
                    // Error message is already shown by the API function
                    // Don't show additional error message here to avoid duplicate alerts
                }
            }
        });
    };

    const getExperienceLevelColor = (level) => {
        switch (level) {
            case 'Entry':
                return 'rgba(76, 175, 80, 0.8)';
            case 'Mid':
                return 'rgba(33, 150, 243, 0.8)';
            case 'Senior':
                return 'rgba(255, 152, 0, 0.8)';
            case 'Lead':
                return 'rgba(156, 39, 176, 0.8)';
            case 'Manager':
                return 'rgba(244, 67, 54, 0.8)';
            default:
                return 'rgba(158, 158, 158, 0.8)';
        }
    };

    const renderCardView = () => (
        <Grid container spacing={3}>
            {jobRoles.length === 0 ? (
                <Grid item xs={12}>
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="h6" color="textSecondary">
                            No job roles found
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Job roles array length: {jobRoles.length}
                        </Typography>
                    </Box>
                </Grid>
            ) : (
                jobRoles.map((jobRole) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={jobRole.jobRoleId}>
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
                                        <Work />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5, color: '#880E4F' }}>
                                            {jobRole.jobRoleName}
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                            <Chip
                                                label={jobRole.experienceLevel}
                                                size="small"
                                                sx={{
                                                    bgcolor: getExperienceLevelColor(jobRole.experienceLevel),
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                    fontSize: '0.7rem'
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
                                    {jobRole.jobRoleDescription}
                                </Typography>

                                <Divider sx={{ my: 1, bgcolor: 'rgba(136, 14, 79, 0.2)' }} />

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="caption" sx={{ opacity: 0.7, color: '#880E4F' }}>
                                        ID: {jobRole.jobRoleId}
                                    </Typography>
                                    <Box>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleEdit(jobRole.jobRoleId)}
                                            sx={{ color: '#880E4F', '&:hover': { bgcolor: 'rgba(136, 14, 79, 0.1)' } }}
                                        >
                                            <Edit fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleDelete(jobRole.jobRoleId)}
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
                        {jobRoles.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} align="center">
                                    <Box sx={{ py: 2 }}>
                                        <div>No job roles found</div>
                                        <div style={{ fontSize: '12px', color: 'gray' }}>Job roles array length: {jobRoles.length}</div>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ) : (
                            jobRoles.map((row) => (
                                <TableRow hover role="checkbox" tabIndex={-1} key={row.jobRoleId}>
                                    {columns.map((column) => (
                                        <TableCell key={column.id} align={column.align}>
                                            {column.id === 'actions' ? (
                                                <>
                                                    <IconButton onClick={() => handleEdit(row.jobRoleId)} style={{ color: '#00afb5' }}>
                                                        <Edit />
                                                    </IconButton>
                                                    <IconButton onClick={() => handleDelete(row.jobRoleId)} color="error">
                                                        <DeleteForever />
                                                    </IconButton>
                                                </>
                                            ) : column.id === 'experienceLevel' ? (
                                                <Box
                                                    sx={{
                                                        backgroundColor: getExperienceLevelColor(row[column.id]),
                                                        color: 'white',
                                                        padding: '4px 8px',
                                                        borderRadius: '4px',
                                                        fontSize: '12px',
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    {row[column.id] || 'N/A'}
                                                </Box>
                                            ) : column.id === 'jobRoleDescription' ? (
                                                <Box
                                                    sx={{
                                                        maxWidth: 200,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    {row[column.id] || 'N/A'}
                                                </Box>
                                            ) : (
                                                row[column.id] || 'N/A'
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
                            <span>Job Role Management</span>
                            <Badge badgeContent={typeof roleCount === 'number' ? roleCount : 0} color="primary">
                                <Work color="action" />
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
                                onClick={handleAddJobRole}
                            >
                                Add Job Role
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
                    {editMode ? 'Edit Job Role' : 'Add Job Role'}
                </DialogTitle>
                <Box component="form" onSubmit={postData} noValidate sx={{ p: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Job Role Name"
                                name="jobRoleName"
                                value={userdata.jobRoleName}
                                onChange={changeHandler}
                                error={!!errors.jobRoleName}
                                helperText={errors.jobRoleName}
                                placeholder="e.g., Frontend Developer, UI/UX Designer"
                            />
                        </Grid>
                        {/* Temporarily hide experience level until basic create functionality works */}
                        {/* <Grid item xs={12} md={6}>
                            <FormControl fullWidth error={!!errors.experienceLevel}>
                                <InputLabel>Experience Level (Optional)</InputLabel>
                                <Select
                                    name="experienceLevel"
                                    value={userdata.experienceLevel}
                                    onChange={changeHandler}
                                    label="Experience Level (Optional)"
                                >
                                    <MenuItem value="">
                                        <em>Select experience level (optional)</em>
                                    </MenuItem>
                                    {experienceLevels.map((level) => (
                                        <MenuItem key={level.value} value={level.value}>
                                            {level.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.experienceLevel && (
                                    <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>{errors.experienceLevel}</Box>
                                )}
                            </FormControl>
                        </Grid> */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Job Role Description"
                                name="jobRoleDescription"
                                value={userdata.jobRoleDescription}
                                onChange={changeHandler}
                                error={!!errors.jobRoleDescription}
                                helperText={errors.jobRoleDescription}
                                placeholder="Describe the job role responsibilities and requirements"
                                multiline
                                rows={4}
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

export default JobRole;
