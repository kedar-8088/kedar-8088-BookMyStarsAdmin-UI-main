import axios from 'axios';
import Swal from 'sweetalert2';
import { BaseUrl } from 'BaseUrl';

export const fetchCountries = async (headers, pageNumber = 0, pageSize = 10) => {
  return await axios({
    method: 'get',
    url: `${BaseUrl}/bookmystarsadmin/country/v1/list?pageNumber=${pageNumber}&pageSize=${pageSize}`,
    headers: headers
  });
};

export const addCountry = async (data, headers) => {
    try {
        const res = await axios({
            method: 'POST',
            url: `${BaseUrl}/bookmystarsadmin/country/v1/create`,
            headers,
            data: data
        });

        // Handle different response structures
        const responseBody = res?.data?.body || res?.data;
        const code = responseBody?.code;
        const message = responseBody?.message || 'Country added successfully';
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
        console.error('Error adding country:', error);
        console.error('Error response data:', error?.response?.data);
        
        // Extract error message from various possible response structures
        let errorMessage = 'Failed to add country';
        if (error?.response?.data) {
            const errorData = error.response.data;
            // Try different possible error message locations
            errorMessage = errorData.message || 
                         errorData.error || 
                         errorData.body?.message ||
                         errorData.body?.error ||
                         (typeof errorData === 'string' ? errorData : errorMessage);
        } else if (error?.message) {
            errorMessage = error.message;
        }
        
        Swal.fire('Error', errorMessage, 'error');
    }
};

export const deleteCountry = async (id, headers) => {
    try {
        console.log('=== DELETE COUNTRY DEBUG ===');
        console.log('Country ID to delete:', id);
        console.log('Headers:', headers);
        console.log('Full URL:', `${BaseUrl}/bookmystarsadmin/country/v1/${id}`);
        
        const res = await axios({
            method: 'DELETE',
            url: `${BaseUrl}/bookmystarsadmin/country/v1/${id}`,
            headers
        });

        console.log('=== DELETE RESPONSE ===');
        console.log('HTTP Status:', res.status);
        console.log('Response Data:', res.data);

        // Handle response structure - similar to City API
        const responseBody = res?.data?.body || res?.data;
        const message = responseBody?.message || 'Country deleted successfully';
        
        console.log('✅ DELETE SUCCESS - Returning success result');
        return { success: true, message };
    } catch (error) {
        console.log('=== DELETE ERROR ===');
        console.error('Error deleting country:', error);
        console.log('Error response:', error?.response);
        console.log('Error status:', error?.response?.status);
        console.log('Error data:', error?.response?.data);
        
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete country';
        console.log('Final error message:', errorMessage);
        throw new Error(errorMessage);
    }
};

export const getCountryById = async (id, headers) => {
    try {
        console.log(`Fetching country with ID: ${id}`);
        const res = await axios({
            method: 'GET',
            url: `${BaseUrl}/bookmystarsadmin/country/v1/${id}`,
            headers: headers
        });
        console.log('Get country by ID response:', res.data);
        return res;
    } catch (error) {
        console.error(`Error fetching country with ID ${id}:`, error);
        throw error; // Re-throw to let the calling component handle it
    }
};

