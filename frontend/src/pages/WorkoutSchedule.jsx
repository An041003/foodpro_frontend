import { useState, useEffect } from "react";
import {
    ArrowLeft,
    MoreVertical,
    ChevronDown,
    RefreshCcw
} from "react-feather";
import Layout from "../components/Layout";
import { authFetch } from "../components/autoFetch";

const suggestions = {
    low: "Bạn nên chọn chế độ Giảm mỡ để cải thiện chỉ số cơ thể.",
    medium: "Chế độ Duy trì phù hợp với chỉ số hiện tại.",
    high: "Bạn có thể chọn chế độ Tăng cơ để phát triển thêm."
};

const modeLabels = {
    low: "Giảm mỡ",
    medium: "Duy trì",
    high: "Tăng cơ",
};

export default function WorkoutSchedule() {
    const API_URL = "foodpro-app-production-39e9.up.railway.app";
    const [selectedMode, setSelectedMode] = useState("");
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [exercises, setExercises] = useState([]);
    const [bmi, setBmi] = useState(null);
    const [selectedDateIndex, setSelectedDateIndex] = useState(0);
    const [weekDates, setWeekDates] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [libraryExercises, setLibraryExercises] = useState([]);
    const [showLibrary, setShowLibrary] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [workoutId, setWorkoutId] = useState(null);
    const [deleteMode, setDeleteMode] = useState(false);
    const [showChangeMenu, setShowChangeMenu] = useState(false);
    const [showSaturdayDropdown, setShowSaturdayDropdown] = useState(false);

    const weekdays = ["C.Nhật", "Th.2", "Th.3", "Th.4", "Th.5", "Th.6", "Th.7"];
    const defaultMuscleGroups = ["Nghỉ", "Ngực", "Lưng", "Chân", "Vai", "Tay trước và tay sau", "Toàn thân"];
    const [saturdayType, setSaturdayType] = useState("Toàn thân");


    let modeSuggest = "medium";
    if (bmi) {
        if (bmi < 18.5) modeSuggest = "high";
        else if (bmi > 25) modeSuggest = "low";
    }

    const modeKey = selectedMode;
    const defaultMode = modeSuggest;

    const filtered = libraryExercises.filter(ex =>
        ex.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const groupedExercises = filtered.reduce((acc, ex) => {
        if (!acc[ex.muscle_group]) acc[ex.muscle_group] = [];
        acc[ex.muscle_group].push(ex);
        return acc;
    }, {});


    const fetchLibrary = async () => {
        try {
            const res = await authFetch(`${API_URL}/api/exercise-library/`);
            if (!res.ok) throw new Error("Không thể lấy danh sách thư viện");
            const data = await res.json();
            setLibraryExercises(data);
        } catch (err) {
            console.error("❌ Lỗi fetch library:", err);
        }
    };


    const fetchExercises = async (dateStr) => {
        try {

            const res = await authFetch(`${API_URL}/api/workouts/?date=${dateStr}`);
            if (!res.ok) throw new Error("Không lấy được lịch tập");
            const data = await res.json();

            setExercises(data.exercises || []);
            setWorkoutId(data.id || data.plan_id); // lấy id kế hoạch
            //console.log("📅 Lấy bài tập cho ngày:", dateStr, "ID:", data.id || data.plan_id);

        } catch (err) {
            console.error("Lỗi lấy bài tập:", err);
            setExercises([]);
        }
    };

    const fetchBMI = async () => {
        try {
            const res = await authFetch(`${API_URL}/api/profile/`);
            if (!res.ok) throw new Error("Không lấy được chỉ số BMI");
            const data = await res.json();
            setBmi(data.bmi || 22);
        } catch (err) {
            console.error("Lỗi lấy BMI:", err);
        }
    };

    useEffect(() => {
        fetchBMI();


        const savedMode = localStorage.getItem("selectedWorkoutMode");
        if (savedMode) setSelectedMode(savedMode);
        const today = new Date();
        const sunday = new Date(today);
        sunday.setDate(sunday.getDate() - today.getDay());



        const dates = Array.from({ length: 7 }).map((_, i) => {
            const d = new Date(sunday);
            d.setDate(sunday.getDate() + i);
            return d;
        });
        console.log("📅 weekDates FE:", dates.map(d => d.toISOString().split("T")[0]));
        setWeekDates(dates);
    }, []);

    useEffect(() => {
        if (weekDates.length === 0) return;

        const today = new Date().toDateString();
        const index = weekDates.findIndex((d) => d.toDateString() === today);

        if (index !== -1) {
            setSelectedDateIndex(index);
        }
    }, [weekDates]);


    useEffect(() => {
        if (weekDates.length === 0) return;
        const date = weekDates[selectedDateIndex];
        const dateStr = `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

        fetchExercises(dateStr);
    }, [selectedDateIndex, weekDates]);

    useEffect(() => {
        const savedType = localStorage.getItem("saturdayType");
        if (savedType) setSaturdayType(savedType);
    }, []);

    return (
        <Layout>
            <div className="flex justify-between items-center px-4 py-3 bg-green-600 text-white rounded shadow">
                <div className="flex items-center gap-2">

                    <h1 className="text-xl font-bold">LỊCH TẬP</h1>
                </div>

            </div>

            <div className="flex justify-between px-4 py-3">
                {weekDates.map((d, i) => {
                    const today = new Date();
                    const day = d.getDate();
                    const isToday = d.toDateString() === today.toDateString();
                    const isSelected = selectedDateIndex === i;

                    return (
                        <div
                            key={i}
                            className="flex flex-col items-center w-10 cursor-pointer"
                            onClick={() => setSelectedDateIndex(i)}
                        >
                            <span className={`text-sm ${isSelected ? "text-green-600 font-semibold" : "text-gray-500"}`}>{weekdays[i]}</span>
                            <div
                                className={`w-8 h-8 flex items-center justify-center rounded-full mt-1 ${isToday
                                    ? "bg-red-600 text-white"
                                    : isSelected
                                        ? "border-2 border-green-600"
                                        : "bg-gray-200 text-black"
                                    }`}
                            >
                                {day}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="bg-white m-4 p-4 rounded-xl shadow space-y-2 relative">
                <h2 className="text-lg font-semibold">🏷️ Gợi ý chế độ tập</h2>
                <p className="text-base text-green-600 font-medium">{suggestions[defaultMode]}</p>
                <div className="mt-3">
                    <label className="block mb-1 text-sm font-medium">Chọn chế độ tập:</label>
                    <select
                        className="border p-2 rounded w-full"
                        value={selectedMode}
                        onChange={(e) => {
                            setSelectedMode(e.target.value);
                            localStorage.setItem("selectedWorkoutMode", e.target.value);
                        }}
                    >
                        <option value="">-- Chọn --</option>
                        <option value="low">Giảm mỡ</option>
                        <option value="medium">Duy trì</option>
                        <option value="high">Tăng cơ</option>
                    </select>
                </div>
            </div>

            <div className="bg-white m-4 p-4 rounded-xl shadow space-y-2">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    {/* Bên trái: mục tiêu và thời lượng */}
                    <div className="flex flex-col space-y-1">
                        <p className="text-xl font-bold mt-1">💪 Chế độ tập hiện tại</p>
                        <p className="text-xl font-bold !mt-3">🎯 Mục tiêu: {modeLabels[modeKey || defaultMode]}</p>
                        <div className="text-xl font-bold !mt-3 flex items-center gap-2">
                            💥 Nhóm cơ: {selectedDateIndex === 6 ? saturdayType : defaultMuscleGroups[selectedDateIndex]}

                            {selectedDateIndex === 6 && (
                                <div className="relative inline-block">
                                    <button
                                        onClick={() => setShowSaturdayDropdown(!showSaturdayDropdown)}
                                        className="text-gray-600 hover:text-black transition !pt-2"
                                    >
                                        <RefreshCcw size={18} className={`${showSaturdayDropdown ? "rotate-180" : ""} transition-transform`} />
                                    </button>

                                    {showSaturdayDropdown && (
                                        <div className="absolute bg-white border rounded shadow w-40 mt-2 z-10 right-0">
                                            {["Toàn thân", "Cardio", "Yoga"].map((option) => (
                                                <button
                                                    key={option}
                                                    onClick={() => {
                                                        setSaturdayType(option);
                                                        localStorage.setItem("saturdayType", option);
                                                        setShowSaturdayDropdown(false);
                                                    }}
                                                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bên phải: 3 button xếp dọc, cùng độ rộng */}
                    <div className="flex flex-col items-end gap-2 w-full sm:w-40">
                        <button
                            disabled={isGenerating}
                            className={`text-sm px-4 py-1.5 rounded transition w-full ${isGenerating
                                ? "bg-gray-400 cursor-not-allowed text-white"
                                : "bg-green-600 hover:bg-green-700 text-white"
                                }`}
                            onClick={() => setShowChangeMenu(!showChangeMenu)}
                        >
                            {isGenerating ? "Đang xử lý..." : "Đổi lịch tập"}
                        </button>
                        {showChangeMenu && (
                            <div className="bg-white shadow rounded mt-1 w-full text-sm border z-10">
                                <button
                                    onClick={async () => {
                                        setShowChangeMenu(false);
                                        if (!weekDates.length) return;
                                        const date = weekDates[selectedDateIndex];
                                        const dateStr = `${date.getFullYear()}-${(date.getMonth() + 1)
                                            .toString()
                                            .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
                                        const mode = selectedMode || defaultMode;
                                        const goalLabel = {
                                            low: "Giảm mỡ",
                                            medium: "Duy trì",
                                            high: "Tăng cơ",
                                        }[mode];

                                        const muscleGroup =
                                            selectedDateIndex === 6
                                                ? saturdayType
                                                : defaultMuscleGroups[selectedDateIndex];
                                        try {
                                            setIsGenerating(true);
                                            const res = await authFetch(`${API_URL}/api/ai-generate-workout/`, {
                                                method: "POST",
                                                headers: {
                                                    "Content-Type": "application/json",
                                                },
                                                body: JSON.stringify({
                                                    date: dateStr,
                                                    goal: goalLabel,
                                                    muscle_group: muscleGroup
                                                }),
                                            });
                                            if (!res.ok) throw new Error("Không thể đổi bài tập");
                                            await fetchExercises(dateStr);
                                        } catch (err) {
                                            console.error("❌ Lỗi đổi bài hôm nay:", err);
                                        } finally {
                                            setIsGenerating(false);
                                        }
                                    }}
                                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                                >
                                    Đổi hôm nay
                                </button>
                                <button
                                    onClick={async () => {
                                        setShowChangeMenu(false);
                                        const mode = selectedMode || defaultMode;
                                        const goalLabel = {
                                            low: "Giảm mỡ",
                                            medium: "Duy trì",
                                            high: "Tăng cơ",
                                        }[mode];

                                        try {
                                            setIsGenerating(true);
                                            const res = await authFetch(`${API_URL}/api/workouts/reset/`, {
                                                method: "POST",
                                                headers: {
                                                    "Content-Type": "application/json",
                                                },
                                                body: JSON.stringify({ goal: goalLabel }),

                                            });
                                            if (!res.ok) throw new Error("Không thể đổi cả tuần");
                                            const date = weekDates[selectedDateIndex];
                                            const dateStr = `${date.getFullYear()}-${(date.getMonth() + 1)
                                                .toString()
                                                .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
                                            await fetchExercises(dateStr);
                                        } catch (err) {
                                            console.error("❌ Lỗi đổi cả tuần:", err);
                                        } finally {
                                            setIsGenerating(false);
                                        }
                                    }}
                                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                                >
                                    Đổi cả tuần
                                </button>
                            </div>
                        )}
                        <button
                            onClick={() => {
                                setShowLibrary(true)
                                fetchLibrary();
                            }}
                            className="text-sm bg-blue-500 text-white px-4 py-1.5 rounded hover:bg-blue-600 transition w-full"
                        >
                            Thêm bài tập
                        </button>

                        <button
                            onClick={() => setDeleteMode(!deleteMode)}
                            className="text-sm bg-red-600 text-white px-4 py-1.5 rounded hover:bg-red-700 transition w-full"
                        >
                            {deleteMode ? "Hoàn tất" : "Xoá bài tập"}
                        </button>

                    </div>
                </div>
            </div>

            <div className="px-4 pb-6">

                {showLibrary && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
                        <div className="bg-white w-[90%] max-w-5xl rounded-lg p-6 max-h-[80vh] overflow-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold">📚 Chọn bài tập để thêm</h3>
                                <button onClick={() => setShowLibrary(false)} className="text-red-600">Đóng</button>
                            </div>

                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="🔍 Tìm bài tập..."
                                className="w-full border px-3 py-2 rounded mb-4"
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {Object.entries(
                                    libraryExercises
                                        .filter(ex => ex.name.toLowerCase().includes(searchTerm.toLowerCase()))
                                        .reduce((acc, ex) => {
                                            if (!acc[ex.muscle_group]) acc[ex.muscle_group] = [];
                                            acc[ex.muscle_group].push(ex);
                                            return acc;
                                        }, {})
                                ).map(([group, list], idx) => (
                                    <div key={idx}>
                                        <h4 className="text-sm font-bold mb-2">{group}</h4>
                                        <div className="space-y-2">
                                            {list.map((ex, i) => (
                                                <div key={i} className="border p-2 rounded flex justify-between items-center">
                                                    <span>{ex.name}</span>
                                                    <button
                                                        onClick={async () => {
                                                            try {
                                                                const res = await authFetch(`${API_URL}/api/workouts/${workoutId}/add-exercise/`, {
                                                                    method: "POST",
                                                                    body: JSON.stringify({ exercise_id: ex.id }),
                                                                });
                                                                if (!res.ok) throw new Error("Không thể thêm bài tập");
                                                                console.log("✅ Đã thêm bài:", ex.name);
                                                                const date = weekDates[selectedDateIndex];
                                                                const dateStr = typeof date === "string"
                                                                    ? date
                                                                    : `${date.getFullYear()}-${(date.getMonth() + 1)
                                                                        .toString()
                                                                        .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

                                                                await fetchExercises(dateStr);

                                                            } catch (err) {
                                                                console.error("❌ Lỗi thêm bài:", err);
                                                            }
                                                        }}
                                                        className="text-sm bg-green-600 text-white px-2 py-1 rounded"
                                                    >
                                                        Thêm
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {exercises.map((ex, idx) => (
                    <div
                        key={idx}
                        className={`relative bg-white p-4 mb-4 rounded-lg shadow transition-all duration-300 ${deleteMode ? "pl-16" : ""
                            }`}
                    >
                        {deleteMode && (
                            <button
                                onClick={async () => {
                                    try {
                                        const res = await authFetch(`${API_URL}/api/workouts/${workoutId}/exercise/${ex.id}/`, {
                                            method: "DELETE",
                                        });
                                        if (!res.ok) throw new Error("Không thể xoá bài tập");
                                        console.log("🗑️ Đã xoá:", ex.name);
                                        const date = weekDates[selectedDateIndex];
                                        const dateStr = typeof date === "string" ? date : `${date.getFullYear()}-${(date.getMonth() + 1)
                                            .toString()
                                            .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
                                        fetchExercises(dateStr);
                                    } catch (err) {
                                        console.error("❌ Lỗi xoá bài:", err);
                                    }
                                }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-red-600 text-white w-8 h-8 flex items-center justify-center rounded-full shadow text-2xl font-bold"
                            >
                                &minus;
                            </button>
                        )}
                        <div
                            className="flex justify-between items-center cursor-pointer"
                            onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                        >
                            <div className="font-medium">
                                🏋️ {ex.name} ({ex.muscle_group})
                            </div>
                            <ChevronDown
                                className={`transform transition-transform ${expandedIndex === idx ? "rotate-180" : "rotate-0"}`}
                            />
                        </div>
                        {expandedIndex === idx && (
                            <div className="mt-2">
                                <iframe
                                    src={`https://www.youtube.com/embed/${ex.video_id}`}
                                    className="w-full h-48 rounded mb-2"
                                    allow="autoplay"
                                    title={ex.name}
                                ></iframe>
                                <ul className="text-base text-gray-700 space-y-1">
                                    <li>🔁 Sets: {ex.sets}</li>
                                    <li>🧍 Reps: {ex.reps}</li>
                                    <li>⏸️ Nghỉ: {ex.rest}s</li>
                                </ul>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </Layout>
    );
}
