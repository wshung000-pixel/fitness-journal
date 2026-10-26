# 健身日誌 Fitness Journal V1.0

手機優先的健身訓練紀錄網站。訓練、課表、歷史、統計、體重/體脂/腰圍，以及 Supabase Email 登入雲端同步。

## GitHub Pages
本儲存庫有 GitHub Actions 部署工作流程 `.github/workflows/pages.yml`。
請在 Settings → Pages → Build and deployment 選擇 **GitHub Actions**，讓 main 分支自動部署。
網址： https://wshung000-pixel.github.io/fitness-journal/

## 啟用 Supabase（必要）
1. 前往 https://supabase.com/dashboard 新增專案。
2. 在 SQL Editor 執行 `schema.sql` 全部內容（內含 RLS 存取限制）。
3. 在 Authentication 設定 Email 登入與電子郵件驗證。
4. 在 Authentication → URL Configuration 將 Site URL 與 Redirect URLs 設為上方 GitHub Pages 網址。
5. 編輯 `config.js`：填入 Supabase Project URL 與 **publishable / anon key**。
6. **不可**填寫 `service_role`、`sb_secret_...` 或其他秘密金鑰。GitHub Pages 是公開原始碼，雲端資料權限依賴 Supabase Auth 和 RLS。

## 備註
- 尚未設定 Supabase 時顯示設定引導，不會假裝可以同步資料。
- 各帳號透過 RLS 隔離資料。
- 需網路才能儲存；本版未提供離線同步。
- 尚未做有氧時間/距離專用欄位，請用動作及備註記錄。
- 已提供 JSON 匯出，尚未提供匯入。
