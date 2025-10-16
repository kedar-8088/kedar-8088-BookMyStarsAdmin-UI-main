const API_URL = '/api/bookmystarsadmin/login/v1/userLogin';

export const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const userName = data.get('userName');
    const password = data.get('password');
    const inputErrors = validateInput(userName, password);

    if (Object.keys(inputErrors).length === 0) {
        axios
            .post(API_URL, {
                userName: userName,
                password: password
            })
            .then((response) => {
                console.log('API response:', response.data);
                if (response.data.status === 'FAILED') {
                    onClose();
                    alert('Login Failed');
                    navigate('/');
                } else {
                    sessionStorage.setItem('user', JSON.stringify(response.data));
                    alert('Login Successful');

                    navigate('/mcq/dashboard');
                }

                setFormData({ userName: '', password: '' });
            })
            .catch((error) => {
                console.error('API error:', error);
                alert('Bad Credentials');
            });
    } else {
        setErrors(inputErrors);
    }
};
