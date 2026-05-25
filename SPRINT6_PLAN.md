# SPRINT 6 PLAN — M23–M26: Notification, Theme, Hanzi Writer, Server Dict API

> Ngày lập kế hoạch: 2026-05-25  
> Agent: Antigravity (Coordinator)  
> Trạng thái: 📋 Đã lên kế hoạch

---

## Tổng quan

Sprint 6 gồm 4 milestone:
| Milestone | Tên | Mô tả |
|---|---|---|
| M23 | Notification System | Hệ thống toast notification cho toàn app |
| M24 | Theme System | Light/Dark mode với CSS variables |
| M25 | Hanzi Writer | Hiển thị thứ tự nét bút chữ Hán bằng hanzi-writer |
| M26 | Server Dict API | API tra từ điển server-side qua better-sqlite3 |

**Thứ tự thực hiện:** M23 → M24 → M25 → M26

---

## M23: Notification System

### Hiện trạng
- `src/components/common/NotificationList.tsx` và `src/components/common/Header.tsx` là stub rỗng (`return null`)
- `AppContext` có sẵn `notifications` field trong interface

### Kế hoạch chi tiết

#### Bước 1: Định nghĩa Notification type
- `Notification { id: string; type: 'info' | 'success' | 'warning' | 'error'; message: string; duration?: number }`
- Đặt trong `src/lib/types.ts` (tạo mới) hoặc `src/contexts/AppContext.tsx`

#### Bước 2: NotificationContext / mở rộng AppContext
- State: `notifications: Notification[]`
- Actions:
  - `addNotification(notif: Omit<Notification, 'id'>)` — generate `id` bằng `crypto.randomUUID()`, tự động xóa sau `duration` (default 4000ms)
  - `dismissNotification(id: string)` — xóa thủ công
- Dùng `useCallback` + `setTimeout` để auto-dismiss

#### Bước 3: NotificationList.tsx
- Render danh sách notification dạng **toast stack** góc trên phải màn hình (`fixed top-4 right-4`)
- Dùng `framer-motion` `AnimatePresence`:
  - Enter: slide-in từ phải + fade-in
  - Exit: slide-out sang phải + fade-out
- Mỗi notification card:
  - Icon tùy theo type (check `✓`, warning `⚠`, error `✕`, info `ℹ`)
  - Message text
  - Nút đóng `×`
  - Thanh progress bar chạy ngược thời gian (tự động mờ dần)

#### Bước 4: Tích hợp vào App.tsx
- Đặt `<NotificationList />` bên trong root div, ở level cao nhất để luôn visible

#### Bước 5: Gắn notification vào các service hiện có
- `useAutoSave.ts`: `addNotification({ type: 'success', message: 'Đã lưu tài liệu' })` khi save thành công
- `useExport.ts`: `addNotification({ type: 'success', message: 'Đã xuất PDF' })` khi export xong; `type: 'error'` khi thất bại
- `OCRPanel.tsx`: `addNotification({ type: 'success', message: 'Nhận dạng hoàn tất' })`
- `geminiService.ts` → `DictionaryPanel.tsx`: `addNotification({ type: 'error', message: 'Gemini không phản hồi' })`
- `OverrideManager.tsx`: `addNotification({ type: 'success', message: 'Đã thêm mục từ điển cá nhân' })`

### Files ảnh hưởng
| File | Thay đổi |
|---|---|
| `src/lib/types.ts` | Tạo mới — `Notification` type |
| `src/contexts/AppContext.tsx` | Thêm `notifications` state + `addNotification`/`dismissNotification` |
| `src/components/common/NotificationList.tsx` | Viết lại hoàn chỉnh |
| `src/App.tsx` | Thêm `<NotificationList />` |
| `src/hooks/useAutoSave.ts` | Gọi notification |
| `src/hooks/useExport.ts` | Gọi notification |
| `src/components/ocr/OCRPanel.tsx` | Gọi notification |
| `src/components/dictionary/DictionaryPanel.tsx` | Gọi notification khi GemAI lỗi |
| `src/components/dictionary/OverrideManager.tsx` | Gọi notification |

---

## M24: Theme System (Light/Dark Mode)

### Hiện trạng
- Toàn bộ app dùng dark mode cứng (class `bg-gray-950`, `bg-gray-900`, `text-white`...)
- Không có theme switching, không có light mode

### Kế hoạch chi tiết

#### Bước 1: Thêm theme vào Zustand store
- `theme: 'dark' | 'light'` trong `useEditorStore`
- Action `toggleTheme()`: switch giữa dark/light
- Init: load từ Dexie `settings` table (key `'theme'`), default `'dark'`

