# @helloclever/agent-kit-react

Bộ rules, skills và workflows giúp AI coding agent (Claude Code, Cursor, Copilot…) làm việc đúng chuẩn trong các project frontend React của Hello Clever.

> Trạng thái: **v0.1 — pilot**. Chưa có CLI; cài thủ công theo hướng dẫn bên dưới.

## Thành phần

| Thư mục | Nội dung |
|---|---|
| `rules/core/` | Core rules dùng chung cho mọi project React, chia theo phần, mỗi rule có mã (`R2.3`). |
| `skills/` | Hướng dẫn cho từng loại task (tạo component, tích hợp API…). _Đang xây dựng._ |
| `workflows/` | Slash commands (`/feature`, `/review`) và hooks. _Đang xây dựng._ |
| `templates/` | Các file sẽ được tạo trong project khi cài. |
| `cli/` | Lệnh `init` / `sync` / `profile`. _Làm sau._ |
| `docs/` | ADR và quy trình đóng góp. |

## Cài vào project (thủ công, giai đoạn pilot)

Chạy tại thư mục gốc của project cần cài:

```bash
KIT=/đường/dẫn/tới/agent-kit-react
mkdir -p .agent-kit
cat $KIT/rules/core/*.md > .agent-kit/core-rules.md
cp $KIT/templates/project.md $KIT/templates/config.json .agent-kit/
cp $KIT/templates/AGENTS.md $KIT/templates/CLAUDE.md .
```

Project không dùng TypeScript: bỏ `03-typescript.md` khi ghép file.

Sau đó điền `.agent-kit/project.md` (stack, cấu trúc, file mẫu, lệnh chạy, override) và commit tất cả vào repo project.

## Cấu trúc trong project sau khi cài

```
project/
├── AGENTS.md              # file vào cho Cursor, Codex, Copilot…
├── CLAUDE.md              # file vào cho Claude Code (import các file bên dưới)
└── .agent-kit/
    ├── core-rules.md      # ghép từ rules/core — KHÔNG sửa tay
    ├── project.md         # riêng project — team tự sửa
    └── config.json        # version kit, bật/tắt phần core
```

## Custom cho từng project

- **Mô tả thực tế** trong `project.md`.
- **Override rule cụ thể** bằng mã rule, trong mục "Override core rules" của `project.md`.
- **Tắt cả một phần** (ví dụ TypeScript) trong `config.json`.
- **Rules theo thư mục**: đặt thêm `AGENTS.md` nhỏ trong thư mục con (ví dụ `src/legacy/`).

Không bao giờ sửa `core-rules.md` trong project. Muốn đổi core rules, gửi PR vào repo này — xem [docs/contributing.md](docs/contributing.md).
