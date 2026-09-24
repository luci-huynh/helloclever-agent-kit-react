# Đóng góp vào agent-kit-react

## Khi nào nên đề xuất thay đổi

Khi AI mắc **cùng một lỗi từ lần thứ hai trở đi** (phát hiện qua review của người hoặc AI reviewer), hoặc khi một rule hiện có gây hiểu nhầm, không còn tác dụng. Trong PR review của các project, gắn nhãn `agent-kit-feedback` cho những comment như vậy để gom lại định kỳ.

## Đưa vào đâu

Chọn theo thứ tự ưu tiên, dừng ở mức đầu tiên phù hợp:

1. **Lint / TypeScript config** — nếu kiểm tra được bằng máy. Không viết thành rule bằng lời.
2. **Core rules** (`rules/core/`) — nếu đúng cho mọi project React.
3. **Skill** (`skills/`) — nếu chỉ liên quan đến một loại task.
4. **`project.md` của project đó** — nếu chỉ đúng với một project. Không gửi PR vào repo này.

## Cách viết rule

- Cụ thể, kiểm chứng được. "Viết code sạch" là vô dụng; "component quá khoảng 200 dòng thì tách" là dùng được.
- Chỉ viết điều AI thực sự hay làm sai. Mỗi dòng thừa làm loãng các dòng quan trọng.
- Gán đúng mức: MUST, SHOULD hoặc ASK FIRST.
- Gán mã rule tiếp theo trong phần đó (`R<phần>.<số>`). **Không đánh lại số** rule cũ, vì các project đang override theo mã. Rule bị xoá thì bỏ luôn mã đó, không dùng lại.

## Không đưa vào repo này

Repo này có thể được nhiều người đọc. Không đưa vào: tên hoặc URL service nội bộ, thông tin hạ tầng, dữ liệu khách hàng, secret, hay chi tiết riêng của một project. Những thứ đó thuộc `project.md` trong repo của từng project.

## Quy trình

1. Tạo branch, sửa, cập nhật `CHANGELOG.md` và `version` trong `package.json` theo semver.
2. Mở PR, điền đủ template.
3. Owner (xem `.github/CODEOWNERS`) duyệt trước khi merge.
4. Định kỳ khoảng 2 tuần, owner rà lại các feedback đã gom và dọn các rule không còn tác dụng.
