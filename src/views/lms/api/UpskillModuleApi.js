import axios from 'axios';
import Swal from 'sweetalert2';
import { BaseUrl } from 'BaseUrl';

export const createUpskillModule = async (data, headers) => {
    try {
        console.log('Creating upskill module with data:', data);
        
        const requestData = {
            moduleName: data.moduleName,
            moduleDescription: data.moduleDescription || '',
            courseId: data.courseId,
            isActive: Boolean(data.isActive !== undefined ? data.isActive : true),
            createdBy: data.createdBy || data.insertedBy
        };
        
        console.log('Formatted upskill module request data:', requestData);
        
        const res = await axios({
            method: 'POST',
            url: `${BaseUrl}/bookmystarsadmin/upskillmodule/v1/createUpskillModule`,
            headers,
            data: requestData
        });

        console.log('Create upskill module response:', res.data);

        const responseBody = res?.data;
        const code = responseBody?.code;
        const status = responseBody?.status;
        const message = responseBody?.message || 'Upskill module created successfully';
        const error = responseBody?.error || 'An error occurred';

        if (code === 201 || code === 200 || status === 'SUCCESS' || res.status === 201 || res.status === 200) {
            return { success: true, message };
        } else if (code === 400 || res.status === 400) {
            throw new Error(error || 'Failed to create upskill module');
        } else {
            if (res.status >= 200 && res.status < 300) {
                return { success: true, message };
            } else {
                throw new Error(message || 'Failed to create upskill module');
            }
        }
    } catch (error) {
        console.error('Error creating upskill module:', error);
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create upskill module';
        throw new Error(errorMessage);
    }
};

export const updateUpskillModule = async (updatedData, headers) => {
    try {
        console.log('Updating upskill module with data:', updatedData);
        
        const requestData = {
            moduleId: updatedData.moduleId,
            moduleName: updatedData.moduleName,
            moduleDescription: updatedData.moduleDescription || '',
            courseId: updatedData.courseId,
            isActive: updatedData.isActive !== undefined ? Boolean(updatedData.isActive) : true
        };
        
        const res = await axios({
            method: 'PUT',
            url: `${BaseUrl}/bookmystarsadmin/upskillmodule/v1/updateUpskillModule`,
            headers: headers,
            data: requestData
        });

        console.log('Update upskill module response:', res.data);

        const responseBody = res?.data;
        const code = responseBody?.code;
        const status = responseBody?.status;
        const message = responseBody?.message || 'Upskill module updated successfully';
        const error = responseBody?.error || 'An error occurred';

        if (code === 201 || code === 200 || status === 'SUCCESS' || res.status === 201 || res.status === 200) {
            return { success: true, message, data: responseBody?.data };
        } else if (code === 400 || res.status === 400) {
            throw new Error(error || 'Failed to update upskill module');
        } else {
            if (res.status >= 200 && res.status < 300) {
                return { success: true, message, data: responseBody?.data };
            } else {
                throw new Error(message || 'Failed to update upskill module');
            }
        }
    } catch (error) {
        console.error('Error updating upskill module:', error);
        
        let errorMessage = 'Failed to update upskill module';
        if (error?.response?.data?.message) {
            errorMessage = error.response.data.message;
        } else if (error?.message) {
            errorMessage = error.message;
        }
        
        throw new Error(errorMessage);
    }
};

export const deleteUpskillModuleById = async (moduleId, headers) => {
    try {
        console.log('Deleting upskill module with ID:', moduleId);
        const res = await axios({
            method: 'DELETE',
            url: `${BaseUrl}/bookmystarsadmin/upskillmodule/v1/deleteUpskillModuleById/${moduleId}`,
            headers
        });

        console.log('Delete upskill module response:', res.data);

        const responseBody = res?.data;
        const code = responseBody?.code;
        const status = responseBody?.status;
        const message = responseBody?.message || 'Upskill module deleted successfully';
        const error = responseBody?.error || 'An error occurred';

        if (code === 200 || status === 'SUCCESS' || res.status === 200) {
            return { success: true, message };
        } else if (code === 400 || res.status === 400) {
            throw new Error(error || 'Failed to delete upskill module');
        } else {
            if (res.status >= 200 && res.status < 300) {
                return { success: true, message };
            } else {
                throw new Error(message || 'Failed to delete upskill module');
            }
        }
    } catch (error) {
        console.error('Error deleting upskill module:', error);
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete upskill module';
        throw new Error(errorMessage);
    }
};

export const getUpskillModuleByModuleId = async (moduleId, headers) => {
    try {
        const res = await axios({
            method: 'GET',
            url: `${BaseUrl}/bookmystarsadmin/upskillmodule/v1/getUpskillModuleByModuleId/${moduleId}`,
            headers: headers
        });
        return res;
    } catch (error) {
        console.error('Error fetching upskill module by ID:', error);
        throw error;
    }
};

export const getUpskillModulesByCourseId = async (courseId, headers) => {
    try {
        const res = await axios({
            method: 'GET',
            url: `${BaseUrl}/bookmystarsadmin/upskillmodule/v1/getUpskillModulesByCourseId/${courseId}`,
            headers: headers
        });
        return res;
    } catch (error) {
        console.error('Error fetching upskill modules by course:', error);
        throw error;
    }
};

export const getAllUpskillModules = async (headers) => {
    try {
        const res = await axios({
            method: 'GET',
            url: `${BaseUrl}/bookmystarsadmin/upskillmodule/v1/getAllUpskillModules`,
            headers: headers
        });
        return res;
    } catch (error) {
        console.error('Error fetching all upskill modules:', error);
        throw error;
    }
};

export const getAllUpskillModulesByPagination = async (headers, pageNumber = 0, pageSize = 10) => {
    try {
        if (!headers || !headers.Authorization) {
            console.error('Upskill module fetch - Missing or invalid headers:', headers);
            throw new Error('Authentication headers are required');
        }

        const validPageNumber = Math.max(0, parseInt(pageNumber) || 0);
        const validPageSize = Math.max(1, parseInt(pageSize) || 10);

        console.log('Fetch Upskill Modules Request:', {
            url: `${BaseUrl}/bookmystarsadmin/upskillmodule/v1/getAllUpskillModulesByPagination/${validPageNumber}/${validPageSize}`,
            pageNumber: validPageNumber,
            pageSize: validPageSize,
            hasAuth: !!headers.Authorization
        });

        const res = await axios({
            method: 'GET',
            url: `${BaseUrl}/bookmystarsadmin/upskillmodule/v1/getAllUpskillModulesByPagination/${validPageNumber}/${validPageSize}`,
            headers: headers
        });

        console.log('Upskill module fetch response:', res?.data);
        return res;
    } catch (error) {
        console.error('Error fetching upskill modules:', error);
        console.error('Error response:', error?.response?.data);
        console.error('Error status:', error?.response?.status);
        
        throw error;
    }
};

