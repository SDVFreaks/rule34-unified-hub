---
description: # Upload Media Pipeline
---


**Description**: Xây dựng hoặc kiểm tra full pipeline upload media (image/video) → validate → process → store → moderate.

1. Kiểm tra nếu đã có upload endpoint/service → nếu chưa thì plan tạo mới.
2. Validate: file type (jpg/png/webp/gif/mp4/webm), size limit (ảnh <10MB, video <500MB MVP), rating explicit/questionable.
3. Background job: Enqueue BullMQ job → FFmpeg HLS (multiple qualities), thumbnail generation.
4. Lưu vào R2/Cloudflare, tạo media_versions entries.
5. Insert Post vào Prisma với status 'pending_moderation'.
6. Index tags vào Meilisearch.
7. Tạo moderation queue entry cho admin review.
8. Plan chi tiết trước, chờ human approve trước khi write code lớn.
9. Artifact: Flow diagram text-based + code diff.