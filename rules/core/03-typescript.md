## 3. TypeScript

_Chỉ áp dụng cho project dùng TypeScript (`config.json` → `core.typescript`)._

**MUST**
- **R3.1** Không dùng `any`. Chưa biết kiểu thì dùng `unknown` rồi thu hẹp kiểu.
- **R3.2** Không dùng `as` hoặc `// @ts-ignore` để lách lỗi type. Nếu buộc phải dùng, ghi comment giải thích lý do.
- **R3.3** Props của component có type rõ ràng.
- **R3.4** Dữ liệu từ API có type riêng, đặt theo pattern của project.

**SHOULD**
- **R3.5** Dùng union type cho các trạng thái rời rạc (`'idle' | 'loading' | 'error' | 'success'`) thay vì nhiều biến boolean.

