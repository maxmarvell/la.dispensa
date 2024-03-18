import axiosInstance from "./refresh"

export async function get({ userId }) {
  try {
    let { data } = await axiosInstance.get(`/api/users/${userId}`);
    return data;
  } catch (e) {
    console.error(e);
  };
};

export async function getMany({ userId }) {
  try {
    let { data } = await axiosInstance.get(`/api/users?` + new URLSearchParams({
      userId
    }));
    return data;
  } catch (e) {
    console.error(e);
  };
};

export async function uploadPhoto({ formData, userId }) {
  try {
    let { data } = await axiosInstance.patch(`/api/users/${userId}/uploadPhoto/`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' }
      },
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    console.error(error);
  };
};


// Connections API services

export async function getConnections() {
  try {
    let { data } = await axiosInstance.get("/api/users/connections");
    return data;
  } catch (error) {
    console.error(e);
  };
};

export async function getConnectionsByUserId({ userId }) {
  try {
    let { data } = await axiosInstance.get(`/api/users/${userId}/connections`);
    return data;
  } catch (error) {
    console.error(error);
  };
};

export async function acceptConnection({ userId }) {
  try {
    let { data } = await axiosInstance.put(`/api/users/${userId}/connect/`);
    console.log(data)
    return data;
  } catch (error) {
    console.error(error);
  };
};

export async function createConnection({ userId }) {
  try {
    let { data } = await axiosInstance.post(`/api/users/${userId}/connect/`);
    return data;
  } catch (error) {
    console.error(error);
  };
};

export async function removeConnection({ userId }) {
  try {
    let { data } = await axiosInstance.delete(`/api/users/${userId}/connect/`);
    return data;
  } catch (error) {
    console.error(error);
  };
};

export async function getConnectionRequests() {
  try {
    let { data } = await axiosInstance.get(`/api/users/connection-requests`);
    return data;
  } catch (error) {
    console.error(error);
  };
};