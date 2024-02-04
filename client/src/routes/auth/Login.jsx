import { useContext, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../../context/auth"

export default function Login() {

  const { state } = useLocation();

  let { loginUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const [dataValue, setDataValues] = useState({
    "email": state?.email ? state.email : "",
    "password": "",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDataValues((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="space-y-10 divide-slate-100 flex flex-col h-full">
      <div className="text-3xl font-bold uppercase">Login</div>
      <form
        className="flex space-y-10 flex-col w-80 p-10 shadow-xl self-center"
        onSubmit={async (e) => {
          await loginUser(e);
          navigate("/");
        }}>
        <label className="flex flex-col space-y-4">
          <div className="text-center font-bold capitalize">Email</div>
          <input
            type="text"
            value={dataValue.email}
            name="email"
            className="rounded-lg border p-2 w-52 self-center"
            onChange={(e) => handleInputChange(e)} />
        </label>
        <label className="flex flex-col space-y-4">
          <div className="text-center font-bold capitalize">Password</div>
          <input
            type="password"
            value={dataValue.password}
            name="password"
            className="rounded-lg border p-2 border-grey w-52 self-center"
            onChange={(e) => handleInputChange(e)} />
        </label>
        <div className="flex justify-center space-x-5">
          <button type="submit">Submit</button>
          <NavLink to="/register">
            Signup
          </NavLink>
        </div>
      </form>
    </div>
  )
}