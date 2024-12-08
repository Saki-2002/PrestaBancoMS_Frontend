import httpClient from "../http-common";

const updateStatus = (id,status) => {
    return httpClient.put(`/mctracking/updateStatus/${id}`, status);
}

const getAllStatuses = () => {
    return httpClient.get('/mctracking/status/getAll/');
}

export default { updateStatus,getAllStatuses};