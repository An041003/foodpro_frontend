import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User, ChevronDown, Info, HelpCircle, Menu, Home, Calendar, BarChart2, Activity } from "react-feather";

export default function Layout({ children }) {
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user_id");
        navigate("/login");
    };


    return (
        <div className="flex min-h-screen bg-gray-100 text-gray-800">
            {/* Sidebar */}
            <div className="group bg-green-600 text-white transition-all duration-300 p-4 flex flex-col w-16 hover:w-60 fixed h-full z-40">
                <button className="mb-6">
                    <Menu />
                </button>
                <nav className="flex flex-col gap-4">
                    <a href="/dashboard" className="flex items-center gap-2 hover:text-green-200">
                        <Home size={20} /> <span className="hidden group-hover:inline">Trang chủ</span>
                    </a>
                    <a href="/schedule" className="flex items-center gap-2 hover:text-green-200">
                        <Calendar size={20} /> <span className="hidden group-hover:inline">Trang lịch tập</span>
                    </a>
                    <a href="/nutrition" className="flex items-center gap-2 hover:text-green-200">
                        <BarChart2 size={20} /> <span className="hidden group-hover:inline">Trang dinh dưỡng</span>
                    </a>
                    <a href="/progress" className="flex items-center gap-2 hover:text-green-200">
                        <Activity size={20} /> <span className="hidden group-hover:inline">Trang tiến độ tập luyện</span>
                    </a>
                </nav>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col ml-16 group-hover:ml-60 transition-all duration-300">
                <header className="fixed top-0 left-0 right-0 bg-white text-green-600 flex justify-between items-center px-8 py-5 shadow z-30 ml-16 group-hover:ml-60 transition-all duration-300">
                    <h1 className="text-2xl font-extrabold flex items-center gap-2">
                        🍃 <span>FoodPro</span>
                    </h1>
                    <div className="relative">
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-2 focus:outline-none"
                        >
                            <User className="rounded-full border border-green-600 p-1" size={30} />
                            <ChevronDown size={16} />
                        </button>
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white border rounded shadow-lg z-50 text-sm">
                                <a href="/profile" className="block px-4 py-2 hover:bg-gray-100">
                                    Chỉnh sửa thông tin cá nhân
                                </a>
                                <a href="/terms" className="block px-4 py-2 hover:bg-gray-100">
                                    Chính sách & Điều khoản
                                </a>
                                <a href="/help" className="block px-4 py-2 hover:bg-gray-100">
                                    Hướng dẫn sử dụng
                                </a>
                                <a onClick={handleLogout} className="block px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer">
                                    Đăng xuất
                                </a>
                            </div>
                        )}
                    </div>
                </header>
                <main className="p-6 flex-1 overflow-y-auto pt-24">{children}</main>
            </div>
        </div>
    );
}
