## 2. React

**MUST**
- **R2.1** Chỉ dùng function component và hooks.
- **R2.2** Không dùng `useEffect` để tính giá trị suy ra từ props/state. Tính trực tiếp khi render (dùng `useMemo` nếu tính toán nặng).
- **R2.3** Không copy props vào state rồi đồng bộ bằng `useEffect`.
- **R2.4** `useEffect` có subscription, timer, event listener phải có cleanup.
- **R2.5** `key` trong list dùng id ổn định. Không dùng index nếu list có thể đổi thứ tự hoặc thêm/xoá phần tử.

**SHOULD**
- **R2.6** Mỗi component một trách nhiệm chính. Quá khoảng 200 dòng, hoặc vừa lấy dữ liệu vừa render phức tạp, thì tách.
- **R2.7** Logic dùng lại ở từ 2 nơi trở lên thì tách thành custom hook `useXxx`.
- **R2.8** Chỉ dùng `useMemo`, `useCallback`, `React.memo` khi có lý do cụ thể: tính toán nặng, truyền vào component đã memo, hoặc làm dependency của effect.
- **R2.9** Truyền props cụ thể; tránh truyền cả object lớn khi component chỉ cần vài field.
- **R2.10** Giữ state ở cấp thấp nhất có thể. Chỉ đưa lên store global khi nhiều nhánh component cùng cần.

