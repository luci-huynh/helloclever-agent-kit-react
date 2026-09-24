# Project Profile — <tên project>

<!-- File riêng của project. Team tự sửa. Chỗ nào chưa chắc, ghi [cần xác nhận]. -->

## Tổng quan
- Mục đích: <project này làm gì, cho ai>
- Owner / người liên hệ: <tên hoặc team>

## Stack thực tế
- React: <version>
- Ngôn ngữ: <TypeScript / JavaScript>
- Build: <Vite / CRA / Next.js / webpack…>
- Router: <thư viện + version>
- State: <local state / Zustand / Redux / Context…>
- Data fetching: <React Query / SWR / axios + hook…>
- Styling: <Tailwind / SCSS modules / styled-components…>
- Form: <React Hook Form / Formik / tự viết…>
- Test: <Vitest / Jest + Testing Library…>
- UI library / design system: <tên, hoặc "chưa có">

## Cấu trúc thư mục
<!-- Mô tả ngắn các thư mục chính và cái gì nằm ở đâu. Nếu có code cũ và code mới theo chuẩn khác nhau, ghi rõ. -->
- `src/...` — <nội dung>

## File mẫu để bắt chước
<!-- Quan trọng nhất: AI sẽ mở các file này để học pattern. -->
- Component: `<đường dẫn>`
- Custom hook: `<đường dẫn>`
- Gọi API: `<đường dẫn>`
- Form: `<đường dẫn>`
- Test: `<đường dẫn>`

## Lệnh chạy
- Cài đặt: `<yarn install>`
- Dev: `<yarn dev>`
- Lint: `<yarn lint>`
- Typecheck: `<yarn typecheck>`
- Test: `<yarn test>`
- Build: `<yarn build>`

## Override core rules
<!-- Ghi mã rule + cách project này làm khác + lý do. Không override được phần 6 và 8. -->
<!-- Ví dụ:
- R5.1: Chưa có API layer; code cũ gọi axios trực tiếp trong hook `useXxx`. Code mới vẫn theo cách này cho đến khi migrate.
- R4.1: Chưa có design token; dùng biến SCSS trong `src/styles/_vars.scss`.
-->

## Lưu ý đặc biệt
<!-- Những điều AI hay làm sai ở project này, vùng code nhạy cảm, tích hợp bên thứ ba… -->
