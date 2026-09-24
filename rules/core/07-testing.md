## 7. Testing

**MUST**
- **R7.1** Logic mới (hook, util, xử lý dữ liệu) phải có test, nếu project đã có setup test.
- **R7.2** Khi sửa bug, thêm test tái hiện bug đó nếu khả thi.

**SHOULD**
- **R7.3** Test theo hành vi người dùng (render, tương tác, kết quả hiển thị), không test state nội bộ hay implementation detail.
- **R7.4** Tìm phần tử theo role, label, text trước; `data-testid` là lựa chọn cuối cùng.
- **R7.5** Mock API theo pattern có sẵn trong project.

