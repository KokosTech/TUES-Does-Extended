import { useState, useEffect, useContext } from "react";
import { AccountContext } from "../contexts/UserContext";

import Navigation from "../partials/ToDo/Navigation/Navigation";
import List from "../partials/ToDo/Tasks/List";
import Details from "../partials/ToDo/Tasks/Details";


const ToDo = () => {
    const [current, setCurrent] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    return (
        <div className="flex dark:text-white">
            <Navigation current={current} setCurrent={setCurrent}/>
            <List current={current} setCurrent={setCurrent}/>
            {showDetails && <Details />}
        </div>
    );
}
export default ToDo;