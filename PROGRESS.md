# PROGRESS LOG — Yao Editor v2

---

## [TASK #001] Project Scaffold
**Ngày:** 2026-05-13
**Agent:** Antigravity (Coordinator)
**Trạng thái:** ✅ Hoàn thành

### Đã làm:
- Khởi tạo cấu trúc thư mục theo BLUEPRINT.md mục B
- Tạo `package.json` với đầy đủ dependencies (mục E)
- Cấu hình `vite.config.ts` + `tsconfig.json` + `tsconfig.app.json` + `tsconfig.node.json`
- Tạo `server.ts` — Express: health check `/api/health`, Vite middleware dev, static prod
- Tạo `src/main.tsx`, `src/App.tsx`, `src/index.css` (scaffold)
- Tạo `CLAUDE.md`, `PROGRESS.md`, `.env.example`
- Tạo placeholder `.gitkeep` cho tất cả thư mục trong cấu trúc
- Cài đặt tất cả npm dependencies
- Verify: `npm run dev` hoạt động, browser hiển thị "Yao Editor"

### Thay đổi kiến trúc: Không có

---

## [TASK #002] M02: IME Engine
**Ngày:** 2026-05-13
**Agent:** Antigravity (Coordinator)
**Trạng thái:** ✅ Hoàn thành

### Đã làm:
- Thiết lập hệ thống chuyển đổi ASCII → Yao Unicode (`transform.ts`) hỗ trợ: `aw, iy, ew, ow, ee, oo`.
- Triển khai logic matching 4 bước (`matcher.ts`): Exact → Prefix → Abbrev.
- Xây dựng script `build-dict.ts` tự động chuyển đổi `yao.dict.yaml` sang `dict.json` tối ưu cho web.
- Triển khai `loader.ts` để nạp từ điển vào Map trên client.
- Kiểm thử thành công bằng scratch script: transform và match hoạt động chính xác với trọng số (weight).

### Thay đổi kiến trúc: Không có

---

## [TASK #003] M03: Zustand IME Store
**Ngày:** 2026-05-13
**Agent:** Antigravity (Coordinator)
**Trạng thái:** ✅ Hoàn thành

### Đã làm:
- Triển khai `useEditorStore` bằng Zustand để quản lý toàn bộ trạng thái IME.
- Tích hợp logic `transform` và `match` vào action `setPreedit`.
- Hỗ trợ chọn ứng viên bằng `nextCandidate`, `prevCandidate` và `selectCandidate`.
- Quản lý trạng thái nạp từ điển và chế độ gõ (Han-Dao / ASCII).
- Xác thực hoạt động qua giao diện Debug UI: chuyển đổi Telex, tìm kiếm từ điển và chọn từ hoạt động trơn tru.

### Thay đổi kiến trúc: Không có

---

## [TASK #004] M04: Basic Tiptap Editor
**Ngày:** 2026-05-13
**Agent:** Antigravity (Coordinator)
**Trạng thái:** ✅ Hoàn thành

### Đã làm:
- Triển khai custom `PageNode` extension cho Tiptap, cho phép render nội dung trong khung trang giấy (A4).
- Tích hợp thuộc tính `writing-mode` trực tiếp vào `PageNode` để hỗ trợ viết dọc/ngang linh hoạt.
- Cấu hình `YaoEditor.tsx` với `StarterKit` và cấu trúc nội dung bắt buộc phải nằm trong `PageNode`.
- Cập nhật `index.css` với style premium cho trang giấy (đổ bóng, lề, font chữ).
- Tích hợp Editor vào giao diện chính của `App.tsx`.

### Thay đổi kiến trúc: Không có

---

## [TASK #005] M05: IME ↔ Tiptap Glue
**Ngày:** 2026-05-13
**Agent:** Antigravity (Coordinator)
**Trạng thái:** ✅ Hoàn thành

### Đã làm:
- Triển khai hook `useIME` để xử lý sự kiện `handleKeyDown` từ Tiptap.
- Chặn phím alphanumeric khi ở chế độ Hán-Dao, cập nhật `preedit` và kích hoạt bộ máy gợi ý.
- Hỗ trợ phím mũi tên để duyệt danh sách ứng viên và phím số (1-9) để chọn nhanh.
- Tự động đồng bộ tọa độ con trỏ (`caretCoords`) thông qua `view.coordsAtPos`.
- Chèn nội dung (commit) vào Tiptap khi nhấn Space hoặc Enter.
- Xác thực thành công: Đã có thể gõ "nhătx" trực tiếp trong Tiptap và nhận được chữ "日".

