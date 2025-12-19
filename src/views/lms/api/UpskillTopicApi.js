import axios from 'axios';
import Swal from 'sweetalert2';
import { BaseUrl } from 'BaseUrl';

export const createUpskillTopic = async (data, headers) => {
    try {
        console.log('Creating upskill topic with data:', data);
        
        const requestData = {
            topicName: data.topicName,
            topicDescription: data.topicDescription || '',
            moduleId: data.moduleId,
            isActive: Boolean(data.isActive !== undefined ? data.isActive : true),
            createdBy: data.createdBy || data.insertedBy
        };
        
        console.log('Formatted upskill topic request data:', requestData);
        
        const res = await axios({
            method: 'POST',
            url: `${BaseUrl}/bookmystarsadmin/upskilltopic/v1/createUpskillTopic`,
            headers,
            data: requestData
        });

        console.log('Create upskill topic response:', res.data);

        const responseBody = res?.data;
        const code = responseBody?.code;
        const status = responseBody?.status;
        const message = responseBody?.message || 'Upskill topic created successfully';
        const error = responseBody?.error || 'An error occurred';

        if (code === 201 || code === 200 || status === 'SUCCESS' || res.status === 201 || res.status === 200) {
            return { success: true, message };
        } else if (code === 400 || res.status === 400) {
            throw new Error(error || 'Failed to create upskill topic');
        } else {
            if (res.status >= 200 && res.status < 300) {
                return { success: true, message };
            } else {
                throw new Error(message || 'Failed to create upskill topic');
            }
        }
    } catch (error) {
        console.error('Error creating upskill topic:', error);
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create upskill topic';
        throw new Error(errorMessage);
    }
};

export const updateUpskillTopic = async (updatedData, headers) => {
    try {
        console.log('Updating upskill topic with data:', updatedData);
        
        const requestData = {
            topicId: updatedData.topicId,
            topicName: updatedData.topicName,
            topicDescription: updatedData.topicDescription || '',
            moduleId: updatedData.moduleId,
            isActive: updatedData.isActive !== undefined ? Boolean(updatedData.isActive) : true
        };
        
        const res = await axios({
            method: 'PUT',
            url: `${BaseUrl}/bookmystarsadmin/upskilltopic/v1/updateUpskillTopic`,
            headers: headers,
            data: requestData
        });

        console.log('Update upskill topic response:', res.data);

        const responseBody = res?.data;
        const code = responseBody?.code;
        const status = responseBody?.status;
        const message = responseBody?.message || 'Upskill topic updated successfully';
        const error = responseBody?.error || 'An error occurred';

        if (code === 201 || code === 200 || status === 'SUCCESS' || res.status === 201 || res.status === 200) {
            return { success: true, message, data: responseBody?.data };
        } else if (code === 400 || res.status === 400) {
            throw new Error(error || 'Failed to update upskill topic');
        } else {
            if (res.status >= 200 && res.status < 300) {
                return { success: true, message, data: responseBody?.data };
            } else {
                throw new Error(message || 'Failed to update upskill topic');
            }
        }
    } catch (error) {
        console.error('Error updating upskill topic:', error);
        
        let errorMessage = 'Failed to update upskill topic';
        if (error?.response?.data?.message) {
            errorMessage = error.response.data.message;
        } else if (error?.message) {
            errorMessage = error.message;
        }
        
        throw new Error(errorMessage);
    }
};

export const deleteUpskillTopicById = async (topicId, headers) => {
    try {
        console.log('Deleting upskill topic with ID:', topicId);
        const res = await axios({
            method: 'DELETE',
            url: `${BaseUrl}/bookmystarsadmin/upskilltopic/v1/deleteUpskillTopicById/${topicId}`,
            headers
        });

        console.log('Delete upskill topic response:', res.data);

        const responseBody = res?.data;
        const code = responseBody?.code;
        const status = responseBody?.status;
        const message = responseBody?.message || 'Upskill topic deleted successfully';
        const error = responseBody?.error || 'An error occurred';

        if (code === 200 || status === 'SUCCESS' || res.status === 200) {
            return { success: true, message };
        } else if (code === 400 || res.status === 400) {
            throw new Error(error || 'Failed to delete upskill topic');
        } else {
            if (res.status >= 200 && res.status < 300) {
                return { success: true, message };
            } else {
                throw new Error(message || 'Failed to delete upskill topic');
            }
        }
    } catch (error) {
        console.error('Error deleting upskill topic:', error);
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete upskill topic';
        throw new Error(errorMessage);
    }
};

export const getUpskillTopicByTopicId = async (topicId, headers) => {
    try {
        const res = await axios({
            method: 'GET',
            url: `${BaseUrl}/bookmystarsadmin/upskilltopic/v1/getUpskillTopicByTopicId/${topicId}`,
            headers: headers
        });
        return res;
    } catch (error) {
        console.error('Error fetching upskill topic by ID:', error);
        throw error;
    }
};

export const getUpskillTopicsByModuleId = async (moduleId, headers) => {
    try {
        const res = await axios({
            method: 'GET',
            url: `${BaseUrl}/bookmystarsadmin/upskilltopic/v1/getUpskillTopicsByModuleId/${moduleId}`,
            headers: headers
        });
        return res;
    } catch (error) {
        console.error('Error fetching upskill topics by module:', error);
        throw error;
    }
};

export const getAllUpskillTopicsByPagination = async (headers, pageNumber = 0, pageSize = 10) => {
    try {
        if (!headers || !headers.Authorization) {
            console.error('Upskill topic fetch - Missing or invalid headers:', headers);
            throw new Error('Authentication headers are required');
        }

        const validPageNumber = Math.max(0, parseInt(pageNumber) || 0);
        const validPageSize = Math.max(1, parseInt(pageSize) || 10);

        console.log('Fetch Upskill Topics Request:', {
            url: `${BaseUrl}/bookmystarsadmin/upskilltopic/v1/getAllUpskillTopicsByPagination/${validPageNumber}/${validPageSize}`,
            pageNumber: validPageNumber,
            pageSize: validPageSize,
            hasAuth: !!headers.Authorization
        });

        const res = await axios({
            method: 'GET',
            url: `${BaseUrl}/bookmystarsadmin/upskilltopic/v1/getAllUpskillTopicsByPagination/${validPageNumber}/${validPageSize}`,
            headers: headers
        });

        console.log('Upskill topic fetch response:', res?.data);
        return res;
    } catch (error) {
        console.error('Error fetching upskill topics:', error);
        console.error('Error response:', error?.response?.data);
        console.error('Error status:', error?.response?.status);
        
        throw error;
    }
};

