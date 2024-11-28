import axiosInstance from "../plugins/axios";

// Get containers with filters and pagination
export const GetContainers = (status, page, pageSize) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .get("/containers", {
        params: { status, page, pageSize },
      })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
};

// Delete a container by ID
export const deleteContainer = (id) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .delete(`/containers/${id}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
};

// Add a holdType to a container
export const addHoldType = (id, holdType) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .put(`/containers/${id}/add-holdtype`, { holdType })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
};

// Disable a holdType in a container
export const disableHoldType = (id, holdType) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .put(`/containers/${id}/disable-holdtype`, { holdType })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
};
