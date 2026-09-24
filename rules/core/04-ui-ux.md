## 4. UI & UX

**MUST**
- **R4.1** Ưu tiên component và design token có sẵn trong project. Không hardcode màu, font-size, spacing nếu project đã có token hoặc biến tương ứng.
- **R4.2** Màn hình hoặc khối có tải dữ liệu phải xử lý đủ 4 trạng thái: loading, error, empty, có dữ liệu.
- **R4.3** Thông báo lỗi cho người dùng phải dễ hiểu; không hiển thị raw error hay stack trace.
- **R4.4** Phần tử tương tác phải dùng được bằng bàn phím. Dùng `<button>` cho hành động, `<a>` cho điều hướng; không gắn `onClick` lên `<div>`.
- **R4.5** Input phải có label. Ảnh phải có `alt` (ảnh trang trí dùng `alt=""`).
- **R4.6** Nút gửi form hoặc thực hiện hành động phải chặn double-submit khi đang xử lý.

**SHOULD**
- **R4.7** Kiểm tra layout ở mobile (khoảng 375px) và desktop.
- **R4.8** Text hiển thị cho người dùng đi qua hệ thống i18n nếu project có dùng.

**ASK FIRST**
- **R4.9** Tạo component UI mới có chức năng trùng hoặc gần giống component đã có.

