import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { authFetch } from "../components/autoFetch";
import { ChevronDown, RefreshCcw, X } from "react-feather";

export default function NutritionPage() {
    const [gender, setGender] = useState("male");
    const [bmi, setBmi] = useState(null);
    const [goal, setGoal] = useState("Tăng cơ");
    const [showGoalDropdown, setShowGoalDropdown] = useState(false);
    const [targetCalories, setTargetCalories] = useState(2500);
    const [mealPlan, setMealPlan] = useState(null);
    const [selectedDish, setSelectedDish] = useState(null);
    const [loading, setLoading] = useState(false);

    const getTotalMacro = () => {
        if (!mealPlan) return { protein: 0, carbs: 0, fat: 0 };

        return ["breakfast", "lunch", "dinner", "snack"].reduce(
            (totals, key) => {
                const nutrition = mealPlan[key]?.total_nutrition || {};
                return {
                    protein: totals.protein + (nutrition.protein || 0),
                    carbs: totals.carbs + (nutrition.carbs || 0),
                    fat: totals.fat + (nutrition.fat || 0),
                };
            },
            { protein: 0, carbs: 0, fat: 0 }
        );
    };

    const total = getTotalMacro();
    useEffect(() => {
        authFetch("${API_URL}/api/profile/")
            .then((res) => res.json())
            .then((data) => {
                setGender(data.gender);
                setBmi(data.bmi);
                if (data.bmi < 18.5) {
                    setGoal("Tăng cơ");
                    setTargetCalories(2500);
                } else if (data.bmi > 25) {
                    setGoal("Giảm mỡ");
                    setTargetCalories(1800);
                } else {
                    setGoal("Duy trì");
                    setTargetCalories(2200);
                }
            })
            .catch((err) => console.error("Lỗi lấy profile:", err));
    }, []);

    useEffect(() => {
        const userId = localStorage.getItem("user_id") || "default";
        const saved = localStorage.getItem(`aiMealPlan_${userId}`);

        if (saved) {
            try {
                setMealPlan(JSON.parse(saved));
            } catch { }
        }
    }, []);

    const fetchMealPlan = async () => {
        setLoading(true);
        try {
            const res = await authFetch("${API_URL}/api/ai-meal-plan/", {
                method: "POST",
                body: JSON.stringify({ gender, bmi, goal }),
            });
            const data = await res.json();
            setMealPlan(data);
            const userId = localStorage.getItem("user_id") || "default";
            localStorage.setItem(`aiMealPlan_${userId}`, JSON.stringify(data));

        } catch (err) {
            console.error("Lỗi khi lấy thực đơn:", err);
        } finally {
            setLoading(false);
        }
    };


    const handleGoalChange = (g) => {
        setGoal(g);
        setShowGoalDropdown(false);
        if (g === "Tăng cơ") setTargetCalories(2500);
        else if (g === "Giảm mỡ") setTargetCalories(1800);
        else setTargetCalories(2200);
    };

    const getTotalTodayCalories = () => {
        if (!mealPlan) return 0;
        return ["breakfast", "lunch", "dinner", "snack"].reduce((sum, mealKey) => {
            return sum + (mealPlan[mealKey]?.total_nutrition?.calories || 0);
        }, 0);
    };

    const renderMacros = (label, value, max, color) => (
        <div className="mb-2">
            <div className="flex justify-between text-sm font-medium mb-1">
                <span>{label}</span>
                <span>{value}g</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full">
                <div
                    className={`${color} h-2 rounded-full`}
                    style={{ width: `${Math.min(100, (value / max) * 100)}%` }}
                ></div>
            </div>
        </div>
    );

    const completion = Math.round((getTotalTodayCalories() / targetCalories) * 100);

    const handleSubstituteDish = async (mealKey, dishIndex, dishName) => {
        try {
            const res = await authFetch("${API_URL}/api/ai-substitute-dish/", {
                method: "POST",
                body: JSON.stringify({ dish: dishName, meal: mealKey, goal }),
            });
            const newDish = await res.json();

            const updatedPlan = { ...mealPlan };
            updatedPlan[mealKey].dishes[dishIndex] = newDish;

            // Cập nhật lại tổng macro
            const totals = updatedPlan[mealKey].dishes.reduce(
                (sum, d) => ({
                    calories: sum.calories + (d.nutrition.calories || 0),
                    protein: sum.protein + (d.nutrition.protein || 0),
                    carbs: sum.carbs + (d.nutrition.carbs || 0),
                    fat: sum.fat + (d.nutrition.fat || 0),
                }),
                { calories: 0, protein: 0, carbs: 0, fat: 0 }
            );

            updatedPlan[mealKey].total_nutrition = totals;
            setMealPlan(updatedPlan);
            const userId = localStorage.getItem("user_id") || "default";
            localStorage.setItem(`aiMealPlan_${userId}`, JSON.stringify(updatedPlan));
        } catch (err) {
            console.error("❌ Lỗi đổi món:", err);
        }
    };


    return (
        <Layout>
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-white p-4 rounded shadow border">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-xl font-bold mb-1">🍱 Tổng Quan Dinh Dưỡng</h1>
                            <p className="text-sm text-gray-600 mb-1">🎯 {targetCalories} kcal/ngày - {goal}</p>
                            <p className="text-sm text-gray-600">🔥 Calo hôm nay: {getTotalTodayCalories()}/{targetCalories} kcal ({completion}%)</p>
                        </div>
                        <div className="relative">
                            <button
                                onClick={() => setShowGoalDropdown(!showGoalDropdown)}
                                className="text-sm text-gray-600 hover:text-black flex items-center gap-1"
                            >
                                ⚙️ Mục tiêu <ChevronDown size={14} />
                            </button>
                            {showGoalDropdown && (
                                <div className="absolute right-0 top-full mt-2 w-40 bg-white border rounded shadow z-10">
                                    {["Tăng cơ", "Giảm mỡ", "Duy trì"].map((g) => (
                                        <button
                                            key={g}
                                            onClick={() => handleGoalChange(g)}
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                                        >
                                            {g}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Macro Bars tổng */}
                    <div className="mt-3">
                        {renderMacros("Protein", total.protein, 300, "bg-green-500")}
                        {renderMacros("Carbs", total.carbs, 300, "bg-blue-400")}
                        {renderMacros("Fat", total.fat, 100, "bg-yellow-500")}

                    </div>

                    <button
                        onClick={fetchMealPlan}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-2"
                    >
                        {loading ? "Đang sinh thực đơn..." : "Tạo Thực Đơn Mới Cho Hôm Nay"}
                    </button>
                </div>

                {mealPlan && ["breakfast", "lunch", "dinner", "snack"].map((mealKey) => {
                    const mealTitle = {
                        breakfast: "🍳 Bữa sáng",
                        lunch: "🍛 Bữa trưa",
                        dinner: "🍲 Bữa tối",
                        snack: "🍫 Bữa phụ",
                    }[mealKey];

                    const meal = mealPlan[mealKey];

                    return (
                        <div key={mealKey} className="bg-white p-4 rounded-xl shadow border">
                            <h2 className="text-lg font-bold mb-4">{mealTitle}</h2>
                            {meal.dishes.map((dish, i) => (
                                <div key={i} className="border p-3 mb-3 rounded-xl shadow-sm bg-gray-50">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold">🍽️ {dish.name}</p>
                                            <p className="text-sm text-gray-600">
                                                🔥 {dish.nutrition.calories} kcal | P: {dish.nutrition.protein}g | C: {dish.nutrition.carbs}g | F: {dish.nutrition.fat}g
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleSubstituteDish(mealKey, i, dish.name)}
                                                className="text-blue-500 hover:underline text-sm"
                                            >
                                                <RefreshCcw size={14} className="inline" /> Đổi món
                                            </button>
                                            <button
                                                onClick={() => setSelectedDish(dish)}
                                                className="text-green-600 hover:underline text-sm"
                                            >
                                                Xem chi tiết
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="text-sm text-green-700 font-medium mt-2">
                                Tổng: {meal.total_nutrition.calories} kcal | P: {meal.total_nutrition.protein}g | C: {meal.total_nutrition.carbs}g | F: {meal.total_nutrition.fat}g
                            </div>
                        </div>
                    );
                })}

                {/* Chi tiết món */}
                {selectedDish && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white max-w-lg w-full p-6 rounded-xl shadow-xl relative">
                            <button onClick={() => setSelectedDish(null)} className="absolute top-3 right-3 text-gray-600 hover:text-black">
                                <X />
                            </button>
                            <h2 className="text-xl font-bold mb-2">{selectedDish.name}</h2>
                            <p className="text-sm text-gray-600 mb-2">🔥 {selectedDish.nutrition.calories} kcal | P: {selectedDish.nutrition.protein}g | C: {selectedDish.nutrition.carbs}g | F: {selectedDish.nutrition.fat}g</p>

                            <h3 className="font-semibold mt-3 mb-1">🥗 Nguyên liệu:</h3>
                            <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
                                {selectedDish.ingredients.map((ing, idx) => (
                                    <li key={idx}>{ing}</li>
                                ))}
                            </ul>

                            <h3 className="font-semibold mt-3 mb-1">📋 Cách chế biến:</h3>
                            <p className="text-sm text-gray-700">{selectedDish.instruction}</p>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}