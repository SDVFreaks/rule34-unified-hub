---
description: # Create Prisma Model
---


**Description**: Tạo entity mới trong schema.prisma, migrate, generate client, và tạo DTO + service boilerplate cơ bản.

1. Hỏi user: Tên model (PascalCase, ví dụ Post), các fields chính (id, createdAt, etc.) và relations nếu có.
2. Đề xuất schema.prisma update (thêm model + fields + @@map nếu cần).
3. Chạy `npx prisma migrate dev --name add_[model-kebab]`
4. Chạy `npx prisma generate`
5. Tạo DTO: src/common/dto/[model]-dto.ts (class-validator + class-transformer)
6. Tạo service snippet: src/[module]/services/[model].service.ts (CRUD cơ bản)
7. Plan: Hiển thị diff trước khi apply.
8. Sau apply: Commit với message "feat: add [model] Prisma model and boilerplate"