import axios from 'axios';
import Swal from 'sweetalert2';
import { BaseUrl } from 'BaseUrl';

export const fetchStates = async (headers, pageNumber = 0, pageSize = 10) => {
    return await axios({
        method: 'get',
        url: `${BaseUrl}/bookmystarsadmin/state/v1/list?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        headers: headers
    });
};

export const addState = async (data, headers) => {
    try {
        console.log('Request data:', data);
        // Ensure the data structure matches the API expectations
        const requestData = {
            stateName: data.stateName,
            stateCode: data.stateCode.toUpperCase(),
            countryId: parseInt(data.countryId, 10),
            isActive: Boolean(data.isActive),
            insertedBy: data.insertedBy
        };
        console.log('Formatted request data:', requestData);
        const res = await axios({
            method: 'POST',
            url: `${BaseUrl}/bookmystarsadmin/state/v1/create`,
            headers,
            data: requestData
        });

        // Handle different response structures
        const responseBody = res?.data?.body || res?.data;
        const code = responseBody?.code;
        const message = responseBody?.message || 'State created successfully';
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
        console.error('Error adding state:', error);
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to add state';
        Swal.fire('Error', errorMessage, 'error');
    }
};

export const deleteState = async (id, headers) => {
    try {
        const res = await axios({
            method: 'DELETE',
            url: `${BaseUrl}/bookmystarsadmin/state/v1/${id}`,
            headers
        });

        // Handle different response structures
        const responseBody = res?.data?.body || res?.data;
        const code = responseBody?.code;
        const message = responseBody?.message || 'State deleted successfully';
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
        console.error('Error deleting state:', error);
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete state';
        Swal.fire('Error', errorMessage, 'error');
    }
};

export const getStateById = async (id, headers) => {
    try {
        console.log('Fetching state details for ID:', id);
        const res = await axios({
            method: 'GET',
            url: `${BaseUrl}/bookmystarsadmin/state/v1/${id}`,
            headers: headers
        });
        console.log('State details response:', res.data);
        return res;
    } catch (error) {
        console.error('Error in getStateById:', error.response || error);
        throw error;
    }
};



export const updateState = async (updatedData, headers) => {
    try {
        const res = await axios({
            method: 'PUT',
            url: `${BaseUrl}/bookmystarsadmin/state/v1/update/${updatedData.stateId}`,
            headers: headers,
            data: updatedData
        });

        // Handle different response structures
        const responseBody = res?.data?.body || res?.data;
        const code = responseBody?.code;
        const message = responseBody?.message || 'State updated successfully';
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
        console.error('Error updating state:', error);
        
        let errorMessage = 'Failed to update state';
        if (error?.response?.data?.error) {
            errorMessage = error.response.data.error;
        } else if (error?.response?.data?.message) {
            errorMessage = error.response.data.message;
        } else if (error?.message) {
            errorMessage = error.message;
        }
        
        Swal.fire('Error', errorMessage, 'error');
    }
};

export const getAllStates = async (headers) => {
    return await axios({
        method: 'get',
        url: `${BaseUrl}/bookmystarsadmin/state/v1/all`,
        headers
    });
};

export const getActiveStates = async (headers) => {
    return await axios({
        method: 'get',
        url: `${BaseUrl}/bookmystarsadmin/state/v1/active`,
        headers: headers
    });
};

export const getStateByName = async (stateName, headers) => {
    return await axios({
        method: 'GET',
        url: `${BaseUrl}/bookmystarsadmin/state/v1/getByName/${stateName}`,
        headers: headers
    });
};

export const getStateByCode = async (stateCode, headers) => {
    return await axios({
        method: 'GET',
        url: `${BaseUrl}/bookmystarsadmin/state/v1/getByCode/${stateCode}`,
        headers: headers
    });
};

// Search states by name
export const searchStateByName = async (stateName, headers) => {
    return await axios({
        method: 'GET',
        url: `${BaseUrl}/bookmystarsadmin/state/v1/search?stateName=${stateName}`,
        headers: headers
    });
};

// Get state count
export const getStateCount = async (headers) => {
    return await axios({
        method: 'GET',
        url: `${BaseUrl}/bookmystarsadmin/state/v1/count`,
        headers: headers
    });
};

export const activateState = async (stateId, headers) => {
    try {
        const res = await axios({
            method: 'PUT',
            url: `${BaseUrl}/bookmystarsadmin/state/v1/${stateId}/activate`,
            headers
        });
        const responseBody = res?.data?.body || res?.data;
        const message = responseBody?.message || 'State activated successfully';
        Swal.fire('Success', message, 'success');
        return res;
    } catch (error) {
        console.error('Error activating state:', error);
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to activate state';
        Swal.fire('Error', errorMessage, 'error');
        throw error;
    }
};

export const deactivateState = async (stateId, headers) => {
    try {
        const res = await axios({
            method: 'PUT',
            url: `${BaseUrl}/bookmystarsadmin/state/v1/${stateId}/deactivate`,
            headers
        });
        const responseBody = res?.data?.body || res?.data;
        const message = responseBody?.message || 'State deactivated successfully';
        Swal.fire('Success', message, 'success');
        return res;
    } catch (error) {
        console.error('Error deactivating state:', error);
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to deactivate state';
        Swal.fire('Error', errorMessage, 'error');
        throw error;
    }
};

