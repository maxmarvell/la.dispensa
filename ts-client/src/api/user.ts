import axiosInstance from "./refresh"
import { ConnectionType, UserType } from "../@types/user";

export async function get({ userId }: any) {
  try {
    let { data } = await axiosInstance.get(`/api/users/${userId}`);
    return data as UserType;
  } catch (e) {
    console.error(e);
  };
};

export async function getMany({ userId }: any) {
  try {
    let { data } = await axiosInstance.get(`/api/users?` + new URLSearchParams({
      userId
    }));
    return data;
  } catch (e) {
    console.error(e);
  };
};

export async function uploadPhoto({ formData, userId }: any) {
  try {
    let { data } = await axiosInstance.patch(`/api/users/${userId}/uploadPhoto/`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
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
    return data as UserType[];
  } catch (error) {
    console.error(error);
  };
};

export async function getConnectionsByUserId({ userId }: any) {
  try {
    let { data } = await axiosInstance.get(`/api/users/${userId}/connections`);
    return data;
  } catch (error) {
    console.error(error);
  };
};

export async function acceptConnection({ userId }: any) {
  try {
    let { data } = await axiosInstance.put(`/api/users/${userId}/connect/`);
    console.log(data)
    return data;
  } catch (error) {
    console.error(error);
  };
};

export async function createConnection({ userId }: any) {
  try {
    let { data } = await axiosInstance.post(`/api/users/${userId}/connect/`);
    return data;
  } catch (error) {
    console.error(error);
  };
};

export async function removeConnection({ userId }: any) {
  try {
    let { data } = await axiosInstance.delete(`/api/users/${userId}/connect/`);
    return data;
  } catch (error) {
    console.error(error);
  };
};

export async function getConnectionRequests(): Promise<ConnectionType[] | undefined> {
  try {
    let { data } = await axiosInstance.get(`/api/users/connection-requests`);
    return data;
  } catch (error) {
    console.error(error);
  };
};