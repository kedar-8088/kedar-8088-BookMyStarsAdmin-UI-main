import axios from 'axios';
import Swal from 'sweetalert2';
import { BaseUrl } from 'BaseUrl';

const getAuthHeaders = () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    console.log('User data in getAuthHeaders:', user);

    const token = user?.accessToken;
    const tokenType = user?.tokenType || 'Bearer';

    if (!token) {
        throw new Error('No authentication token available');
    }

    // Check if the token already includes 'Bearer'
    const authToken = token.startsWith('Bearer ') ? token : `${tokenType} ${token}`;

    console.log('Generated auth token:', authToken);

    return {
        'Content-Type': 'application/json',
        'Authorization': authToken
    };
};

export const fetchCities = async (headers, pageNumber = 0, pageSize = 10) => {
    try {
        const authHeaders = getAuthHeaders();
        
        // Ensure pageNumber and pageSize are valid numbers
        const validPageNumber = Math.max(0, parseInt(pageNumber) || 0);
        const validPageSize = Math.max(1, parseInt(pageSize) || 10);

        console.log('Fetch Cities Request:', {
            url: `${BaseUrl}/bookmystarsadmin/city/v1/list`,
            headers: authHeaders,
            params: {
                pageNumber: validPageNumber,
                pageSize: validPageSize
            }
        });

        const response = await axios({
            method: 'get',
            url: `${BaseUrl}/bookmystarsadmin/city/v1/list`,
            headers: authHeaders,
            params: {
                pageNumber: validPageNumber,
                pageSize: validPageSize
            }
        });

        console.log('Cities response:', response);
        
        // Handle the new API response format
        if (response.data && response.data.code === 200) {
            return {
                data: {
                    body: {
                        data: {
                            content: response.data.data.cities || [],
                            totalElements: response.data.data.totalCount || 0,
                            totalCount: response.data.data.totalCount || 0,
                            pageNumber: response.data.data.pageNumber,
                            pageSize: response.data.data.pageSize,
                            cities: response.data.data.cities || []
                        }
                    },
                    status: response.data.status,
                    message: response.data.message
                }
            };
        }
        
        return response;
    } catch (error) {
        console.error('Fetch cities error details:', {
            status: error.response?.status,
            data: error.response?.data,
            headers: error.response?.headers,
            config: error.config
        });
        throw error;
    }
};

export const addCity = async (data) => {
    try {
        const authHeaders = getAuthHeaders();
        
        // Format data to match CityDto structure
        const formattedData = {
            cityName: data.cityName,
            countryId: data.countryId,
            stateId: data.stateId,
            isActive: data.isActive,
            isDelete: false,
            insertedBy: {
                userId: data.insertedBy?.userId || 1,
                userName: data.insertedBy?.userName || 'admin'
            }
        };

        console.log('Formatted city data:', formattedData);

        const res = await axios({
            method: 'POST',
            url: `${BaseUrl}/bookmystarsadmin/city/v1/create`,
            headers: authHeaders,
            data: formattedData
        });

        // Backend response shape examples:
        // 1) { code:200, status:'SUCCESS', message:'...', data: { ... } }
        // 2) { status:'SUCCESS', message:'City created successfully', data: null }
        const body = res?.data || {};

        // Prefer checking status === 'SUCCESS'
        if (body.status === 'SUCCESS' || body.code === 200) {
            const successMessage = body.message || 'City created successfully';
            // Don't show success message here - let the UI handle it
            console.log('City created successfully:', successMessage);
            return body; // return parsed body for caller to use
        }

        // Fallback: handle error-like responses
        const errMsg = body.message || body.error || 'Failed to create city';
        // Don't show error message here - let the UI handle it
        console.error('City creation failed:', errMsg);
        const error = new Error(errMsg);
        error.response = res;
        throw error;
    } catch (error) {
        console.error('Error adding city:', error);

        // Log the full error details for debugging (include nested server response)
        const resp = error.response;
        const serverData = resp?.data;
        console.log('Full error details:', {
            status: resp?.status,
            headers: resp?.headers,
            data: serverData,
            message: error.message,
            config: error.config
        });
        try {
            console.log('Server response body (string):', JSON.stringify(serverData));
        } catch (e) {
            console.log('Server response body (string) could not be stringified');
        }

        // Prefer server-provided message fields, fall back to stringified body
        let errorMessage = 'Failed to add city';
        if (serverData) {
            if (typeof serverData === 'string') {
                errorMessage = serverData;
            } else if (serverData.message) {
                errorMessage = serverData.message;
            } else if (serverData.error) {
                errorMessage = serverData.error;
            } else if (serverData.body && (serverData.body.message || serverData.body.error)) {
                errorMessage = serverData.body.message || serverData.body.error;
            } else {
                try {
                    errorMessage = JSON.stringify(serverData);
                } catch (_e) {
                    errorMessage = String(serverData);
                }
            }
        } else if (error.message) {
            errorMessage = error.message;
        }

        // Handle specific error cases
        if (resp?.status === 400) {
            if (errorMessage.toLowerCase().includes('constraint') || errorMessage.toLowerCase().includes('validation')) {
                errorMessage = 'Invalid data: Please check all required fields';
            }
        }

        // Let the UI component handle error display
        console.error('City creation error:', errorMessage);
        throw error;
    }
};

