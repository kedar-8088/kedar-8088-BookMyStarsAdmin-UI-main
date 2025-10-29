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
        console.log('Adding category with data:', data);
        const res = await axios({
            method: 'POST',
            url: `${BaseUrl}/bookmystarsadmin/category/v1/create`,
            headers,
            data: data
        });

        console.log('Add category response:', res.data);

        // Handle ClientResponseBean structure
        const responseBody = res?.data;
        const code = responseBody?.code;
        const status = responseBody?.status;
        const message = responseBody?.message || 'Category created successfully';
        const error = responseBody?.error || 'An error occurred';

        // Check for success (201 for create, 200 for other operations)
        if (code === 201 || code === 200 || status === 'SUCCESS' || res.status === 201 || res.status === 200) {
            return { success: true, message };
        } else if (code === 400 || res.status === 400) {
            throw new Error(error || 'Failed to create category');
        } else {
            // For unclear responses, check HTTP status
            if (res.status >= 200 && res.status < 300) {
                return { success: true, message };
            } else {
                throw new Error(message || 'Failed to create category');
            }
        }
    } catch (error) {
        console.error('Error adding category:', error);
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to add category';
        throw new Error(errorMessage);
    }
};

export const deleteCategory = async (id, headers) => {
    try {
        console.log('Deleting category with ID:', id);
        const res = await axios({
            method: 'DELETE',
            url: `${BaseUrl}/bookmystarsadmin/category/v1/${id}`,
            headers
        });

        console.log('Delete category response:', res.data);

        // Handle ClientResponseBean structure
        const responseBody = res?.data;
        const code = responseBody?.code;
        const status = responseBody?.status;
        const message = responseBody?.message || 'Category deleted successfully';
        const error = responseBody?.error || 'An error occurred';

        // Check for success
        if (code === 200 || status === 'SUCCESS' || res.status === 200) {
            return { success: true, message };
        } else if (code === 400 || res.status === 400) {
            throw new Error(error || 'Failed to delete category');
        } else {
            // For unclear responses, check HTTP status
            if (res.status >= 200 && res.status < 300) {
                return { success: true, message };
            } else {
                throw new Error(message || 'Failed to delete category');
            }
        }
    } catch (error) {
        console.error('Error deleting category:', error);
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete category';
        throw new Error(errorMessage);
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
        console.log('Updating category with data:', updatedData);
        const categoryId = updatedData.categoryId;
        
        // Prepare the data for the backend (remove categoryId from body since it's in URL)
        const requestData = {
            categoryName: updatedData.categoryName,
            categoryDescription: updatedData.categoryDescription,
            isActive: updatedData.isActive,
            isDelete: updatedData.isDelete || false
        };
        
        const res = await axios({
            method: 'PUT',
            url: `${BaseUrl}/bookmystarsadmin/category/v1/update/${categoryId}`,
            headers: headers,
            data: requestData
        });

        console.log('Update category response:', res.data);

        // Handle ClientResponseBean structure
        const responseBody = res?.data;
        const code = responseBody?.code;
        const status = responseBody?.status;
        const message = responseBody?.message || 'Category updated successfully';
        const error = responseBody?.error || 'An error occurred';

        // Check for success (201 for update, 200 for other operations)
        if (code === 201 || code === 200 || status === 'SUCCESS' || res.status === 201 || res.status === 200) {
            return { success: true, message, data: responseBody?.data };
        } else if (code === 400 || res.status === 400) {
            throw new Error(error || 'Failed to update category');
        } else {
            // For unclear responses, check HTTP status
            if (res.status >= 200 && res.status < 300) {
                return { success: true, message, data: responseBody?.data };
            } else {
                throw new Error(message || 'Failed to update category');
            }
        }
    } catch (error) {
        console.error('Error updating category:', error);
        
        let errorMessage = 'Failed to update category';
        if (error?.response?.data?.message) {
            errorMessage = error.response.data.message;
        } else if (error?.message) {
            errorMessage = error.message;
        }
        
        throw new Error(errorMessage);
    }
};

export const getAllCategories = async (headers) => {
    return await axios({
        method: 'get',
        url: `${BaseUrl}/bookmystarsadmin/category/v1/all`,
        headers: headers
    });
};

export const getCategoryByName = async (categoryName, headers) => {
    return await axios({
        method: 'GET',
        url: `${BaseUrl}/bookmystarsadmin/category/v1/name/${categoryName}`,
        headers: headers
    });
};

// Note: searchCategoryByName and getCategoryCount endpoints don't exist in the backend controller
// They have been removed to match the actual backend API
