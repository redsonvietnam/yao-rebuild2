# CLAUDE.md — Hiến pháp Dự án Yao Editor v2

> Mọi agent (Claude, Antigravity, Gemini...) phải đọc file này trước khi làm bất cứ việc gì.

---

## 1. MỤC TIÊU DỰ ÁN

Web app soạn thảo văn bản chữ Hán bằng phiên âm tiếng Dao, hỗ trợ:
- Viết dọc / ngang với lưới ô (grid)
- IME tùy chỉnh từ file YAML gốc (`yao.dict.yaml`)
- Từ điển tra cứu với hanzi-writer
- OCR ảnh (Tesseract.js)
- Xuất PDF / DOCX / PNG

## 2. STACK KỸ THUẬT

| Layer | Công nghệ |
|---|---|
| Frontend | React 19 + Vite + TypeScript |
| Styling | Tailwind CSS v4 |
| Editor | Tiptap v3 (ProseMirror) |
| IME State | Zustand |
| Local DB | Dexie.js (dict cache) + idb (documents) |
| Backend | Express + better-sqlite3 |
| IME Engine | Custom TS (parse YAML lúc build) |

## 3. QUY TẮC BẤT BIẾN

### Kiến trúc
- **KHÔNG** thay đổi stack mà không hỏi lại Claude (Kiến trúc sư trưởng)
- **KHÔNG** thêm thư viện ngoài danh sách trong BLUEPRINT.md mà không có lý do rõ ràng
- **KHÔNG** dùng `document.execCommand` — mọi thao tác editor qua `editor.commands.*`

### IME Engine
- `transform.ts`: pure function duy nhất — ASCII → phiên âm Unicode
- `matcher.ts`: thứ tự match **bắt buộc** Exact → Prefix → Abbrev → Meaning
- IME intercept đặt trong `editorProps.handleKeyDown`, return `true` để block Tiptap

### State Management
- **Zustand** (`useEditorStore`): IME state + editor config
- **AppContext**: globals nhẹ (activeTab, theme, notifications)
- **KHÔNG** đẩy IME state vào Context — tránh re-render toàn app

### Error Handling
- Services trả `null` khi lỗi, **không** throw
- SQLite errors: Express trả `{ error: string, code: number }`

## 4. WORKFLOW AGENT

```
Claude (Architect) → tạo TASK → Antigravity (Coordinator) → đọc TASK → thực thi → cập nhật PROGRESS.md
```

- Antigravity đọc BLUEPRINT.md trước mỗi task
- Antigravity cập nhật PROGRESS.md sau mỗi task hoàn thành
- Mọi thay đổi kiến trúc phải ghi vào PROGRESS.md và cập nhật BLUEPRINT.md

## 5. FILE QUAN TRỌNG

- `BLUEPRINT.md` — Kiến trúc tổng thể (Claude viết, không sửa tùy tiện)
- `PROGRESS.md` — Log tiến độ (Antigravity cập nhật)
- `CLAUDE.md` — File này

---

*Phiên bản: 1.0 — Khởi tạo cùng project scaffold*
