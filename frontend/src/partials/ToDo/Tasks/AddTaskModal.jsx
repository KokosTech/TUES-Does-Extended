import Modal from 'react-modal';

const AddTaskModal = ({ modalIsOpen, closeModal, addNewTask }) => {
    return (
        <Modal
            isOpen={modalIsOpen}
            className="absolute top-1/2 left-1/2 right-auto bottom-auto -mr-[50%] -translate-y-[50%] -translate-x-[50%] 
                bg-gray-100 dark:bg-slate-900
                w-1/3 p-3 rounded-lg overflow-hidden
                border border-gray-300 dark:border-slate-800
                shadow-lg dark:shadow-slide-lg"
            onRequestClose={closeModal}
            contentLabel="Add new task"
            //className="bg-white"
        >
            <form onSubmit={addNewTask} className="flex flex-col p-3 space-y-2 divide-y dark:text-white">
                <h3 className="text-2xl font-bold">Add new task</h3>
                
                <div className="flex flex-col pt-2 pb-2 space-y-2">
                    <label htmlFor="task" className="font-semibold">Task</label>
                    <input id="task" name="task" type="text" placeholder="task" className="p-2 rounded-md text-black bg-white border border-slate-200 hover:border-slate-300"/>

                    <label htmlFor="description" className="font-semibold">Description</label>
                    <textarea name="description" placeholder="description" className="resize-none p-2 rounded-md text-black bg-white border border-slate-200 hover:border-slate-300"/>

                    <div className="flex justify-between">
                        <div className="flex flex-col">
                            <label htmlFor="priority" className="font-semibold">Priority</label>
                            <div className="flex h-full items-center space-x-4 mr-6">
                                <div className="flex items-center space-x-2">
                                    <input id="priority" name="priority" type="radio" value="1" className="text-black"/>
                                    <label>low</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input id="priority" name="priority" type="radio" value="2" className="text-black"/>
                                    <label>mid</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input id="priority" name="priority" type="radio" value="3" className="text-black"/>
                                    <label>high</label>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col grow">
                            <label htmlFor="due" className="font-semibold">Due date</label>
                            <div class="relative w-full">
                                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path></svg>
                                </div>
                                <input id="due" name="due" type="date" className="pl-10 p-2 rounded-md text-black bg-white border border-slate-200 hover:border-slate-300 w-full"/>
                            </div>
                        </div>
                    </div>
                </div>
                <button type="submit" className="m-10 p-2 px-4 py-2 rounded-md border bg-white border-gray-200 hover:border-gray-300 dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:hover:bg-slate-700 dark:hover:border-slate-600">Add</button>
            </form>
        </Modal>
    );
}

export default AddTaskModal;