import axios from 'axios';
import Swal from 'sweetalert2';
import { BaseUrl } from 'BaseUrl';

export const fetchSkinColors = async (headers, pageNumber = 0, pageSize = 10) => {
    return await axios({
        method: 'get',
        url: `${BaseUrl}/bookmystarsadmin/skin-color/v1/getAllByPagination?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        headers: headers
    });
};

export const addSkinColor = async (data, headers) => {
    try {
        const res = await axios({
            method: 'POST',
            url: `${BaseUrl}/bookmystarsadmin/skin-color/v1/create`,
            headers,
            data: data
        });

        // Handle different response structures
        const responseBody = res?.data?.body || res?.data;
        const code = responseBody?.code;
        const message = responseBody?.message || 'Skin Color created successfully';
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
        console.error('Error adding skin color:', error);
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to add skin color';
        Swal.fire('Error', errorMessage, 'error');
    }
};

export const deleteSkinColor = async (id, headers) => {
    try {
        const res = await axios
        ({
            method: 'delete',
            url: `${BaseUrl}/bookmystarsadmin/skin-color/v1/delete/${id}`,
            headers
        });

        // Handle different response structures
        const responseBody = res?.data?.body || res?.data;
        const code = responseBody?.code;
        const message = responseBody?.message || 'Skin Color deleted successfully';
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
        console.error('Error deleting skin color:', error);
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete skin color';
        Swal.fire('Error', errorMessage, 'error');
    }
};

export const getSkinColorById = async (id, headers) => {
    return await axios({
        method: 'GET',
        url: `${BaseUrl}/bookmystarsadmin/skin-color/v1/get/${id}`,
        headers: headers
    });
};

export const updateSkinColor = async (updatedData, headers) => {
    try {
        const res = await axios({
            method: 'PUT',
            url: `${BaseUrl}/bookmystarsadmin/skin-color/v1/update`,
            headers: headers,
            data: updatedData
        });

        // Handle different response structures
        const responseBody = res?.data?.body || res?.data;
        const code = responseBody?.code;
        const message = responseBody?.message || 'Skin Color updated successfully';
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
        console.error('Error updating skin color:', error);
        
        let errorMessage = 'Failed to update skin color';
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

export const getAllSkinColors = async (headers) => {
    return await axios({
        method: 'get',
        url: `${BaseUrl}/bookmystarsadmin/skin-color/v1/getAll`,
        headers: headers
    });
};

export const getSkinColorByName = async (skinColorName, headers) => {
    return await axios({
        method: 'GET',
        url: `${BaseUrl}/bookmystarsadmin/skin-color/v1/getByName/${skinColorName}`,
        headers: headers
    });
};

export const searchSkinColors = async (skinColorName, headers) => {
    return await axios({
        method: 'GET',
        url: `${BaseUrl}/bookmystarsadmin/skin-color/v1/search?skinColorName=${skinColorName}`,
        headers: headers
    });
};

export const getSkinColorCount = async (headers) => {
    return await axios({
        method: 'GET',
        url: `${BaseUrl}/bookmystarsadmin/skin-color/v1/count`,
        headers: headers
    });
};
