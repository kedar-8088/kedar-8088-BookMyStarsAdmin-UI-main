import axios from 'axios';
import Swal from 'sweetalert2';
import { BaseUrl } from 'BaseUrl';

export const fetchCommunicationLanguages = async (headers, pageNumber = 0, pageSize = 10) => {
    const res = await axios({
        method: 'get',
        url: `${BaseUrl}/bookmystarsadmin/language/v1/getAllByPagination?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        headers: headers
    });

    // Normalize response to a consistent shape for callers
    // Controller returns: { code, status, message, error, data: { content: [...], totalElements, ... } }
    const body = res?.data ?? {};
    const pageNode = body?.data ?? {};
    const items = Array.isArray(pageNode?.content) ? pageNode.content : Array.isArray(body) ? body : [];
    const total = pageNode?.totalElements ?? pageNode?.totalCount ?? (Array.isArray(items) ? items.length : 0);

    return { items, total, raw: res };
};

export const addCommunicationLanguage = async (data, headers) => {
    try {
        // Log payload for debugging (inspect server-side validation issues)
        console.log('addCommunicationLanguage - payload:', data);

        const res = await axios({
            method: 'POST',
            url: `${BaseUrl}/bookmystarsadmin/language/v1/create`,
            headers,
            data: data
        });

        // Normalize response and show feedback
        const responseBody = res?.data?.body || res?.data;
        const code = responseBody?.code ?? res?.status;
        const message = responseBody?.message || responseBody?.data?.message || 'Language created successfully';

        if (code === 200 || code === 201 || res?.status === 200 || res?.status === 201) {
            Swal.fire('Success', message, 'success');
        } else {
            const errorMsg = responseBody?.error || responseBody?.message || 'An error occurred';
            Swal.fire('Error', errorMsg, 'error');
        }

        return res;
    } catch (error) {
        console.error('Error adding language:', error);

        // Try to extract meaningful server error information
        const serverData = error?.response?.data;
        // Log full server response to help debugging
        console.error('Server response (error.response):', error?.response);
        console.error('Server response data:', serverData);

        let errorMessage = error?.message || 'Failed to add language';

        // Support nested shapes used by ClientResponseBean: { code, status, message, error, data }
        if (serverData) {
            errorMessage = serverData?.message || serverData?.error || serverData?.body?.message || serverData?.body?.error || JSON.stringify(serverData) || errorMessage;
        }

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

        // Handle different response structures
        const responseBody = res?.data?.body || res?.data;
        const code = responseBody?.code;
        const message = responseBody?.message || 'Language deleted successfully';
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
        console.error('Error deleting language:', error);
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete language';
        Swal.fire('Error', errorMessage, 'error');
    }
};

export const getCommunicationLanguageById = async (id, headers) => {
    return await axios({
        method: 'GET',
        url: `${BaseUrl}/bookmystarsadmin/language/v1/get/${id}`,
        headers: headers
    });
};

export const updateCommunicationLanguage = async (updatedData, headers) => {
    try {
        const res = await axios({
            method: 'PUT',
            url: `${BaseUrl}/bookmystarsadmin/language/v1/update`,
            headers: headers,
            data: updatedData
        });

        // Handle different response structures
        const responseBody = res?.data?.body || res?.data;
        const code = responseBody?.code;
        const message = responseBody?.message || 'Language updated successfully';
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
        console.error('Error updating language:', error);
        
        let errorMessage = 'Failed to update language';
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

export const getAllCommunicationLanguages = async (headers) => {
    return await axios({
        method: 'get',
        url: `${BaseUrl}/bookmystarsadmin/language/v1/getAll`,
        headers: headers
    });
};

export const getCommunicationLanguageByName = async (languageName, headers) => {
    return await axios({
        method: 'GET',
        url: `${BaseUrl}/bookmystarsadmin/language/v1/getByName/${languageName}`,
        headers: headers
    });
};

export const searchCommunicationLanguagesByName = async (languageName, headers) => {
    return await axios({
        method: 'GET',
        url: `${BaseUrl}/bookmystarsadmin/language/v1/search?languageName=${languageName}`,
        headers: headers
    });
};

export const getCommunicationLanguageCount = async (headers) => {
    return await axios({
        method: 'GET',
        url: `${BaseUrl}/bookmystarsadmin/language/v1/count`,
        headers: headers
    });
};
