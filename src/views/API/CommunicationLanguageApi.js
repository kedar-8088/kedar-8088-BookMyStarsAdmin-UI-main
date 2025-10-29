import axios from 'axios';
import Swal from 'sweetalert2';
import { BaseUrl } from 'BaseUrl';

export const fetchCommunicationLanguages = async (headers, pageNumber = 0, pageSize = 10) => {
    const res = await axios({
        method: 'get',
        url: `${BaseUrl}/bookmystarsadmin/language/v1/getAllByPagination?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        headers: headers
    });

    // Handle ClientResponseBean structure: { code, status, message, error, data }
    // For pagination, data contains Page<LanguageDto> with content and totalElements
    const responseBody = res?.data ?? {};
    const pageData = responseBody?.data ?? {};
    
    // Extract items and total from Page object
    const items = Array.isArray(pageData?.content) ? pageData.content : [];
    const total = pageData?.totalElements ?? pageData?.totalCount ?? items.length;

    return { items, total, raw: res };
};

export const addCommunicationLanguage = async (data, headers) => {
    try {
        // Log payload for debugging (inspect server-side validation issues)
        console.log('addCommunicationLanguage - payload:', JSON.stringify(data, null, 2));
        console.log('addCommunicationLanguage - headers:', headers);
        console.log('addCommunicationLanguage - URL:', `${BaseUrl}/bookmystarsadmin/language/v1/create`);

        // Validate required fields before sending
        if (!data.languageName || data.languageName.trim() === '') {
            throw new Error('Language name is required and cannot be empty');
        }

        const res = await axios({
            method: 'POST',
            url: `${BaseUrl}/bookmystarsadmin/language/v1/create`,
            headers,
            data: data
        });

        // Handle ClientResponseBean structure: { code, status, message, error, data }
        const responseBody = res?.data ?? {};
        const code = responseBody?.code ?? res?.status;
        const message = responseBody?.message || 'Language created successfully';

        if (code === 200 || code === 201 || res?.status === 200 || res?.status === 201) {
            Swal.fire('Success', message, 'success');
            return { success: true, message, data: responseBody?.data };
        } else {
            const errorMsg = responseBody?.error || responseBody?.message || 'An error occurred';
            Swal.fire('Error', errorMsg, 'error');
            return { success: false, message: errorMsg };
        }

        return res;
    } catch (error) {
        console.error('Error adding language:', error);

        // Try to extract meaningful server error information
        const serverData = error?.response?.data;
        const statusCode = error?.response?.status;
        
        // Log full server response to help debugging
        console.error('Server response (error.response):', error?.response);
        console.error('Server response data:', serverData);
        console.error('Status code:', statusCode);

        let errorMessage = error?.message || 'Failed to add language';

        // Handle ClientResponseBean error structure: { code, status, message, error, data }
        if (serverData) {
            errorMessage = serverData?.message || serverData?.error || errorMessage;
            
            // Handle validation errors specifically
            if (serverData?.body?.message) {
                errorMessage = serverData.body.message;
            } else if (serverData?.body?.error) {
                errorMessage = serverData.body.error;
            }
        }

        // Handle specific HTTP status codes
        if (statusCode === 409) {
            if (serverData?.message?.includes('already exists') || serverData?.message?.includes('duplicate')) {
                errorMessage = 'Language with this name already exists. Please choose a different name.';
            } else if (serverData?.message?.includes('constraint')) {
                errorMessage = `Constraint violation: ${serverData?.message}. Please check your input data.`;
            } else if (serverData?.message?.includes('authentication') || serverData?.message?.includes('login')) {
                errorMessage = 'User authentication required - please login and try again.';
            } else {
                errorMessage = serverData?.message || 'Conflict: This language may already exist or violate database constraints.';
            }
        } else if (statusCode === 400) {
            errorMessage = serverData?.message || 'Invalid data provided. Please check your input.';
        } else if (statusCode === 401) {
            errorMessage = 'Authentication required. Please login and try again.';
        } else if (statusCode === 403) {
            errorMessage = 'Access denied. You do not have permission to perform this action.';
        } else if (statusCode === 500) {
            errorMessage = 'Server error. Please try again later.';
        }

        // Log detailed error information for debugging
        console.error('Detailed error information:', {
            statusCode,
            serverData,
            errorMessage,
            originalError: error.message
        });

        Swal.fire('Error', errorMessage, 'error');
        // Re-throw so callers can react if needed
        throw error;
    }
};

export const deleteCommunicationLanguage = async (id, headers) => {
    try {
        const res = await axios({
            method: 'delete',
            url: `${BaseUrl}/bookmystarsadmin/language/v1/delete/${id}`,
            headers
        });

        // Handle ClientResponseBean structure: { code, status, message, error, data }
        const responseBody = res?.data ?? {};
        const code = responseBody?.code ?? res?.status;
        const message = responseBody?.message || 'Language deleted successfully';

        if (code === 200 || res?.status === 200) {
            Swal.fire('Deleted!', message, 'success');
        } else {
            const errorMsg = responseBody?.error || responseBody?.message || 'An error occurred';
            Swal.fire('Error', errorMsg, 'error');
        }

        return res;
    } catch (error) {
        console.error('Error deleting language:', error);
        
        // Handle ClientResponseBean error structure: { code, status, message, error, data }
        const serverData = error?.response?.data;
        let errorMessage = error?.message || 'Failed to delete language';
        
        if (serverData) {
            errorMessage = serverData?.message || serverData?.error || errorMessage;
        }
        
        Swal.fire('Error', errorMessage, 'error');
        throw error;
    }
};

export const getCommunicationLanguageById = async (id, headers) => {
    try {
        const res = await axios({
            method: 'GET',
            url: `${BaseUrl}/bookmystarsadmin/language/v1/get/${id}`,
            headers: headers
        });

        // Handle ClientResponseBean structure: { code, status, message, error, data }
        const responseBody = res?.data ?? {};
        const language = responseBody?.data ?? {};
        
        return { ...res, language };
    } catch (error) {
        console.error('Error fetching language by ID:', error);
        
        // Handle ClientResponseBean error structure: { code, status, message, error, data }
        const serverData = error?.response?.data;
        let errorMessage = error?.message || 'Failed to fetch language';
        
        if (serverData) {
            errorMessage = serverData?.message || serverData?.error || errorMessage;
        }
        
        throw new Error(errorMessage);
    }
};

export const updateCommunicationLanguage = async (updatedData, headers) => {
    try {
        const res = await axios({
            method: 'PUT',
            url: `${BaseUrl}/bookmystarsadmin/language/v1/update`,
            headers: headers,
            data: updatedData
        });

        // Handle ClientResponseBean structure: { code, status, message, error, data }
        const responseBody = res?.data ?? {};
        const code = responseBody?.code ?? res?.status;
        const message = responseBody?.message || 'Language updated successfully';

        if (code === 200 || code === 201 || res?.status === 200 || res?.status === 201) {
            Swal.fire('Success', message, 'success');
            return { success: true, message, data: responseBody?.data };
        } else {
            const errorMsg = responseBody?.error || responseBody?.message || 'An error occurred';
            Swal.fire('Error', errorMsg, 'error');
            return { success: false, message: errorMsg };
        }

        return res;
    } catch (error) {
        console.error('Error updating language:', error);
        
        // Handle ClientResponseBean error structure: { code, status, message, error, data }
        const serverData = error?.response?.data;
        const statusCode = error?.response?.status;
        let errorMessage = error?.message || 'Failed to update language';
        
        console.error('Update error - Status code:', statusCode);
        console.error('Update error - Server data:', serverData);
        
        if (serverData) {
            errorMessage = serverData?.message || serverData?.error || errorMessage;
            
            // Handle validation errors specifically
            if (serverData?.body?.message) {
                errorMessage = serverData.body.message;
            } else if (serverData?.body?.error) {
                errorMessage = serverData.body.error;
            }
        }

        // Handle specific HTTP status codes
        if (statusCode === 409) {
            if (serverData?.message?.includes('already exists') || serverData?.message?.includes('duplicate')) {
                errorMessage = 'Language with this name already exists. Please choose a different name.';
            } else if (serverData?.message?.includes('constraint')) {
                errorMessage = 'Invalid data provided - constraint violation. Please check your input.';
            } else {
                errorMessage = serverData?.message || 'Conflict: This language may already exist or violate database constraints.';
            }
        } else if (statusCode === 400) {
            errorMessage = serverData?.message || 'Invalid data provided. Please check your input.';
        } else if (statusCode === 401) {
            errorMessage = 'Authentication required. Please login and try again.';
        } else if (statusCode === 404) {
            errorMessage = 'Language not found. It may have been deleted.';
        }
        
        Swal.fire('Error', errorMessage, 'error');
        throw error;
    }
};

export const getAllCommunicationLanguages = async (headers) => {
    try {
        const res = await axios({
            method: 'get',
            url: `${BaseUrl}/bookmystarsadmin/language/v1/getAll`,
            headers: headers
        });

        // Handle ClientResponseBean structure: { code, status, message, error, data }
        const responseBody = res?.data ?? {};
        const languages = responseBody?.data ?? [];
        
        return { ...res, languages };
    } catch (error) {
        console.error('Error fetching all languages:', error);
        
        // Handle ClientResponseBean error structure: { code, status, message, error, data }
        const serverData = error?.response?.data;
        let errorMessage = error?.message || 'Failed to fetch languages';
        
        if (serverData) {
            errorMessage = serverData?.message || serverData?.error || errorMessage;
        }
        
        throw new Error(errorMessage);
    }
};

export const getCommunicationLanguageByName = async (languageName, headers) => {
    try {
        const res = await axios({
            method: 'GET',
            url: `${BaseUrl}/bookmystarsadmin/language/v1/getByName/${languageName}`,
            headers: headers
        });

        // Handle ClientResponseBean structure: { code, status, message, error, data }
        const responseBody = res?.data ?? {};
        const language = responseBody?.data ?? {};
        
        return { ...res, language };
    } catch (error) {
        console.error('Error fetching language by name:', error);
        
        // Handle ClientResponseBean error structure: { code, status, message, error, data }
        const serverData = error?.response?.data;
        let errorMessage = error?.message || 'Failed to fetch language by name';
        
        if (serverData) {
            errorMessage = serverData?.message || serverData?.error || errorMessage;
        }
        
        throw new Error(errorMessage);
    }
};


export const getCommunicationLanguageCount = async (headers) => {
    try {
        const res = await axios({
            method: 'GET',
            url: `${BaseUrl}/bookmystarsadmin/language/v1/count`,
            headers: headers
        });

        // Handle ClientResponseBean structure: { code, status, message, error, data }
        const responseBody = res?.data ?? {};
        const count = responseBody?.data ?? 0;
        
        return { ...res, count };
    } catch (error) {
        console.error('Error fetching language count:', error);
        throw error;
    }
};

// Helper function to check if language exists by name before creating
export const checkLanguageExists = async (languageName, headers) => {
    try {
        const res = await getCommunicationLanguageByName(languageName, headers);
        return res.language && res.language.languageId;
    } catch (error) {
        // If language doesn't exist, the API will return 404, which is expected
        if (error?.response?.status === 404) {
            return false;
        }
        // For other errors, re-throw
        throw error;
    }
};
