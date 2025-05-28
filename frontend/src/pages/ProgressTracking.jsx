import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import Layout from "../components/Layout";
import { Gauge } from "lucide-react";
import { authFetch } from "../components/autoFetch";

export default function ProgressTracking() {
    const navigate = useNavigate();

    const [uid, setUid] = useState(() => localStorage.getItem("user_id"));
    const [history, setHistory] = useState([]);

    const [gender, setGender] = useState("");
    const [weight, setWeight] = useState("");
    const [height, setHeight] = useState("");
    const [waist, setWaist] = useState("");
    const [neck, setNeck] = useState("");
    const [hip, setHip] = useState("");
    const [bodyFat, setBodyFat] = useState(null);
    const [bmi, setBmi] = useState(null);

    useEffect(() => {
        const access = localStorage.getItem("access");
        if (!access) {
            alert("Phiên đăng nhập đã hết, vui lòng đăng nhập lại.");
            navigate("/login");
        }

    }, [navigate]);

    useEffect(() => {
        const uid = localStorage.getItem("user_id");
        const saved = JSON.parse(localStorage.getItem(`weightHistory_${uid}`) || "[]");
        setHistory(saved);
    }, [uid]);

    useEffect(() => {
        authFetch("${API_URL}/api/profile/")

            .then((res) => res.json())
            .then((data) => {
                setGender(data.gender || "male");
                setHeight(data.height?.toString() || "");
                setWeight(data.weight?.toString() || "");
                setWaist(data.waist?.toString() || "");
                setNeck(data.neck?.toString() || "");
                setHip(data.hip?.toString() || "");
                setBodyFat(data.body_fat?.toString() || "");
                setBmi(data.bmi?.toString() || "");

                const uid = localStorage.getItem("user_id");
                const saved = JSON.parse(localStorage.getItem(`weightHistory_${uid}`) || "[]");

                const alreadyLogged = saved.some(item => item.date === new Date().toLocaleDateString("vi-VN"));
                if (!alreadyLogged) {
                    const newEntry = {
                        date: new Date().toLocaleDateString("vi-VN"),
                        weight: parseFloat(data.weight),
                        height: parseFloat(data.height),
                        bodyFat: parseFloat(data.body_fat),
                        bmi: parseFloat(data.bmi),
                    };
                    const updated = [...saved, newEntry];
                    setHistory(updated);
                    localStorage.setItem(`weightHistory_${uid}`, JSON.stringify(updated));
                }
            })
            .catch((err) => console.error("Lỗi khi lấy chỉ số:", err));
    }, []);

    const handleUpdateMetrics = async (e) => {
        e.preventDefault();

        try {
            const res = await authFetch("${API_URL}/api/profile/", {
                method: "PUT",
                body: JSON.stringify({
                    gender,
                    height: parseFloat(height),
                    weight: parseFloat(weight),
                    waist: parseFloat(waist),
                    neck: parseFloat(neck),
                    hip: hip ? parseFloat(hip) : null,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                const newEntry = {
                    date: new Date().toLocaleDateString("vi-VN"),
                    weight: parseFloat(weight),
                    height: parseFloat(height),
                    bodyFat: parseFloat(data.body_fat),
                    bmi: parseFloat(data.bmi),
                };

                const updatedHistory = [...history, newEntry];
                setHistory(updatedHistory);
                localStorage.setItem(`weightHistory_${uid}`, JSON.stringify(updatedHistory));

                setBodyFat(data.body_fat?.toString() || "");
                setBmi(data.bmi?.toString() || "");
                alert("✅ Cập nhật thành công!");
            } else {
                alert("❌ Lỗi: " + (data.error || "Vui lòng đăng nhập lại"));
            }
        } catch (err) {
            console.error(err);
            alert("Không thể kết nối đến máy chủ");
        }
    };

    return (
        <Layout>
            <div className="p-6 max-w-4xl mx-auto space-y-6">
                {/* Stats Section */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl shadow p-4 flex items-center gap-3">
                        <Gauge className="text-green-600" />
                        <div>
                            <p className="text-sm text-gray-500">BMI</p>
                            <p className="text-lg font-semibold">{bmi ? `${bmi}` : "Chưa tính"}</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow p-4 flex items-center gap-3">
                        <Gauge className="text-green-600" />
                        <div>
                            <p className="text-sm text-gray-500">Body Fat</p>
                            <p className="text-lg font-semibold">{bodyFat ? `${bodyFat}%` : "Chưa tính"}</p>
                        </div>
                    </div>
                </div>

                {/* Metrics Update Form */}
                <div>
                    <h2 className="text-xl font-semibold mt-6 mb-2">📏 Cập nhật chỉ số:</h2>
                    <form onSubmit={handleUpdateMetrics} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Giới tính</label>
                            <p className="p-2 border rounded bg-gray-50">{gender === "male" ? "Nam" : "Nữ"}</p>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Cân nặng (kg)</label>
                            <input
                                type="number"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                className="border p-2 rounded w-full"
                                step="0.1"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Chiều cao (cm)</label>
                            <input
                                type="number"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                                className="border p-2 rounded w-full"
                                step="0.1"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Vòng eo (cm)</label>
                            <input
                                type="number"
                                value={waist}
                                onChange={(e) => setWaist(e.target.value)}
                                className="border p-2 rounded w-full"
                                step="0.1"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Vòng cổ (cm)</label>
                            <input
                                type="number"
                                value={neck}
                                onChange={(e) => setNeck(e.target.value)}
                                className="border p-2 rounded w-full"
                                step="0.1"
                                required
                            />
                        </div>
                        {gender === "female" && (
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Vòng mông (cm)</label>
                                <input
                                    type="number"
                                    value={hip}
                                    onChange={(e) => setHip(e.target.value)}
                                    className="border p-2 rounded w-full"
                                    step="0.1"
                                    required
                                />
                            </div>
                        )}
                        <div className="col-span-full">
                            <button
                                type="submit"
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
                            >
                                Cập nhật chỉ số
                            </button>
                        </div>
                    </form>
                </div>

                {/* Chart Section */}
                {history.length > 0 && (
                    <ResponsiveContainer width="100%" height={300} key={JSON.stringify(history)}>
                        <LineChart data={history} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis domain={["auto", "auto"]} />
                            <Tooltip />
                            <Line type="monotone" dataKey="weight" stroke="#3b82f6" strokeWidth={2} name="Cân nặng" />
                            <Line type="monotone" dataKey="bmi" stroke="#34d399" strokeWidth={2} name="BMI" />
                            <Line type="monotone" dataKey="bodyFat" stroke="#f87171" strokeWidth={2} name="Body Fat" />
                        </LineChart>
                    </ResponsiveContainer>
                )}

            </div>
        </Layout>
    );
}
