import { Form, ListGroup, Stack } from "react-bootstrap";
import ButtonWithProgress from "../components/ButtonWithProgress";
import {
  deleteEmployee,
  deleteSkill,
  deleteDepartment,
  updateDepartment,
  updateEmployee,
  updateSkill,
} from "../api/apiCalls";
import { useApiProgress } from "../shared/ApiProgress";
import React, { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { toast } from "react-toastify";

const ListComp = (props) => {
  ///////////////////////// TOP STATES AREA ///////////////////////////////

  const { item, variant, onDelete, whichOne, onUpdate } = props;

  const [form, setForm] = useState({
    name: null,
  });

  ///////////////////////// TOP STATES AREA END///////////////////////////////

  ///////////////////////// API PROGRESS AREA///////////////////////////////

  const deleteDepartmentsPending = useApiProgress(
    "delete",
    `/api/1.0/department/${item.id}`,
    true
  );

  const deleteSkillsPending = useApiProgress(
    "delete",
    `/api/1.0/skill/${item.id}`,
    true
  );
  const deleteEmployeesPending = useApiProgress(
    "delete",
    `/api/1.0/employee/${item.id}`,
    true
  );

  ///////////////////////// API PROGRESS END///////////////////////////////

  ///////////////////////// DELETING AREA///////////////////////////////

  const onClickDelete = async () => {
    if (whichOne === "department") {
      await deleteDepartment(item.id);
      onDelete(item.id);
      toast.error(`Department ${item.name} deleted`);
    }
    if (whichOne === "skill") {
      await deleteSkill(item.id);
      onDelete(item.id);
      toast.error(`Skill ${item.name} deleted`);
    }
    if (whichOne === "employee") {
      await deleteEmployee(item.id);
      onDelete(item.id);
      toast.error(`Employee ${item.name} deleted`);
    }
  };
  ///////////////////////// DELETING AREA END///////////////////////////////

  ///////////////////////// UPDATING FETCH AREA///////////////////////////////
  //TODO: fix one letter changing 400 error
  const onChange = async (event) => {
    const { value } = event.target;
    setForm((previousForm) => ({ ...previousForm, name: value }));

    if (whichOne === "department") {
      try {
        await updateDepartment(item.id, form);
      } catch (err) {
        toast.error(err.message);
      }
    }
    if (whichOne === "skill") {
      try {
        await updateSkill(item.id, form);
      } catch (err) {
        toast.error(err.message);
      }
    }
    if (whichOne === "employee") {
      try {
        await updateEmployee(item.id, form);
      } catch (err) {
        toast.error(err.message);
      }
    }
  };
  ///////////////////////// UPDATING FETCH AREA END///////////////////////////////

  ///////////////////////// DRAG AND DROP AREA///////////////////////////////
  //TODO:add delete employees skill
  const dragUpdate = async (updatedItem) => {
    let response;
    if (updatedItem.element === "department") {
      response = await updateEmployee(item.id, { department: updatedItem.id });
      toast(`Employee ${item.name} added to ${updatedItem.name} Department`);
    }
    if (updatedItem.element === "skill") {
      response = await updateEmployee(item.id, { skill: updatedItem.id });
      toast(`Skill ${updatedItem.name}  added to ${item.name} Employee`);
    }
    onUpdate(item.id, response);
  };

  const [{ isDepartmentDragging }, dragDepartmentRef] = useDrag({
    type: "element",
    item: { ...item, element: "department" },
    collect: (monitor) => ({
      isDepartmentDragging: monitor.isDragging(),
    }),
  });

  const [{ isSkillDragging }, dragSkillRef] = useDrag({
    type: "element",
    item: { ...item, element: "skill" },
    collect: (monitor) => ({
      isSkillDragging: monitor.isDragging(),
    }),
  });

  const [{ isEmployeeOver }, dropEmployeeRef] = useDrop({
    accept: "element",
    drop: dragUpdate,
    collect: (monitor) => ({
      isEmployeeOver: monitor.isOver(),
    }),
  });

  let witchRef;
  if (whichOne === "department") {
    witchRef = dragDepartmentRef;
  } else if (whichOne === "employee") {
    witchRef = dropEmployeeRef;
  } else if (whichOne === "skill") {
    witchRef = dragSkillRef;
  }
  ///////////////////////// DRAG AND DROP AREA END///////////////////////////////

  return (
    <div className="list-group valid-feedback " ref={witchRef}>
      <ListGroup.Item action variant={variant}>
        <Stack direction="horizontal" gap={3}>
          {isDepartmentDragging && "🏬"}
          {isSkillDragging && "🧍"}
          {isEmployeeOver && "🧑‍💼"}
          <Form.Control
            name={whichOne}
            defaultValue={item.name}
            onChange={onChange}
          />
          <ButtonWithProgress
            className="btn btn-danger btn-sm"
            text="🗑️"
            onClick={onClickDelete}
            pendingApiCall={
              (whichOne === "department" && deleteDepartmentsPending) ||
              (whichOne === "skill" && deleteSkillsPending) ||
              (whichOne === "employee" && deleteEmployeesPending)
            }
          />
        </Stack>
      </ListGroup.Item>
    </div>
  );
};
export default ListComp;
