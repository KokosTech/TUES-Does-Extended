import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";

import Task from "./Task";
import AddTaskModal from "./AddTaskModal";

const List = ({ current }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [todos, setTodos] = useState([]);

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

    const addNewTask = (e) => {
        e.preventDefault();
        const { task, description, priority, due } = e.target;
        const newTodo = {
            id: null,
            name: task.value,
            list_id: current,
            description: description.value,
            priority: priority.value,
            due_date: due.value,
            completed: false
        };

        fetch(`${process.env.REACT_APP_SERVER_URL}/tasks/${current}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newTodo)
        })
            .then(r => {
                if (!r || !r.ok || r.status >= 400) {
                    return;
                }
                return r.json();
            })
            .then(data => {
                if (!data) {
                    return;
                }
                newTodo.id = data.id;
                setTodos([newTodo, ...todos]);
                setModalIsOpen(false);
            })
            .catch(err => {
                console.log(err);
            });
    }

    const toggleTodo = (id) => {
        const todo = todos.find(todo => todo.id === id);
        const newTodo = {
            ...todo,
            completed: !todo.completed
        };
        fetch(`${process.env.REACT_APP_SERVER_URL}/tasks/${id}`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newTodo)
        })
            .then(r => {
                if (!r || !r.ok || r.status >= 400) {
                    return;
                }
                return r.json();
            })
            .then(data => {
                if (!data) {
                    return;
                }
                const newTodos = [...todos];
                const index = newTodos.findIndex(todo => todo.id === id);
                newTodos[index].completed = !newTodos[index].completed;
                setTodos(newTodos);
            })
            .catch(err => {
                console.log(err);
            });
    }

    const flagTask = (id) => {
        const todo = todos.find(todo => todo.id === id);
        const updatedTodo = {
            ...todo,
            flagged: !todo.flagged
        };
        fetch(`${process.env.REACT_APP_SERVER_URL}/tasks/${id}`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedTodo)
        })
            .then(r => {
                if (!r || !r.ok || r.status >= 400) {
                    return;
                }
                return r.json();
            })
            .then(data => {
                if (!data) {
                    return;
                }
                setTodos(todos.map(todo => todo.id === id ? {
                    ...todo,
                    flagged: !todo.flagged
                } : todo));
            })
            .catch(err => {
                console.log(err);
            });
    }

    const deleteTask = (id) => {
        fetch(`${process.env.REACT_APP_SERVER_URL}/tasks/${id}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        })
        setTodos(todos.filter(todo => todo.id !== id));
    }

    useEffect(() => {
        if(current) {
            let url = `${process.env.REACT_APP_SERVER_URL}/tasks/${current}`;
            
            fetch(url, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            })
            .then(r => {
                if (!r || !r.ok || r.status >= 400) {
                    return;
                }
                return r.json();
            })
            .then(data => {
                if (!data) {
                    return;
                }
                setTodos(data);
                console.log(todos);
            })
            .catch(err => {
                console.log(err);
            });
        }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    , [current]);

    return (
        <div className="w-10/12 mr-5 flex-col dark:text-white mt-5">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold mb-5">To Do List</h1>
                <button className="flex justify-center items-center p-3 border rounded-lg bg-gray-100 dark:bg-slate-900 border-gray-200 dark:border-slate-800 hover:bg-gray-200 dark:hover:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-700" onClick={openModal}>
                    <FaPlus />
                </button>
            </div>
            <ul className="flex flex-col space-y-3 dark:text-white">
                {todos?.map(todo => (
                    <Task key={todo.id} todo={todo} toggleTodo={toggleTodo} flagTask={flagTask} deleteTask={deleteTask} />
                ))}
            </ul>
            <AddTaskModal modalIsOpen={modalIsOpen} closeModal={closeModal} addNewTask={addNewTask} />
        </div>
    );
}

export default List;