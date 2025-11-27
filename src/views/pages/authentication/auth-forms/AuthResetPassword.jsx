import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as Yup from 'yup';
import { Formik } from 'formik';
import Swal from 'sweetalert2';
import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import { BaseUrl } from 'BaseUrl';
import { Stack } from '@mui/system';
import { Typography } from '@mui/material';
import OTPInput from './OtpInput';

const AuthResetPassword = ({ ...others }) => {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();

    const mobileNumber = sessionStorage.getItem('mobileNumber');

    const handleSubmit = async (values, { setSubmitting, setErrors }) => {
        const { newPassword, otp } = values;

        try {
            const response = await axios.post(`${BaseUrl}/login/v1/resetPassword`, {
                mobileNumber,
                otp,
                newPassword
            });

            const result = response.data;
            console.log(result);
            if (result.responseCode === 202) {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: result.message,
                    showConfirmButton: false,
                    timer: 3000,
                    toast: true
                });
                navigate('/');
            } else {
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: result.errorMessage || result.message,
                    showConfirmButton: false,
                    timer: 3000,
                    toast: true
                });
            }
        } catch (error) {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'An error occurred. Please try again.',
                showConfirmButton: false,
                timer: 3000,
                toast: true
            });
        }
        setSubmitting(false);
    };

    const handleResendOTP = async () => {
        try {
            const response = await axios.post(`${BaseUrl}/login/v1/resendOtp`, {
                mobileNumber
            });

            const result = response.data;

            if (result.responseCode === 1000) {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: result.message,
                    showConfirmButton: false,
                    timer: 3000,
                    toast: true
                });
            } else {
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: result.errorMessage || result.message,
                    showConfirmButton: false,
                    timer: 3000,
                    toast: true
                });
            }
        } catch (error) {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'An error occurred. Please try again.',
                showConfirmButton: false,
                timer: 3000,
                toast: true
            });
        }
    };

    return (
        <Formik
            initialValues={{
                newPassword: '',
                otp: '',
                submit: null
            }}
            validationSchema={Yup.object().shape({
                newPassword: Yup.string().required('New Password is required').min(6, 'Password must be at least 6 characters')
            })}
            onSubmit={handleSubmit}
        >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
                <form noValidate onSubmit={handleSubmit} {...others}>
                    <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                        <InputLabel htmlFor="outlined-adornment-mobileNumber">Mobile Number</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-mobileNumber"
                            type="text"
                            value={mobileNumber}
                            name="mobileNumber"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            label="Mobile Number"
                            disabled // Disable the input field
                        />
                    </FormControl>

                    <FormControl
                        fullWidth
                        error={Boolean(touched.newPassword && errors.newPassword)}
                        sx={{ ...theme.typography.customInput }}
                    >
                        <InputLabel htmlFor="outlined-adornment-newPassword">New Password</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-newPassword"
                            type="password"
                            value={values.newPassword}
                            name="newPassword"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            label="New Password"
                        />
                        {touched.newPassword && errors.newPassword && (
                            <FormHelperText error id="standard-weight-helper-text-newPassword">
                                {errors.newPassword}
                            </FormHelperText>
                        )}
                    </FormControl>
                    {/* 
          <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
            <Typography variant="h6" gutterBottom>
              Enter OTP
            </Typography>
            <OTPInput value={values.otp} onChange={(otp) => setFieldValue('otp', otp)} /> 
          </FormControl> */}

                    <FormControl fullWidth error={Boolean(touched.otp && errors.otp)} sx={{ ...theme.typography.customInput }}>
                        <InputLabel htmlFor="outlined-adornment-otp">OTP</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-otp"
                            type="text"
                            value={values.otp}
                            name="otp"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            label="OTP"
                        />
                        {touched.otp && errors.otp && (
                            <FormHelperText error id="standard-weight-helper-text-otp">
                                {errors.otp}
                            </FormHelperText>
                        )}
                    </FormControl>

                    <Stack direction="row" justifyContent="flex-end" spacing={1}>
                        <Typography
                            variant="subtitle1"
                            color="secondary"
                            sx={{ textDecoration: 'none', cursor: 'pointer' }}
                            onClick={handleResendOTP}
                        >
                            Resend OTP?
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
                                color="secondary"
                                disabled={isSubmitting}
                            >
                                Reset Password
                            </Button>
                        </AnimateButton>
                    </Box>
                </form>
            )}
        </Formik>
    );
};

export default AuthResetPassword;
