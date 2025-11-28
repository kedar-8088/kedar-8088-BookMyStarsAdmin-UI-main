import { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import Google from 'assets/images/icons/social-google.svg';
import { Link } from 'react-router-dom';
import { BaseUrl } from 'BaseUrl';
import Swal from 'sweetalert2';

// API URL
const API_URL = `${BaseUrl}/bookmystarsadmin/login/v1/userLogin`;

const AuthLogin = ({ ...others }) => {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const customization = useSelector((state) => state.customization);
    const [checked, setChecked] = useState(true);
    const navigate = useNavigate();

    const googleHandler = async () => {
        console.error('Login');
    };

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleLoginSubmit = (values, { setSubmitting, setErrors }) => {
        axios
            .post(API_URL, {
                userName: values.userName,
                password: values.password
            })
            .then((response) => {
                console.log('API response:', response.data);
                if (response.data.status === 'FAILED') {
                    // alert(response.data.errorMessage);
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: response.data.errorMessage,
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        toast: true,
                        customClass: {
                            container: 'custom-swal-container'
                        },
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer);
                            toast.addEventListener('mouseleave', Swal.resumeTimer);
                        }
                    });
                    navigate('/');
                } else {
                    sessionStorage.setItem('user', JSON.stringify(response.data));
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Login Successful',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        toast: true,
                        customClass: {
                            container: 'custom-swal-container'
                        },
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer);
                            toast.addEventListener('mouseleave', Swal.resumeTimer);
                        }
                    });

                    const container = document.querySelector('.swal2-container');
                    if (container) {
                        container.style.marginTop = '80px';
                    }

                    navigate('/dashboard');
                }
                setSubmitting(false);
            })
            .catch((error) => {
                console.error('API error:', error);
                setSubmitting(false);
            });
    };

    return (
        <>
            <Grid container direction="column" justifyContent="center" spacing={2}>
                <Grid item xs={12}>
                    <AnimateButton>
                        <Button
                            disableElevation
                            fullWidth
                            onClick={googleHandler}
                            size="large"
                            variant="outlined"
                            sx={{
                                color: 'grey.700',
                                backgroundColor: theme.palette.grey[50],
                                borderColor: theme.palette.grey[100]
                            }}
                        >
                            <Box sx={{ mr: { xs: 1, sm: 2, width: 20 } }}>
                                <img src={Google} alt="google" width={16} height={16} style={{ marginRight: matchDownSM ? 8 : 16 }} />
                            </Box>
                            Sign in with Google
                        </Button>
                    </AnimateButton>
                </Grid>
                <Grid item xs={12}>
                    <Box
                        sx={{
                            alignItems: 'center',
                            display: 'flex'
                        }}
                    >
                        <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
                        <Button
                            variant="outlined"
                            sx={{
                                cursor: 'unset',
                                m: 2,
                                py: 0.5,
                                px: 7,
                                borderColor: `${theme.palette.grey[100]} !important`,
                                color: `${theme.palette.grey[900]}!important`,
                                fontWeight: 500,
                                borderRadius: `${customization.borderRadius}px`
                            }}
                            disableRipple
                            disabled
                        >
                            OR
                        </Button>
                        <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
                    </Box>
                </Grid>
                <Grid item xs={12} container alignItems="center" justifyContent="center">
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1">Sign in with Username </Typography>
                    </Box>
                </Grid>
            </Grid>

            <Formik
                initialValues={{
                    userName: '',
                    password: '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    userName: Yup.string().max(255).required('Username is required'),
                    password: Yup.string().max(255).required('Password is required')
                })}
                onSubmit={handleLoginSubmit}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit} {...others}>
                        <FormControl
                            fullWidth
                            error={Boolean(touched.userName && errors.userName)}
                            sx={{
                                ...theme.typography.customInput,
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: '#DA498D' // Default border color
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#DA498D' // Border color on hover
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#DA498D' // Border color when focused
                                    }
                                }
                            }}
                        >
                            <InputLabel htmlFor="outlined-adornment-userName-login">Username</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-userName-login"
                                type="text"
                                value={values.userName}
                                name="userName"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="Username"
                            />
                            {touched.userName && errors.userName && (
                                <FormHelperText error id="standard-weight-helper-text-userName-login">
                                    {errors.userName}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl
                            fullWidth
                            error={Boolean(touched.password && errors.password)}
                            sx={{
                                ...theme.typography.customInput,
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: '#DA498D' // Default border color
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#DA498D' // Border color on hover
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#DA498D' // Border color when focused
                                    }
                                }
                            }}
                        >
                            <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password-login"
                                type={showPassword ? 'text' : 'password'}
                                value={values.password}
                                name="password"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                            size="large"
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                            />
                            {touched.password && errors.password && (
                                <FormHelperText error id="standard-weight-helper-text-password-login">
                                    {errors.password}
                                </FormHelperText>
                            )}
                        </FormControl>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={checked}
                                        onChange={(event) => setChecked(event.target.checked)}
                                        name="checked"
                                        style={{ color: '#DA498D' }}
                                    />
                                }
                                label="Remember me"
                            />
                            <Typography
                                variant="subtitle1"
                                style={{ color: '#DA498D' }}
                                sx={{ textDecoration: 'none', cursor: 'pointer' }}
                                onClick={() => navigate('/forgot-password')}
                            >
                                Forgot Password?
                            </Typography>
                        </Stack>
                        {errors.submit && (
                            <Box sx={{ mt: 3 }}>
                                <FormHelperText error>{errors.submit}</FormHelperText>
                            </Box>
                        )}

                        <Box sx={{ mt: 2 }}>
                            <AnimateButton>
                                <Button
                                    disableElevation
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    style={{ background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)', color: 'white' }}
                                    disabled={isSubmitting}
                                >
                                    Sign in
                                </Button>
                            </AnimateButton>
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default AuthLogin;
