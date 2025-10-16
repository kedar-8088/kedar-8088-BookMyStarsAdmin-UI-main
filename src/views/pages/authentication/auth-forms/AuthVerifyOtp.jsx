import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as Yup from 'yup';
import { Formik } from 'formik';
import Swal from 'sweetalert2';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import { BaseUrl } from 'BaseUrl';

// OTP component
import OTPInput from './OtpInput';

const AuthVerifyOTP = ({ ...others }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const defaultOtp = '123456'; // Set OTP directly
    const [otp, setOtp] = useState(defaultOtp);

    useEffect(() => {
        sessionStorage.setItem('otp', defaultOtp);
    }, [defaultOtp]);

    //   const handleOTPSubmit = async (values, { setSubmitting, setErrors }) => {
    //     try {
    //       const response = await axios.post(`${BaseUrl}/login/v1/verifyOtp`, {
    //         mobileNumber: sessionStorage.getItem('mobileNumber'),
    //         otp: values.otp
    //       });

    //       const result = response.data;

    //       if (result.responseCode === 1000) {
    //         Swal.fire({
    //           position: 'top-end',
    //           icon: 'success',
    //           title: result.message,
    //           showConfirmButton: false,
    //           timer: 3000,
    //           toast: true
    //         });
    //         navigate('/dashboard');
    //       } else {
    //         Swal.fire({
    //           position: 'top-end',
    //           icon: 'error',
    //           title: result.errorMessage || result.message,
    //           showConfirmButton: false,
    //           timer: 3000,
    //           toast: true
    //         });
    //       }
    //     } catch (error) {
    //       Swal.fire({
    //         position: 'top-end',
    //         icon: 'error',
    //         title: 'An error occurred. Please try again.',
    //         showConfirmButton: false,
    //         timer: 3000,
    //         toast: true
    //       });
    //     }
    //     setSubmitting(false);
    //   };

    const handleResendOTP = async () => {
        const mobileNumber = sessionStorage.getItem('mobileNumber');
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
                otp: defaultOtp, // Set OTP directly in Formik
                submit: null
            }}
            validationSchema={Yup.object().shape({
                otp: Yup.string()
                    .required('OTP is required')
                    .length(6, 'OTP must be exactly 6 digits')
                    .matches(/^[0-9]+$/, 'OTP must be a valid 6-digit number')
            })}
            //   onSubmit={handleOTPSubmit}
        >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                <form noValidate onSubmit={handleSubmit} {...others}>
                    <FormControl fullWidth error={Boolean(touched.otp && errors.otp)} sx={{ ...theme.typography.customInput }}>
                        <Typography variant="h6" gutterBottom>
                            Enter OTP
                        </Typography>
                        <OTPInput
                            value={values.otp} // Sync OTPInput with Formik values
                            onChange={(newOtp) => handleChange({ target: { name: 'otp', value: newOtp } })} // Update Formik values
                            length={6}
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
                                onClick={() => navigate('/reset-password')}
                            >
                                Verify OTP
                            </Button>
                        </AnimateButton>
                    </Box>
                </form>
            )}
        </Formik>
    );
};

export default AuthVerifyOTP;
