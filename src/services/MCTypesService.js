import httpClient from "../http-common";

const getAll = () => {
    return httpClient.get('/mcapplication/types/getAll/')
}

export default {getAll};