### Thay đổi kiến trúc: Không có

---

## [TASK #006] M06: CandidateBar
**Ngày:** 2026-05-13
**Agent:** Antigravity (Coordinator)
**Trạng thái:** ✅ Hoàn thành

### Đã làm:
- Triển khai thành phần `CandidateBar.tsx` sử dụng `framer-motion` cho hiệu ứng hiển thị mượt mà.
- Logic định vị động dựa trên `caretCoords`, hỗ trợ tốt cả hai chế độ viết NGANG và DỌC.
- Thiết kế giao diện Dark Mode cao cấp, đồng bộ với layout tổng thể của ứng dụng.
- Hiển thị âm tiết đã biến đổi (transformed preedit) và danh sách tối đa 10 ứng viên mỗi trang.
- Tích hợp hoàn tất vào `App.tsx`, loại bỏ các thành phần debug tạm thời.
- Bổ sung nút chuyển đổi chế độ viết (Ngang/Dọc) và chế độ gõ (Hán-Dao/ASCII) trên Header.

### Thay đổi kiến trúc: Không có

---

## 🎉 TỔNG KẾT SPRINT 1: CORE IME ENGINE & FOUNDATION
**Trạng thái:** ✅ HOÀN THÀNH

**Các cột mốc đã đạt được:**
1. **Scaffold:** Base React + Vite + Tailwind v4 + Express server.
2. **Engine:** Chuyển đổi Telex Yao & Matching thuật toán 4 bước.
3. **State:** Zustand store quản lý IME tập trung.
4. **Editor:** Tiptap với custom PageNode (A4 layout).
5. **Glue:** Keo dính IME ↔ Tiptap (Keystroke interception).
6. **UI:** Floating CandidateBar premium.

*Sprint 2 sẽ bắt đầu với M07: Pagination & M08: Grid Extension.*

---

## [TASK #007] M07 & M08: Pagination & Grid Extension (Sprint 2)
**Ngày:** 2026-05-17
**Agent:** Antigravity (Coordinator)
**Trạng thái:** ✅ Hoàn thành

### Đã làm:
- **A4 Layout Constraints**: Đặt kích thước cố định A4 `210mm x 297mm` và ẩn overflow, tạo cảm giác soạn thảo thực tế.
- **Hán-Nôm Grid Overlay**: Thiết lập lưới ô ly 40px và viền chỉ đỏ báo lề viết theo đúng phong cách thư tịch cổ.
- **Pagination Engine**: Triển khai `PaginationPlugin` tự động split trang ở cấp block (depth 1) hoặc split giữa chừng trong đoạn văn bằng tọa độ (depth 2 split). Tự động dồn trang (join) khi có khoảng trống và tự xóa trang trống.
- **Multi-page Vertical Side-by-side**: Đồng bộ hóa chế độ gõ DỌC cho mọi trang trong tài liệu và thiết lập ProseMirror xếp các trang A4 từ phải sang trái theo trục ngang.
- **Zustand & Toolbar**: Tích hợp `showGrid` / `toggleGrid` vào Zustand store và thêm nút toggle Grid trên Header.

### Thay đổi kiến trúc: Không có

---

## 🎉 TỔNG KẾT SPRINT 2: PAGINATION & GRID LAYOUT
**Trạng thái:** ✅ HOÀN THÀNH

**Các cột mốc đã đạt được:**
1. **Grid**: Lưới ô ly cổ phong và thước lề chỉ đỏ cực kỳ thẩm mỹ.
2. **Auto-Pagination**: Động cơ phân trang và dồn trang tự động theo thời gian thực (real-time).
3. **Vertical Book Layout**: Trải nghiệm gõ dọc đa trang từ phải sang trái độc bản.

*Sprint 3 sẽ bắt đầu với các tính năng: M09: Ruler, M10: EditorToolbar, và M11: Dictionary Panel.*

---

## [TASK #008] M09: Ruler — Phantom Overlay Fix
**Ngày:** 2026-05-24
**Agent:** Antigravity (Coordinator)
**Trạng thái:** ✅ Hoàn thành

