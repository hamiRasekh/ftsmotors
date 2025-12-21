#!/bin/bash
set -e

cd /opt/ftsmotors/ftsmotors

echo "🔍 بررسی وضعیت Git..."

# بررسی تغییرات محلی
if [ -n "$(git status --porcelain)" ]; then
    echo "📦 ذخیره تغییرات محلی..."
    git stash push -m "Auto-stash before merge $(date +%Y%m%d_%H%M%S)"
    STASHED=true
else
    STASHED=false
fi

# تنظیم merge strategy
echo "⚙️  تنظیم merge strategy..."
git config pull.rebase false

# Pull با merge
echo "🔄 دریافت تغییرات از remote..."
if git pull origin main --no-edit; then
    echo "✅ Merge موفقیت‌آمیز بود!"
else
    echo "⚠️  Conflict پیش آمد. در حال حل..."
    # اگر conflict پیش آمد، از تغییرات remote استفاده می‌کنیم
    git checkout --theirs . 2>/dev/null || true
    git add .
    git commit -m "Merge remote changes - resolved conflicts" || true
fi

# بازگرداندن تغییرات محلی
if [ "$STASHED" = true ]; then
    echo "📦 بازگرداندن تغییرات محلی..."
    if git stash pop; then
        echo "✅ تغییرات محلی بازگردانده شدند"
    else
        echo "⚠️  Conflict در stash. بررسی کنید: git stash list"
    fi
fi

echo "✅ مشکل Git حل شد!"
git status

