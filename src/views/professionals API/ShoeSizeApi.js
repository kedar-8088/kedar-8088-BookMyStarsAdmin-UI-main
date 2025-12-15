import axios from 'axios';
import Swal from 'sweetalert2';
import { BaseUrl } from 'BaseUrl';

export const fetchShoeSizes = async (headers, pageNumber = 0, pageSize = 10) => {
    return await axios({
        method: 'get',
        url: `${BaseUrl}/bookmystarsadmin/shoe-size/v1/getAllByPagination?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        headers: headers
    });
};

export const addShoeSize = async (data, headers) => {
    try {
        const res = await axios({
            method: 'POST',
            url: `${BaseUrl}/bookmystarsadmin/shoe-size/v1/create`,
            headers,
            data: data
        });

        // Handle different response structures
        const responseBody = res?.data?.body || res?.data;
        const code = responseBody?.code;
        const message = responseBody?.message || 'Shoe Size created successfully';
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
        console.error('Error adding shoe size:', error);
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to add shoe size';
        Swal.fire('Error', errorMessage, 'error');
    }
};

export const deleteShoeSize = async (id, headers) => {
    try {
        const res = await axios
        ({
            method: 'delete',
            url: `${BaseUrl}/bookmystarsadmin/shoe-size/v1/delete/${id}`,
            headers
        });

        // Handle different response structures
        const responseBody = res?.data?.body || res?.data;
        const code = responseBody?.code;
        const message = responseBody?.message || 'Shoe Size deleted successfully';
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
        console.error('Error deleting shoe size:', error);
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete shoe size';
        Swal.fire('Error', errorMessage, 'error');
    }
};

export const getShoeSizeById = async (id, headers) => {
    return await axios({
        method: 'GET',
        url: `${BaseUrl}/bookmystarsadmin/shoe-size/v1/get/${id}`,
        headers: headers
    });
};

export const updateShoeSize = async (updatedData, headers) => {
    try {
        const res = await axios({
            method: 'PUT',
            url: `${BaseUrl}/bookmystarsadmin/shoe-size/v1/update`,
            headers: headers,
            data: updatedData
        });

        // Handle different response structures
        const responseBody = res?.data?.body || res?.data;
        const code = responseBody?.code;
        const status = responseBody?.status;
        const message = responseBody?.message || 'Shoe Size updated successfully';
        const error = responseBody?.error || 'An error occurred';

        if (code === 201 || code === 200 || status === 'SUCCESS') {
            Swal.fire('Success', message, 'success');
        } else if (code === 400) {
            Swal.fire('Error', error, 'error');
        } else {
            // Handle other response structures or success without explicit code
            Swal.fire('Success', message, 'success');
        }
    } catch (error) {
        console.error('Error updating shoe size:', error);
        
        let errorMessage = 'Failed to update shoe size';
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

export const getAllShoeSizes = async (headers) => {
    return await axios({
        method: 'get',
        url: `${BaseUrl}/bookmystarsadmin/shoe-size/v1/getAll`,
        headers: headers
    });
};

export const getShoeSizeByName = async (shoeSizeName, headers) => {
    return await axios({
        method: 'GET',
        url: `${BaseUrl}/bookmystarsadmin/shoe-size/v1/getByName/${shoeSizeName}`,
        headers: headers
    });
};

export const searchShoeSizes = async (shoeSizeName, headers) => {
    return await axios({
        method: 'GET',
        url: `${BaseUrl}/bookmystarsadmin/shoe-size/v1/search?shoeSizeName=${shoeSizeName}`,
        headers: headers
    });
};

export const getShoeSizeCount = async (headers) => {
    return await axios({
        method: 'GET',
        url: `${BaseUrl}/bookmystarsadmin/shoe-size/v1/count`,
        headers: headers
    });
};
