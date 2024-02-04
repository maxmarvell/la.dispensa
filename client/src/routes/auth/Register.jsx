import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/auth";

export default function Register() {

  const navigate = useNavigate();

  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    email: "",
  })

  const { registerUser } = useContext(AuthContext);

  return (
    <div className="space-y-10 divide-slate-100 flex flex-col h-full">
      <div className="text-3xl font-bold uppercase">Signup</div>
      <div className="flex space-y-10 flex-col w-80 p-10 shadow-xl self-center">
        <label className="flex flex-col space-y-4">
          <div className="text-center font-bold capitalize">Email</div>
          <input
            type="text"
            value={newUser.email}
            className="rounded-lg border-grey w-52 self-center"
            onChange={(e) => setNewUser((prev) => ({ ...prev, email: e.target.value }))} />
        </label>
        <label className="flex flex-col space-y-4">
          <div className="text-center font-bold capitalize">Username</div>
          <input
            type="text"
            value={newUser.username}
            className="rounded-lg border-grey w-52 self-center"
            onChange={(e) => setNewUser((prev) => ({ ...prev, username: e.target.value }))} />
        </label>
        <label className="flex flex-col space-y-4">
          <div className="text-center font-bold capitalize">Password</div>
          <input
            type="password"
            value={newUser.password}
            className="rounded-lg border-grey w-52 self-center"
            onChange={(e) => setNewUser((prev) => ({ ...prev, password: e.target.value }))} />
        </label>
        <div className="flex justify-center space-x-5">
          <button
            onClick={async () => {
              let result = await registerUser({ newUser })
              if (result) {
                 return navigate("/login", { state: { email: newUser.email}})
              }
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  )
};