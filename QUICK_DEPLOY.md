# ByteGuard - Quick Deployment Guide

## 🚀 Deploy to Vercel (Recommended - 5 minutes)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

- Elige tu método de login (GitHub, GitLab, Bitbucket, o Email)
- Sigue las instrucciones en el navegador

### Step 3: Deploy

```bash
cd /Users/aydenCR/byteguard
vercel --prod
```

### Step 4: Configure Environment Variables

Después del deploy, ve a tu dashboard de Vercel:

1. Selecciona tu proyecto "byteguard"
2. Ve a Settings → Environment Variables
3. Agrega:
   - `NEXT_PUBLIC_SUPABASE_URL` = tu_supabase_url
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = tu_supabase_key

### Step 5: Redeploy (para aplicar variables)

```bash
vercel --prod
```

**¡Listo!** Tu app estará en: `https://byteguard.vercel.app` (o tu dominio custom)

---

## 🌐 Deploy to Netlify (Alternative)

### Step 1: Install Netlify CLI

```bash
npm install -g netlify-cli
```

### Step 2: Login

```bash
netlify login
```

### Step 3: Build & Deploy

```bash
npm run build
netlify deploy --prod
```

### Step 4: Configure Environment Variables

En Netlify Dashboard:

1. Site settings → Environment variables
2. Agrega las mismas variables de Supabase

---

## 📱 Microsoft Store Submission

### Después del Deploy a Producción

1. **Ve a PWABuilder.com**
   - URL: <https://www.pwabuilder.com/>
   - Ingresa tu URL de producción (ej: <https://byteguard.vercel.app>)
   - Click "Start"

2. **Analiza tu PWA**
   - Debería mostrar score alto (manifest + service worker detectados)
   - Click "Package for Stores"

3. **Genera Package para Windows**
   - Selecciona "Windows" platform
   - Click "Generate Package"
   - Descarga el `.msixbundle`

4. **Sube a Microsoft Store**
   - Ve a: <https://partner.microsoft.com/dashboard>
   - Create new app
   - Sube el package
   - Completa store listing con screenshots
   - Submit for review

**Review time**: 24-48 horas típicamente

---

## ✅ Checklist Pre-Deploy

- [x] Build exitoso (`npm run build`)
- [x] 0 errores
- [x] Security headers configurados
- [x] PWA manifest listo
- [x] Service worker implementado
- [x] Screenshots capturados
- [x] Legal docs accesibles
- [ ] Variables de entorno configuradas (hazlo después del deploy)

---

## 🎯 URLs Importantes

Después del deploy, tendrás:

- **Production**: <https://byteguard.vercel.app> (o tu dominio)
- **Dashboard**: <https://vercel.com/dashboard>
- **Analytics**: Incluido en Vercel
- **Logs**: Vercel Dashboard → Deployments → View Function Logs

---

## 🔧 Troubleshooting

### Error: "Vercel not found"

```bash
npm install -g vercel
```

### Error: "Build failed"

- Verifica que `npm run build` funcione localmente primero
- Revisa logs en Vercel dashboard

### Error: "Environment variables not working"

- Asegúrate de que empiecen con `NEXT_PUBLIC_`
- Redeploy después de agregar variables

---

## 📞 Soporte

- Vercel Docs: <https://vercel.com/docs>
- Next.js Deployment: <https://nextjs.org/docs/deployment>
- PWABuilder: <https://docs.pwabuilder.com/>

**¡Buena suerte con el launch!** 🚀
