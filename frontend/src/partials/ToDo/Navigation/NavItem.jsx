import { useEffect } from 'react';

const NavItem = ({ list, current, setCurrent }) => {
    const handleChange = () => {
        setCurrent(list?.id);
    }

    useEffect  (() => {
        console.log("HIIII", list);
    }  , [list])

    return (
        <div 
            className={`m-2 p-2 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-lg cursor-pointer ${list?.id === current ? 'bg-gray-200 dark:bg-slate-800' : ''}`} 
            onClick={() => handleChange()}
          >
            <p className="dark:text-gray-600 dark:hover:text-white">{list?.name}</p>
        </div>
    );
}
export default NavItem;