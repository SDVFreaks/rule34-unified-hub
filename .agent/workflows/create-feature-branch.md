---
description: # Create Feature Branch
---


**Description**: Tạo branch mới theo chuẩn Conventional Commits, checkout, commit initial scaffold message, push origin, và tạo draft PR.

1. Hỏi user (nếu chưa có): Tên feature ngắn gọn (kebab-case), ví dụ: unified-search-bar
2. Tạo branch mới: `git checkout -b feature/[tên-feature]`
3. Commit empty initial: `git commit --allow-empty -m "feat: scaffold [tên-feature]"`
4. Push branch: `git push origin feature/[tên-feature]`
5. Tạo draft PR với title: "feat: [tên-feature]" và body: "- Scaffold files and structure\n- Ready for implementation"
6. Artifact: Link PR + screenshot GitHub PR page
7. Thông báo: "Branch & draft PR created. Review before merging."