### Vấn đề:
- Ruler bị ẩn sau EditorToolbar dù DOM báo tọa độ chính xác (không overlap). Nguyên nhân: lỗi browser compositor khi vẽ flex-col child có `backdrop-blur-md` ở sibling phía trên, đẩy Ruler xuống lớp dưới.

### Giải pháp:
- Tách Ruler ra khỏi flex flow: bọc vào div `flex-1 relative min-h-0`, đặt Ruler `absolute top-0` với `z-[95]`.
- Editor canvas area thêm `paddingTop: 53px` khi showGrid để tạo khoảng trống cho Ruler, tránh đè lên nội dung.

### Thay đổi kiến trúc: Không — layout structure unchanged, chỉ thay đổi positioning strategy.

---

## [TASK #009] M11: Dictionary Panel — Search & Character Detail
**Ngày:** 2026-05-24
**Agent:** Antigravity (Coordinator)
**Trạng thái:** ✅ Hoàn thành

### Đã làm:
- Xây dựng `DictionaryPanel.tsx` — floating slide-in right sidebar (320px) với 3 tab: TRA CỨU, LỊCH SỬ, CHI TIẾT.
- **Search engine**: tìm kiếm trong in-memory dict Map với fuzzy matching (exact pinyin → prefix → hanzi → pinyin contains). Tự động deduplicate và sort theo weight.
- **Dexie caching**: kết quả tra cứu được cache vào `dictCache` table, lần sau tra cùng query sẽ trả về instantly. Lịch sử tra cứu lưu vào `searchHistory`.
- **Character detail**: hiển thị lớn chữ Hán, phiên âm, thanh tần suất, và nút sao chép.
- **UI/UX**: framer-motion animation slide-in, dark mode premium, toggle button floating bên phải màn hình.
- Tích hợp vào `App.tsx`.

### Thay đổi kiến trúc: Không có

---

## 🎉 TỔNG KẾT SPRINT 3: RULER, TOOLBAR & DICTIONARY
**Trạng thái:** ✅ HOÀN THÀNH

**Các cột mốc đã đạt được:**
1. **M09 Ruler**: Fix phantom overlay bug — absolute positioning, hiển thị đúng.
2. **M10 EditorToolbar**: Formatting toolbar đầy đủ (bold/italic/underline/strike, headings, alignment, undo/redo).
3. **M11 Dictionary Panel**: Tra cứu từ điển với cache Dexie, lịch sử, chi tiết ký tự.

---

## [TASK #010] M12: ModeToggle — Unified Mode Switching Component
**Ngày:** 2026-05-25
**Agent:** Antigravity (Coordinator)
**Trạng thái:** ✅ Hoàn thành

### Đã làm:
- Tách toàn bộ mode controls (Han-Dao/ASCII, Ngang/Dọc, Grid) khỏi inline JSX trong App.tsx thành `ModeToggle` component riêng.
- Giữ nguyên logic Zustand store, không thay đổi behavior.
- Tích hợp vào App.tsx header thông qua `<ModeToggle />`.

### Thay đổi kiến trúc: App.tsx header giờ dùng ModeToggle component thay vì inline buttons.

---

## [TASK #011] M13: LayoutModal — Page Layout Configuration
**Ngày:** 2026-05-25
**Agent:** Antigravity (Coordinator)
**Trạng thái:** ✅ Hoàn thành

### Đã làm:
- Xây dựng `LayoutModal.tsx` — modal trung tâm với backdrop blur để cấu hình bố cục trang.
- Hỗ trợ chọn khổ giấy A4/A3.
- 5 presets lề: Chuẩn (20mm), Hẹp (15mm), Rộng (30mm), Đóng sách (25/20mm), Cổ điển (35/25mm).
- 4 input tùy chỉnh lề (trên/dưới/trái/phải) với validation min 5mm / max 80mm.
- **Real-time preview**: hiển thị hình chữ nhật thu nhỏ của trang với lề được visualize, text lines preview.
- Nút Đặt lại mặc định và Áp dụng.
- Keyboard shortcut `Ctrl+Shift+L` để mở modal.
- Tích hợp vào App.tsx với state `isLayoutModalOpen`.

### Thay đổi kiến trúc: LayoutModal giao tiếp qua Zustand store (`setMargins`, `pageSize`).

