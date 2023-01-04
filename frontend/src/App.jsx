import React,{useState} from 'react';
import UserContext from "./contexts/UserContext";
import axios from 'axios';
import Routes from './routes/Routes';

axios.defaults.baseURL = 'http://localhost:5003'

const App = ()=> {
  return (
    <UserContext>
      <Routes />
    </UserContext>
  );
}
export default App;