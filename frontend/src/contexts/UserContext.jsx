import { useNavigate } from "react-router";
import { createContext, useState, useEffect } from "react";

export const AccountContext = createContext();

const UserContext = ({ children }) => {
  const [user, setUser] = useState({
    loggedIn: null,
    token: localStorage.getItem("token"),
  });
  const navigate = useNavigate();

/*   const logout = () => {
    localStorage.removeItem("sid");
    setUser({ loggedIn: null, token: null });
    navigate("/");
  } */

  const [logout, setLogout] = useState(null);
  
  useEffect(() => {
    //${process.env.REACT_APP_SERVER_URL}
    fetch(`${process.env.REACT_APP_SERVER_URL}/auth/login`, {
      credentials: "include",
      mode: 'cors',
      headers: {
        authorization: `Bearer ${user.token}`,
      },
    })
      .catch(err => {
        setUser({ loggedIn: false });
        return;
      })
      .then(r => {
        if (!r || !r.ok || r.status >= 400) {
          setUser({ loggedIn: false });
          return;
        }
        return r.json();
      })
      .then(data => {
        if (!data) {
          setUser({ loggedIn: false });
          return;
        }
        setUser({ ...data });
        navigate("/home");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <AccountContext.Provider value={{ user, setUser }}>
      {children}
    </AccountContext.Provider>
  );
};

export default UserContext;