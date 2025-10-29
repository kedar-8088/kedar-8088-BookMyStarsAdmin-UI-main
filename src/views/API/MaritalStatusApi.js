import axios from 'axios';
import Swal from 'sweetalert2';
import { BaseUrl } from 'BaseUrl';

export const fetchMaritalStatuses = async (headers, pageNumber = 0, pageSize = 10) => {
    return await axios({
        method: 'get',
        url: `${BaseUrl}/bookmystarsadmin/marital-status/v1/getAllByPagination?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        headers: headers
    });
};

export const addMaritalStatus = async (data, headers) => {
    try {
        // Create a minimal request payload to avoid Hibernate proxy serialization issues
        const requestData = {
            maritalStatusName: data.maritalStatusName,
            maritalStatusDescription: data.maritalStatusDescription
            // Removed isActive and insertedBy fields to avoid serialization issues
            // The backend should handle these fields internally
        };

        console.log('Creating marital status with data:', requestData);

        const res = await axios({
            method: 'POST',
            url: `${BaseUrl}/bookmystarsadmin/marital-status/v1/create`,
            headers,
            data: requestData
        });

        // Handle different response structures
        const responseBody = res?.data?.body || res?.data;
        const code = responseBody?.code;
        const message = responseBody?.message || 'Marital Status created successfully';
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
        console.error('Error adding marital status:', error);
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to add marital status';
        Swal.fire('Error', errorMessage, 'error');
    }
};

export const deleteMaritalStatus = async (id, headers) => {
    try {
        const res = await axios
        ({
            method: 'delete',
            url: `${BaseUrl}/bookmystarsadmin/marital-status/v1/delete/${id}`,
            headers
        });

        // Handle different response structures
        const responseBody = res?.data?.body || res?.data;
        const code = responseBody?.code;
        const message = responseBody?.message || 'Marital Status deleted successfully';
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
        console.error('Error deleting marital status:', error);
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete marital status';
        Swal.fire('Error', errorMessage, 'error');
    }
};

export const getMaritalStatusById = async (id, headers) => {
    return await axios({
        method: 'GET',
        url: `${BaseUrl}/bookmystarsadmin/marital-status/v1/get/${id}`,
        headers: headers
    });
};

export const updateMaritalStatus = async (updatedData, headers) => {
    try {
        console.log('Attempting to update marital status with data:', updatedData);
        
        // Create a minimal request payload to avoid Hibernate proxy serialization issues
        // Only send the fields that are actually needed for the update
        const requestData = {
            maritalStatusId: updatedData.maritalStatusId,
            maritalStatusName: updatedData.maritalStatusName,
            maritalStatusDescription: updatedData.maritalStatusDescription
            // Removed isActive field as it might be causing issues with the backend
            // The backend should handle the active status internally
        };
        
        console.log('Sending update request to:', `${BaseUrl}/bookmystarsadmin/marital-status/v1/update`);
        console.log('Request data:', requestData);
        console.log('Request data JSON:', JSON.stringify(requestData, null, 2));
        
        const res = await axios({
            method: 'PUT',
            url: `${BaseUrl}/bookmystarsadmin/marital-status/v1/update`,
            headers: headers,
            data: requestData
        });

        console.log('Update API response:', res.data);
        console.log('Response status:', res.status);
        console.log('Response headers:', res.headers);

        // Handle response structure - backend returns ClientResponseBean
        const responseBody = res?.data;
        const code = responseBody?.code;
        const message = responseBody?.message || 'Marital Status updated successfully';
        const error = responseBody?.error || 'An error occurred';

        console.log('Response body analysis:', {
            code,
            message,
            error,
            status: responseBody?.status,
            data: responseBody?.data
        });

        // Backend returns 201 for successful updates
        if (code === 201 || code === 200 || res.status === 201 || res.status === 200) {
            return { success: true, message, data: responseBody?.data };
        } else if (code === 400 || res.status === 400) {
            throw new Error(error || 'Update operation failed');
        } else {
            // For unclear responses, check HTTP status
            if (res.status >= 200 && res.status < 300) {
                return { success: true, message, data: responseBody?.data };
            } else {
                throw new Error(message || 'Update operation failed');
            }
        }
    } catch (error) {
        console.error('Error updating marital status:', error);
        
        // Log detailed error information
        console.log('Detailed API error info:', {
            status: error?.response?.status,
            statusText: error?.response?.statusText,
            data: error?.response?.data,
            message: error?.message,
            config: {
                url: error?.config?.url,
                method: error?.config?.method,
                data: error?.config?.data
            }
        });
        
        // Log the full error response data separately for better visibility
        console.log('Full error response data:', JSON.stringify(error?.response?.data, null, 2));
        console.log('Request data that was sent:', JSON.stringify(error?.config?.data, null, 2));
        
        let errorMessage = 'Failed to update marital status';
        if (error?.response?.data?.error) {
            errorMessage = error.response.data.error;
        } else if (error?.response?.data?.message) {
            errorMessage = error.response.data.message;
        } else if (error?.message) {
            errorMessage = error.message;
        }
        
        Swal.fire('Error', errorMessage, 'error');
        throw error; // Re-throw to let the calling component handle it
    }
};

export const getAllMaritalStatuses = async (headers) => {
    return await axios({
        method: 'get',
        url: `${BaseUrl}/bookmystarsadmin/marital-status/v1/getAll`,
        headers: headers
    });
};

export const getMaritalStatusByName = async (maritalStatusName, headers) => {
    return await axios({
        method: 'GET',
        url: `${BaseUrl}/bookmystarsadmin/marital-status/v1/getByName/${maritalStatusName}`,
        headers: headers
    });
};

export const searchMaritalStatuses = async (maritalStatusName, headers) => {
    return await axios({
        method: 'GET',
        url: `${BaseUrl}/bookmystarsadmin/marital-status/v1/search?maritalStatusName=${maritalStatusName}`,
        headers: headers
    });
};

export const getMaritalStatusCount = async (headers) => {
    return await axios({
        method: 'GET',
        url: `${BaseUrl}/bookmystarsadmin/marital-status/v1/count`,
        headers: headers
    });
};
