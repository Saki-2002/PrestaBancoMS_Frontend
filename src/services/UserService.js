import httpClient from "../http-common";

const login = data => {
    return httpClient.post('/userregister/login/',data)
}

const register = data => {
    return httpClient.post('/userregister/register/',data)
}

export default {login,register};