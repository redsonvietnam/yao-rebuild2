# Sửa Lỗi Dexie - KeyPath updatedAt ✅

## Vấn Đề
```
DexieError2: KeyPath updatedAt on object store userDict is not indexed
```

## Nguyên Nhân
- Schema `userDict` không có index cho `updatedAt`
- Nhưng code gọi `.orderBy('updatedAt')` ở dòng 237
- Dexie yêu cầu tất cả fields dùng trong `.orderBy()` phải được index

## Sửa
1. **Thêm `updatedAt` vào schema**:
   ```javascript
   userDict: '++id, key, hanzi, updatedAt'  // Thêm updatedAt
   ```

2. **Tăng version database**:
   ```javascript
   this.version(5).stores({...})  // Từ 4 lên 5
   ```

## Cách Xóa Database Cũ

### Cách 1: DevTools (Nhanh nhất)
1. Mở http://localhost:3000
2. Mở DevTools (F12)
3. Vào tab **Application**
4. Click **Storage** → **IndexedDB**
5. Tìm **YaoEditorDB**
6. **Right-click** → **Delete database**
7. **Refresh** trang (F5)

### Cách 2: Console
```javascript
// Mở Console (F12)
await indexedDB.deleteDatabase('YaoEditorDB')
// Refresh trang
```

### Cách 3: Tự động
- Ứng dụng sẽ tự động xóa database nếu gặp lỗi schema
- Chỉ cần refresh trang

## Kiểm Tra

Sau khi xóa database:
1. Refresh trang (F5)
2. Mở Console (F12)
3. Không nên có lỗi Dexie
4. Ứng dụng hoạt động bình thường

## Files Đã Sửa

- `src/db/dexie.ts`
  - Thêm `updatedAt` vào schema `userDict`
  - Tăng version từ 4 lên 5

## Status

✅ **DEXIE SCHEMA FIXED**
✅ **READY TO TEST**

## Tiếp Theo

1. Xóa database cũ (xem hướng dẫn trên)
2. Refresh trang
3. Kiểm tra console - không có lỗi
4. Bấm nút theme toggle để kiểm tra theme system
