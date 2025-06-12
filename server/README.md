
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
