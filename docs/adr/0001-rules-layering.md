# ADR 0001: Phân lớp rules và cách custom theo project

- Trạng thái: Đã chấp nhận
- Ngày: 2026-09-24

## Bối cảnh
Các project FE React hiện không thống nhất về cấu trúc thư mục và thư viện. Nếu core rules áp một cấu trúc lý tưởng lên project chưa theo cấu trúc đó, AI sẽ lúng túng giữa rules và code thực tế.

## Quyết định
- **Core rules** chỉ chứa nguyên tắc đúng bất kể cấu trúc và thư viện, chia theo phần trong `rules/core/`, mỗi rule có mã `R<phần>.<số>`.
- **`project.md`** trong mỗi project mô tả thực tế và override convention theo mã rule.
- Phần 6 (Bảo mật & dữ liệu) và phần 8 (Definition of Done) không bị override.
- Trong project, file của kit nằm trong `.agent-kit/`; `AGENTS.md` là file vào chung, `CLAUDE.md` import các file qua `@`.
- `config.json` cho phép tắt cả một phần core (ví dụ TypeScript với project JavaScript).
- Core rules không bao giờ bị sửa tay trong project.

## Các phương án đã cân nhắc
- Chuẩn hoá toàn bộ project trước rồi mới làm rules: quá chậm, không ai hưởng lợi trong nhiều tháng.
- Mỗi project tự viết rules riêng: không tái sử dụng được, chất lượng không đồng đều.

## Hệ quả
- Kit dùng được ngay trên các project hiện tại mà không cần đổi code.
- Mục "Override core rules" trong `project.md` cũng là danh sách việc cần chuẩn hoá của project đó.
- Mã rule phải ổn định: không đánh lại số.