export const updateCountry = async (updatedData, headers) => {
    try {
        console.log('Attempting to update country with data:', updatedData);
        
        const countryId = updatedData.countryId;
        
        // Prepare the data for the backend (remove countryId from body since it's in URL)
        const requestData = {
            countryName: updatedData.countryName,
            countryCode: updatedData.countryCode,
            isActive: updatedData.isActive,
            updatedBy: updatedData.updatedBy
        };
        
        console.log('Sending update request to:', `${BaseUrl}/bookmystarsadmin/country/v1/update/${countryId}`);
        console.log('Request data:', requestData);
        
        const res = await axios({
            method: 'PUT',
            url: `${BaseUrl}/bookmystarsadmin/country/v1/update/${countryId}`,
            headers: headers,
            data: requestData
        });

        console.log('Update API response:', res.data);

        // Handle response structure
        const responseBody = res?.data?.body || res?.data;
        const code = responseBody?.code;
        const message = responseBody?.message || 'Country updated successfully';
        const error = responseBody?.error || 'An error occurred';

        if (code === 200 || res.status === 200) {
            return { success: true, message, data: responseBody?.data };
        } else if (code === 400 || res.status === 400) {
            throw new Error(error || 'Update operation failed');
        } else {
            // For unclear responses, check HTTP status
            if (res.status >= 200 && res.status < 300) {
                return { success: true, message, data: responseBody?.data };
            } else {
                throw new Error(message || 'Update operation failed');
            }
        }
    } catch (error) {
        console.error('Error updating country:', error);
        
        let errorMessage = 'Failed to update country';
        if (error?.response?.status === 405) {
            errorMessage = 'Update method not allowed. The server may not support this operation.';
        } else if (error?.response?.data?.error) {
            errorMessage = error.response.data.error;
        } else if (error?.response?.data?.message) {
            errorMessage = error.response.data.message;
        } else if (error?.message) {
            errorMessage = error.message;
        }
        
        throw new Error(errorMessage);
    }
};

export const getAllCountries = async (headers) => {
    return await axios({
        method: 'get',
        url: `${BaseUrl}/bookmystarsadmin/country/v1/all`,
        headers: headers
    });
};

export const getActiveCountries = async (headers) => {
    return await axios({
        method: 'get',
        url: `${BaseUrl}/bookmystarsadmin/country/v1/active`,
        headers: headers
    });
};

export const getCountryByName = async (countryName, headers) => {
    return await axios({
        method: 'GET',
        url: `${BaseUrl}/bookmystarsadmin/country/v1/name/${countryName}`,
        headers: headers
    });
};

export const getCountryByCode = async (countryCode, headers) => {
    return await axios({
        method: 'GET',
        url: `${BaseUrl}/bookmystarsadmin/country/v1/code/${countryCode}`,
        headers: headers
    });
};

export const activateCountry = async (countryId, headers) => {
    try {
        const res = await axios({
            method: 'PUT',
            url: `${BaseUrl}/bookmystarsadmin/country/v1/${countryId}/activate`,
            headers: headers
        });

        // Handle different response structures
        const responseBody = res?.data?.body || res?.data;
        const code = responseBody?.code;
        const message = responseBody?.message || 'Country activated successfully';
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
        console.error('Error activating country:', error);
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to activate country';
        Swal.fire('Error', errorMessage, 'error');
    }
};

export const deactivateCountry = async (countryId, headers) => {
    try {
        const res = await axios({
            method: 'PUT',
            url: `${BaseUrl}/bookmystarsadmin/country/v1/${countryId}/deactivate`,
            headers: headers
        });

        // Handle different response structures
        const responseBody = res?.data?.body || res?.data;
        const code = responseBody?.code;
        const message = responseBody?.message || 'Country deactivated successfully';
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
        console.error('Error deactivating country:', error);
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to deactivate country';
        Swal.fire('Error', errorMessage, 'error');
    }
};

// Test function to verify delete endpoint
export const testDeleteCountry = async (countryId, headers) => {
    console.log('=== TESTING DELETE ENDPOINT ===');
    console.log('Testing delete for country ID:', countryId);
    
    try {
        // First, get the country to verify it exists
        console.log('Step 1: Getting country details...');
        const getRes = await getCountryById(countryId, headers);
        console.log('Country exists:', getRes.data);
        
        // Then try to delete it
        console.log('Step 2: Attempting delete...');
        const deleteRes = await deleteCountry(countryId, headers);
        console.log('Delete result:', deleteRes);
        
        // Finally, try to get it again to verify deletion
        console.log('Step 3: Verifying deletion...');
        try {
            const verifyRes = await getCountryById(countryId, headers);
            console.log('❌ Country still exists after deletion:', verifyRes.data);
        } catch (verifyError) {
            console.log('✅ Country successfully deleted (404 on verification):', verifyError.response?.status);
        }
        
        return deleteRes;
    } catch (error) {
        console.log('❌ Test failed:', error);
        throw error;
    }
};
