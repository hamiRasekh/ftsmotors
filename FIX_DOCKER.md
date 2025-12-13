# رفع مشکل Docker

## مشکل
ارور `@ftsmotors/shared@*' is not in this registry` به این دلیل است که پکیج `@ftsmotors/shared` یک پکیج محلی است و در npm registry وجود ندارد.

## راه حل اعمال شده

1. **تغییر package.json**: از `file:../../packages/shared` به جای `*` استفاده شد
2. **تغییر Dockerfile.dev**: حالا از root context استفاده می‌کند و کل monorepo را build می‌کند
3. **تغییر docker-compose.dev.yml**: context به root تغییر کرد

## دستورات

```bash
# پاک کردن کانتینرهای قبلی
docker-compose -f docker-compose.dev.yml down -v

# ساخت مجدد
docker-compose -f docker-compose.dev.yml build --no-cache

# راه‌اندازی
docker-compose -f docker-compose.dev.yml up -d
```

## اگر هنوز مشکل دارید

اگر هنوز مشکل دارید، می‌توانید پکیج shared را موقتاً از dependencies حذف کنید:

```bash
# در apps/frontend/package.json و apps/backend/package.json
# خط "@ftsmotors/shared": "file:../../packages/shared" را کامنت کنید
```

یا از import مستقیم استفاده کنید:

```typescript
// به جای
import { User } from '@ftsmotors/shared';

// استفاده کنید
import { User } from '../../packages/shared/src/types';
```

