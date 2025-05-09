import requests from "./httpService";

const AdminServices = {
  registerAdmin: async (body) => {
    return requests.post("/admin/register", body);
  },

  loginAdmin: async (body) => {
    console.log("base url", import.meta.env.VITE_APP_API_BASE_URL);
    return requests.post(`/admin/login`, body);
  },

  forgetPassword: async (body) => {
    return requests.put("/admin/forget-password", body);
  },

  resetPassword: async (body) => {
    return requests.put("/admin/reset-password", body);
  },

  signUpWithProvider: async (body) => {
    return requests.post("/admin/signup", body);
  },

  addStaff: async (body) => {
    return requests.post("/admin/add", body);
  },
  getAllPartners: async (body) => {
    return requests.get("/partners/partners/all", body);
  },
  getAllTelecallers: async (body) => {
    return requests.get("tele/telecallers/all", body);
  },
  getAllStaff: async (body) => {
    return requests.get("/admin", body);
  },
  getStaffById: async (id, body) => {
    return requests.post(`/admin/${id}`, body);
  },

  updateTelecallerStatus: async (id, body) => {
    return requests.put(`/tele/telecaller/${id}/status`, body);
  },
  updateStorePartnerStatus: async (id, body) => {
    return requests.put(`partners/partner/${id}/status`, body);
  },
  updateStaff: async (id, body) => {
    return requests.put(`/admin/${id}`, body);
  },

  updateStaffStatus: async (id, body) => {
    return requests.put(`/admin/update-status/${id}`, body);
  },

  deleteStaff: async (id) => {
    return requests.delete(`/admin/${id}`);
  },
};

export default AdminServices;
