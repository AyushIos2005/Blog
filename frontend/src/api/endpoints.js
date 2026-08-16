import api from "./client";

/* ---------------- AUTH (/api/auth) ---------------- */
export const registerUser = (data) => api.post("/api/auth/register", data);
export const verifyOtp = (data) => api.post("/api/auth/verify-otp", data);
export const loginUser = (data) => api.post("/api/auth/login", data);
export const getMe = () => api.get("/api/auth/get-me");
export const logoutUser = () => api.post("/api/auth/logout");
export const changePassword = (data) =>
  api.post("/api/auth/change-password", data);
export const forgetPassword = (data) =>
  api.post("/api/auth/forget-password", data);
export const resetPassword = (data) =>
  api.post("/api/auth/reset-password", data);

/* ---------------- POSTS (/api/post) ---------------- */
export const getAllPosts = () => api.get("/api/post/");
export const createPost = (formData) =>
  api.post("/api/post/post", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const updatePost = (id, formData) =>
  api.patch(`/api/post/postupdate/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deletePost = (id) => api.delete(`/api/post/post/${id}`);
export const toggleLike = (id) => api.post(`/api/post/post/${id}/like`);
export const addComment = (id, comment) =>
  api.post(`/api/post/post/${id}/comment`, { comment });
export const getComments = (id) => api.get(`/api/post/post/${id}/comment`);

/* ---------------- PROFILE (/api/profile) ---------------- */
export const createProfile = (formData) =>
  api.post("/api/profile/createProfile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const updateProfile = (id, formData) =>
  api.patch(`/api/profile/updateProfile/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deleteProfile = (id) => api.delete(`/api/profile/deleteProfile/${id}`);
export const getMyProfile = () => api.get("/api/profile/profile-detail");
