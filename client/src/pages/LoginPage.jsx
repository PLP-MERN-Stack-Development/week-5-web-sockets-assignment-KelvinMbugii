import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";

const LoginPage = ({ onLogin, switchToRegister }) => {
    const [ username, setUsername] = useState("");
    const [ password, setPassword] = useState("");
    const [ error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!username || !password){
            setError("Username and password are required");
            return;
        }

        try{
            const res = await axios.post("http://localhost:5000/api/login",{
                username: username.trim(),
                password: password.trim(),
            });

            const { token, username:name } = res.data;
            localStorage.setItem("token", token);
            onLogin(name);
        } catch (err){
            setError(err?.response?.data?.message || "Login failed");
        }
    };

    return(
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <form
                onSubmit={handleSubmit} 
                className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 space-y-4 w-full max-w-sm"
            >
            <h1 className="text-2xl font-semibold text-center">Login to Chat</h1>
            <Input
                placeholder="Enter a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            <Input
                type="password"
                placeholder = "Password"
                value = {password}
                onChange = {(e) => setPassword(e.target.value)}
            />

            {error && <p className = "text-red-500 text-sm">{error}</p>}

            <Button type="submit" className="w-full">
                Login
            </Button>
           

            <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <button
                    type="button"
                    onClick={switchToRegister}
                    className = "text-blue-600 hover:underLine"
                >
                    Register here
                </button>
            </p>
            </form>
        </div>
    );
};

export default LoginPage;