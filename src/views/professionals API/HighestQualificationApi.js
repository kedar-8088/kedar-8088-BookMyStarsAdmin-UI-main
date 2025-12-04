import axios from 'axios';
import Swal from 'sweetalert2';
import { BaseUrl } from 'BaseUrl';

export const fetchHighestQualifications = async (headers, pageNumber = 0, pageSize = 10) => {
    return await axios({
        method: 'get',
        url: `${BaseUrl}/bookmystarsadmin/highest-qualification/v1/getAllByPagination?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        headers: headers
    });
};

export const addHighestQualification = async (data, headers) => {
    try {
        const res = await axios({
            method: 'POST',
            url: `${BaseUrl}/bookmystarsadmin/highest-qualification/v1/create`,
            headers,
            data: data
        });

        // Handle different response structures
        const responseBody = res?.data?.body || res?.data;
        const code = responseBody?.code;
        const message = responseBody?.message || 'Highest Qualification created successfully';
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
        console.error('Error adding highest qualification:', error);
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to add highest qualification';
        Swal.fire('Error', errorMessage, 'error');
    }
};

export const deleteHighestQualification = async (id, headers) => {
    try {
        const res = await axios
        ({
            method: 'delete',
            url: `${BaseUrl}/bookmystarsadmin/highest-qualification/v1/delete/${id}`,
            headers
        });

        // Handle different response structures
        const responseBody = res?.data?.body || res?.data;
        const code = responseBody?.code;
        const message = responseBody?.message || 'Highest Qualification deleted successfully';
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
        console.error('Error deleting highest qualification:', error);
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete highest qualification';
        Swal.fire('Error', errorMessage, 'error');
    }
};

export const getHighestQualificationById = async (id, headers) => {
    return await axios({
        method: 'GET',
        url: `${BaseUrl}/bookmystarsadmin/highest-qualification/v1/get/${id}`,
        headers: headers
    });
};

export const updateHighestQualification = async (updatedData, headers) => {
    try {
        const res = await axios({
            method: 'PUT',
            url: `${BaseUrl}/bookmystarsadmin/highest-qualification/v1/update`,
            headers: headers,
            data: updatedData
        });

        // Handle different response structures
        const responseBody = res?.data?.body || res?.data;
        const code = responseBody?.code;
        const message = responseBody?.message || 'Highest Qualification updated successfully';
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
        console.error('Error updating highest qualification:', error);
        
        let errorMessage = 'Failed to update highest qualification';
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

export const getAllHighestQualifications = async (headers) => {
    return await axios({
        method: 'get',
        url: `${BaseUrl}/bookmystarsadmin/highest-qualification/v1/getAll`,
        headers: headers
    });
};

export const getHighestQualificationByName = async (highestQualificationName, headers) => {
    return await axios({
        method: 'GET',
        url: `${BaseUrl}/bookmystarsadmin/highest-qualification/v1/getByName/${highestQualificationName}`,
        headers: headers
    });
};

export const searchHighestQualifications = async (highestQualificationName, headers) => {
    return await axios({
        method: 'GET',
        url: `${BaseUrl}/bookmystarsadmin/highest-qualification/v1/search?highestQualificationName=${highestQualificationName}`,
        headers: headers
    });
};

export const getHighestQualificationCount = async (headers) => {
    return await axios({
        method: 'GET',
        url: `${BaseUrl}/bookmystarsadmin/highest-qualification/v1/count`,
        headers: headers
    });
};
