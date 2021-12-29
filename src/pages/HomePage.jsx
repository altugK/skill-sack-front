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
  deleteEmployeeSkill,
} from "../api/apiCalls";
import {
  Accordion,
  Badge,
  Button,
  ListGroup,
  Pagination,
  Spinner,
} from "react-bootstrap";
import Input from "../components/Input";
import { toast } from "react-toastify";

const HomePage = () => {
  ///////////////////////// TOP STATES AREA ///////////////////////////////

  const [form, setForm] = useState({
    department: [],
    skill: [],
    employee: [],
  });

  const [errors, setErrors] = useState({});

  const {
    department: departmentError,
    skill: skillError,
    employee: employeeError,
  } = errors;

  const [departments, setDepartments] = useState({
    content: [],
    number: 0,
    first: true,
    last: false,
  });

  const [skills, setSkills] = useState({
    content: [],
    number: 0,
    first: true,
    last: false,
  });

  const [employees, setEmployees] = useState({
    content: [],
    number: 0,
    first: true,
    last: false,
  });

  const [searchDepartmentTerm, setSearchDepartmentTerm] = React.useState("");
  const [searchSkillTerm, setSearchSkillTerm] = React.useState("");
  const [searchEmployeeTerm, setSearchEmployeeTerm] = React.useState("");

  ///////////////////////// TOP STATES AREA END ///////////////////////////////

  ///////////////////////// SEARCHING CHANGES AREA ///////////////////////////////
  //TODO: change this one method
  const onChangeDepartmentSearch = (event) => {
    setSearchDepartmentTerm(event.target.value);
    setDepartments((previousDepartmentPage) => ({
      ...previousDepartmentPage,
      number: 0,
    }));
  };
  const onChangeSkilltSearch = (event) => {
    setSearchSkillTerm(event.target.value);
    setSkills((previousSkillPage) => ({
      ...previousSkillPage,
      number: 0,
    }));
  };
  const onChangeEmployeeSearch = (event) => {
    setSearchEmployeeTerm(event.target.value);
    setEmployees((previousEmployeePage) => ({
      ...previousEmployeePage,
      number: 0,
    }));
  };
  ///////////////////////// SEARCHING CHANGES AREA END///////////////////////////////

  ///////////////////////// API PROGRESS AREA///////////////////////////////

  const getDepartmentsPending = useApiProgress(
    "get",
    "/api/1.0/departments",
    false
  );
  const postDepartmentsPending = useApiProgress(
    "post",
    "/api/1.0/department",
    true
  );

  const getSkillsPending = useApiProgress("get", "/api/1.0/skills", false);
  const postSkillsPending = useApiProgress("post", "/api/1.0/skill", true);

  const getEmployeesPending = useApiProgress(
    "get",
    "/api/1.0/employees",
    false
  );
  const postEmployeesPending = useApiProgress(
    "post",
    "/api/1.0/employee",
    true
  );

  ///////////////////////// API PROGRESS AREA END///////////////////////////////

  ///////////////////////// FETCHING AREA///////////////////////////////

  ///DEPARTMENTS///
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await getDepartments(
          searchDepartmentTerm,
          departments.number
        );
        setDepartments({
          content: response.data.content,
          number: response.data.number,
          first: response.data.first,
          last: response.data.last,
        });
      } catch (error) {
        console.log(error + "departments api error");
      }
    };
    fetchDepartments();
  }, [postDepartmentsPending, searchDepartmentTerm, departments.number]);
  ///DEPARTMENTS END///

  ///SKILLS///
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await getSkills(searchSkillTerm, skills.number);
        setSkills({
          content: response.data.content,
          number: response.data.number,
          first: response.data.first,
          last: response.data.last,
        });
      } catch (error) {
        console.log(error + "fetchSkills api error");
      }
    };
    fetchSkills();
  }, [postSkillsPending, searchSkillTerm, skills.number]);
  ///SKILLS END///

  ///EMPLOYEES///
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await getEmployees(
          searchEmployeeTerm,
          employees.number
        );
        setEmployees({
          content: response.data.content,
          number: response.data.number,
          first: response.data.first,
          last: response.data.last,
        });
      } catch (error) {
        console.log(error + "fetchEmployees error");
      }
    };
    fetchEmployees();
  }, [postEmployeesPending, searchEmployeeTerm, employees.number]);
  ///EMPLOYEES END///

  ///////////////////////// FETCHING AREA END///////////////////////////////

  ///////////////////////// SAVING AREA///////////////////////////////
  //TODO:fix valid saving errors
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

  ///////////////////////// SAVING AREA END///////////////////////////////

  ///////////////////////// DELETING AREA///////////////////////////////
  //TODO:fix state update of deleting releations
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

  const onDeleteEmployeeSkill = async (employeeId, skillId) => {
    try {
      await deleteEmployeeSkill(employeeId, skillId);
      setEmployees((previousEmployeePage) => ({
        ...previousEmployeePage,
        content: previousEmployeePage.content.map((employee) =>
          employee.id === employeeId
            ? {
                ...employee,
                skills: employee.skills.filter((skill) => skill.id !== skillId),
              }
            : employee
        ),
      }));

      toast.success("Employee skill deleted successfully");
    } catch (error) {
      toast.error("Error deleting employee skill");
    }
  };

  ///////////////////////// DELETING AREA END///////////////////////////////

  ///////////////////////// UPDATING AREA///////////////////////////////

  const onUpdateEmployeeSuccess = (id, response) => {
    setEmployees((previousEmployeePage) => ({
      ...previousEmployeePage,
      content: previousEmployeePage.content.map((employee) =>
        employee.id === id ? response.data : employee
      ),
    }));
  };
  ///////////////////////// UPDATING AREA END///////////////////////////////

  ///////////////////////// PAGINATION AREA ///////////////////////////////

  const onPaginationPage = (event) => {
    event.preventDefault();
    const name = event.target.name;
    const nextOrPrevPage = name.includes("next") ? +1 : -1;

    if (name.includes("department")) {
      setDepartments((previousDepartmentPage) => ({
        ...previousDepartmentPage,
        number: previousDepartmentPage.number + nextOrPrevPage,
      }));
    } else if (name.includes("skill")) {
      setSkills((previousSkillPage) => ({
        ...previousSkillPage,
        number: previousSkillPage.number + nextOrPrevPage,
      }));
    } else if (name.includes("employee")) {
      setEmployees((previousEmployeePage) => ({
        ...previousEmployeePage,
        number: previousEmployeePage.number + nextOrPrevPage,
      }));
    }
  };

  ///////////////////////// PAGINATION AREA END///////////////////////////////

  return (
    <React.Fragment>
      <Stack
        direction="horizontal"
        gap={3}
        className="gap-3 hstack justify-content-sm-between mx-auto row-cols-md-4 align-items-sm-start"
      >
        {/* ***************  DEPARTMENT  **************** */}
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
          <Input
            name="departmentSearch"
            placeholder="Search Department"
            value={searchDepartmentTerm}
            onChange={onChangeDepartmentSearch}
          />

          {getDepartmentsPending === true ? (
            <div className="d-flex justify-content-center">
              <Spinner animation="border" />
            </div>
          ) : (
            <>
              <Pagination className="row-cols-1 col-form-label">
                <Stack direction="horizontal" gap={2}>
                  <Button
                    name="department prev"
                    onClick={onPaginationPage}
                    size="sm"
                    disabled={departments.first}
                  >
                    ⏮️
                  </Button>
                  <Button
                    className="ms-auto"
                    name="department next"
                    onClick={onPaginationPage}
                    size="sm"
                    disabled={departments.last}
                  >
                    ⏭️
                  </Button>
                </Stack>
              </Pagination>
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
                              return (
                                <Badge className="mb-lg-1" bg="success">
                                  {employee}
                                </Badge>
                              );
                            })}
                          </ListGroup>
                        </Accordion.Body>
                      </Accordion.Item>
                    );
                  })}
                </Accordion>
              </ListGroup>
            </>
          )}
        </div>

        {/* ***************  DEPARTMENT  END**************** */}

        {/* ***************  SKILL  **************** */}
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
          <Input
            name="skillSearch"
            placeholder="Search Skill"
            value={searchSkillTerm}
            onChange={onChangeSkilltSearch}
          />

          {getSkillsPending === true ? (
            <div className="d-flex justify-content-center">
              <Spinner animation="border" />
            </div>
          ) : (
            <>
              <Pagination className="row-cols-1 col-form-label">
                <Stack direction="horizontal" gap={2}>
                  <Button
                    name="skill prev"
                    onClick={onPaginationPage}
                    size="sm"
                    disabled={skills.first}
                  >
                    ⏮️
                  </Button>
                  <Button
                    className="ms-auto"
                    name="skill next"
                    onClick={onPaginationPage}
                    size="sm"
                    disabled={skills.last}
                  >
                    ⏭️
                  </Button>
                </Stack>
              </Pagination>
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
                              return (
                                <Badge className="mb-lg-1" bg="success">
                                  {employee}
                                </Badge>
                              );
                            })}
                          </ListGroup>
                        </Accordion.Body>
                      </Accordion.Item>
                    );
                  })}
                </Accordion>
              </ListGroup>
            </>
          )}
        </div>
        {/* ***************  SKILL END **************** */}

        {/* ***************  EMPLOYEE  **************** */}
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
          <Input
            name="employeeSearch"
            placeholder="Search Employee"
            value={searchEmployeeTerm}
            onChange={onChangeEmployeeSearch}
          />
          {getEmployeesPending === true ? (
            <div className="d-flex justify-content-center">
              <Spinner animation="border" />
            </div>
          ) : (
            <>
              <Pagination className="row-cols-1 col-form-label">
                <Stack direction="horizontal" gap={2}>
                  <Button
                    name="employee prev"
                    onClick={onPaginationPage}
                    size="sm"
                    disabled={employees.first}
                  >
                    ⏮️
                  </Button>
                  <Button
                    className="ms-auto"
                    name="employee next"
                    onClick={onPaginationPage}
                    size="sm"
                    disabled={employees.last}
                  >
                    ⏭️
                  </Button>
                </Stack>
              </Pagination>
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
                          <Badge
                            bg="warning"
                            text="dark"
                            className="accordion-button"
                          >
                            <h7>
                              {employee.department === null
                                ? "No department"
                                : employee.department.name}
                            </h7>
                          </Badge>
                          <ListGroup>
                            {employee.skills.map((skill) => {
                              return (
                                <Stack gap={2}>
                                  <li>
                                    <Badge bg="info" text="dark">
                                      {skill.name}
                                    </Badge>
                                    <div
                                      className="btn"
                                      onClick={() =>
                                        onDeleteEmployeeSkill(
                                          employee.id,
                                          skill.id
                                        )
                                      }
                                    >
                                      🗑️
                                    </div>
                                  </li>
                                </Stack>
                              );
                            })}
                          </ListGroup>
                        </Accordion.Body>
                      </Accordion.Item>
                    );
                  })}
                </Accordion>
              </ListGroup>
            </>
          )}
        </div>

        {/* ***************  EMPLOYEE END **************** */}
      </Stack>
    </React.Fragment>
  );
};
export default HomePage;