export const deleteCity = async (cityId) => {
    try {
        const authHeaders = getAuthHeaders();
        const res = await axios({
            method: 'DELETE',
            url: `${BaseUrl}/bookmystarsadmin/city/v1/${cityId}`,
            headers: authHeaders
        });

        const responseBody = res?.data?.body || res?.data;
        const message = responseBody?.message || 'City deleted successfully';
        
        Swal.fire('Success', message, 'success');
        return true;
    } catch (error) {
        console.error('Error deleting city:', error);
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete city';
        Swal.fire('Error', errorMessage, 'error');
        throw error;
    }
};

export const getCityById = async (cityId) => {
    const authHeaders = getAuthHeaders();
    return await axios({
        method: 'GET',
        url: `${BaseUrl}/bookmystarsadmin/city/v1/${cityId}`,
        headers: authHeaders
    });
};

export const updateCity = async (cityId, updatedData) => {
    try {
        const authHeaders = getAuthHeaders();
        // Format data to match CityDto structure
        const formattedData = {
            cityId: cityId,
            cityName: updatedData.cityName,
            countryId: updatedData.countryId,
            stateId: updatedData.stateId,
            isActive: updatedData.isActive,
            isDelete: updatedData.isDelete || false,
            updatedBy: {
                userId: updatedData.updatedBy?.userId || 1,
                userName: updatedData.updatedBy?.userName || 'admin'
            }
        };

        const res = await axios({
            method: 'PUT',
            url: `${BaseUrl}/bookmystarsadmin/city/v1/update/${cityId}`,
            headers: authHeaders,
            data: formattedData
        });

        const responseBody = res?.data?.body || res?.data;
        const message = responseBody?.message || 'City updated successfully';
        Swal.fire('Success', message, 'success');
        return responseBody?.data;
    } catch (error) {
        console.error('Error updating city:', error);
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update city';
        Swal.fire('Error', errorMessage, 'error');
        throw error;
    }
};

export const getAllCities = async () => {
    const authHeaders = getAuthHeaders();
    return await axios({
        method: 'GET',
        url: `${BaseUrl}/bookmystarsadmin/city/v1/all`,
        headers: authHeaders
    });
};

export const getActiveCities = async () => {
    const authHeaders = getAuthHeaders();
    return await axios({
        method: 'GET',
        url: `${BaseUrl}/bookmystarsadmin/city/v1/active`,
        headers: authHeaders
    });
};

export const getCityByName = async (cityName) => {
    const authHeaders = getAuthHeaders();
    return await axios({
        method: 'GET',
        url: `${BaseUrl}/bookmystarsadmin/city/v1/name/${cityName}`,
        headers: authHeaders
    });
};

export const getCitiesByState = async (stateId) => {
    const authHeaders = getAuthHeaders();
    return await axios({
        method: 'GET',
        url: `${BaseUrl}/bookmystarsadmin/city/v1/state/${stateId}`,
        headers: authHeaders
    });
};

export const getActiveCitiesByState = async (stateId) => {
    const authHeaders = getAuthHeaders();
    return await axios({
        method: 'GET',
        url: `${BaseUrl}/bookmystarsadmin/city/v1/state/${stateId}/active`,
        headers: authHeaders
    });
};

export const getCitiesByCountry = async (countryId) => {
    const authHeaders = getAuthHeaders();
    return await axios({
        method: 'GET',
        url: `${BaseUrl}/bookmystarsadmin/city/v1/country/${countryId}`,
        headers: authHeaders
    });
};

export const getActiveCitiesByCountry = async (countryId) => {
    const authHeaders = getAuthHeaders();
    return await axios({
        method: 'GET',
        url: `${BaseUrl}/bookmystarsadmin/city/v1/country/${countryId}/active`,
        headers: authHeaders
    });
};

export const activateCity = async (cityId) => {
    try {
        const authHeaders = getAuthHeaders();
        const res = await axios({
            method: 'PUT',
            url: `${BaseUrl}/bookmystarsadmin/city/v1/${cityId}/activate`,
            headers: authHeaders
        });
        
        const responseBody = res?.data?.body || res?.data;
        const message = responseBody?.message || 'City activated successfully';
        Swal.fire('Success', message, 'success');
        return true;
    } catch (error) {
        console.error('Error activating city:', error);
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to activate city';
        Swal.fire('Error', errorMessage, 'error');
        throw error;
    }
};

export const deactivateCity = async (cityId) => {
    try {
        const authHeaders = getAuthHeaders();
        const res = await axios({
            method: 'PUT',
            url: `${BaseUrl}/bookmystarsadmin/city/v1/${cityId}/deactivate`,
            headers: authHeaders
        });
        
        const responseBody = res?.data?.body || res?.data;
        const message = responseBody?.message || 'City deactivated successfully';
        Swal.fire('Success', message, 'success');
        return true;
    } catch (error) {
        console.error('Error deactivating city:', error);
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to deactivate city';
        Swal.fire('Error', errorMessage, 'error');
        throw error;
    }
};

// Since there's no direct count endpoint in the backend controller,
// we'll calculate it from the list endpoint
export const getCityCount = async () => {
    try {
        const authHeaders = getAuthHeaders();

        // Fetch all cities
        const response = await axios({
            method: 'GET',
            url: `${BaseUrl}/bookmystarsadmin/city/v1/all`,
            headers: authHeaders
        });

        // Normalize response
        const responseBody = response?.data?.body || response?.data;
        const cities = responseBody?.data || [];

        // Return count in the expected format
        const count = Array.isArray(cities) ? cities.length : 0;
        return {
            data: {
                body: {
                    data: count
                }
            }
        };
    } catch (error) {
        console.error('Get city count error details:', {
            status: error.response?.status,
            data: error.response?.data,
            headers: error.response?.headers,
            config: error.config
        });
        throw error;
    }
};