---

## [TASK #012] M14: HandwritingCanvas — Vẽ Tay Nhận Dạng Ký Tự
**Ngày:** 2026-05-25
**Agent:** Antigravity (Coordinator)
**Trạng thái:** ✅ Hoàn thành

### Đã làm:
- Xây dựng `HandwritingCanvas.tsx` — canvas vẽ tay với các tính năng:
  - **Drawing engine**: vẽ tự do bằng chuột & touch, nét vẽ mượt với quadratic Bézier curves.
  - **Brush controls**: chọn kích thước bút (2/4/6/10px), chọn màu mực (5 màu).
  - **Undo/Redo**: stack-based, hoàn tác/làm lại từng nét vẽ.
  - **Clear**: xóa toàn bộ canvas.
  - **OCR recognition**: dùng Tesseract.js (`chi_sim`) để nhận dạng ký tự từ canvas.
  - **Dictionary integration**: sau khi nhận dạng, tự động tra từ điển và hiển thị pinyin + weight.
- Tích hợp vào DictionaryPanel dưới tab "VIẾT TAY".

### Thay đổi kiến trúc: HandwritingCanvas là component mới trong `components/dictionary/`, tích hợp vào DictionaryPanel tab bar.

---

## [TASK #013] M15: Dexie Caching Đầy Đủ
**Ngày:** 2026-05-25
**Agent:** Antigravity (Coordinator)
**Trạng thái:** ✅ Hoàn thành

### Đã làm:
- Mở rộng `db/dexie.ts` từ 2 tables lên **6 tables**:
  1. `dictCache` — cache kết quả tra từ điển (đã có từ Sprint 3)
  2. `searchHistory` — lịch sử tra cứu (đã có từ Sprint 3)
  3. `documents` — **MỚI**: lưu trữ tài liệu (JSON Tiptap content, margins, writingMode, wordCount...)
  4. `settings` — **MỚI**: persistence cho settings (key-value với JSON serialization)
  5. `exportCache` — **MỚI**: cache file export (PDF/DOCX/PNG) dưới dạng Blob
  6. `ocrCache` — **MỚI**: cache kết quả OCR (hash ảnh → text + confidence)
- Cung cấp đầy đủ CRUD helpers: `saveDocument`, `loadDocument`, `listDocuments`, `deleteDocument`, `getLatestAutoSave`
- Settings helpers: `saveSetting`, `loadSetting<T>`, `loadAllSettings`
- Export cache: `getCachedExport`, `cacheExport`
- OCR cache: `getCachedOCR`, `cacheOCR` + `simpleHash` utility
- Cập nhật `storageService.ts` để delegate sang các Dexie helpers mới.

### Thay đổi kiến trúc: DB version bumped từ 1 → 2. Tất cả helpers được export từ `@/db/dexie`.

---

## [TASK #014] M16: OCR Panel — Nhận Dạng Ký Tự Từ Ảnh
**Ngày:** 2026-05-25
**Agent:** Antigravity (Coordinator)
**Trạng thái:** ✅ Hoàn thành

### Đã làm:
- Xây dựng `OCRPanel.tsx` — floating panel góc phải dưới màn hình (400x520px).
- **3 cách nhập ảnh**: kéo thả (drag & drop), chọn file (file picker), dán từ clipboard (Ctrl+V).
- **Hỗ trợ 3 ngôn ngữ**: Chữ Hán (chi_sim), Tiếng Việt (vie), Tiếng Anh (eng).
- **Progress bar**: hiển thị % tiến trình nhận dạng real-time.
- **Kết quả**: hiển thị text đã nhận dạng, confidence badge (xanh/vàng/đỏ), multi-line display.
- **Dexie OCR cache**: tự động cache kết quả OCR theo hash ảnh — lần sau load ảnh giống sẽ trả về instantly.
- **Sao chép**: nút sao chép text đã nhận dạng.
- Tích hợp vào App.tsx (floating bottom-right, cạnh Dictionary toggle).

### Thay đổi kiến trúc: OCRPanel sử dụng `tesseract.js` + Dexie OCR cache.

---

## [TASK #015] M17: Export (PDF/DOCX/PNG)
**Ngày:** 2026-05-25
**Agent:** Antigravity (Coordinator)
**Trạng thái:** ✅ Hoàn thành

