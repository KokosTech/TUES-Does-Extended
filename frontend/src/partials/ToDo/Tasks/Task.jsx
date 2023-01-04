import { FaCheck, FaRegTrashAlt, FaFlag } from "react-icons/fa";

const Task = ({ todo, toggleTodo, flagTask, deleteTask}) => {
    return (
        <li key={todo?.id} className={"flex justify-between items-center p-5 bg-gray-100 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:bg-gray-200 dark:hover:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-700 rounded-xl ".concat((todo?.completed) ? "opacity-50 line-through" : "")}>
            <div className="flex justify-start items-center space-x-3">
                <button className="w-2 h-2 p-2 flex justify-center items-center rounded-full border bg-gray-200 dark:bg-slate-800 border-gray-300 dark:border-slate-700 dark:text-white hover:bg-gray-300 dark:hover:bg-slate-700 hover:border-gray-400 dark:hover:border-slate-600 overflow-visible" onClick={() => toggleTodo(todo?.id)}>{todo?.completed && <FaCheck className="w-6 h-6 absolute" />}</button>
                <span className="text-lg">{todo?.name}</span>
            </div>
            <div className="flex justify-start items-center space-x-3">
                <button className={`w-[34px]  h-[34px] p-2 rounded-md border ${todo.flagged ? 'bg-amber-500 dark:bg-amber-800 border-gray-300 dark:border-slate-700 hover:bg-amber-600 dark:hover:bg-amber-700 hover:border-gray-400 dark:hover:border-slate-600' : 'bg-gray-100 dark:bg-slate-800 border-gray-200 dark:border-slate-700 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-700 hover:border-gray-300 dark:hover:border-slate-600'}`} onClick={() => flagTask(todo?.id)}><FaFlag /></button>
                <button className="w-[34px]  h-[34px] p-2 rounded-md border bg-gray-100 dark:bg-slate-800 border-gray-200 dark:border-slate-700 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-700 hover:border-gray-300 dark:hover:border-slate-600" onClick={() => deleteTask(todo?.id)}><FaRegTrashAlt /></button>
            </div>
        </li>
    );
}

export default Task;