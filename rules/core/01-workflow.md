## 1. Cách làm việc

**MUST**
- **R1.1** Đọc `.agent-kit/project.md` trước khi bắt đầu task.
- **R1.2** Trước khi tạo file mới, xem 2–3 file cùng loại gần nhất và theo đúng pattern của chúng (cấu trúc, đặt tên, cách import, cách gọi API).
- **R1.3** Chỉ sửa trong phạm vi task. Thấy vấn đề khác thì ghi vào phần tóm tắt, không tự sửa.
- **R1.4** Không xoá hoặc viết lại code khi chưa hiểu rõ mục đích của nó.

**SHOULD**
- **R1.5** Task chạm từ 4 file trở lên: liệt kê plan (file nào tạo/sửa, vì sao) và chờ xác nhận trước khi code.
- **R1.6** Chia thay đổi lớn thành các bước nhỏ, mỗi bước đều chạy được.

**ASK FIRST**
- **R1.7** Thêm, xoá hoặc nâng version bất kỳ dependency nào.
- **R1.8** Tạo folder mới ở cấp `src/` hoặc thay đổi cấu trúc thư mục.
- **R1.9** Sửa component, hook, util dùng chung (được import ở nhiều nơi).
- **R1.10** Sửa config: build, lint, tsconfig, CI, biến môi trường.

