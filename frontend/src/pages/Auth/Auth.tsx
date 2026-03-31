import { useState } from "react";
import { Mail } from "lucide-react";
import LoginForm from "./partials/LoginForm";
import RegisterForm from "./partials/RegisterForm";

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen w-full bg-white flex flex-col md:flex-row">
      <div className="w-full md:w-6/12 bg-cyan-500 p-8 text-white flex flex-col justify-center">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 p-4 rounded-full">
              <Mail className="size-10" />
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-2">Welcome to Chat-app</h1>
          <p>Connect with Anyone, Anytime and worldwide</p>
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm opacity-80">Join Now and Connect with Loved one's</p>
        </div>
      </div>

      <div className="w-full md:w-6/12 flex p-8 justify-center items-center">
        {isLogin ? (
          <div className="w-full md:w-[400px]">
            <LoginForm onSwitch={() => setIsLogin(false)} />
          </div>
        ) : (
          <div className="w-full md:w-[400px]">
            <RegisterForm onSwitch={() => setIsLogin(true)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;