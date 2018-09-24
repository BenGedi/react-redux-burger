import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-redux-burger-1.firebaseio.com/'
});

export default instance;