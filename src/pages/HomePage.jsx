import Stack from "react-bootstrap/Stack";
import ButtonWithProgress from "../components/ButtonWithProgress";
import ListComp from "../components/ListComp";
import { useApiProgress } from "../shared/ApiProgress";
import React, { useState, useEffect } from "react";
import {
  getDepartments,
  getSkills,
  getEmployees,
  postEmployee,
  postDepartment,
  postSkill,
} from "../api/apiCalls";
import { Accordion, ListGroup, Spinner } from "react-bootstrap";
import Input from "../components/Input";
import { toast } from "react-toastify";

const HomePage = () => {
  const [form, setForm] = useState({
    department: [],
    skill: [],
    employee: [],
  });

  const [errors, setErrors] = useState({});

  const [departments, setDepartments] = useState({
    content: [],
    last: true,
    number: 0,
  });

  const [skills, setSkills] = useState({
    content: [],
    last: true,
    number: 0,
  });

  const [employees, setEmployees] = useState({
    content: [],
    last: true,
    number: 0,
  });

  const getDepartmentsPending = useApiProgress(
    "get",
    "/api/1.0/departments",
    true
  );
  const postDepartmentsPending = useApiProgress(
    "post",
    "/api/1.0/department",
    true
  );

  const getSkillsPending = useApiProgress("get", "/api/1.0/skills", true);
  const postSkillsPending = useApiProgress("post", "/api/1.0/skill", true);

  const getEmployeesPending = useApiProgress("get", "/api/1.0/employees", true);
  const postEmployeesPending = useApiProgress(
    "post",
    "/api/1.0/employee",
    true
  );

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await getDepartments();
        setDepartments({
          content: response.data.content,
          last: response.data.last,
          number: response.data.number,
        });
      } catch (error) {
        console.log(error + "departments api error");
      }
    };
    fetchDepartments();
  }, [postDepartmentsPending]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await getSkills();
        setSkills({
          content: response.data.content,
          last: response.data.last,
          number: response.data.number,
        });
      } catch (error) {
        console.log(error + "fetchSkills api error");
      }
    };
    fetchSkills();
  }, [postSkillsPending]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await getEmployees();
        setEmployees({
          content: response.data.content,
          last: response.data.last,
          number: response.data.number,
        });
      } catch (error) {
        console.log(error + "fetchEmployees error");
      }
    };
    fetchEmployees();
  }, [postEmployeesPending]);

  const onChange = (event) => {
    const { name, value } = event.target;
    setErrors((previousErrors) => ({ ...previousErrors, [name]: undefined }));
    setForm((previousForm) => ({ ...previousForm, [name]: value }));
  };

  const onClickSave = async (event) => {
    event.preventDefault();
    const { name } = event.target;
    const { department, skill, employee } = form;

    try {
      let body;
      if (name === "department") {
        body = {
          name: department,
        };
        await postDepartment(body);
        setForm({ department: null });
        toast.success("Department added successfully");
      } else if (name === "skill") {
        body = {
          name: skill,
        };
        await postSkill(body);
        setForm({ skill: null });
        toast.success("Skill added successfully");
      } else if (name === "employee") {
        body = {
          name: employee,
        };
        await postEmployee(body);
        setForm({ employee: null });
        toast.success("Employee added successfully");
      }
    } catch (error) {
      if (error.response.data.validationErrors) {
        setErrors(error.response.data.validationErrors);
        toast.error(error.response.data.validationErrors);
      }
    }
  };

  const onDeleteDeparmentSuccess = (id) => {
    setDepartments((previousDepartmentPage) => ({
      ...previousDepartmentPage,
      content: previousDepartmentPage.content.filter(
        (deparment) => deparment.id !== id
      ),
    }));
  };

  const onDeleteSkillSuccess = (id) => {
    setSkills((previousSkillPage) => ({
      ...previousSkillPage,
      content: previousSkillPage.content.filter((skill) => skill.id !== id),
    }));
  };

  const onDeleteEmployeeSuccess = (id) => {
    setEmployees((previousEmployeePage) => ({
      ...previousEmployeePage,
      content: previousEmployeePage.content.filter(
        (employee) => employee.id !== id
      ),
    }));
  };

  const onUpdateEmployeeSuccess = (id, response) => {
    setEmployees((previousEmployeePage) => ({
      ...previousEmployeePage,
      content: previousEmployeePage.content.map((employee) =>
        employee.id === id ? response.data : employee
      ),
    }));
  };

  const {
    department: departmentError,
    skill: skillError,
    employee: employeeError,
  } = errors;

  return (
    <React.Fragment>
      <Stack
        direction="horizontal"
        gap={3}
        className="gap-3 hstack justify-content-sm-between mx-auto row-cols-md-4 align-items-sm-start"
      >
        <div>
          <Input
            name="department"
            label="Department"
            error={departmentError}
            onChange={onChange}
          />
          <ButtonWithProgress
            name="department"
            pendingApiCall={postDepartmentsPending}
            disabled={postDepartmentsPending}
            onClick={onClickSave}
            text="Save"
          />
          {getDepartmentsPending === true ? (
            <div className="d-flex justify-content-center">
              <Spinner animation="border" />
            </div>
          ) : (
            <ListGroup>
              <Accordion defaultActiveKey="0">
                {departments.content.map((department) => {
                  return (
                    <Accordion.Item eventKey={department.id}>
                      <Accordion.Header>
                        <ListComp
                          draggable
                          whichOne="department"
                          key={department.id}
                          item={department}
                          variant="warning"
                          onDelete={onDeleteDeparmentSuccess}
                        />
                      </Accordion.Header>
                      <Accordion.Body>
                        <ListGroup>
                          {department.employees.map((employee) => {
                            return <li>{employee}</li>;
                          })}
                        </ListGroup>
                      </Accordion.Body>
                    </Accordion.Item>
                  );
                })}
              </Accordion>
            </ListGroup>
          )}
        </div>

        <div>
          <Input
            name="skill"
            label="Skill"
            error={skillError}
            onChange={onChange}
          />
          <ButtonWithProgress
            name="skill"
            pendingApiCall={postSkillsPending}
            disabled={postSkillsPending}
            onClick={onClickSave}
            text="Save"
          />
          {getSkillsPending === true ? (
            <div className="d-flex justify-content-center">
              <Spinner animation="border" />
            </div>
          ) : (
            <ListGroup>
              <Accordion defaultActiveKey="1">
                {skills.content.map((skill) => {
                  return (
                    <Accordion.Item eventKey={skill.id}>
                      <Accordion.Header>
                        <ListComp
                          draggable
                          whichOne="skill"
                          key={skill.id}
                          item={skill}
                          variant="info"
                          onDelete={onDeleteSkillSuccess}
                        />
                      </Accordion.Header>
                      <Accordion.Body>
                        <ListGroup>
                          {skill.employees.map((employee) => {
                            return <li>{employee}</li>;
                          })}
                        </ListGroup>
                      </Accordion.Body>
                    </Accordion.Item>
                  );
                })}
              </Accordion>
            </ListGroup>
          )}
        </div>

        <div>
          <Input
            name="employee"
            label="Employee"
            error={employeeError}
            onChange={onChange}
          />
          <ButtonWithProgress
            name="employee"
            pendingApiCall={postEmployeesPending}
            disabled={postEmployeesPending}
            onClick={onClickSave}
            text="Save"
          />
          {getEmployeesPending === true ? (
            <div className="d-flex justify-content-center">
              <Spinner animation="border" />
            </div>
          ) : (
            <ListGroup>
              <Accordion defaultActiveKey="2">
                {employees.content.map((employee) => {
                  return (
                    <Accordion.Item eventKey={employee.id}>
                      <Accordion.Header>
                        <ListComp
                          whichOne="employee"
                          key={employee.id}
                          item={employee}
                          variant="success"
                          onDelete={onDeleteEmployeeSuccess}
                          onUpdate={onUpdateEmployeeSuccess}
                        />
                      </Accordion.Header>
                      <Accordion.Body>
                        <div className="text-sm-center">
                          {employee.department === null
                            ? "No department"
                            : employee.department.name}
                        </div>
                        <ListGroup>
                          {employee.skills.map((skill) => {
                            return <li>{skill.name}</li>;
                          })}
                        </ListGroup>
                      </Accordion.Body>
                    </Accordion.Item>
                  );
                })}
              </Accordion>
            </ListGroup>
          )}
        </div>
      </Stack>
    </React.Fragment>
  );
};
export default HomePage;
