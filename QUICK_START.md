# Hướng Dẫn Nhanh - Theme System

## 🚀 Bắt Đầu

Dev server đang chạy tại: **http://localhost:3000**

## 🎨 Chuyển Đổi Theme

### Cách 1: Sử dụng Nút Toggle
1. Mở http://localhost:3000
2. Nhìn vào **góc trên phải** của header
3. Tìm icon **mặt trời ☀️** (light theme) hoặc **mặt trăng 🌙** (dark theme)
4. **Bấm nút** để chuyển đổi

### Cách 2: Kiểm Tra Trong Console
```javascript
// Mở DevTools (F12) → Console
// Kiểm tra theme hiện tại
document.documentElement.classList.contains('light')
// true = light theme, false = dark theme

// Kiểm tra màu nền
getComputedStyle(document.documentElement).getPropertyValue('--color-bg-primary')
// #ffffff = light, #030712 = dark
```

## 🎯 Kỳ Vọng

### Dark Theme (Mặc Định)
- ✅ Nền: Đen/xám đậm
- ✅ Chữ: Trắng/xám sáng
- ✅ Borders: Xám đậm

### Light Theme
- ✅ Nền: Trắng/xám sáng
- ✅ Chữ: Đen/xám đậm
- ✅ Borders: Xám sáng

## 🔄 Persistence

- **Lưu tự động**: Theme được lưu vào localStorage
- **Khi reload**: Theme sẽ được khôi phục
- **Lần đầu**: Sẽ dùng system preference

## 🐛 Troubleshooting

### Nút toggle không hiển thị
- [ ] Kiểm tra header có render không
- [ ] Zoom out (Ctrl+-) để xem toàn bộ
- [ ] Mở DevTools (F12) kiểm tra console

### Theme không thay đổi
- [ ] Kiểm tra console có error không
- [ ] Refresh trang (F5)
- [ ] Clear cache (Ctrl+Shift+Delete)

### Chữ không đọc được
- [ ] Kiểm tra contrast
- [ ] Thử zoom in/out
- [ ] Thử browser khác

## 📝 Files Liên Quan

- `THEME_SYSTEM_FIXED.md` - Chi tiết kỹ thuật
- `TESTING_INSTRUCTIONS.md` - Hướng dẫn kiểm tra đầy đủ
- `LIGHT_THEME_GUIDE.md` - Hướng dẫn chi tiết

## ✅ Checklist

- [ ] Mở http://localhost:3000
- [ ] Tìm nút sun/moon icon
- [ ] Bấm nút toggle
- [ ] Xem theme thay đổi
- [ ] Refresh trang
- [ ] Kiểm tra theme vẫn giữ nguyên
- [ ] Mở DevTools kiểm tra class `light`

## 🎉 Done!

Theme system hoạt động bình thường. Bấm nút toggle để chuyển đổi giữa light và dark theme!
