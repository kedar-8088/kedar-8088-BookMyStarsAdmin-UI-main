import axios from 'axios';
import Swal from 'sweetalert2';
import { BaseUrl } from 'BaseUrl';

export const fetchBanner = async (pageNumber = 0, pageSize = 10, headers) => {
    return await axios({
        method: 'get',
        url: `${BaseUrl}/bookmystarsadmin/advertisement/v1/getAllAdvertisementByPagination/${pageNumber}/${pageSize}?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        headers: headers
    });
};

export const addBanner = async (data, headers) => {
    try {
        const res = await axios({
            method: 'POST',
            url: `${BaseUrl}/bookmystarsadmin/advertisement/v1/createAdvertisement`,
            headers,
            data: data
        });

        if (res.data.responseCode === 201) {
            Swal.fire('Success', res.data.message, 'success');
        } else if (res.data.responseCode === 400) {
            Swal.fire('Error', res.data.errorMessage, 'error');
        }
    } catch (error) {
        Swal.fire('Error', error.message, 'error');
    }
};

export const deleteBanner = async (id, headers) => {
    return await axios({
        method: 'delete',
        url: `${BaseUrl}/bookmystarsadmin/advertisement/v1/deleteAdvertisementById/${id}`,
        headers
    })
        .then((res) => {
            if (res.data.responseCode === 200) {
                Swal.fire('Deleted!', res.data.message, 'success');
            } else if (res.data.responseCode === 400) {
                Swal.fire('Error', res.data.errorMessage, 'error');
            }
        })
        .catch((err) => {
            Swal.fire('Error', err.message, 'error');
        });
};

export const getAdvertiseById = async (id, headers) => {
    return await axios({
        method: 'GET',
        url: `${BaseUrl}/bookmystarsadmin/advertisement/v1/getAdvertisementByAdvertisementId/${id}`,
        headers: headers
    });
};

export const updatedAdvertise = async (updatedData, headers) => {
    console.log(updatedData);
    return await axios({
        method: 'PUT',
        url: `${BaseUrl}/bookmystarsadmin/advertisement/v1/updateAdvertisement`,
        headers: headers,
        data: updatedData
    })
        .then((res) => {
            if (res.data.responseCode === 201) {
                Swal.fire('Success', res.data.message, 'success');
            } else if (res.data.responseCode === 400) {
                Swal.fire('Error', res.data.errorMessage, 'error');
            }
        })
        .catch((error) => {
            Swal.fire('Error', error.message, 'error');
        });
};
