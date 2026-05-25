# Báo cáo lỗi: Lỗi hiển thị Ruler bị che khuất (Overlay Issue)

**Gửi:** Kiến trúc sư (Architect) / User
**Từ:** AI Assistant (Antigravity)

## Tóm tắt vấn đề
Người dùng báo cáo rằng thanh Ruler (Thước đo) không hiển thị khi bật chế độ Grid (`showGrid = true`). Khi được hỏi, người dùng xác nhận có vẻ như thanh Ruler "bị nằm sau thanh công cụ" (Toolbar) và dù đã thử nhiều cách fix (bao gồm thay đổi layout, gỡ sticky, dùng pure inline CSS), người dùng vẫn phản hồi là "chả có gì khác cả, vẫn bị overlay".

## Phân tích kỹ thuật & Các nỗ lực đã thực hiện

### 1. Cấu trúc Layout hiện tại
Theo `YaoEditor.tsx`, cấu trúc Flexbox đang được sắp xếp như sau:
```tsx
<div className="flex flex-col w-full h-full bg-gray-950 overflow-hidden">
  <EditorToolbar /> {/* h-12, shrink-0 */}
  {showGrid && <RulerWrapper />} /* py-2, shrink-0, chứa Ruler 28px */
  <EditorCanvasWrapper /> /* flex-1, overflow-auto */
</div>
```

### 2. Kết quả kiểm tra từ Puppeteer (DOM)
Tôi đã chạy các script kiểm tra DOM bằng Puppeteer (Headless Chrome) để lấy chính xác tọa độ (Bounding Client Rect) của các element. Kết quả trả về cho thấy Layout hoạt động **hoàn toàn chính xác ở cấp độ DOM**:

- **Header (App.tsx):** `y: 0, height: 56`
- **EditorToolbar:** `y: 56, height: 48` (Kết thúc ở `104`)
- **RulerWrapper:** `y: 104, height: 45` (Bắt đầu chính xác ngay dưới Toolbar, không hề bị overlap)
- **EditorCanvasWrapper:** `y: 149, height: 719`

### 3. Vấn đề "Bóng ma" (The Phantom Overlay)
Dù DOM báo cáo tọa độ chính xác (không có chồng chéo), nhưng kết quả hiển thị thực tế (Visual) lại cho thấy Ruler dường như biến mất hoặc bị lồng vào trong Toolbar. 
Tôi đã thử đổi màu nền của Ruler sang `red` (đỏ) và thấy một vệt đỏ bị mờ (blurred) nằm lấp ló **bên dưới (behind)** `EditorToolbar`. Vì `EditorToolbar` có thuộc tính `backdrop-blur-md`, điều này chứng tỏ bộ render của trình duyệt đang vẽ Ruler ở lớp dưới (z-axis) và bị lệch trục y (y-axis) so với tính toán của DOM.

### Nguyên nhân khả dĩ (Cần Architect xem xét)

1. **Vite / HMR Cache Stale:** Có thể server Vite đang cache lại một phiên bản cũ của file CSS hoặc JS trên máy cục bộ của người dùng, khiến các thay đổi (như việc tháo `sticky top-14`) không thực sự được áp dụng lên trình duyệt của người dùng, dù mã nguồn đã đổi. (Đã yêu cầu người dùng hard refresh nhưng không thành công).
2. **Lỗi rendering của trình duyệt với flex-col + overflow-auto:** Có thể lớp vỏ `overflow-hidden` ở ngoài cùng kết hợp với `flex-1 overflow-auto` ở bên trong đang ép luồng render của trình duyệt (Paint layer) phải gộp (composite) sai các layer, khiến Ruler bị đẩy ngược lên z-index thấp hơn và trượt lên trên.
3. **Tailwind JIT Issue:** Trình biên dịch Tailwind CSS có thể không parse kịp các class động hoặc class nội tuyến (inline). (Tôi đã fix bằng cách chuyển Ruler 100% sang Inline style gốc, nhưng vẫn không hiển thị).

## Đề xuất hướng xử lý tiếp theo

Vì lỗi này có tính chất bất thường (DOM tính đúng nhưng Visual vẽ sai), tôi xin bàn giao lại cho Architect. Các hướng có thể thử nghiệm tiếp theo:

1. **Thêm Spacer hoặc bọc Wrapper cố định chiều cao:** Thay vì dựa vào flex-shrink, gán cứng `height: 45px` và `display: block` thay vì `flex` cho RulerWrapper.
2. **Portal:** Render Ruler ra một thẻ `div` hoàn toàn độc lập khỏi luồng flex của `YaoEditor`, sử dụng `position: absolute` và tự tính toán top offset (ví dụ: `top: 104px`).
3. **Khởi động lại toàn bộ môi trường:** Xóa thư mục `.vite` hoặc `node_modules/.vite` và chạy lại server.

Tôi đã lưu file này vào hệ thống để Architect có thể tiếp tục phân tích.
