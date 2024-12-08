import httpClient from "../http-common";

const updateStatus = (id,status) => {
    return httpClient.put(`/mcevaluation/updateStatus/${id}`, status);
}

const getAllStatuses = () => {
    return httpClient.get('/mcevaluation/status/getAll/');
}

const getAllApplications = () => {
    return httpClient.get('/mcevaluation/applications/getAll/');
}

export default { updateStatus, getAllStatuses, getAllApplications};