# Skills

Mỗi skill là một thư mục chứa hướng dẫn cho một loại task cụ thể, chỉ được nạp khi cần.

```
skills/<tên-skill>/
├── SKILL.md       # frontmatter (name, description) + các bước thực hiện + lỗi thường gặp
└── examples/      # file mẫu "chuẩn" để AI bắt chước (tuỳ chọn)
```

Khi cài vào project, skills được đưa vào `.claude/skills/`.

## Kế hoạch
- [ ] `generate-project-profile` — quét repo và viết nháp `.agent-kit/project.md`
- [ ] `create-component`
- [ ] `api-integration`
- [ ] `figma-to-component`
- [ ] `write-tests`
