import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { authFetch } from "../components/autoFetch";
import { Gauge } from "lucide-react";
import { Link } from "react-router-dom";

export default function DashboardPage() {
    const [bmi, setBmi] = useState(null);
    const [bodyFat, setBodyFat] = useState(null);
    const [todayWorkout, setTodayWorkout] = useState([]);
    const [mealPlan, setMealPlan] = useState(null);
    const [streak, setStreak] = useState(0);
    const [isWin, setIsWin] = useState(true);
    const API_URL = "foodpro-app-production.up.railway.app";

    useEffect(() => {
        const todayStr = new Date().toLocaleDateString("vi-VN");
        const streakKey = `streak_${localStorage.getItem("user_id")}`;
        const saved = JSON.parse(localStorage.getItem(streakKey) || "{}");
        const yesterdayStr = new Date(Date.now() - 86400000).toLocaleDateString("vi-VN");

        let streak = saved.streak || 0;
        let lastDate = saved.lastDate || null;

        if (lastDate === todayStr) {
            setStreak(streak);
            setIsWin(streak >= 2);
            return;
        }

        if (lastDate === yesterdayStr) {
            streak++;
            setIsWin(streak >= 2);
        } else {
            streak = 1;
            setIsWin(false);
        }

        localStorage.setItem(
            streakKey,
            JSON.stringify({ lastDate: todayStr, streak })
        );

        setStreak(streak);
    }, []);


    useEffect(() => {
        async function fetchData() {
            try {
                const profileRes = await authFetch(`${API_URL}/api/profile/`);
                const profileData = await profileRes.json();
                setBmi(profileData.bmi);
                setBodyFat(profileData.body_fat);

                const today = new Date();
                const dateStr = `${today.getFullYear()}-${(today.getMonth() + 1)
                    .toString()
                    .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;

                const workoutRes = await authFetch(`${API_URL}/api/workouts/?date=${dateStr}`);
                const workoutData = await workoutRes.json();
                setTodayWorkout(workoutData.exercises || []);

                const uid = localStorage.getItem("user_id");
                const saved = localStorage.getItem(`aiMealPlan_${uid}`);

                if (saved) {
                    setMealPlan(JSON.parse(saved));
                }
            } catch (err) {
                console.error("Lỗi khi load dashboard:", err);
            }
        }

        fetchData();
    }, []);

    const renderMealSection = (title, dishes) => (
        <div className="mb-4">
            <h3 className="font-semibold text-base text-gray-700 mb-1">{title}</h3>
            {dishes && dishes.length > 0 ? (
                <ul className="space-y-1">
                    {dishes.map((dish, i) => (
                        <li key={i} className="text-[15px] text-gray-800">🍽️ {dish.name}</li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-gray-500">Không có món ăn.</p>
            )}
        </div>
    );

    const getStreakMessage = () => {
        const winMessages = [
            "🔥 Bạn đang duy trì rất tốt!",
            "💪 Chuỗi streak tuyệt vời, tiếp tục nhé!",
            "🏆 Cố gắng giữ phong độ như thế này nhé!",
            "✨ Bạn thật kiên trì, tuyệt vời!",
            "🌟 Thêm một ngày chiến thắng bản thân!",
            "🥇 Thói quen tốt đang hình thành rồi đấy!",
            "🔥 Ngọn lửa quyết tâm đang bùng cháy!",
            "🙌 Chỉ còn vài ngày nữa là đạt mốc mới!"
        ];

        const loseMessages = [
            "💤 Bạn đã bị ngắt chuỗi, thử lại từ hôm nay nhé...",
            "😢 Lần sau đừng bỏ quên nhé...",
            "🌧️ Đừng để đám lửa nguội lạnh nữa...",
            "🕯️ Đốm lửa nhỏ vẫn còn, thắp lại từ hôm nay!",
            "⏳ Ai cũng có lúc lỡ nhịp, bắt đầu lại nào!",
            "🥲 Một ngày mới, một khởi đầu mới.",
            "🌱 Đừng nản lòng, hãy gieo lại hạt giống thói quen!",
            "💡 Hôm nay là cơ hội để viết lại chuỗi mới!"
        ];

        const messages = isWin ? winMessages : loseMessages;
        return messages[streak % messages.length];
    };

    return (
        <Layout>
            <div className="space-y-6 max-w-4xl mx-auto">
                {/* Streak block */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl shadow p-4 flex items-center gap-4">
                        <img
                            src={isWin ? "/images/streak_win.png" : "/images/streak_lose.png"}
                            alt="Streak flame"
                            className="w-16 h-16"
                        />
                        <div>
                            <p className={`text-xl font-bold ${isWin ? "text-red-600" : "text-blue-500"}`}>
                                {streak} ngày streak
                            </p>
                            <p className="text-sm text-gray-600">{getStreakMessage()}</p>
                        </div>
                    </div>

                    {/* BMI + Body Fat */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-2xl shadow p-4 flex items-center gap-3">
                            <Gauge className="text-green-600" />
                            <div>
                                <p className="text-sm text-gray-500">BMI</p>
                                <p className="text-xl font-semibold">{bmi || "Chưa có"}</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl shadow p-4 flex items-center gap-3">
                            <Gauge className="text-green-600" />
                            <div>
                                <p className="text-sm text-gray-500">Body Fat</p>
                                <p className="text-xl font-semibold">{bodyFat ? `${bodyFat}%` : "Chưa có"}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hôm nay tập gì */}
                <div className="bg-white rounded-2xl shadow p-4">
                    <h2 className="text-xl font-bold mb-2">💪 Lịch tập hôm nay</h2>
                    {todayWorkout.length === 0 ? (
                        <p className="text-base text-gray-600">Chưa có bài tập hôm nay.</p>
                    ) : (
                        <ul className="space-y-2">
                            {todayWorkout.map((ex, i) => (
                                <li key={i} className="text-base text-gray-800">🏋️ {ex.name} ({ex.muscle_group})</li>
                            ))}
                        </ul>
                    )}
                    <Link
                        to="/schedule"
                        className="mt-3 inline-block text-green-600 text-sm hover:underline"
                    >
                        ➕ Xem chi tiết lịch tập
                    </Link>
                </div>

                {/* Hôm nay ăn gì */}
                <div className="bg-white rounded-2xl shadow p-4">
                    <h2 className="text-xl font-bold mb-2">🍽️ Thực đơn hôm nay</h2>
                    {mealPlan ? (
                        <>
                            {renderMealSection("🍳 Bữa sáng", mealPlan.breakfast?.dishes)}
                            {renderMealSection("🍛 Bữa trưa", mealPlan.lunch?.dishes)}
                            {renderMealSection("🍲 Bữa tối", mealPlan.dinner?.dishes)}
                            {renderMealSection("🍫 Bữa phụ", mealPlan.snack?.dishes)}
                        </>
                    ) : (
                        <p className="text-base text-gray-600">Chưa có thực đơn hôm nay.</p>
                    )}
                    <Link
                        to="/nutrition"
                        className="mt-3 inline-block text-green-600 text-sm hover:underline"
                    >
                        ➕ Xem chi tiết thực đơn
                    </Link>
                </div>
            </div>
        </Layout>
    );
}
