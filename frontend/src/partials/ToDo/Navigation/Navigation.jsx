import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AccountContext } from '../../../contexts/UserContext';

import NavItem from './NavItem'

const Navigation = ({ isLoggedIn, current, setCurrent }) => {
    const [lists, setLists] = useState([])
    const { user } = useContext(AccountContext);

/*     const lists = [
        {
            id: 1,
            name: 'To Do',
            href: ''
        }, 
        {
            id: 2,
            name: 'In Progress',
            href: '/progress'
        }, {
            id: 3,
            name: 'Completed',
            href: '/completed'
        }
    ]; */

    useEffect(() => {
        fetch(`${process.env.REACT_APP_SERVER_URL}/lists/user/${user.username}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                //"Authorization": `Bearer ${localStorage.getItem("token")}`
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
            setCurrent(data[0].id);
            setLists(data);
            console.log(lists);
        })
        .catch(err => {
            console.log(err);
        });
    }, [user.username])

    return (
        <div className="sticky top-0 w-2/12 p-5 h-screen">
            <div className="p-2 h-full flex flex-col justify-between rounded-xl bg-gray-100 dark:bg-slate-900 overflow-hidden divide-y space-y-2 divide-neutral-200 dark:divide-slate-800">
                <div className="flex flex-col justify-start divide-y divide-gray-200 dark:divide-slate-800">
                    <div className='user flex items-center space-x-5 m-2'>
                        <img className='w-16 border border-gray-300 dark:border-slate-700 rounded-full' src={user?.pic || '/default.png'} alt='user profile'/>
                        <p>{ user?.username || '(null)'}</p>
                    </div>
                    <div>
                        { lists?.map(list => (<NavItem key={list?.id} list={list} current={current} setCurrent={setCurrent}/>)) }
                        <div 
                            className="m-2 p-2 dark:hover:bg-slate-800 rounded-lg cursor-pointer" 
                        >
                            <p className="text-gray-600">+ add list</p>
                        </div>
                    </div>
                </div>
                <>
                    <Link to='/logout' className="flex justify-center items-center p-4">
                        <p className="text-lg font-semibold dark:text-white">log out</p>
                    </Link>
                </>
            </div>
        </div>
    );         
}

export default Navigation;