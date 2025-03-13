import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import useSWR from "swr";
import Dlt from "./icons/dlt";
import Done from "./icons/done";
import Edit from "./icons/edit";
import Clock from "./clock";
import Quote from "./qoutes";
import Background from "./Background";

import SearchBox from "./Search";
import { motion } from "framer-motion";
function TodoItem({ todo, editTodo, editTitle, setEditTodo, setEditTitle, handleEdit, handleComplete, deleteTodo, startEdit, textColor }) {
    return (
<motion.div
    key={todo._id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ type: "spring", stiffness: 100, damping: 15 }}
    className={`card shadow-md p-3 flex flex-row justify-between items-center ${todo.isCompleted ? "bg-green-400" : "bg-white/10"} rounded-lg`}
>

            {editTodo === todo._id ? (
                <form onSubmit={(e) => handleEdit(e, todo._id)} className="flex w-full">
                    <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="input input-sm flex-grow bg-white/10 backdrop-blur-lg shadow-lg p-4 border border-white/20"
                        autoFocus
                    />
                    <button type="submit" className="btn btn-sm btn-success ml-2">Save</button>
                </form>
            ) : (
                <>
                    <span style={{ color: textColor }} className={` ${todo.isCompleted ? "line-through" : ""}`}>
                        {todo.title}
                    </span>

                    <div className="flex gap-2">
                        {editTodo !== todo._id && (
                            <>
                                <button onClick={() => handleComplete(todo._id, todo.isCompleted)}>
                                    <Done />
                                </button>
                                <button onClick={() => startEdit(todo)}>
                                    <Edit />
                                </button>
                                <button onClick={() => deleteTodo(todo._id)}>
                                    <Dlt />
                                </button>
                            </>
                        )}
                    </div>
                </>
            )}
        </motion.div>
    );
}

const fetcher = async (url, options = {}) => {
    try {
        const response = await fetch(url, {
            method: options.method || "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            mode: "cors",
            body: options.body ? JSON.stringify(options.body) : undefined,
        });

        const text = await response.text();
        try {
            return JSON.parse(text);
        } catch {
            return { message: text };
        }
    } catch (error) {
        console.error("Fetch error:", error);
        return { error: "Network error" };
    }
};

