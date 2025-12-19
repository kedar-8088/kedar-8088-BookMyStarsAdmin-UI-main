import axios from 'axios';
import Swal from 'sweetalert2';
import { BaseUrl } from 'BaseUrl';

export const createUpskillCourse = async (data, headers) => {
    try {
        console.log('Creating upskill course with data:', data);
        
        const requestData = {
            courseName: data.courseName,
            courseDescription: data.courseDescription || '',
            categoryId: data.categoryId,
            isActive: Boolean(data.isActive !== undefined ? data.isActive : true),
            createdBy: data.createdBy || data.insertedBy
        };
        
        console.log('Formatted upskill course request data:', requestData);
        
        const res = await axios({
            method: 'POST',
            url: `${BaseUrl}/bookmystarsadmin/upskillcourse/v1/createUpskillCourse`,
            headers,
            data: requestData
        });

        console.log('Create upskill course response:', res.data);

        const responseBody = res?.data;
        const code = responseBody?.code;
        const status = responseBody?.status;
        const message = responseBody?.message || 'Upskill course created successfully';
        const error = responseBody?.error || 'An error occurred';

        if (code === 201 || code === 200 || status === 'SUCCESS' || res.status === 201 || res.status === 200) {
            return { success: true, message };
        } else if (code === 400 || res.status === 400) {
            throw new Error(error || 'Failed to create upskill course');
        } else {
            if (res.status >= 200 && res.status < 300) {
                return { success: true, message };
            } else {
                throw new Error(message || 'Failed to create upskill course');
            }
        }
    } catch (error) {
        console.error('Error creating upskill course:', error);
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create upskill course';
        throw new Error(errorMessage);
    }
};

export const updateUpskillCourse = async (updatedData, headers) => {
    try {
        console.log('Updating upskill course with data:', updatedData);
        
        const requestData = {
            courseId: updatedData.courseId,
            courseName: updatedData.courseName,
            courseDescription: updatedData.courseDescription || '',
            categoryId: updatedData.categoryId,
            isActive: updatedData.isActive !== undefined ? Boolean(updatedData.isActive) : true
        };
        
        const res = await axios({
            method: 'PUT',
            url: `${BaseUrl}/bookmystarsadmin/upskillcourse/v1/updateUpskillCourse`,
            headers: headers,
            data: requestData
        });

        console.log('Update upskill course response:', res.data);

        const responseBody = res?.data;
        const code = responseBody?.code;
        const status = responseBody?.status;
        const message = responseBody?.message || 'Upskill course updated successfully';
        const error = responseBody?.error || 'An error occurred';

        if (code === 201 || code === 200 || status === 'SUCCESS' || res.status === 201 || res.status === 200) {
            return { success: true, message, data: responseBody?.data };
        } else if (code === 400 || res.status === 400) {
            throw new Error(error || 'Failed to update upskill course');
        } else {
            if (res.status >= 200 && res.status < 300) {
                return { success: true, message, data: responseBody?.data };
            } else {
                throw new Error(message || 'Failed to update upskill course');
            }
        }
    } catch (error) {
        console.error('Error updating upskill course:', error);
        
        let errorMessage = 'Failed to update upskill course';
        if (error?.response?.data?.message) {
            errorMessage = error.response.data.message;
        } else if (error?.message) {
            errorMessage = error.message;
        }
        
        throw new Error(errorMessage);
    }
};

export const deleteUpskillCourseById = async (courseId, headers) => {
    try {
        console.log('Deleting upskill course with ID:', courseId);
        const res = await axios({
            method: 'DELETE',
            url: `${BaseUrl}/bookmystarsadmin/upskillcourse/v1/deleteUpskillCourseById/${courseId}`,
            headers
        });

        console.log('Delete upskill course response:', res.data);

        const responseBody = res?.data;
        const code = responseBody?.code;
        const status = responseBody?.status;
        const message = responseBody?.message || 'Upskill course deleted successfully';
        const error = responseBody?.error || 'An error occurred';

        if (code === 200 || status === 'SUCCESS' || res.status === 200) {
            return { success: true, message };
        } else if (code === 400 || res.status === 400) {
            throw new Error(error || 'Failed to delete upskill course');
        } else {
            if (res.status >= 200 && res.status < 300) {
                return { success: true, message };
            } else {
                throw new Error(message || 'Failed to delete upskill course');
            }
        }
    } catch (error) {
        console.error('Error deleting upskill course:', error);
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete upskill course';
        throw new Error(errorMessage);
    }
};

export const getUpskillCourseByCourseId = async (courseId, headers) => {
    try {
        const res = await axios({
            method: 'GET',
            url: `${BaseUrl}/bookmystarsadmin/upskillcourse/v1/getUpskillCourseByCourseId/${courseId}`,
            headers: headers
        });
        return res;
    } catch (error) {
        console.error('Error fetching upskill course by ID:', error);
        throw error;
    }
};

export const getUpskillCoursesByCategoryId = async (categoryId, headers) => {
    try {
        const res = await axios({
            method: 'GET',
            url: `${BaseUrl}/bookmystarsadmin/upskillcourse/v1/getUpskillCoursesByCategoryId/${categoryId}`,
            headers: headers
        });
        return res;
    } catch (error) {
        console.error('Error fetching upskill courses by category:', error);
        throw error;
    }
};

export const getAllUpskillCourses = async (headers) => {
    try {
        const res = await axios({
            method: 'GET',
            url: `${BaseUrl}/bookmystarsadmin/upskillcourse/v1/getAllUpskillCourses`,
            headers: headers
        });
        return res;
    } catch (error) {
        console.error('Error fetching all upskill courses:', error);
        throw error;
    }
};

export const getAllUpskillCoursesByPagination = async (headers, pageNumber = 0, pageSize = 10) => {
    try {
        if (!headers || !headers.Authorization) {
            console.error('Upskill course fetch - Missing or invalid headers:', headers);
            throw new Error('Authentication headers are required');
        }

        const validPageNumber = Math.max(0, parseInt(pageNumber) || 0);
        const validPageSize = Math.max(1, parseInt(pageSize) || 10);

        console.log('Fetch Upskill Courses Request:', {
            url: `${BaseUrl}/bookmystarsadmin/upskillcourse/v1/getAllUpskillCoursesByPagination/${validPageNumber}/${validPageSize}`,
            pageNumber: validPageNumber,
            pageSize: validPageSize,
            hasAuth: !!headers.Authorization
        });

        const res = await axios({
            method: 'GET',
            url: `${BaseUrl}/bookmystarsadmin/upskillcourse/v1/getAllUpskillCoursesByPagination/${validPageNumber}/${validPageSize}`,
            headers: headers
        });

        console.log('Upskill course fetch response:', res?.data);
        return res;
    } catch (error) {
        console.error('Error fetching upskill courses:', error);
        console.error('Error response:', error?.response?.data);
        console.error('Error status:', error?.response?.status);
        
        throw error;
    }
};

