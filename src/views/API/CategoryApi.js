import axios from 'axios';
import Swal from 'sweetalert2';
import { BaseUrl } from 'BaseUrl';

export const fetchCategories = async (headers, pageNumber = 0, pageSize = 10) => {
    return await axios({
        method: 'get',
        url: `${BaseUrl}/bookmystarsadmin/category/v1/list?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        headers: headers
    });
};

export const addCategory = async (data, headers) => {
    try {
        const res = await axios({
            method: 'POST',
            url: `${BaseUrl}/bookmystarsadmin/category/v1/create`,
            headers,
            data: data
        });

        // Handle different response structures
        const responseBody = res?.data?.body || res?.data;
        const code = responseBody?.code;
        const message = responseBody?.message || 'Category created successfully';
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
        console.error('Error adding category:', error);
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to add category';
        Swal.fire('Error', errorMessage, 'error');
    }
};

export const deleteCategory = async (id, headers) => {
    try {
        const res = await axios({
            method: 'delete',
            url: `${BaseUrl}/bookmystarsadmin/category/v1/${id}`,
            headers
        });

        // Handle different response structures
        const responseBody = res?.data?.body || res?.data;
        const code = responseBody?.code;
        const message = responseBody?.message || 'Category deleted successfully';
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
        console.error('Error deleting category:', error);
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete category';
        Swal.fire('Error', errorMessage, 'error');
    }
};

export const getCategoryById = async (id, headers) => {
    return await axios({
        method: 'GET',
        url: `${BaseUrl}/bookmystarsadmin/category/v1/${id}`,
        headers: headers
    });
};

export const updateCategory = async (updatedData, headers) => {
    try {
        const res = await axios({
            method: 'PUT',
            url: `${BaseUrl}/bookmystarsadmin/category/v1/update/${updatedData.categoryId}`,
            headers: headers,
            data: updatedData
        });

        // Handle different response structures
        const responseBody = res?.data?.body || res?.data;
        const code = responseBody?.code;
        const message = responseBody?.message || 'Category updated successfully';
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
        console.error('Error updating category:', error);
        
        let errorMessage = 'Failed to update category';
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

export const getAllCategories = async (headers) => {
    return await axios({
        method: 'get',
        url: `${BaseUrl}/category/v1/all`,
        headers: headers
    });
};

export const getCategoryByName = async (categoryName, headers) => {
    return await axios({
        method: 'GET',
        url: `${BaseUrl}/bookmystarsadmin/category/v1/getByName/${categoryName}`,
        headers: headers
    });
};

export const searchCategoryByName = async (categoryName, headers) => {
    return await axios({
        method: 'GET',
        url: `${BaseUrl}/bookmystarsadmin/category/v1/search?categoryName=${categoryName}`,
        headers: headers
    });
};

export const getCategoryCount = async (headers) => {
    return await axios({
        method: 'GET',
        url: `${BaseUrl}/bookmystarsadmin/category/v1/count`,
        headers: headers
    });
};
