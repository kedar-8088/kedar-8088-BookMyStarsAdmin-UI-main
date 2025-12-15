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
import { fetchBanner, addBanner, deleteBanner, getAdvertiseById, updatedAdvertise } from 'views/professionals API/BannerApi';
import { BaseUrl } from 'BaseUrl';
import { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import { Box, Button, Dialog, DialogActions, DialogTitle, TextField, Container, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { DeleteForever, Edit } from '@mui/icons-material';
import Swal from 'sweetalert2';

// Add AuthImage component outside the Banner component
const AuthImage = ({ filePath }) => {
    const [src, setSrc] = useState('');
    const user = JSON.parse(sessionStorage.getItem('user'));

    useEffect(() => {
        if (!filePath) return;

        const fetchImage = async () => {
            try {
                const response = await axios.get(`${BaseUrl}/bookmystarsadmin/file/downloadFile/?filePath=${encodeURIComponent(filePath)}`, {
                    headers: {
                        Authorization: `Bearer ${user?.accessToken}`
                    },
                    responseType: 'blob'
                });
                const blob = new Blob([response.data], { type: response.headers['content-type'] });
                const imageUrl = URL.createObjectURL(blob);
                setSrc(imageUrl);
            } catch (error) {
                console.error('Error fetching image:', error);
                setSrc(''); // Optionally set a placeholder image here
            }
        };

        fetchImage();

        return () => {
            if (src) {
                URL.revokeObjectURL(src);
            }
        };
    }, [filePath, user?.accessToken]);

    return src ? <img src={src} style={{ width: 80, height: 50 }} alt="Advertisement" /> : 'Loading...';
};

const columns = [
    { id: 'advertisementId', label: 'ID' },
    { id: 'advertisementName', label: 'Name', minWidth: 100 },
    { id: 'description', label: 'Description', minWidth: 100 },
    { id: 'file', label: 'File' },
    { id: 'createdBy', label: 'Created By', align: 'right' },
    { id: 'updatedBy', label: 'Updated By', align: 'right' },
    { id: 'insertedDate', label: 'Inserted Date', align: 'right' },
    { id: 'updatedDate', label: 'Updated Date', align: 'right' },
    { id: 'actions', label: 'Actions', align: 'right' }
];

const Banner = () => {
    const theme = useTheme();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [advertisement, setAdvertisement] = useState([]);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [userdata, setUserData] = useState({
        advertisementName: '',
        description: '',
        fileName: ''
    });
    const [errors, setErrors] = useState({});
    const [fileError, setFileError] = useState('');
    const [fileName, setFileName] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [advertisementId, setAdvertisementId] = useState(null);
    const inputRef = useRef(null);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const user = JSON.parse(sessionStorage.getItem('user'));
    const accessToken = user?.accessToken;
    const headers = {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
    };

    const ImageUrl = `${BaseUrl}/file/downloadFile/?filePath=`;

    const FetchData = async () => {
        try {
            const res = await fetchBanner(page, rowsPerPage, headers);
            const fetchedData = res.data.content;
            console.log(res.data.content);
            if (fetchedData) {
                const tableData = fetchedData.map((p) => ({
                    advertisementId: p.advertisementId,
                    advertisementName: p.advertisementName,
                    description: p.description,
                    file: p.filePath ? <AuthImage filePath={p.filePath} /> : 'NO IMAGE FOUND',
                    insertedDate: moment(p.insertedDate).format('L'),
                    updatedDate: moment(p.updatedDate).format('L'),
                    createdBy: p.createdBy ? p.createdBy.userName : 'No User',
                    updatedBy: p.updatedBy ? p.updatedBy.userName : 'No User'
                }));

                setAdvertisement(tableData);
            } else {
                setAdvertisement([]);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        FetchData();
    }, [refreshTrigger, page, rowsPerPage]);

    // Avoid aria-hidden warning by blurring focused elements when dialog opens
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
                    if (!advertisementId) {
                        console.error('Cannot update: missing advertisementId');
                        return;
                    }
                    const updatedData = {
                        ...userdata,
                        advertisementId,
                        updatedBy: { userId: user.userId }
                    };
                    await updatedAdvertise(updatedData, headers);
                } else {
                    const payload = {
                        ...userdata,
                        createdBy: { userId: user.userId }
                    };
                    await addBanner(payload, headers);
                }
                setUserData({ advertisementName: '', description: '', fileName: '' });
                inputRef.current.value = null;
                setRefreshTrigger((prev) => !prev);
                setOpen(false);
            } catch (error) {
                console.error('Error saving advertisement:', error);
            }
        }
    };

    const onFileUpload = async (e) => {
        e.preventDefault();
        if (!selectedFile) {
            setFileError('Please select a file');
            return;
        }
        const data = new FormData();
        data.append('file', selectedFile);

        try {
            const res = await axios.post(`${BaseUrl}/bookmystarsadmin/file/uploadFile`, data, {
                headers: {
                    'content-type': 'multipart/form-data',
                    Authorization: 'Bearer ' + user.accessToken
                }
            });
            setFileName(res.data.fileName);
            alert(res.data.message);
            setUserData({ ...userdata, fileName: res.data.fileName });
            setFileError('');
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const onFileChange = (e) => {
        setFileName(e.target.files[0].name);
        setSelectedFile(e.target.files[0]);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!userdata.advertisementName || userdata.advertisementName.trim() === '') {
            newErrors.advertisementName = 'Enter the Advertisement name';
        }

        if (!userdata.description || userdata.description.trim() === '') {
            newErrors.description = 'Enter the description';
        }

        if (!userdata.fileName || userdata.fileName.trim() === '') {
            newErrors.fileName = 'Select the file';
        }

        return newErrors;
    };

    const changeHandler = (e) => {
        setUserData({
            ...userdata,
            [e.target.name]: e.target.value,
            createdBy: { userId: user.userId }
        });

        setErrors({
            ...errors,
            [e.target.name]: null
        });
    };

    const handleAddBanner = () => {
        setEditMode(false);
        setUserData({
            advertisementName: '',
            description: '',
            fileName: ''
        });
        setOpen(true);
    };

    const handleEdit = async (advertisementId) => {
        setEditMode(true);
        setOpen(true);
        // Ensure we have the ID locally even if the details fetch fails
        setAdvertisementId(advertisementId);
        try {
            const res = await getAdvertiseById(advertisementId, headers);
            const det = res.data;

            setAdvertisementId(det.advertisementId);
            setUserData({
                advertisementName: det.advertisementName,
                description: det.description,
                fileName: det.fileName
            });
        } catch (error) {
            console.error('Error fetching advertisement details:', error);
        }
    };

    const handleDelete = async (advertisementId) => {
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
                    await deleteBanner(advertisementId, headers);
                    setRefreshTrigger((prev) => !prev);
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'Your file has been deleted.',
                        icon: 'success'
                    });
                } catch (error) {
                    Swal.fire({
                        title: 'Error!',
                        text: 'There was a problem deleting the record.',
                        icon: 'error'
                    });
                    console.error('Error deleting qualification:', error);
                }
            }
        });
    };

    return (
        <MainCard
            title={
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Banner</span>
                    <Button
                        variant="contained"
                        style={{ backgroundColor: '#00afb5', color: 'white' }}
                        sx={{ display: 'flex', alignItems: 'center', fontSize: '15px' }}
                        onClick={handleAddBanner}
                    >
                        Add
                        <AddIcon sx={{ color: '#fff' }} />
                    </Button>
                </Box>
            }
        >
            <Grid container spacing={gridSpacing}></Grid>
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
                            {advertisement.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                <TableRow hover role="checkbox" tabIndex={-1} key={row.advertisementId}>
                                    {columns.map((column) => (
                                        <TableCell key={column.id} align={column.align}>
                                            {column.id === 'actions' ? (
                                                <>
                                                    <IconButton
                                                        onClick={() => handleEdit(row.advertisementId)}
                                                        style={{ color: '#00afb5' }}
                                                    >
                                                        <Edit />
                                                    </IconButton>
                                                    <IconButton onClick={() => handleDelete(row.advertisementId)} color="error">
                                                        <DeleteForever />
                                                    </IconButton>
                                                </>
                                            ) : (
                                                row[column.id]
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={advertisement.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
                <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.25rem', backgroundColor: '#f5f5f5' }}>
                    {editMode ? 'Edit Advertisement' : 'Add Advertisement'}
                </DialogTitle>
                <Box component="form" onSubmit={postData} noValidate sx={{ p: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Advertisement Name"
                                name="advertisementName"
                                value={userdata.advertisementName}
                                onChange={changeHandler}
                                error={!!errors.advertisementName}
                                helperText={errors.advertisementName}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                value={userdata.description}
                                onChange={changeHandler}
                                error={!!errors.description}
                                helperText={errors.description}
                                multiline
                                rows={3}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin="normal"
                                fullWidth
                                id="fileName"
                                label="File Name"
                                name="fileName"
                                autoComplete="fileName"
                                value={userdata.fileName}
                                disabled
                                helperText={errors.fileName}
                                error={!!errors.fileName}
                                InputProps={{
                                    endAdornment: (
                                        <Button
                                            variant="contained"
                                            style={{ backgroundColor: '#00afb5', color: 'white' }}
                                            onClick={onFileUpload}
                                        >
                                            Upload
                                        </Button>
                                    )
                                }}
                            />
                            <input type="file" onChange={onFileChange} ref={inputRef} style={{ marginTop: 20 }} />
                        </Grid>
                    </Grid>
                    <DialogActions>
                        <Button type="submit" variant="contained" style={{ backgroundColor: '#00afb5', color: 'white' }}>
                            {editMode ? 'Edit' : 'Add'}
                        </Button>
                        <Button onClick={() => setOpen(false)} style={{ color: '#00afb5' }}>
                            Cancel
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </MainCard>
    );
};

export default Banner;
