## 5. Data & API

**MUST**
- **R5.1** Gọi API qua layer/client mà project đang dùng (xem `project.md`). Không gọi `fetch`/`axios` trực tiếp trong component nếu project đã có layer riêng.
- **R5.2** Xử lý lỗi cho mọi request; không nuốt lỗi bằng `catch` rỗng.
- **R5.3** Không hardcode URL, API key hay giá trị phụ thuộc môi trường; dùng biến môi trường theo cách project đang làm.

**SHOULD**
- **R5.4** Bỏ qua response cũ khi request đã bị thay thế hoặc component đã unmount (ví dụ khi search, đổi filter liên tục).
- **R5.5** Không tự viết cơ chế cache nếu project đã có thư viện data fetching.

