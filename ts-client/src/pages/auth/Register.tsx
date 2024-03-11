import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginBanner from "../../assets/display/loginBanner.jpeg"
import LoginBanner2 from "../../assets/display/loginBanner2.jpeg"
import * as light from '../../assets/icons/light'

import AuthContext from "@/services/contexts/authContext";
import { AuthContextType } from "@/services/contexts/models";

export const Register = () => {

  const navigate = useNavigate();

  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    email: "",
  })

  const { registerUser } = useContext(AuthContext) as AuthContextType;

  const [registerError, setError] = useState<String | null>(null)

  const handleRegister = async () => {
    try {
      await registerUser(newUser)
      return navigate("/login", { state: { email: newUser.email } });
    } catch (error) {
      console.log(error)
      if (error instanceof Error) {
        setError(error.message);
      };
    };
  };

  return (
    <div className="w-screen h-screen absolute">
      <img className="h-1/3 border-slate-950 absolute top-0 w-full object-cover -z-20" src={LoginBanner2} alt="" />
      <img className="h-2/3 border-t-4 border-slate-950 absolute bottom-0 w-full object-cover -z-20" src={LoginBanner} alt="" />
      <div className="absolute top-10 left-10 space-x-5">
        <button
          className={`p-1 border-2 bg-slate-950 border-slate-950`}
          onClick={() => navigate(-1)}
        >
          <img src={light.RefundBack} alt="go back" />
        </button>
        <button
          className={`p-1 border-2 bg-slate-950 border-slate-950`}
          onClick={() => navigate('/')}
        >
          <img src={light.Home} alt="go back" />
        </button>
      </div>
      <div className="flex space-y-10 flex-col p-10 mt-40 ml-20 mr-10  shadow-xl bg-slate-950 text-slate-50 relative">
        <div className="text-slate-950 uppercase text-6xl font-bold absolute left-0 -top-12 text-center">La Dispensa</div>
        <label className="flex flex-col space-y-4">
          <div className="font-bold uppercase">Email</div>
          <input
            type="text"
            value={newUser.email}
            placeholder="Type email here..."
            className="border-0 border-b-2 bg-slate-950 border-slate-50 py-2 focus:border-orange-300 focus:outline-none"
            onChange={(e) => setNewUser((prev) => ({ ...prev, email: e.target.value }))} />
        </label>
        <label className="flex flex-col space-y-4">
          <div className="font-bold uppercase">Username</div>
          <input
            type="text"
            value={newUser.username}
            placeholder="Type username here..."
            className="border-0 border-b-2 bg-slate-950 border-slate-50 py-2 focus:border-orange-300 focus:outline-none"
            onChange={(e) => setNewUser((prev) => ({ ...prev, username: e.target.value }))} />
        </label>
        <label className="flex flex-col space-y-4">
          <div className="font-bold uppercase">Password</div>
          <input
            type="password"
            value={newUser.password}
            placeholder="Type password here..."
            className="border-0 border-b-2 bg-slate-950 border-slate-50 py-2 focus:border-orange-300 focus:outline-none"
            onChange={(e) => setNewUser((prev) => ({ ...prev, password: e.target.value }))} />
        </label>
        {registerError ? (
          <div className="text-sm text-center text-red-500">{registerError}</div>
        ) : null}
        <div className="flex justify-center space-x-5 u">
          <button
            className="uppercase border-2 border-white px-2 py-1 hover:bg-orange-300 hover:text-slate-950 hover:border-slate-950"
            onClick={handleRegister}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  )
};

export default Register;