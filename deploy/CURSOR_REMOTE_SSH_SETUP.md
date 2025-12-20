# راهنمای اتصال Cursor Remote SSH به سرور

## اطلاعات سرور:
- **Host:** production-server2
- **IP:** 193.105.234.30
- **Port:** 22
- **User:** root

## مراحل تنظیم:

### مرحله 1: اضافه کردن SSH Config

#### در Windows:

1. باز کردن PowerShell:
```powershell
# ایجاد دایرکتوری .ssh (اگر وجود ندارد)
New-Item -ItemType Directory -Force -Path $HOME\.ssh

# اضافه کردن config
$config = @"
Host production-server2
    HostName 193.105.234.30
    User root
    Port 22
    ServerAliveInterval 60
    ServerAliveCountMax 3
    ForwardAgent yes
    StrictHostKeyChecking no
    UserKnownHostsFile /dev/null
"@

Add-Content -Path "$HOME\.ssh\config" -Value $config
```

2. بررسی فایل config:
```powershell
cat $HOME\.ssh\config
```

### مرحله 2: تست اتصال SSH

قبل از استفاده در Cursor، اتصال را تست کنید:

```powershell
ssh production-server2
```

اگر با موفقیت متصل شدید، از `exit` برای خروج استفاده کنید.

### مرحله 3: اتصال از طریق Cursor

1. در Cursor، کلید `F1` را بزنید
2. `Remote-SSH: Connect to Host` را تایپ کنید
3. `production-server2` را انتخاب کنید
4. رمز عبور را وارد کنید

یا:

1. کلیک روی آیکون Remote در گوشه پایین سمت چپ
2. `Connect to Host...` را انتخاب کنید
3. `production-server2` را انتخاب کنید

### مرحله 4: رفع مشکل Timeout

اگر خطای timeout می‌گیرید:

1. **بررسی اتصال SSH:**
```powershell
ssh -v production-server2
```

2. **افزایش timeout در config:**
```
Host production-server2
    HostName 193.105.234.30
    User root
    Port 22
    ServerAliveInterval 30
    ServerAliveCountMax 10
    ConnectTimeout 60
```

3. **بررسی فایروال:**
   - مطمئن شوید پورت 22 باز است
   - بررسی کنید که سرور در دسترس است

### مرحله 5: استفاده از SSH Key (اختیاری - توصیه می‌شود)

برای امنیت بیشتر و جلوگیری از وارد کردن رمز:

1. **تولید SSH Key:**
```powershell
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

2. **کپی کلید به سرور:**
```powershell
type $HOME\.ssh\id_rsa.pub | ssh production-server2 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

3. **به‌روزرسانی config:**
```
Host production-server2
    HostName 193.105.234.30
    User root
    Port 22
    IdentityFile ~/.ssh/id_rsa
    ServerAliveInterval 60
    ServerAliveCountMax 3
```

## عیب‌یابی:

### مشکل 1: Timeout
- بررسی کنید سرور در دسترس است: `ping 193.105.234.30`
- بررسی کنید پورت 22 باز است: `Test-NetConnection -ComputerName 193.105.234.30 -Port 22`

### مشکل 2: Authentication Failed
- بررسی کنید رمز عبور درست است
- از SSH Key استفاده کنید

### مشکل 3: Host Key Verification Failed
- اضافه کردن `StrictHostKeyChecking no` به config (فقط برای سرورهای قابل اعتماد)

## دستورات مفید:

```powershell
# تست اتصال
ssh production-server2 "echo 'Connection successful'"

# کپی فایل به سرور
scp file.txt production-server2:/root/

# کپی فایل از سرور
scp production-server2:/root/file.txt ./
```
