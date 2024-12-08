import httpClient from "../http-common";

const getAll = () => {
    return httpClient.get('/userregister/roles/getAll/')
}

export default {getAll};