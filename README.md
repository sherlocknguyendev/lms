
- Khởi tạo dự án dùng Vite + JS
- App sử dụng Clerk để đăng nhập/đăng ký
- Dùng Cloudinary để lưu trữ ảnh (tránh kích thước data ở database to + hiệu năng web tăng)
- Dùng axios để gọi apis
- Toast để tạo notification (success/error)


- Class là "khuôn mẫu" như bản thiết kế xe ô tô
    -> Instance là "một chiếc xe cụ thể" bạn mua về



- Webhook (Clerk) là một cách để các hệ thống tự động gửi dữ liệu cho nhau khi có sự kiện xảy ra
- Phải dùng Webhook vì Clerk lưu thông tin trên server của họ (vì mình dùng Clerk để đăng nhập/đăng ký,..), bạn không có dữ liệu user nếu không dùng Webhook.
- Luồng:
    1. Bạn đăng ký tài khoản trên frontend (dùng Clerk) 👉
    2. Clerk xử lý việc xác thực, tạo người dùng 👉
    3. Clerk tự động GỬI một Webhook tới backend của bạn (gửi data người dùng) 👉
    4. Backend nhận Webhook đó, xử lý (thêm/sửa/xóa người dùng) 👉
    5. MongoDB cập nhật thông tin người dùng

    1. Clerk gửi POST webhook đến server của bạn.
    2. Bạn nhận req.body + headers.
    3. Bạn tạo `Webhook(secret)`.
    4. Gọi `verify(payload, headers)` để kiểm tra:
        - Dữ liệu đúng không?
        - Có bị giả mạo không?
    5. Nếu pass -> xử lý sự kiện (create/update/delete user).


- Flow upload ảnh = Cloudinary:
1. Upload ảnh từ BE → Cloudinary server
2. Cloudinary trả về → Object chứa thông tin ảnh
3. Lưu URL → Database (chỉ string, siêu nhẹ)


- Multer:
    Middleware của Express.js để xử lý multipart/form-data
    Dùng khi frontend gửi file (ảnh, video, document...)


- Flow sử dụng Stripe
    1. User->>Frontend: Click "Mua khóa học"
    2. Frontend->>Backend: POST /create-checkout-session
    3. Backend->>Stripe: Tạo session thanh toán
    4. Stripe-->>Backend: Trả về session.url
    5. Backend-->>Frontend: Trả về URL
    6. Frontend-->>User: Redirect sang Stripe Checkout

    7. User->>Stripe: Nhập thẻ, thanh toán
    8. Stripe-->>User: Giao diện thành công
    9. Stripe-->>Frontend: Redirect về success_url

    10. Stripe->>Backend: Gửi webhook (session.completed)
    11. Backend->>DB: Ghi đơn hàng (Purchase)


Frontend → Backend → Platform API → Backend → Frontend
                            ↓
                       (Webhook optional - tự động gọi lại Backend)

    Frontend: Gửi yêu cầu (ví dụ: thanh toán, đăng nhập)
    Backend: Xử lý logic (bảo mật, xử lý giá trị đầu vào, gọi API platform)
    Platform Service: Thực thi (thanh toán, xác thực, lưu dữ liệu...)
    Webhook (nếu có): Platform gọi lại backend khi có event (success, error...)