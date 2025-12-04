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
import { fetchSkills, addSkill, deleteSkill, getSkillById, updateSkill, getSkillCount } from 'views/professionals API/SkillsApi';
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
import { DeleteForever, Edit, CheckCircle, Cancel, ViewList, ViewModule, Psychology } from '@mui/icons-material';
import Swal from 'sweetalert2';

const columns = [
    { id: 'skillId', label: 'ID' },
    { id: 'skillName', label: 'Skill Name', minWidth: 150 },
    { id: 'skillDescription', label: 'Description', minWidth: 200 },
    { id: 'skillLevel', label: 'Skill Level', minWidth: 120 },
    { id: 'isActive', label: 'Status', align: 'center' },
    { id: 'insertedDate', label: 'Created Date', align: 'right' },
    { id: 'updatedDate', label: 'Updated Date', align: 'right' },
    { id: 'actions', label: 'Actions', align: 'right' }
];

const skillLevels = [
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Advanced', label: 'Advanced' },
    { value: 'Expert', label: 'Expert' }
];

const Skills = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [skills, setSkills] = useState([]);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'card'
    const [userdata, setUserData] = useState({
        skillName: '',
        skillDescription: '',
        skillLevel: '',
        isActive: true
    });
    const [errors, setErrors] = useState({});
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [skillId, setSkillId] = useState(null);
    const [totalCount, setTotalCount] = useState(0);
    const [skillCount, setSkillCount] = useState(0);

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

    const user = JSON.parse(sessionStorage.getItem('user') || 'null');
    
    // Helper function to create properly formatted headers
    const getAuthHeaders = () => {
        const currentUser = JSON.parse(sessionStorage.getItem('user') || 'null');
        if (!currentUser || !currentUser.accessToken) {
            return null;
        }
        const token = currentUser.accessToken;
        const tokenType = currentUser.tokenType || 'Bearer';
        // Check if token already includes 'Bearer'
        const authToken = token.startsWith('Bearer ') ? token : `${tokenType} ${token}`;
        
        return {
            'Content-Type': 'application/json',
            'Authorization': authToken
        };
    };

    const FetchData = async () => {
        try {
            // Check if user is authenticated and get headers
            const authHeaders = getAuthHeaders();
            if (!authHeaders) {
                console.error('User not authenticated');
                Swal.fire({
                    icon: 'error',
                    title: 'Authentication Required',
                    text: 'Please login to continue',
                    confirmButtonText: 'Go to Login'
                }).then(() => {
                    sessionStorage.removeItem('user');
                    window.location.href = '/';
                });
                return;
            }

            const res = await fetchSkills(authHeaders, page, rowsPerPage);

            console.log('=== SKILLS FETCH DEBUG ===');
            console.log('Full API response:', res);
            console.log('Response data:', res.data);

            // Handle the response structure:
            // {
            //     "code": 200,
            //     "status": "SUCCESS",
            //     "message": "Skills retrieved successfully",
            //     "error": "",
            //     "data": {
            //         "totalPages": 0,
            //         "totalElements": 0,
            //         "content": [],
            //         ...
            //     }
            // }
            const responseData = res?.data;
            
            // Check if response has the expected structure
            let fetchedData = [];
            let totalCountFromApi = 0;
            
            if (responseData) {
                // Direct structure: { code, status, message, error, data: { content, totalElements } }
                if (responseData.data && typeof responseData.data === 'object') {
                    fetchedData = responseData.data.content || responseData.data.skills || [];
                    totalCountFromApi = responseData.data.totalElements || 0;
                }
                // Alternative structure: { body: { data: { content, totalElements } } }
                else if (responseData.body?.data) {
                    const dataNode = responseData.body.data;
                    fetchedData = dataNode.content || dataNode.skills || Array.isArray(dataNode) ? dataNode : [];
                    totalCountFromApi = dataNode.totalElements || dataNode.totalCount || (Array.isArray(dataNode) ? dataNode.length : 0);
                }
                // Fallback: check if data is directly an array
                else if (Array.isArray(responseData)) {
                    fetchedData = responseData;
                    totalCountFromApi = responseData.length;
                }
            }

            console.log('Fetched data:', fetchedData);
            console.log('Total count from API:', totalCountFromApi);

            if (fetchedData && Array.isArray(fetchedData)) {
                const tableData = fetchedData.map((p) => {
                    // Handle isActive field similar to other components
                    const isActiveValue = p.isActive !== undefined ? p.isActive : p.active !== undefined ? p.active : true;

                    // Enhanced fallback for date properties: check all common alternatives
                    const insertedDateRaw = p.insertedDate || p.inserted_date || p.createdAt || p.created_at || null;
                    const updatedDateRaw = p.updatedDate || p.updated_date || p.updatedAt || p.updated_at || null;

                    return {
                        skillId: p.skillId,
                        skillName: p.skillName || 'N/A',
                        skillDescription: p.skillDescription || 'N/A',
                        skillLevel: p.skillLevel || 'Not Set',
                        isActive: isActiveValue ? 'Active' : 'Inactive',
                        insertedDate: insertedDateRaw ? moment(insertedDateRaw).format('L') : 'N/A',
                        updatedDate: updatedDateRaw ? moment(updatedDateRaw).format('L') : 'N/A'
                    };
                });

                setSkills(tableData);
                setTotalCount(typeof totalCountFromApi === 'number' ? totalCountFromApi : 0);
                // Also update skill count from the same data
                setSkillCount(typeof totalCountFromApi === 'number' ? totalCountFromApi : 0);
            } else {
                console.warn('No valid data found in response');
                setSkills([]);
                setTotalCount(0);
                setSkillCount(0);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            
            // Handle 401 Unauthorized errors
            if (error?.response?.status === 401) {
                Swal.fire({
                    icon: 'error',
                    title: 'Session Expired',
                    text: 'Your session has expired. Please login again.',
                    confirmButtonText: 'Go to Login'
                }).then(() => {
                    sessionStorage.removeItem('user');
                    window.location.href = '/';
                });
                return;
            }
            
            // Handle other errors
            let errorMessage = 'Failed to load skills. Please try again.';
            if (error?.response?.status === 403) {
                errorMessage = 'You do not have permission to access skills.';
            } else if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error?.message) {
                errorMessage = error.message;
            }
            
            Swal.fire('Error', errorMessage, 'error');
            setSkills([]);
            setTotalCount(0);
            setSkillCount(0);
        }
    };

    const fetchSkillCount = async () => {
        try {
            // Since count endpoint doesn't exist, we'll get count from the main data fetch
            // This will be handled in FetchData function
            setSkillCount(0); // Default to 0, will be updated when data is fetched
        } catch (error) {
            console.error('Error fetching skill count:', error);
            setSkillCount(0);
        }
    };

    useEffect(() => {
        FetchData();
        fetchSkillCount();
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
                const authHeaders = getAuthHeaders();
                if (!authHeaders) {
                    Swal.fire('Error', 'Authentication required. Please login again.', 'error');
                    sessionStorage.removeItem('user');
                    window.location.href = '/';
                    return;
                }
                
                if (editMode) {
                    const updatedData = {
                        skillId: skillId,
                        skillName: userdata.skillName?.trim() || '',
                        skillDescription: userdata.skillDescription?.trim() || '',
                        skillLevel: userdata.skillLevel || '',
                        isActive: true   // ensure activity status true for updates
                    };
                    const result = await updateSkill(updatedData, authHeaders);
                    if (result?.success) {
                        Swal.fire('Success', result.message, 'success');
                    }
                } else {
                    const newData = {
                        skillName: userdata.skillName?.trim() || '',
                        skillDescription: userdata.skillDescription?.trim() || '',
                        skillLevel: userdata.skillLevel || '',
                        isActive: Boolean(userdata.isActive)
                    };
                    console.log('Sending add data:', newData);
                    await addSkill(newData, authHeaders);
                }
                setUserData({ skillName: '', skillDescription: '', skillLevel: '', isActive: true });
                setRefreshTrigger((prev) => !prev);
                setOpen(false);
            } catch (error) {
                console.error('Error saving skill:', error);
                Swal.fire('Error', 'Failed to save skill. Please try again.', 'error');
            }
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!userdata.skillName || userdata.skillName.trim() === '') {
            newErrors.skillName = 'Enter the skill name';
        }

        if (!userdata.skillDescription || userdata.skillDescription.trim() === '') {
            newErrors.skillDescription = 'Enter the skill description';
        }

        if (!userdata.skillLevel || userdata.skillLevel === '') {
            newErrors.skillLevel = 'Select a skill level';
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


    const handleAddSkill = () => {
        setEditMode(false);
        setUserData({
            skillName: '',
            skillDescription: '',
            skillLevel: '',
            isActive: true
        });
        setErrors({});
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        setEditMode(false);
        setUserData({
            skillName: '',
            skillDescription: '',
            skillLevel: '',
            isActive: true
        });
        setErrors({});
        setSkillId(null);
    };

    const handleEdit = async (skillId) => {
        setEditMode(true);
        setOpen(true);
        try {
            const authHeaders = getAuthHeaders();
            if (!authHeaders) {
                Swal.fire('Error', 'Authentication required. Please login again.', 'error');
                sessionStorage.removeItem('user');
                window.location.href = '/';
                return;
            }
            const res = await getSkillById(skillId, authHeaders);
            // Support both possible response shapes: { body: { data } } or { data }
            const responseBody = res?.data?.body ?? res?.data;
            const det = responseBody?.data || responseBody;

            if (det && det.skillId) {
                console.log('Skill details for edit:', det);
                const isActiveValue = det.isActive !== undefined ? det.isActive : det.active !== undefined ? det.active : true;
                setSkillId(det.skillId);
                setUserData({
                    skillName: det.skillName || '',
                    skillDescription: det.skillDescription || '',
                    skillLevel: det.skillLevel || '',
                    isActive: Boolean(isActiveValue)
                });
            } else {
                Swal.fire('Error', 'Failed to load skill details', 'error');
                setOpen(false);
            }
        } catch (error) {
            console.error('Error fetching skill details:', error);
            Swal.fire('Error', 'Failed to load skill details. Please try again.', 'error');
            setOpen(false);
        }
    };

    const handleDelete = async (skillId) => {
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
                    const authHeaders = getAuthHeaders();
                    if (!authHeaders) {
                        Swal.fire('Error', 'Authentication required. Please login again.', 'error');
                        sessionStorage.removeItem('user');
                        window.location.href = '/';
                        return;
                    }
                    await deleteSkill(skillId, authHeaders);
                    setRefreshTrigger((prev) => !prev);
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'Skill has been deleted.',
                        icon: 'success'
                    });
                } catch (error) {
                    Swal.fire({
                        title: 'Error!',
                        text: 'There was a problem deleting the skill.',
                        icon: 'error'
                    });
                    console.error('Error deleting skill:', error);
                }
            }
        });
    };

    const getSkillLevelColor = (level) => {
        switch (level) {
            case 'Beginner':
                return 'rgba(76, 175, 80, 0.8)';
            case 'Intermediate':
                return 'rgba(33, 150, 243, 0.8)';
            case 'Advanced':
                return 'rgba(255, 152, 0, 0.8)';
            case 'Expert':
                return 'rgba(156, 39, 176, 0.8)';
            default:
                return 'rgba(158, 158, 158, 0.8)';
        }
    };

    const renderCardView = () => (
        <Grid container spacing={isMobile ? 2 : 3}>
            {skills.length === 0 ? (
                <Grid item xs={12}>
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="h6" color="textSecondary">
                            No skills found
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Skills array length: {skills.length}
                        </Typography>
                    </Box>
                </Grid>
            ) : (
                skills.map((skill) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={skill.skillId}>
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
                                        <Psychology />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5, color: '#880E4F' }}>
                                            {skill.skillName}
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                            <Chip
                                                label={skill.isActive}
                                                size="small"
                                                sx={{
                                                    bgcolor:
                                                        skill.isActive === 'Active' ? 'rgba(76, 175, 80, 0.9)' : 'rgba(244, 67, 54, 0.9)',
                                                    color: 'white',
                                                    fontWeight: 'bold'
                                                }}
                                            />
                                            <Chip
                                                label={skill.skillLevel}
                                                size="small"
                                                sx={{
                                                    bgcolor: getSkillLevelColor(skill.skillLevel),
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
                                    {skill.skillDescription}
                                </Typography>

                                <Divider sx={{ my: 1, bgcolor: 'rgba(136, 14, 79, 0.2)' }} />

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                    <Typography variant="caption" sx={{ opacity: 0.7, color: '#880E4F' }}>
                                        ID: {skill.skillId}
                                    </Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.7, color: '#880E4F' }}>
                                        {skill.insertedDate}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="caption" sx={{ opacity: 0.7, color: '#880E4F' }}>
                                        Updated: {skill.updatedDate}
                                    </Typography>
                                    <Box>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleEdit(skill.skillId)}
                                            sx={{ color: '#880E4F', '&:hover': { bgcolor: 'rgba(136, 14, 79, 0.1)' } }}
                                        >
                                            <Edit fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleDelete(skill.skillId)}
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
            ? columns.filter(col => ['skillId', 'skillName', 'skillLevel', 'actions'].includes(col.id))
            : isTablet
            ? columns.filter(col => !['insertedDate', 'updatedDate', 'skillDescription'].includes(col.id))
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
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {skills.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={visibleColumns.length} align="center">
                                        <Box sx={{ py: 2 }}>
                                            <div>No skills found</div>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                skills.map((row) => (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.skillId}>
                                        {visibleColumns.map((column) => (
                                            <TableCell 
                                                key={column.id} 
                                                align={column.align}
                                                sx={{ fontSize: isMobile ? 12 : 14, whiteSpace: 'nowrap' }}
                                            >
                                                {column.id === 'isActive' ? (
                                                    <Box
                                                        sx={{
                                                            backgroundColor: row.isActive === 'Active' ? '#4caf50' : '#f44336',
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
                                                        {row.isActive}
                                                    </Box>
                                                ) : column.id === 'skillLevel' ? (
                                                    <Box
                                                        sx={{
                                                            backgroundColor: getSkillLevelColor(row[column.id]),
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
                                                        {row[column.id]}
                                                    </Box>
                                                ) : column.id === 'actions' ? (
                                                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                        <IconButton 
                                                            size={isMobile ? 'small' : 'medium'}
                                                            onClick={() => handleEdit(row.skillId)} 
                                                            style={{ color: '#00afb5' }}
                                                        >
                                                            <Edit fontSize={isMobile ? 'small' : 'medium'} />
                                                        </IconButton>
                                                        <IconButton 
                                                            size={isMobile ? 'small' : 'medium'}
                                                            onClick={() => handleDelete(row.skillId)} 
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
                                Skills Management
                            </Typography>
                            <Badge badgeContent={typeof skillCount === 'number' ? skillCount : 0} color="primary">
                                <Psychology color="action" />
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
                                onClick={handleAddSkill}
                            >
                                {isMobile ? 'Add' : 'Add Skill'}
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
                    {editMode ? 'Edit Skill' : 'Add Skill'}
                </DialogTitle>
                <Box component="form" onSubmit={postData} noValidate sx={{ p: { xs: 2, sm: 3 } }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Skill Name"
                                name="skillName"
                                value={userdata.skillName}
                                onChange={changeHandler}
                                error={!!errors.skillName}
                                helperText={errors.skillName}
                                placeholder="e.g., React.js, Python, UI/UX Design"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth error={!!errors.skillLevel}>
                                <InputLabel>Skill Level</InputLabel>
                                <Select name="skillLevel" value={userdata.skillLevel} onChange={changeHandler} label="Skill Level">
                                    <MenuItem value="">
                                        <em>Select skill level</em>
                                    </MenuItem>
                                    {skillLevels.map((level) => (
                                        <MenuItem key={level.value} value={level.value}>
                                            {level.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.skillLevel && (
                                    <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>{errors.skillLevel}</Box>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Skill Description"
                                name="skillDescription"
                                value={userdata.skillDescription}
                                onChange={changeHandler}
                                error={!!errors.skillDescription}
                                helperText={errors.skillDescription}
                                placeholder="Describe the skill and its applications"
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

export default Skills;