#### Bước 2: CSS Custom Properties trong index.css
```css
:root {
  /* Dark theme (default) */
  --color-bg-primary: #0a0a0a;     /* gray-950 */
  --color-bg-secondary: #111111;   /* gray-900 */
  --color-bg-surface: #1a1a1a;     /* gray-800 */
  --color-bg-hover: #222222;       /* gray-750 */
  --color-text-primary: #ffffff;
  --color-text-secondary: #d1d5db; /* gray-300 */
  --color-text-muted: #6b7280;     /* gray-500 */
  --color-border-primary: #1f2937; /* gray-800 */
  --color-border-secondary: #374151;
  --color-accent: #6366f1;         /* indigo-500 */
  --color-accent-bg: rgba(99, 102, 241, 0.1);
  --color-success: #22c55e;        /* green-500 */
  --color-warning: #f59e0b;        /* amber-500 */
  --color-error: #ef4444;          /* red-500 */
}

.light {
  --color-bg-primary: #fafafa;
  --color-bg-secondary: #ffffff;
  --color-bg-surface: #f3f4f6;
  --color-bg-hover: #e5e7eb;
  --color-text-primary: #111827;
  --color-text-secondary: #374151;
  --color-text-muted: #6b7280;
  --color-border-primary: #d1d5db;
  --color-border-secondary: #e5e7eb;
  --color-accent: #4f46e5;
  --color-accent-bg: rgba(79, 70, 229, 0.08);
}
```

#### Bước 3: Áp dụng CSS variables thay cho Tailwind color classes
Thay vì sửa tất cả component inline, cách tiếp cận:
- Mở rộng Tailwind v4 config trong `index.css` với `@theme`:
```css
@theme {
  --color-yao-bg: var(--color-bg-primary);
  --color-yao-surface: var(--color-bg-surface);
  --color-yao-text: var(--color-text-primary);
  --color-yao-text-muted: var(--color-text-muted);
  --color-yao-border: var(--color-border-primary);
}
```
- Sau đó dùng `bg-yao-bg`, `text-yao-text`, `border-yao-border` thay vì `bg-gray-950`, `text-white`, `border-gray-800`
- Hoặc: giữ class hiện tại + thêm `light:` variants nếu Tailwind hỗ trợ

#### Bước 4: Root div theme class
```tsx
<div className={`h-screen ... ${theme === 'light' ? 'light' : ''}`}>
```

#### Bước 5: Theme toggle trong ModeToggle
- Nút mặt trời 🌞 / mặt trăng 🌙 bên cạnh Grid toggle
- Gọi `toggleTheme()` + `saveSetting('theme', newTheme)`

#### Bước 6: Persist theme qua Dexie
- `initDict` hoặc `App.tsx useEffect` load theme từ settings
- Tự động save mỗi khi toggle

### Files ảnh hưởng
| File | Thay đổi |
|---|---|
| `src/index.css` | CSS variables + `.light` class + `@theme` mở rộng |
| `src/editor/useEditorStore.ts` | Thêm `theme` state + `toggleTheme` action |
| `src/App.tsx` | Thêm theme class vào root div, load theme từ settings |
| `src/components/editor/ModeToggle.tsx` | Thêm nút theme toggle |
| Toàn bộ components | Thay class màu tailwind cứng → dùng CSS variables hoặc theme-aware classes |

---

## M25: Hanzi Writer (Hiển thị thứ tự nét bút)

### Hiện trạng
- `hanzi-writer` (v3.5.1) đã có trong `package.json`, chưa được sử dụng
- DictionaryPanel có tab CHI TIẾT hiển thị ký tự lớn, nhưng chưa có animation nét bút

### Kế hoạch chi tiết

#### Bước 1: Tạo HanziWriterDisplay component
- File: `src/components/dictionary/HanziWriterDisplay.tsx`
- Props: `hanzi: string`
- Logic:
  - `useRef` cho container `<div>`
  - `useEffect` khi mount: `HanziWriter.create(containerRef.current!, hanzi, options)`
  - Options:
    ```ts
    {
      width: 200,
      height: 200,
      padding: 5,
      strokeAnimationSpeed: 2,
      delayBetweenStrokes: 100,
      strokeColor: currentTheme === 'light' ? '#111827' : '#ffffff',
      radicalColor: '#6366f1',  // indigo accent
      outlineColor: '#374151',
    }
    ```
  - Cleanup: gọi `writer.destroy()` khi unmount (nếu có API) hoặc clear container
  - Controls:
    - Nút **▶ Viết** — `writer.animateCharacter()`
    - Nút **⟳ Lặp** — `writer.loopCharacterAnimation()`
    - **Tốc độ** slider — thay đổi `strokeAnimationSpeed`
    - Nút **◼ Dừng** — `writer.pauseAnimation()` / `writer.cancelAnimation()`
  - Fallback: nếu `hanzi-writer` không có dữ liệu → hiển thị text "Không có dữ liệu nét bút cho ký tự này"

