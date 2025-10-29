import axios from 'axios';
import Swal from 'sweetalert2';
import { BaseUrl } from 'BaseUrl';

export const fetchSkills = async (headers, pageNumber = 0, pageSize = 10) => {
    return await axios({
        method: 'get',
        url: `${BaseUrl}/bookmystarsadmin/skill/v1/list?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        headers: headers
    });
};

export const addSkill = async (data, headers) => {
    try {
        // Create a minimal request payload to avoid Hibernate proxy serialization issues
        const requestData = {
            skillName: data.skillName,
            skillDescription: data.skillDescription,
            skillLevel: data.skillLevel
            // Removed isActive and insertedBy fields to avoid serialization issues
            // The backend should handle these fields internally
        };

        console.log('Creating skill with data:', requestData);

        const res = await axios({
            method: 'POST',
            url: `${BaseUrl}/bookmystarsadmin/skill/v1/create`,
            headers,
            data: requestData
        });

        // Handle different response structures
        const responseBody = res?.data?.body || res?.data;
        const code = responseBody?.code;
        const message = responseBody?.message || 'Skill created successfully';
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
        console.error('Error adding skill:', error);
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to add skill';
        Swal.fire('Error', errorMessage, 'error');
    }
};

export const deleteSkill = async (id, headers) => {
    try {
        const res = await axios
        ({
            method: 'delete',
            url: `${BaseUrl}/bookmystarsadmin/skill/v1/delete/${id}`,
            headers
        });

        // Handle different response structures
        const responseBody = res?.data?.body || res?.data;
        const code = responseBody?.code;
        const message = responseBody?.message || 'Skill deleted successfully';
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
        console.error('Error deleting skill:', error);
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete skill';
        Swal.fire('Error', errorMessage, 'error');
    }
};

export const getSkillById = async (id, headers) => {
    return await axios({
        method: 'GET',
        url: `${BaseUrl}/bookmystarsadmin/skill/v1/${id}`,
        headers: headers
    });
};

export const updateSkill = async (updatedData, headers) => {
    try {
        console.log('Attempting to update skill with data:', updatedData);
        
        // Create a minimal request payload to avoid Hibernate proxy serialization issues
        // Only send the fields that are actually needed for the update
        const requestData = {
            skillName: updatedData.skillName,
            skillDescription: updatedData.skillDescription,
            skillLevel: updatedData.skillLevel
            // Removed isActive and updatedBy fields to avoid serialization issues
            // The backend should handle these fields internally
        };
        
        console.log('Sending update request to:', `${BaseUrl}/bookmystarsadmin/skill/v1/update/${updatedData.skillId}`);
        console.log('Request data:', requestData);
        console.log('Request data JSON:', JSON.stringify(requestData, null, 2));
        
        const res = await axios({
            method: 'PUT',
            url: `${BaseUrl}/bookmystarsadmin/skill/v1/update/${updatedData.skillId}`,
            headers: headers,
            data: requestData
        });

        console.log('Update API response:', res.data);
        console.log('Response status:', res.status);
        console.log('Response headers:', res.headers);

        // Handle response structure - backend returns ClientResponseBean
        const responseBody = res?.data;
        const code = responseBody?.code;
        const message = responseBody?.message || 'Skill updated successfully';
        const error = responseBody?.error || 'An error occurred';

        console.log('Response body analysis:', {
            code,
            message,
            error,
            status: responseBody?.status,
            data: responseBody?.data
        });

        // Backend returns 200 for successful updates
        if (code === 200 || res.status === 200) {
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
        console.error('Error updating skill:', error);
        
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
        
        let errorMessage = 'Failed to update skill';
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

export const getAllSkills = async (headers) => {
    return await axios({
        method: 'get',
        url: `${BaseUrl}/bookmystarsadmin/skill/v1/getAll`,
        headers: headers
    });
};

export const getSkillByName = async (skillName, headers) => {
    return await axios({
        method: 'GET',
        url: `${BaseUrl}/bookmystarsadmin/skill/v1/getByName/${skillName}`,
        headers: headers
    });
};

export const searchSkills = async (skillName, headers) => {
    return await axios({
        method: 'GET',
        url: `${BaseUrl}/bookmystarsadmin/skill/v1/search?skillName=${skillName}`,
        headers: headers
    });
};

// Note: Count endpoint doesn't exist in the backend controller
// We can calculate count from the pagination response instead
export const getSkillCount = async (headers) => {
    try {
        // Use the list endpoint to get total count
        const res = await fetchSkills(headers, 0, 1); // Get first page with size 1
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
        console.error('Error getting skill count:', error);
        return {
            data: {
                body: {
                    data: 0
                }
            }
        };
    }
};
