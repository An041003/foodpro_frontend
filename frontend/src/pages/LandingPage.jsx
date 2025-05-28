import { useNavigate } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaXTwitter, FaEnvelope } from "react-icons/fa6";


export default function LandingPage() {
    const navigate = useNavigate();

    const scrollToDemo = () => {
        const section = document.getElementById("demo");
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="min-h-screen bg-white text-gray-800">
            {/* Header */}
            <header className="bg-white text-[#17A34A] flex justify-between items-center px-6 py-4 shadow">
                <h1 className="text-2xl font-bold">🍃 FoodPro</h1>
                <div className="space-x-3">
                    <button
                        onClick={() => navigate("/register")}
                        className="bg-[#3498DB] text-white px-4 py-2 rounded hover:brightness-110 transition"
                    >
                        Đăng ký
                    </button>
                    <button
                        onClick={() => navigate("/login")}
                        className="bg-[#17A34A] text-white px-4 py-2 rounded hover:brightness-110 transition"
                    >
                        Đăng nhập
                    </button>
                </div>


            </header>


            {/* Hero Section */}
            <section
                className="relative bg-gradient-to-t from-[#2ECC71] to-[#3498DB] text-white py-24 px-6 overflow-hidden"
                style={{ backgroundAttachment: "fixed" }}
            >
                <div
                    className="absolute inset-0 bg-[url('/images/hero_overlay.png')] bg-cover bg-center opacity-30"
                    style={{ backgroundAttachment: "fixed" }}
                ></div>

                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <h2
                        className="font-bold text-white mb-6"
                        style={{
                            fontFamily: "Montserrat, sans-serif",
                            fontSize: "44px",
                            textShadow: "1px 1px 4px rgba(0, 0, 0, 0.4)"
                        }}
                    >
                        Biến Mục Tiêu Thành Hiện Thực – Dinh Dưỡng & Tập Luyện Tối Ưu Với AI!
                    </h2>
                    <p
                        className="mb-8"
                        style={{
                            fontFamily: "Open Sans, sans-serif",
                            fontSize: "20px",
                            color: "rgba(255,255,255,0.8)"
                        }}
                    >
                        FoodPro phân tích thể trạng, đề xuất lịch tập cá nhân hóa và thực đơn dinh dưỡng chính xác – Giúp bạn đạt mục tiêu nhanh gấp 2 lần!
                    </p>
                    <div className="space-x-4">
                        <button
                            onClick={() => navigate("/register")}
                            className="bg-[#FF6B6B] text-white font-semibold px-6 py-2 rounded hover:brightness-110 transition"
                        >
                            Trải nghiệm ngay
                        </button>
                        <button
                            onClick={scrollToDemo}
                            className="bg-white text-green-600 font-semibold px-6 py-2 rounded border border-white hover:bg-gray-100 transition"
                        >
                            Xem Demo Video
                        </button>
                    </div>

                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 px-6 bg-gray-100">
                <h3 className="text-2xl font-bold text-center mb-10">Tính Năng Nổi Bật</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    <div className="bg-white p-6 rounded-xl shadow text-center">
                        <p className="text-4xl mb-2">📊</p>
                        <h4 className="font-bold text-lg mb-1">Theo Dõi Tiến Độ</h4>
                        <p>Biểu đồ tự động cập nhật cân nặng, BMI, body fat.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow text-center">
                        <p className="text-4xl mb-2">🤖</p>
                        <h4 className="font-bold text-lg mb-1">AI Tư Vấn Dinh Dưỡng</h4>
                        <p>AI gợi ý thực đơn phù hợp với lịch tập của bạn.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow text-center">
                        <p className="text-4xl mb-2">📱</p>
                        <h4 className="font-bold text-lg mb-1">Quét Mã Vạch</h4>
                        <p>Kiểm tra calo, protein, chất béo chỉ bằng một cú chạm.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow text-center">
                        <p className="text-4xl mb-2">🏋️</p>
                        <h4 className="font-bold text-lg mb-1">Lịch Tập Cá Nhân</h4>
                        <p>Tạo lịch tập tự động theo mục tiêu cá nhân.</p>
                    </div>
                </div>
            </section>

            {/* Demo Section */}
            <section id="demo" className="py-16 px-6 text-center">
                <h3 className="text-2xl font-bold mb-6">Xem FoodPro Hoạt Động Như Thế Nào</h3>
                <div className="max-w-3xl mx-auto">
                    <video className="w-full rounded shadow" controls>
                        <source src="/videos/demo.mp4" type="video/mp4" />
                        Trình duyệt không hỗ trợ video.
                    </video>
                    <button onClick={() => navigate("/register")} className="mt-6 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition">Đăng ký ngay</button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-10 px-6">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <h4 className="font-bold mb-2">Liên kết nhanh</h4>
                        <ul className="space-y-1 text-sm">
                            <li><a href="#" className="hover:underline">Về chúng tôi</a></li>
                            <li><a href="#" className="hover:underline">Chính sách bảo mật</a></li>
                            <li><a href="#" className="hover:underline">Liên hệ hỗ trợ</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-2">Theo dõi chúng tôi</h4>
                        <div className="flex gap-4 text-xl">
                            <a href="#" className="hover:text-green-400"><FaFacebookF /></a>
                            <a href="#" className="hover:text-green-400"><FaEnvelope /></a>
                            <a href="#" className="hover:text-green-400"><FaXTwitter /></a>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold mb-2">Đăng ký nhận tin</h4>
                        <div className="flex gap-2">
                            <input type="email" placeholder="Nhập email..." className="p-2 rounded w-full text-black" />
                            <button className="bg-green-600 px-4 py-2 rounded hover:bg-green-700">Gửi</button>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
