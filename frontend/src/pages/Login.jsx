import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const API_URL = "foodpro-app-production-39e9.up.railway.app";

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`${API_URL}/api/auth/login/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("access", data.access);
                localStorage.setItem("refresh", data.refresh);
                if (data.user_id) {
                    localStorage.setItem("user_id", data.user_id);
                } else {
                    console.warn("⚠️ Không thấy user_id trong phản hồi:", data);
                }

                navigate("/dashboard");
            } else {
                setError(data.detail || data.error || "Sai email hoặc mật khẩu");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Không thể kết nối đến máy chủ");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow w-96">
                <h2 className="text-2xl font-bold text-center mb-6">Đăng nhập FoodPro</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full border border-gray-300 p-2 rounded"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-1">Mật khẩu</label>
                        <input
                            type="password"
                            className="w-full border border-gray-300 p-2 rounded"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
                    >
                        Đăng nhập
                    </button>
                </form>
            </div>
        </div>
    );
}
