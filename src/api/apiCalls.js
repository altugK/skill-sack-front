import axios from "axios";

export const getDepartments = (name, page = 0) => {
  if (name) {
    return axios.get(`/api/1.0/departments/${name}?page=${page}`);
  } else {
    return axios.get(`/api/1.0/departments?page=${page}`);
  }
};

export const getSkills = (name, page = 0) => {
  if (name) {
    return axios.get(`/api/1.0/skills/${name}?page=${page}`);
  } else {
    return axios.get(`/api/1.0/skills?page=${page}`);
  }
};

export const getEmployees = (name, page = 0) => {
  if (name) {
    return axios.get(`/api/1.0/employees/${name}?page=${page}`);
  } else {
    return axios.get(`/api/1.0/employees?page=${page}`);
  }
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

export const deleteEmployeeSkill = (employeeid, skillid) => {
  return axios.delete(`/api/1.0/employee/${employeeid}/${skillid}`);
};
