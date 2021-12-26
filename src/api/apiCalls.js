import axios from "axios";

export const getDepartments = () => {
  return axios.get("/api/1.0/departments");
};

export const getSkills = () => {
  return axios.get("/api/1.0/skills");
};

export const getEmployees = () => {
  return axios.get("/api/1.0/employees");
};

export const postDepartment = (body) => {
  return axios.post("/api/1.0/department", body);
};

export const postSkill = (body) => {
  return axios.post("/api/1.0/skill", body);
};

export const postEmployee = (body) => {
  return axios.post("/api/1.0/employee", body);
};

export const deleteDepartment = (id) => {
  return axios.delete(`/api/1.0/department/${id}`);
};

export const deleteSkill = (id) => {
  return axios.delete(`/api/1.0/skill/${id}`);
};

export const deleteEmployee = (id) => {
  return axios.delete(`/api/1.0/employee/${id}`);
};

export const updateDepartment = (id, body) => {
  return axios.put(`/api/1.0/department/${id}`, body);
};

export const updateSkill = (id, body) => {
  return axios.put(`/api/1.0/skill/${id}`, body);
};

export const updateEmployee = (id, body) => {
  return axios.put(`/api/1.0/employee/${id}`, body);
};
