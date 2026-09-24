## 8. Definition of Done

_Không bị `project.md` override._

Chỉ báo hoàn thành khi đủ các điều kiện sau:

- **R8.1** Lint, typecheck, test, build đều pass (lệnh cụ thể trong `project.md`). Nếu fail thì sửa; không tắt rule, không skip test.
- **R8.2** Không còn `console.log`, code bị comment-out, hay TODO không được yêu cầu.
- **R8.3** Đã tự đối chiếu diff với core rules và `project.md`.
- **R8.4** Gửi tóm tắt gồm:
  - Đã thay đổi gì và vì sao.
  - Đã kiểm tra bằng cách nào.
  - Những gì chưa làm hoặc cần người xác nhận.
  - Vấn đề phát hiện ngoài phạm vi task (nếu có).