#### Bước 2: Tích hợp vào DictionaryPanel
- Tab CHI TIẾT: thêm section "THỨ TỰ NÉT" ngay dưới ô hiển thị ký tự lớn
- `<HanziWriterDisplay hanzi={selectedChar.hanzi} />`
- Tự động animate khi mở tab details

#### Bước 3: Edge cases
- Ký tự không có trong hanzi-writer data → fallback message
- Component unmount → cleanup instance tránh memory leak
- Responsive: container width/height điều chỉnh theo panel width

### Files ảnh hưởng
| File | Thay đổi |
|---|---|
| `src/components/dictionary/HanziWriterDisplay.tsx` | Tạo mới |
| `src/components/dictionary/DictionaryPanel.tsx` | Thêm section HanziWriter trong tab details |

---

## M26: Server-side Dict API

### Hiện trạng
- Dictionary load toàn bộ từ `src/assets/dict.json` (~10MB+) qua Vite import ở client
- `better-sqlite3` đã có trong dependencies nhưng chưa dùng
- `server.ts` (Express) chỉ có health check endpoint

### Kế hoạch chi tiết

#### Bước 1: Script seed database
- File: `scripts/seed-dict-db.ts`
- Logic:
  - Import `better-sqlite3`
  - Đọc `src/assets/dict.json`
  - Tạo file `data/yao-dict.db`
  - Schema:
    ```sql
    CREATE TABLE IF NOT EXISTS entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT NOT NULL,        -- pinyin key (e.g., "nhaxn")
      hanzi TEXT NOT NULL,      -- output character (e.g., "人")
      pinyin TEXT,              -- reading
      weight INTEGER DEFAULT 0,
      matchType TEXT DEFAULT 'exact'
    );
    CREATE INDEX IF NOT EXISTS idx_key ON entries(key);
    CREATE INDEX IF NOT EXISTS idx_hanzi ON entries(hanzi);
    CREATE INDEX IF NOT EXISTS idx_pinyin ON entries(pinyin);
    ```
  - Batch insert: dùng prepared statement trong transaction
  - Log progress ra console

#### Bước 2: API endpoints trong server.ts
- `GET /api/dict/search?q=<query>`:
  - Search trên `key`, `hanzi`, `pinyin` dùng LIKE `%query%`
  - Trả JSON: `{ results: { hanzi, pinyin, weight, matchType }[], total: number }`
  - Giới hạn 50 kết quả
- `GET /api/dict/char/:hanzi`:
  - Tìm exact match trên `hanzi`
  - Trả tất cả entries với ký tự đó
- `GET /api/dict/stats`:
  - Trả `{ totalEntries: number, dbSize: string }`

#### Bước 3: Client-side dictApiService
- File: `src/services/dictApiService.ts`
- Functions:
  - `searchDict(query: string): Promise<DictResult[]>` — gọi `/api/dict/search`
  - `getCharDetail(hanzi: string): Promise<DictResult[]>` — gọi `/api/dict/char/:hanzi`
  - `getStats(): Promise<{ totalEntries: number }>` — gọi `/api/dict/stats`
- Fallback: nếu server không reachable (fetch error), trả về `[]` hoặc throw để caller dùng in-memory dict

#### Bước 4: Tích hợp vào DictionaryPanel
- `handleSearch`: gọi `searchDict(query)` thay vì search in-memory
- Giữ nguyên Dexie cache layer (cache kết quả API response)
- Nếu API lỗi → fallback về in-memory search như hiện tại

#### Bước 5: Cập nhật scripts
- `package.json`: thêm `"seed-dict": "tsx scripts/seed-dict-db.ts"`
- `npm run dev` có thể chạy seed trước nếu DB chưa tồn tại

### Files ảnh hưởng
| File | Thay đổi |
|---|---|
| `scripts/seed-dict-db.ts` | Tạo mới |
| `server.ts` | Thêm SQLite connection + API routes |
| `src/services/dictApiService.ts` | Tạo mới |
| `src/components/dictionary/DictionaryPanel.tsx` | Tích hợp API search với fallback |
| `package.json` | Thêm script `seed-dict` |

---

## Thứ tự thực hiện

1. **M23 Notification** — infrastructure cho các module khác báo lỗi/thành công
2. **M24 Theme** — touch nhiều file nhất, làm sớm tránh conflict
3. **M25 Hanzi Writer** — component mới, biệt lập
4. **M26 Server Dict API** — backend + script, phức tạp nhất, làm cuối

---

## Cập nhật PROGRESS.md

Sau mỗi milestone hoàn thành, cập nhật PROGRESS.md với format như các sprint trước:
```
## [TASK #021] M23: Notification System
**Ngày:** 2026-05-25
**Agent:** Antigravity (Coordinator)
**Trạng thái:** ✅ Hoàn thành
...