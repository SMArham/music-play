import "./User.css";
import Profile from "./component/Profile/Profile";
import Login from "./component/Login/Login";
import Register from "./component/Register/Register";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

function User() {
    const [userstate, setUserState] = useState({});
    return (
        <div className="User">
            <Router>
                <Routes>
                    <Route
                        path="/"
                        element={
                            userstate && userstate._id ? (
                                <Profile
                                    setUserState={setUserState}
                                    username={userstate.fname}
                                />
                            ) : (
                                <Login setUserState={setUserState} />
                            )
                        }
                    ></Route>
                    <Route
                        path="/login"
                        element={<Login setUserState={setUserState} />}
                    ></Route>
                    <Route path="/signup" element={<Register />}></Route>
                </Routes>
            </Router>
        </div>
    );
}

export default User;
