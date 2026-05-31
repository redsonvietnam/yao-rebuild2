# Hướng Dẫn Xóa Database Dexie

## ⚠️ Tại Sao Cần Xóa?

Dexie lưu schema database. Khi schema thay đổi (thêm index), database cũ không tương thích.

**Lỗi**:
```
DexieError2: KeyPath updatedAt on object store userDict is not indexed
```

**Giải pháp**: Xóa database cũ, tạo database mới với schema đúng.

---

## 🔧 Cách 1: DevTools (Nhanh Nhất) ⭐

### Bước 1: Mở DevTools
- Nhấn **F12** hoặc **Ctrl+Shift+I**
- Hoặc: Right-click → **Inspect**

### Bước 2: Vào Application Tab
- Click tab **Application** (hoặc **Storage** trên Firefox)

### Bước 3: Tìm IndexedDB
- Bên trái: **Storage** → **IndexedDB**
- Mở rộng **IndexedDB**

### Bước 4: Tìm YaoEditorDB
- Tìm **YaoEditorDB** trong danh sách
- Right-click vào **YaoEditorDB**

### Bước 5: Delete Database
- Chọn **Delete database**
- Xác nhận xóa

### Bước 6: Refresh Trang
- Nhấn **F5** hoặc **Ctrl+R**
- Ứng dụng sẽ tạo database mới

---

## 💻 Cách 2: Console (Nếu DevTools Không Hoạt Động)

### Bước 1: Mở Console
- Nhấn **F12**
- Click tab **Console**

### Bước 2: Chạy Lệnh
```javascript
await indexedDB.deleteDatabase('YaoEditorDB')
```

### Bước 3: Refresh Trang
- Nhấn **F5**

---

## 🧹 Cách 3: Xóa Toàn Bộ Storage

Nếu muốn xóa tất cả (localStorage, sessionStorage, IndexedDB):

### DevTools
1. **F12** → **Application**
2. **Storage** → **Clear site data**
3. Chọn tất cả
4. Click **Clear**

### Console
```javascript
// Xóa localStorage
localStorage.clear()

// Xóa sessionStorage
sessionStorage.clear()

// Xóa IndexedDB
await indexedDB.deleteDatabase('YaoEditorDB')
```

---

## ✅ Kiểm Tra Sau Khi Xóa

### 1. Refresh Trang
- Nhấn **F5**

### 2. Mở Console
- Nhấn **F12** → **Console**

### 3. Kiểm Tra Lỗi
- Không nên có lỗi Dexie
- Ứng dụng hoạt động bình thường

### 4. Kiểm Tra Database Mới
- **F12** → **Application** → **IndexedDB**
- **YaoEditorDB** phải có (được tạo mới)

---

## 🎯 Kiểm Tra Theme System

Sau khi xóa database:

1. **Tìm nút toggle**
   - Góc trên phải header
   - Icon mặt trời ☀️ / mặt trăng 🌙

2. **Bấm nút toggle**
   - Nền phải thay đổi
   - Chữ phải thay đổi

3. **Refresh trang**
   - Nhấn F5
   - Theme phải giữ nguyên

---

## 🐛 Nếu Vẫn Có Lỗi

### Lỗi vẫn xuất hiện
- [ ] Xóa lại database
- [ ] Clear cache: **Ctrl+Shift+Delete**
- [ ] Đóng tab, mở tab mới
- [ ] Thử browser khác

### Nút toggle không hiển thị
- [ ] Zoom out: **Ctrl+Minus**
- [ ] Kiểm tra header render
- [ ] Mở DevTools kiểm tra console

### Theme không thay đổi
- [ ] Refresh trang
- [ ] Xóa localStorage: `localStorage.clear()`
- [ ] Xóa database lại

---

## 📝 Lệnh Nhanh

```javascript
// Xóa database
await indexedDB.deleteDatabase('YaoEditorDB')

// Xóa localStorage
localStorage.clear()

// Kiểm tra theme
document.documentElement.classList.contains('light')

// Kiểm tra CSS variables
getComputedStyle(document.documentElement).getPropertyValue('--color-bg-primary')
```

---

## ✨ Hoàn Tất!

Sau khi xóa database:
1. ✅ Ứng dụng hoạt động bình thường
2. ✅ Không có lỗi Dexie
3. ✅ Theme system hoạt động
4. ✅ Nút toggle hiển thị
5. ✅ Có thể chuyển đổi theme

---

**Ghi chú**: Database sẽ được tạo lại tự động khi ứng dụng chạy.
