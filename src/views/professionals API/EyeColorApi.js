import axios from 'axios';
import Swal from 'sweetalert2';
import { BaseUrl } from 'BaseUrl';

export const fetchEyeColors = async (headers, pageNumber = 0, pageSize = 10) => {
    return await axios({
        method: 'get',
        url: `${BaseUrl}/bookmystarsadmin/eye-color/v1/getAllByPagination?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        headers: headers
    });
};

export const addEyeColor = async (data, headers) => {
    try {
        const res = await axios({
            method: 'POST',
            url: `${BaseUrl}/bookmystarsadmin/eye-color/v1/create`,
            headers,
            data: data
        });

        // Handle different response structures
        const responseBody = res?.data?.body || res?.data;
        const code = responseBody?.code;
        const message = responseBody?.message || 'Eye Color created successfully';
        const error = responseBody?.error || 'An error occurred';

        if (code === 200) {
            Swal.fire('Success', message, 'success');
        } else if (code === 400) {
            Swal.fire('Error', error, 'error');
        } else {
            // Handle other response structures or success without explicit code
            Swal.fire('Success', message, 'success');
        }
    } catch (error) {
        console.error('Error adding eye color:', error);
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to add eye color';
        Swal.fire('Error', errorMessage, 'error');
    }
};

export const deleteEyeColor = async (id, headers) => {
    try {
        const res = await axios
        ({
            method: 'delete',
            url: `${BaseUrl}/bookmystarsadmin/eye-color/v1/delete/${id}`,
            headers
        });

        // Handle different response structures
        const responseBody = res?.data?.body || res?.data;
        const code = responseBody?.code;
        const message = responseBody?.message || 'Eye Color deleted successfully';
        const error = responseBody?.error || 'An error occurred';

        if (code === 200) {
            Swal.fire('Deleted!', message, 'success');
        } else if (code === 400) {
            Swal.fire('Error', error, 'error');
        } else {
            // Handle other response structures or success without explicit code
            Swal.fire('Deleted!', message, 'success');
        }
    } catch (error) {
        console.error('Error deleting eye color:', error);
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete eye color';
        Swal.fire('Error', errorMessage, 'error');
    }
};

export const getEyeColorById = async (id, headers) => {
    return await axios({
        method: 'GET',
        url: `${BaseUrl}/bookmystarsadmin/eye-color/v1/get/${id}`,
        headers: headers
    });
};

export const updateEyeColor = async (updatedData, headers) => {
    try {
        const res = await axios({
            method: 'PUT',
            url: `${BaseUrl}/bookmystarsadmin/eye-color/v1/update`,
            headers: headers,
            data: updatedData
        });

        // Handle different response structures
        const responseBody = res?.data?.body || res?.data;
        const code = responseBody?.code;
        const message = responseBody?.message || 'Eye Color updated successfully';
        const error = responseBody?.error || 'An error occurred';

        if (code === 200) {
            Swal.fire('Success', message, 'success');
        } else if (code === 400) {
            Swal.fire('Error', error, 'error');
        } else {
            // Handle other response structures or success without explicit code
            Swal.fire('Success', message, 'success');
        }
    } catch (error) {
        console.error('Error updating eye color:', error);
        console.error('Error response data:', error?.response?.data);
        console.error('Error status:', error?.response?.status);
        
        let errorMessage = 'Failed to update eye color';
        
        // Extract error message from various possible response structures
        if (error?.response?.data) {
            const errorData = error.response.data;
            
            // Check for database/constraint errors
            if (errorData.error && typeof errorData.error === 'string') {
                if (errorData.error.includes('foreign key constraint')) {
                    errorMessage = 'Database error: Invalid user reference. Please contact administrator.';
                } else if (errorData.error.includes('violates foreign key constraint')) {
                    errorMessage = 'Database error: The referenced user does not exist. Please contact administrator.';
                } else {
                    errorMessage = errorData.error;
                }
            } else if (errorData.message) {
                errorMessage = errorData.message;
            } else if (errorData.body?.error) {
                errorMessage = errorData.body.error;
            } else if (errorData.body?.message) {
                errorMessage = errorData.body.message;
            } else if (typeof errorData === 'string') {
                errorMessage = errorData;
            }
        } else if (error?.message) {
            errorMessage = error.message;
        }
        
        Swal.fire('Error', errorMessage, 'error');
        throw error; // Re-throw to let the calling component handle it
    }
};

export const getAllEyeColors = async (headers) => {
    return await axios({
        method: 'get',
        url: `${BaseUrl}/bookmystarsadmin/eye-color/v1/getAll`,
        headers: headers
    });
};

export const getEyeColorByName = async (eyeColorName, headers) => {
    return await axios({
        method: 'GET',
        url: `${BaseUrl}/bookmystarsadmin/eye-color/v1/getByName/${eyeColorName}`,
        headers: headers
    });
};

export const searchEyeColors = async (eyeColorName, headers) => {
    return await axios({
        method: 'GET',
        url: `${BaseUrl}/bookmystarsadmin/eye-color/v1/search?eyeColorName=${eyeColorName}`,
        headers: headers
    });
};

export const getEyeColorCount = async (headers) => {
    return await axios({
        method: 'GET',
        url: `${BaseUrl}/bookmystarsadmin/eye-color/v1/count`,
        headers: headers
    });
};
