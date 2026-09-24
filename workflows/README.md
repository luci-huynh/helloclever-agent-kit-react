# Workflows

- `commands/` — slash commands nhiều bước, có điểm dừng chờ người duyệt. Khi cài, đưa vào `.claude/commands/`.
- `hooks/` — script chạy tự động (ví dụ lint + typecheck sau khi AI sửa file).

## Kế hoạch
- [ ] `/feature` — yêu cầu → plan (chờ duyệt) → code → lint/typecheck/test → tự review → tóm tắt PR
- [ ] `/review` — AI reviewer độc lập, output theo mức blocking / nên sửa / gợi ý, dẫn chiếu mã rule
- [ ] Hook lint + typecheck khi sửa file