### Đã làm:
- Triển khai đầy đủ `useExport` hook với 3 format:
  1. **PDF**: render từng trang A4 qua `html2canvas` → `jsPDF` addImage. Multi-page support, A4 dimensions (210x297mm).
  2. **DOCX**: parse Tiptap JSON content → build `docx` library Paragraphs/TextRuns với bold/italic/underline/strike marks. Heading levels preserved. A4 page size with margins.
  3. **PNG**: render tất cả trang A4 qua `html2canvas`, combine thành 1 ảnh dọc duy nhất.
- **Dexie export cache**: tự động cache blob export — lần sau export cùng format trả về instantly.
- **Progress tracking**: `isExporting`, `progress` (0-100%), `format`, `error` state.
- **Download trigger**: tự động tạo link download blob sau khi export xong.

### Thay đổi kiến trúc: `useExport` hook export từ `@/hooks/useExport`, nhận `Editor` instance, trả về 3 hàm export + state.

---

## 🎉 TỔNG KẾT SPRINT 4: MODE TOGGLE, LAYOUT, HANDWRITING, DEXIE, OCR & EXPORT
**Trạng thái:** ✅ HOÀN THÀNH

**Các cột mốc đã đạt được:**
1. **M12 ModeToggle**: Component mode controls tập trung, sạch sẽ, tái sử dụng.
2. **M13 LayoutModal**: Modal cấu hình lề + khổ giấy với real-time preview & 5 presets.
3. **M14 HandwritingCanvas**: Vẽ tay ký tự Hán, nhận dạng OCR Tesseract.js, tra từ điển tự động.
4. **M15 Dexie đầy đủ**: 6 tables — dict cache, history, documents, settings, export cache, OCR cache.
5. **M16 OCR Panel**: Nhận dạng ảnh → text, 3 ngôn ngữ, drag-drop-paste, cache Dexie.
6. **M17 Export**: PDF (multi-page A4), DOCX (formatted text + headings), PNG (combined pages) — tất cả có Dexie cache.

*Sprint 5 sẽ bắt đầu với các tính năng: M18 OverrideManager, M19 GemAI, M20 AutoSave, M21 Template, M22 Export UI.*

---

## [TASK #016] M18: OverrideManager — Personal Dictionary Management
**Ngày:** 2026-05-25
**Agent:** Antigravity (Coordinator)
**Trạng thái:** ✅ Hoàn thành

### Đã làm:
- Mở rộng Dexie DB lên version 3, thêm `userDict` table (key, hanzi, pinyin, weight).
- Xây dựng `OverrideManager.tsx` — panel quản lý từ điển cá nhân: thêm/sửa/xóa mục override.
- Tích hợp `buildUserDictMap()` vào `useEditorStore.initDict()` và `refreshUserDict()`.
- Merge logic: user overrides được prepend vào trước built-in dict trong `setPreedit()`, đảm bảo user customization có priority cao nhất.
- Tích hợp vào DictionaryPanel dưới tab "CÁ NHÂN" (màu amber).
- Giao diện: form thêm/sửa với validation, list có hover edit/delete, confirm xóa tất cả.

### Thay đổi kiến trúc: Dexie DB version 2 → 3. useEditorStore thêm `userDictMap` + `refreshUserDict()`.

---

## [TASK #017] M20: AutoSave — Debounced Document Persistence
**Ngày:** 2026-05-25
**Agent:** Antigravity (Coordinator)
**Trạng thái:** ✅ Hoàn thành

### Đã làm:
- Tạo `useAutoSave.ts` hook với debounce 2s, lưu JSON Tiptap content vào Dexie `documents` table (`isAutoSaved: true`).
- Restore document khi reload: tự động load autosaved content, set writing mode và margins.
- Đồng bộ `saveStatus` vào Zustand store: `idle` | `saving` | `saved`.
- `FooterStats` component trong App.tsx: hiển thị badge "ĐÃ LƯU" (xanh), "ĐANG LƯU..." (vàng nhấp nháy), "CHƯA LƯU" (xám).
- Lock `isRestoringRef` để tránh save trong quá trình restore.

### Thay đổi kiến trúc: useEditorStore thêm `saveStatus` + `setSaveStatus()`. YaoEditor tích hợp useAutoSave hook.

---

