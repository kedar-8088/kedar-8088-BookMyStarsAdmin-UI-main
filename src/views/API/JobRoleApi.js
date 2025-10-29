import axios from 'axios';
import Swal from 'sweetalert2';
import { BaseUrl } from 'BaseUrl';

export const fetchJobRoles = async (headers, pageNumber = 0, pageSize = 10) => {
    return await axios({
        method: 'get',
        url: `${BaseUrl}/bookmystarsadmin/role/v1/pagination?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        headers: headers
    });
};

export const addJobRole = async (data, headers) => {
    try {
        // Create a minimal request payload to match existing role structure
        // Based on the existing roles in the database, they only have roleName and roleDescription
        const requestData = {
            roleName: data.roleName?.trim() || '',
            roleDescription: data.roleDescription?.trim() || ''
            // Temporarily exclude experienceLevel to match existing role structure
            // This might be causing the constraint violation
        };
        
        // TODO: Add experienceLevel support once the basic create functionality works
        // if (data.experienceLevel && data.experienceLevel.trim() !== '') {
        //     requestData.experienceLevel = data.experienceLevel.trim();
        // }

        console.log('Creating job role with data:', requestData);
        console.log('Original data received:', data);
        console.log('Request data JSON:', JSON.stringify(requestData, null, 2));
        
        // Debug: Check if the data looks correct
        console.log('Data validation:', {
            roleName: requestData.roleName,
            roleDescription: requestData.roleDescription,
            experienceLevel: requestData.experienceLevel,
            hasExperienceLevel: 'experienceLevel' in requestData
        });

        // Skip the pre-check for now since the getJobRoleByName endpoint seems to have issues
        // The backend will handle duplicate name validation and return appropriate error messages

        const res = await axios({
            method: 'POST',
            url: `${BaseUrl}/bookmystarsadmin/role/v1/create`,
            headers,
            data: requestData
        });

        console.log('Create API response:', res.data);
        console.log('Response status:', res.status);

        // Handle the new backend response structure
        const responseBody = res?.data;
        const code = responseBody?.code;
        const message = responseBody?.message || 'Role created successfully';
        const error = responseBody?.error || 'An error occurred';
        const status = responseBody?.status;

        // Backend now returns 201 for successful creation
        if (res.status === 201 || code === 201 || status === 'SUCCESS') {
            Swal.fire('Success', message, 'success');
            return { success: true, message, data: responseBody?.data };
        } else if (res.status === 400 || res.status === 409 || code === 400 || status === 'FAILED') {
            Swal.fire('Error', error || message, 'error');
            throw new Error(error || message);
        } else {
            // Handle other response structures
            Swal.fire('Success', message, 'success');
            return { success: true, message, data: responseBody?.data };
        }
    } catch (error) {
        console.error('Error adding role:', error);
        
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
        
        // Handle different error response structures from the updated backend
        let errorMessage = 'Failed to add role';
        if (error?.response?.data?.error) {
            errorMessage = error.response.data.error;
        } else if (error?.response?.data?.message) {
            errorMessage = error.response.data.message;
        } else if (error?.message) {
            errorMessage = error.message;
        }
        
        // Add more specific error handling for constraint violations
        if (error?.response?.status === 409) {
            if (errorMessage.includes('constraint violation') || errorMessage.includes('duplicate')) {
                errorMessage = 'A role with this name already exists. Please choose a different name.';
            } else if (errorMessage.includes('foreign key')) {
                errorMessage = 'Cannot create role due to database constraints. Please check your data.';
            } else {
                errorMessage = 'Cannot create role due to database constraints. This might be because:\n• A role with this name already exists\n• Invalid data format\n• Database constraint violation\n\nPlease try with different data.';
            }
        }
        
        Swal.fire('Error', errorMessage, 'error');
        throw error; // Re-throw to let the calling component handle it
    }
};

export const deleteJobRole = async (id, headers) => {
    try {
        const res = await axios({
            method: 'delete',
            url: `${BaseUrl}/bookmystarsadmin/role/v1/${id}`,
            headers
        });

        console.log('Delete API response:', res.data);
        console.log('Response status:', res.status);

        // Handle the new backend response structure
        const responseBody = res?.data;
        const code = responseBody?.code;
        const message = responseBody?.message || 'Role deleted successfully';
        const error = responseBody?.error || 'An error occurred';
        const status = responseBody?.status;

        // Backend returns 200 for successful deletion
        if (res.status === 200 || code === 200 || status === 'SUCCESS') {
            Swal.fire('Deleted!', message, 'success');
            return { success: true, message };
        } else if (res.status === 400 || res.status === 409 || code === 400 || status === 'FAILED') {
            Swal.fire('Error', error || message, 'error');
            throw new Error(error || message);
        } else {
            // Handle other response structures
            Swal.fire('Deleted!', message, 'success');
            return { success: true, message };
        }
    } catch (error) {
        console.error('Error deleting role:', error);
        
        // Handle different error response structures from the updated backend
        let errorMessage = 'Failed to delete role';
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

export const getJobRoleById = async (id, headers) => {
    return await axios({
        method: 'GET',
        url: `${BaseUrl}/bookmystarsadmin/role/v1/${id}`,
        headers: headers
    });
};

export const updateJobRole = async (updatedData, headers) => {
    try {
        console.log('Attempting to update job role with data:', updatedData);
        
        // Create a minimal request payload to avoid Hibernate proxy serialization issues
        // Only send the fields that are actually needed for the update
        const requestData = {
            roleName: updatedData.roleName?.trim() || '',
            roleDescription: updatedData.roleDescription?.trim() || ''
            // Only include experienceLevel if it's provided and not empty
            // Some roles might not have experience levels
        };
        
        // Only add experienceLevel if it's provided and not empty
        if (updatedData.experienceLevel && updatedData.experienceLevel.trim() !== '') {
            requestData.experienceLevel = updatedData.experienceLevel.trim();
        }
        
        console.log('Sending update request to:', `${BaseUrl}/bookmystarsadmin/role/v1/update/${updatedData.roleId}`);
        console.log('Request data:', requestData);
        console.log('Request data JSON:', JSON.stringify(requestData, null, 2));
        
        const res = await axios({
            method: 'PUT',
            url: `${BaseUrl}/bookmystarsadmin/role/v1/update/${updatedData.roleId}`,
            headers: headers,
            data: requestData
        });

        console.log('Update API response:', res.data);
        console.log('Response status:', res.status);

        // Handle the new backend response structure
        const responseBody = res?.data;
        const code = responseBody?.code;
        const message = responseBody?.message || 'Role updated successfully';
        const error = responseBody?.error || 'An error occurred';
        const status = responseBody?.status;

        console.log('Response body analysis:', {
            code,
            message,
            error,
            status: responseBody?.status,
            data: responseBody?.data
        });

        // Backend returns 200 for successful updates
        if (res.status === 200 || code === 200 || status === 'SUCCESS') {
            return { success: true, message, data: responseBody?.data };
        } else if (res.status === 400 || res.status === 409 || code === 400 || status === 'FAILED') {
            throw new Error(error || message || 'Update operation failed');
        } else {
            // For unclear responses, check HTTP status
            if (res.status >= 200 && res.status < 300) {
                return { success: true, message, data: responseBody?.data };
            } else {
                throw new Error(message || 'Update operation failed');
            }
        }
    } catch (error) {
        console.error('Error updating role:', error);
        
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
        
        // Handle different error response structures from the updated backend
        let errorMessage = 'Failed to update role';
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

export const getAllJobRoles = async (headers) => {
    return await axios({
        method: 'get',
        url: `${BaseUrl}/bookmystarsadmin/role/v1/all`,
        headers: headers
    });
};

export const getJobRoleByName = async (roleName, headers) => {
    return await axios({
        method: 'GET',
        url: `${BaseUrl}/bookmystarsadmin/role/v1/name/${roleName}`,
        headers: headers
    });
};

export const searchJobRoles = async (roleName, headers) => {
    return await axios({
        method: 'GET',
        url: `${BaseUrl}/bookmystarsadmin/role/v1/search?roleName=${roleName}`,
        headers: headers
    });
};

// Note: Count endpoint doesn't exist in the backend controller
// We can calculate count from the pagination response instead
export const getJobRoleCount = async (headers) => {
    try {
        // Use the list endpoint to get total count
        const res = await fetchJobRoles(headers, 0, 1); // Get first page with size 1
        const responseBody = res?.data?.body ?? res?.data;
        const dataNode = responseBody?.data;
        const totalCount = dataNode?.totalElements || 0;
        
        return {
            data: {
                body: {
                    data: totalCount
                }
            }
        };
    } catch (error) {
        console.error('Error getting job role count:', error);
        return {
            data: {
                body: {
                    data: 0
                }
            }
        };
    }
};
