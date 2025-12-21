# راهنمای اتصال به سرور Production

## اطلاعات سرور:
- **IP:** 193.105.234.30
- **Port:** 22
- **User:** root
- **Password:** (باید از شما دریافت شود)

## روش 1: استفاده از SSH Config (توصیه می‌شود)

### در Windows (PowerShell):

1. ایجاد دایرکتوری `.ssh` (اگر وجود ندارد):
```powershell
New-Item -ItemType Directory -Force -Path $HOME\.ssh
```

2. اضافه کردن config به فایل SSH:
```powershell
# کپی محتوای ssh-config.txt به فایل config
$configContent = @"
Host production-server
    HostName 193.105.234.30
    User root
    Port 22
    ServerAliveInterval 60
    ServerAliveCountMax 3
"@

Add-Content -Path "$HOME\.ssh\config" -Value $configContent
```

3. اتصال به سرور:
```powershell
ssh production-server
```

### در Linux/Mac:

1. اضافه کردن به فایل `~/.ssh/config`:
```bash
cat >> ~/.ssh/config << 'EOF'
Host production-server
    HostName 193.105.234.30
    User root
    Port 22
    ServerAliveInterval 60
    ServerAliveCountMax 3
EOF
```

2. تنظیم مجوز فایل:
```bash
chmod 600 ~/.ssh/config
```

3. اتصال به سرور:
```bash
ssh production-server
```

## روش 2: اتصال مستقیم

### Windows (PowerShell):
```powershell
ssh -p 22 root@193.105.234.30
```

### Linux/Mac:
```bash
ssh -p 22 root@193.105.234.30
```

## روش 3: استفاده از اسکریپت

### Windows:
```powershell
.\deploy\connect-to-server.ps1
```

### Linux/Mac:
```bash
chmod +x deploy/connect-to-server.sh
./deploy/connect-to-server.sh
```

## استفاده از SSH Key (اختیاری - امن‌تر)

اگر می‌خواهید از SSH Key استفاده کنید:

1. تولید SSH Key (اگر ندارید):
```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

2. کپی کلید عمومی به سرور:
```bash
ssh-copy-id -p 22 root@193.105.234.30
```

3. اضافه کردن به config:
```
Host production-server
    HostName 193.105.234.30
    User root
    Port 22
    IdentityFile ~/.ssh/id_rsa
    ServerAliveInterval 60
    ServerAliveCountMax 3
```

## نکات امنیتی:

1. **هرگز رمز عبور را در فایل config ننویسید**
2. از SSH Key استفاده کنید به جای password
3. فایل `~/.ssh/config` باید مجوز 600 داشته باشد
4. برای امنیت بیشتر، پورت SSH را تغییر دهید
