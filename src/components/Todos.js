import React, { useState } from "react";
import { connect } from "react-redux";
import { addTodos } from "../redux/reducer";
import { GoPlus } from "react-icons/go";
import { motion } from "framer-motion";

const mapStateToProps = (state) => {
  return {
    todos: state,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addTodo: (obj) => dispatch(addTodos(obj)),
  };
};

const Todos = (props) => {
  const [todo, setTodo] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleChange = (e) => {
    setTodo(e.target.value);
  };

  const handleDueDateChange = (e) => {
    setDueDate(e.target.value);
  };

  const add = () => {
    if (todo === "") {
      alert("Input is Empty");
    } else {
      props.addTodo({
        id: Math.floor(Math.random() * 1000),
        item: todo,
        dueDate: dueDate,
        completed: false,
      });
      setTodo("");
      setDueDate("");
    }
  };

  return (
    <div className="addTodos">
      <input
        type="text"
        onChange={(e) => handleChange(e)}
        className="todo-input"
        value={todo}
        placeholder="Enter todo item"
      />
      <input
        type="date"
        onChange={(e) => handleDueDateChange(e)}
        className="due-date-input"
        value={dueDate}
        placeholder="Due date"
      />
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="add-btn"
        onClick={() => add()}
      >
        <GoPlus />
      </motion.button>
      {todo && dueDate && (
        <div className="created-todo">
          
        </div>
      )}
      <br />
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Todos);
