import React, { useState,useEffect } from "react";
import './api.css';



function Api() {
  const [todos, setTodos] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [editingTodoId, setEditingTodoId] = useState(null);
  // const [editingTodoId, setEditingTodoId] = useState(null);
  const [editedTodoTitle, setEditedTodoTitle] = useState('');
  const [counter, setCounter] = useState(1); // Initialize counter

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos');
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const handleAddTodo = async () => {
    if (newTodoTitle.trim() !== '') {
      const newTodo = {id: counter, title: newTodoTitle, completed: false };
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
          method: 'POST',
          body: JSON.stringify(newTodo),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setTodos([data, ...todos]);
        setNewTodoTitle('');
        setCounter(counter + 1); // Increment counter
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    }
  };

  const handleEditedTodoTitleChange = (todoId, newValue) => {
    setEditedTodoTitle((prevTitles) => ({
      ...prevTitles,
      [todoId]: newValue,
    }));
  };
  
  const handleEditButtonClick = (todoId, title) => {
    setEditingTodoId(todoId);
    setEditedTodoTitle((prevTitles) => ({
      ...prevTitles,
      [todoId]: title,
    }));
  };


  const handleEditTodo = async (todoId) => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
        method: 'PATCH',
        body: JSON.stringify({ title: editedTodoTitle[todoId] }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const updatedTodos = todos.map((todo) =>
          todo.id === todoId ? { ...todo, title: editedTodoTitle[todoId] } : todo
        );
        setTodos(updatedTodos);
        setEditingTodoId(null);
        setEditedTodoTitle((prevTitles) => ({
          ...prevTitles,
          [todoId]: '',
        }));
      }
    } catch (error) {
      console.error('Error editing todo:', error);
    }
  };


  const handleDeleteTodo = async todoId => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        const updatedTodos = todos.filter(todo => todo.id !== todoId);
        setTodos(updatedTodos);
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <div className="api-container">
      <h1>TODO List</h1>
      <div className="input-container">
        <input
          type="text"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          placeholder="Enter todo title"
        />
        <button onClick={handleAddTodo}>Add Todo</button>
      </div>
      <div className="data-container">
        <div className="scrollable">
          {todos.map((todo) => (
            <div className="item" key={todo.id}>
              {editingTodoId === todo.id ? (
                <>
                  <input
                    type="text"
                    value={editedTodoTitle[todo.id] || todo.title}
                    onChange={(e) => handleEditedTodoTitleChange(todo.id, e.target.value)}
                  />
                  <button onClick={() => handleEditTodo(todo.id)}>Save</button>
                </>
              ) : (
                <>
                  <h2>{todo.title}</h2>
                  <div className="item-buttons">
                    <button className="delete-button">
                      <span
                        role="img"
                        aria-label="Delete"
                        onClick={() => handleDeleteTodo(todo.id)}
                      >
                        🗑️
                      </span>
                    </button>
                    <button className="edit-button">
                      <span
                        role="img"
                        aria-label="Edit"
                        onClick={() => handleEditButtonClick(todo.id, todo.title)}
                      >
                        ✏️
                      </span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
  
}

export default Api;