## [TASK #018] M22: Export UI — Dropdown Menu & Progress Bar
**Ngày:** 2026-05-25
**Agent:** Antigravity (Coordinator)
**Trạng thái:** ✅ Hoàn thành

### Đã làm:
- Xây dựng `ExportMenu.tsx` — dropdown menu nút "XUẤT" trên header với 3 lựa chọn: PDF (A4), DOCX (Word), PNG (Ảnh).
- Tích hợp `useExport` hook có sẵn (M17): gọi exportPDF/exportDOCX/exportPNG.
- Progress overlay: hiển thị % progress với gradient bar animation trong khi export.
- Đăng ký editor instance vào Zustand store (`editor`, `setEditor`) từ YaoEditor.
- `ExportMenuWrapper` component trong App.tsx để bridge Zustand → ExportMenu.
- UX: disabled state khi đang export, click outside to close dropdown.

### Thay đổi kiến trúc: useEditorStore thêm `editor: Editor | null` + `setEditor()`. YaoEditor gọi setEditor on mount/unmount.

---

## [TASK #019] M19: GemAI — Gemini API Character Explanation
**Ngày:** 2026-05-25
**Agent:** Antigravity (Coordinator)
**Trạng thái:** ✅ Hoàn thành

### Đã làm:
- Tạo `geminiService.ts` — gọi Gemini API (`@google/genai`) với model `gemini-2.0-flash`.
- API key từ `VITE_GEMINI_API_KEY` environment variable.
- Prompt engineering: yêu cầu JSON response với meaning (tiếng Việt), radical (bộ thủ), sinoVietnamese (âm Hán Việt), examples (từ ghép), strokeCount (số nét).
- Tích hợp vào DictionaryPanel tab CHI TIẾT: nút "GIẢI NGHĨA" màu tím, loading spinner, hiển thị kết quả structured (nghĩa, bộ thủ, âm HV, số nét, ví dụ).
- Fallback khi API lỗi: hiển thị thông báo lỗi thân thiện.

### Thay đổi kiến trúc: DictionaryPanel thêm state `aiLoading`, `aiExplanation`, hàm `handleAIExplain`.

---

## [TASK #020] M21: Template Manager — Document Template Presets
**Ngày:** 2026-05-25
**Agent:** Antigravity (Coordinator)
**Trạng thái:** ✅ Hoàn thành

### Đã làm:
- Thêm `templates` table vào Dexie DB version 3 với `seedTemplates()` tự động seed 4 template.
- Xây dựng `TemplateModal.tsx` — modal trung tâm chọn mẫu tài liệu.
- **4 built-in templates**: Thư tịch cổ (dọc, cổ điển), Công văn hành chính (ngang, formal), Thơ Đường luật (dọc, 8 câu), Luyện viết chữ Hán (ngang, chữ to).
- Giao diện: 2-column grid card layout với icon theo category, select + highlight, footer với nút Áp dụng.
- Confirm dialog trước khi overwrite nội dung hiện tại.
- Nút "MẪU" trên header (bên trái nút BỐ CỤC).
- Áp dụng template: setContent JSON, setPageMode writing mode, reset margins.

### Thay đổi kiến trúc: Dexie DB templates table. App.tsx thêm TemplateModal với state `isTemplateModalOpen`.

---

## 🎉 TỔNG KẾT SPRINT 5: AI, AUTOSAVE, OVERRIDE & TEMPLATE
**Trạng thái:** ✅ HOÀN THÀNH

**Các cột mốc đã đạt được:**
1. **M18 OverrideManager**: Từ điển cá nhân, merge vào IME engine, ưu tiên user customization.
2. **M20 AutoSave**: Debounce 2s lưu JSON, restore khi reload, footer badge trạng thái.
3. **M22 Export UI**: Dropdown XUẤT với progress bar overlay cho PDF/DOCX/PNG.
4. **M19 GemAI**: Gemini 2.0 Flash giải nghĩa chữ Hán (nghĩa, bộ thủ, âm HV, ví dụ).
5. **M21 Template Manager**: 4 mẫu tài liệu preset (Thư tịch cổ, Công văn, Thơ Đường, Luyện viết).

*Sprint 6 sẽ bắt đầu với các tính năng: M23 Notification System, M24 Theme System, M25 Hanzi Writer, M26 Server-side Dict API.*

---