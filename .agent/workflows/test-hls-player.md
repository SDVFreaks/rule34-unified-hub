---
description: # Test HLS Video Player
---


**Description**: Test end-to-end video playback trên viewer page.

1. Hỏi user: ID của post/video cần test (hoặc dùng latest pending).
2. Spawn browser session → navigate localhost:3000/post/[id]
3. Chờ page load, click play.
4. Kiểm tra: adaptive streaming (thay đổi chất lượng), speed control, chapters nếu có, theater mode.
5. Play 30s → screenshot timeline + console logs.
6. Report: Issues (nếu có buffering, error, etc.) và suggestions.