## 6. Bảo mật & dữ liệu

_Không bị `project.md` override._

**MUST**
- **R6.1** Không commit secret, token, API key hay dữ liệu thật của khách hàng.
- **R6.2** Không `console.log` dữ liệu cá nhân, token, thông tin thanh toán.
- **R6.3** Không dùng `dangerouslySetInnerHTML` với nội dung chưa được sanitize.
- **R6.4** Không lưu token hoặc dữ liệu nhạy cảm vào `localStorage` trừ khi `project.md` quy định rõ.
- **R6.5** Dữ liệu mẫu, mock và test chỉ dùng giá trị giả.

