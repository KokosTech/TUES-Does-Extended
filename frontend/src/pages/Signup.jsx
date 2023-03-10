import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AccountContext } from "../contexts/UserContext";

const SignUp = () => {
  const { setUser } = useContext(AccountContext);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const { username, password, passwordConfirm } = e.target;

        if (password.value !== passwordConfirm.value) {
            setError("Passwords do not match");
            return;
        }

        const user = {
            username: username.value,
            password: password.value
        };
        fetch(process.env.REACT_APP_SERVER_URL + "/auth/signup", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        })
            .then(r => {
                if (!r || !r.ok || r.status >= 400) {
                    setError("Invalid username or password");
                    return;
                }
                return r.json();
            })
            .then(data => {
                if (!data) {
                    setError("Invalid username or password");
                    return;
                }
                if(data.status) {
                    setError(data.status);
                } else if (data.loggedIn) {
                    setUser({ ...data });
                    fetch(process.env.REACT_APP_SERVER_URL + "/lists/user/" + user.username, {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            name: "To Do",
                            user: user.username
                        })
                    })
                        .then(r => {
                            if (!r || !r.ok || r.status >= 400) {
                                return;
                            }
                            return r.json();
                        }).then(data => {
                            if (!data) {
                                return;
                            }
                        }).catch(err => {
                            console.log(err);
                        });
                    navigate("/home");
                }
            })
            .catch(err => {
                setError("Invalid username or password");
            });
    }

  return (
    <div className="h-screen flex justify-evenly items-center dark:text-white dark:bg-black">
        <div>
            <img className="w-96 invert dark:invert-0" src="/elsys.png" alt=""/>
        </div>
        <div className="flex flex-col w-3/12">
            <h1 className="text-4xl font-bold mb-5">sign up</h1>
            <form className="flex flex-col space-y-3 dark:text-black" onSubmit={handleSubmit}>
                <label className="text-lg font-semibold dark:text-white" htmlFor="username">username</label>
                <input className="p-2 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-200 hover:border-slate-300" type="text" name="username" placeholder="username" />
                
                <label className="text-lg font-semibold dark:text-white" htmlFor="password">password</label>
                <input className="p-2 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-200 hover:border-slate-300" type="password" name="password" placeholder="password" />
                
                <label className="text-lg font-semibold dark:text-white" htmlFor="passwordConfirm">confirm password</label>
                <input className="p-2 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-200 hover:border-slate-300" type="password" name="passwordConfirm" placeholder="confirm password" />
                
                <div className="flex justify-center items-center space-x-6">
                    <button className="p-2 rounded-md border hover:bg-slate-100 dark:bg-slate-900 dark:border-slate-800 dark:text-white dark:hover:bg-slate-800 dark:hover:border-slate-700 grow" type="submit">sign up</button>
                    <div className="flex justify-center items-center p-4">
                        <Link className="underline text-black hover:text-slate-600 dark:text-white dark:hover:text-neutral-200" to='/login'>log in</Link>
                    </div>
                </div>
            </form>
            <p className="text-red-600">{error}</p>
        </div>
    </div>
  );
};

export default SignUp;