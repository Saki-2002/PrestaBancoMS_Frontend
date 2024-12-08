import httpClient from "../http-common";

const create = data => {
    return httpClient.post('/mcapplication/create/', data);
}

const getAllByClient = id => {
    return httpClient.get(`/mcapplication/getAllbyClient/${id}`);
}

export default { create, getAllByClient};