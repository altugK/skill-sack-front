import { ListGroup } from "react-bootstrap";
import Input from "./Input";
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
  const { item, variant, onDelete, whichOne, onUpdate } = props;

  const [form, setForm] = useState({
    name: null,
  });

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

  return (
    <div className="list-group valid-feedback " ref={witchRef}>
      <ListGroup.Item action variant={variant}>
        <div className="row mx-auto">
          <div className="col-md-10">
            <Input
              name={whichOne}
              defaultValue={item.name}
              onChange={onChange}
            />
          </div>
          <div className="col-md-2">
            <ButtonWithProgress
              className="btn btn-danger btn-sm float-end"
              text="x"
              onClick={onClickDelete}
              pendingApiCall={
                (whichOne === "department" && deleteDepartmentsPending) ||
                (whichOne === "skill" && deleteSkillsPending) ||
                (whichOne === "employee" && deleteEmployeesPending)
              }
            />
            {isDepartmentDragging && "🏬"}
            {isSkillDragging && "🧍"}
            {isEmployeeOver && "🧑‍💼"}
          </div>
        </div>
      </ListGroup.Item>
    </div>
  );
};
export default ListComp;
