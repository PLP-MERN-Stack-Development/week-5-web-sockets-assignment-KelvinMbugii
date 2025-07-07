import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";

const RegisterPage = ({ onRegister, switchToLogin }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

    if(!username || !password || !confirm){
        return setError("All fields are required")
    }

    if(password !== confirm){
        return setError("Passwords do not match");
    }

    try {
        const res = await axios.post("http://localhost:5000/api/register", {
            username: username.trim(),
            password: password.trim(),
        });

        const { token, username: name} = res.data;
        localStorage.setItem("token", token);
        onRegister(name);
    } catch (err) {
        setError(err?.response?.data?.message || "Registration failed");
    }
};

return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <form
            onSubmit = {handleSubmit}
            className = "bg-white darK:bg-gray-900 rounded-xl shadow-xl p-6 space-y-4 w-full max-w-sm"
        >
            <h1 className="text-2xl font-semibold text-center">Create an Account</h1>

            <Input
                placeholder = "Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <Input
                type="password"
                placeholder="Confirm Password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button type="submit" className="w-full">
                Register
            </Button>


            <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <button
                    type="button"
                    onClick={switchToLogin}
                    className="text-blue-600 hover:underline"
                >
                    Login here
                </button>
            </p>
        </form>
    </div>
);
};

export default RegisterPage;