function Todo() {
    const token = sessionStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
    }, [token, navigate]);

    const { data, error, mutate, isLoading } = useSWR(`${import.meta.env.VITE_BACKEND_URL}/api/todos`, fetcher);
    const [editTodo, setEditTodo] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [textColor, setTextColor] = useState("#FFFFFF");

    if (error) {
        toast.error("Error loading todos");
        return <div className="alert alert-error text-white">Error loading todos</div>;
    }

    if (isLoading) {
        return <div className="text-center text-lg font-semibold">Loading...</div>;
    }

    async function handleAddTodo(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const title = formData.get("title").trim();

        if (!title) {
            toast.error("Todo can't be empty");
            return;
        }

        if (data.some(todo => todo.title.toLowerCase() === title.toLowerCase())) {
            toast.error("Todo already exists");
            return;
        }

        const newTodo = { title, _id: Date.now().toString(), isCompleted: false };

        try {
            await mutate(async () => {
                const response = await fetcher(`${import.meta.env.VITE_BACKEND_URL}/api/todos`, {
                    method: "POST",
                    body: { title },
                });

                if (response.error) {
                    throw new Error(response.error);
                }

                toast.success("Todo Added");
                return [...data, response];
            }, {
                optimisticData: [...data, newTodo],
                rollbackOnError: true,
                revalidate: false,
            });
        } catch (error) {
            toast.error("Failed to add todo");
        }

        e.target.reset();
    }

    async function deleteTodo(id) {
        console.log("Deleting todo with ID:", id);

        await mutate(async () => {
            const response = await fetcher(`${import.meta.env.VITE_BACKEND_URL}/api/todos/${id}`, {
                method: "DELETE",
            });

            if (response.error) {
                throw new Error(response.error);
            }

            toast.success(response.message || "Todo Deleted");
            return data.filter((todo) => todo._id !== id);
        }, {
            optimisticData: data.filter((todo) => todo._id !== id),
            rollbackOnError: true,
            revalidate: false,
        });
    }

    async function handleComplete(id, isCompleted) {
        console.log("Marking as completed:", id);

        await mutate(async () => {
            const response = await fetcher(`${import.meta.env.VITE_BACKEND_URL}/api/todos/${id}`, {
                method: "PUT",
                body: { isCompleted: !isCompleted },
            });

            if (response.error) {
                throw new Error(response.error);
            }

            toast.success(response.message || "Todo Updated");
            return data.map((todo) =>
                todo._id === id ? { ...todo, isCompleted: !isCompleted } : todo
            );
        }, {
            optimisticData: data.map((todo) =>
                todo._id === id ? { ...todo, isCompleted: !isCompleted } : todo
            ),
            rollbackOnError: true,
            revalidate: false,
        });
    }

    function startEdit(todo) {
        setEditTodo(todo._id);
        setEditTitle(todo.title);
    }

    async function handleEdit(e, id) {
        e.preventDefault();

        if (!editTitle.trim()) {
            toast.error("Title cannot be empty");
            return;
        }

        await mutate(async () => {
            const response = await fetcher(`${import.meta.env.VITE_BACKEND_URL}/api/todos/${id}`, {
                method: "PUT",
                body: { title: editTitle },
            });

            if (response.error) {
                throw new Error(response.error);
            }

            toast.success("Todo Updated");
            return data.map((todo) =>
                todo._id === id ? { ...todo, title: editTitle } : todo
            );
        }, {
            optimisticData: data.map((todo) =>
                todo._id === id ? { ...todo, title: editTitle } : todo
            ),
            rollbackOnError: true,
            revalidate: false,
        });

        setEditTodo(null);
        setEditTitle("");
    }

    return (
        <div className="relative flex flex-col items-end justify-items-start overflow-hidden min-h-screen p-4">
            <Background />
            <div className="relative z-10 text-center w-full max-w-md">
               
                <SearchBox />
                <Clock textColor={textColor} setTextColor={setTextColor} />

                <h1 className="text-3xl font-bold mb-2 bg-white/10 backdrop-blur-lg shadow-lg p-6 rounded-lg border border-white/20" style={{ color: textColor }}>
                    What is your focus for today?
                </h1>

                <form onSubmit={handleAddTodo} className="flex gap-2">
                    <input
                        type="text"
                        name="title"
                        placeholder="Enter todo"
                        required
                        className="input input-bordered w-full bg-white/10 backdrop-blur-lg shadow-lg p-4 border border-white/20"
                        style={{ color: textColor }}
                    />
                    <button type="submit" className="btn bg-white/10 backdrop-blur-lg shadow-lg p-4 border border-white/20">+</button>
                </form>

                <div className="mt-2 w-full max-w-md">
                    {data?.length ? (
                        <div className="max-h-60 overflow-y-auto  bg-white/10 backdrop-blur-lg shadow-lg p-6 rounded-lg border border-white/20">
                            <div className="space-y-2">
                                {data.filter((todo) => !todo.isCompleted).map((todo) => (
                                    <TodoItem key={todo._id} todo={todo} {...{ editTodo, editTitle, setEditTodo, setEditTitle, handleEdit, handleComplete, deleteTodo, startEdit, textColor }} />
                                ))}
                                {data.filter((todo) => todo.isCompleted).map((todo) => (
                                    <TodoItem key={todo._id} todo={todo} {...{ editTodo, editTitle, setEditTodo, setEditTitle, handleEdit, handleComplete, deleteTodo, startEdit, textColor }} />
                                ))}
                            </div>
                        </div>
                    ) : <div className="none"></div>}
                </div>
            </div>

            <div className="absolute bottom-4 w-full text-center">
                <Quote textColor={textColor} />
            </div>
        </div>
    );
}

export default Todo;
