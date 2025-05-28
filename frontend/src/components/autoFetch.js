export async function authFetch(url, options = {}) {
    let access = localStorage.getItem("access");

    const defaultHeaders = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access}`,
    };

    try {
        let res = await fetch(url, {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
        });

        // Nếu access token hết hạn
        if (res.status === 401) {
            const refresh = localStorage.getItem("refresh");

            const refreshRes = await fetch("${API_URL}/api/token/refresh/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refresh }),
            });

            const refreshData = await refreshRes.json();

            if (refreshRes.ok) {
                // Lưu access mới
                localStorage.setItem("access", refreshData.access);
                access = refreshData.access;

                // Gọi lại request gốc với access mới
                res = await fetch(url, {
                    ...options,
                    headers: {
                        ...defaultHeaders,
                        Authorization: `Bearer ${access}`,
                        ...options.headers,
                    },
                });
            } else {
                // Cả refresh cũng hết → logout
                localStorage.clear();
                window.location.href = "/login";
            }
        }

        return res;
    } catch (err) {
        console.error("authFetch error:", err);
        throw err;
    }
}
