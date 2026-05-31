# Toolbar Redesign - TODO

## Yêu cầu chưa hoàn thành

### 1. Gộp tất cả controls vào 1 hàng duy nhất
- [ ] Đưa XUẤT, BỐ CỤC, MẪU lên cùng hàng với H1/H2/H3, căn lề, bold/italic
- [ ] Tất cả controls phải ngang hàng nhau, không có phân chia left/right section
- [ ] Toolbar phải gọn hơn nữa, có thể cần giảm padding/spacing

### 2. Layout mong muốn
```
[Undo][Redo] | [P][H1][H2][H3] [B][I][U][S] | [Left][Center][Right][Justify] | [Rotate] | [Ngang/Dọc][Grid][Hán-Dao] | [Mẫu][Bố Cục][Xuất]
```

Tất cả trong 1 row, không có justify-between.

### 3. Hiện trạng
- ✅ Đã icon hóa các controls
- ✅ OCR split view hoạt động
- ✅ Dictionary full-screen hoạt động
- ❌ Toolbar vẫn còn 2 sections (left/right với justify-between)
- ❌ Chưa đưa tất cả controls lên cùng 1 hàng

## Ghi chú
- User muốn toolbar thật sự gọn, tất cả controls nằm trên 1 hàng duy nhất
- Có thể cần scroll horizontal nếu màn hình nhỏ
- Hoặc responsive: ẩn bớt controls trên màn hình nhỏ
