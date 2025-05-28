import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
    const navigate = useNavigate();
    const API_URL = "foodpro-app-production-39e9.up.railway.app";

    const [form, setForm] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        full_name: "",
        birthdate: "",
        gender: "male",
        height: "",
        weight: "",
        waist: "",
        neck: "",
        hip: "",
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        if (form.password !== form.confirmPassword) {
            setError("Mật khẩu không khớp");
            return;
        }

        try {
            const res = await fetch(`${API_URL}/api/auth/register/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: form.email,
                    password: form.password,
                    full_name: form.full_name,
                    birthdate: form.birthdate,
                    gender: form.gender,
                    height: parseFloat(form.height),
                    weight: parseFloat(form.weight),
                    waist: parseFloat(form.waist),
                    neck: parseFloat(form.neck),
                    hip: parseFloat(form.hip),
                }),
            });

            const data = await res.json();

            if (res.ok) {
                alert("Đăng ký thành công!");
                navigate("/login");
            } else {
                setError(data.error || "Đăng ký thất bại");
            }
        } catch (err) {
            console.error(err);
            setError("Không thể kết nối đến máy chủ");
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 space-y-4">
            <h1 className="text-2xl font-bold text-center">Đăng ký FoodPro</h1>

            {error && <p className="text-red-600 text-center">{error}</p>}

            <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="border p-2 rounded"
                    value={form.email}
                    onChange={handleChange}
                    required
                />
                <select
                    name="gender"
                    className="border p-2 rounded"
                    value={form.gender}
                    onChange={handleChange}
                >
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                </select>
                <input
                    type="password"
                    name="password"
                    placeholder="Mật khẩu"
                    className="border p-2 rounded"
                    value={form.password}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Nhập lại mật khẩu"
                    className="border p-2 rounded"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="full_name"
                    placeholder="Họ tên"
                    className="border p-2 rounded"
                    value={form.full_name}
                    onChange={handleChange}
                    required
                />

                <input
                    type="date"
                    name="birthdate"
                    className="border p-2 rounded"
                    value={form.birthdate}
                    onChange={handleChange}
                    required
                />

                <input
                    type="number"
                    name="height"
                    placeholder="Chiều cao (cm)"
                    className="border p-2 rounded"
                    value={form.height}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="weight"
                    placeholder="Cân nặng (kg)"
                    className="border p-2 rounded"
                    value={form.weight}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="waist"
                    placeholder="Vòng eo (cm)"
                    className="border p-2 rounded"
                    value={form.waist}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="neck"
                    placeholder="Vòng cổ (cm)"
                    className="border p-2 rounded"
                    value={form.neck}
                    onChange={handleChange}
                    required
                />
                {form.gender === "female" && (
                    <input
                        type="number"
                        name="hip"
                        placeholder="Vòng mông (cm)"
                        className="border p-2 rounded"
                        value={form.hip}
                        onChange={handleChange}
                        required
                    />
                )}

                <button
                    type="submit"
                    className="col-span-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                >
                    Đăng ký
                </button>
            </form>
        </div>
    );
}
