# Deployment Guide

## Quick Start

Your Next.js app is ready to deploy! Here's everything you need to know.

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Test production build locally
npm start
```

Visit: http://localhost:3000

## GitHub Pages Deployment (Automatic)

### Setup (One-time)

1. **Enable GitHub Pages**:
   - Go to: Repository Settings → Pages
   - Source: GitHub Actions
   - Save

2. **Push to GitHub**:
```bash
git add .
git commit -m "Migrate to Next.js with comprehensive SEO"
git push origin main
```

3. **Automatic Deployment**:
   - GitHub Actions will automatically build and deploy
   - Check progress: Actions tab in GitHub
   - Live URL: https://rishikeshhedaoo.github.io

### Deployment Status

Check deployment status at:
```
https://github.com/rishikeshhedaoo/rishikeshhedaoo.github.io/actions
```

## Manual Deployment

If you prefer manual deployment:

```bash
# 1. Build the static site
npm run build

# 2. The 'out' directory contains your static site
# 3. Deploy 'out' directory to any static hosting service
```

## Alternative Hosting Options

### Vercel (Recommended for Next.js)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

Benefits:
- Zero configuration
- Automatic HTTPS
- Global CDN
- Analytics included
- Best Next.js performance

### Netlify

1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `out`
4. Deploy!

### Cloudflare Pages

1. Connect GitHub repository
2. Framework preset: Next.js (Static HTML Export)
3. Build command: `npm run build`
4. Build output directory: `out`
5. Deploy!

## Environment Variables

If you need environment variables:

### Development (`.env.local`)
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Production
Add in your hosting platform:
- GitHub: Settings → Secrets and variables → Actions
- Vercel: Project Settings → Environment Variables
- Netlify: Site Settings → Environment Variables

## Custom Domain

### For GitHub Pages

1. **Add CNAME file**:
```bash
echo "yourdomain.com" > public/CNAME
```

2. **Update DNS** (at your domain registrar):
```
Type: A
Name: @
Value: 185.199.108.153
Value: 185.199.109.153
Value: 185.199.110.153
Value: 185.199.111.153

Type: CNAME
Name: www
Value: rishikeshhedaoo.github.io
```

3. **Update metadata** in all files:
   - `app/layout.tsx`
   - `app/sitemap.ts`
   - `components/StructuredData.tsx`

Replace `rishikeshhedaoo.github.io` with your domain.

### For Vercel/Netlify
1. Add domain in dashboard
2. Update DNS as instructed
3. SSL is automatic

## Post-Deployment Checklist

### Immediate
- [ ] Site loads at correct URL
- [ ] All links work
- [ ] Images/assets load properly
- [ ] No console errors
- [ ] Mobile responsive

### SEO (Within 24 hours)
- [ ] Submit sitemap to Google Search Console
- [ ] Verify ownership in Google Search Console
- [ ] Test Open Graph with Facebook Debugger
- [ ] Test Twitter Card
- [ ] Run Lighthouse audit (aim for 90+ SEO score)

### Performance
- [ ] Page loads in < 3 seconds
- [ ] Core Web Vitals pass
- [ ] Images optimized
- [ ] No render-blocking resources

## Monitoring & Analytics

### Add Google Analytics 4

1. **Get tracking ID** from Google Analytics

2. **Create component** (`components/Analytics.tsx`):
```typescript
import Script from 'next/script'

export default function Analytics() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-XXXXXXXXXX');
        `}
      </Script>
    </>
  )
}
```

3. **Add to layout** (`app/layout.tsx`):
```typescript
import Analytics from '@/components/Analytics'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### Alternative Analytics

- **Plausible**: Privacy-friendly, lightweight
- **Fathom**: Simple, privacy-focused
- **Umami**: Self-hosted, open-source
- **Vercel Analytics**: Built-in (if using Vercel)

## Troubleshooting

### Issue: 404 on refresh
**Solution**: Already configured with `output: 'export'` in next.config.js

### Issue: Images not loading
**Solution**: Use Next.js Image component or ensure images are in `/public/`

### Issue: Slow initial load
**Solution**: 
- Check bundle size: `npm run build`
- Use dynamic imports for heavy components
- Already implemented for Three.js!

### Issue: GitHub Pages 404
**Solution**: 
- Ensure `.nojekyll` file exists (✓ Already created)
- Check GitHub Pages is enabled in settings
- Wait 5-10 minutes for first deployment

### Issue: Metadata not showing
**Solution**:
- Clear social media cache
- Test with tools mentioned in SEO-METADATA-GUIDE.md
- Wait 24-48 hours for crawlers

## Updating Content

### Update homepage text
Edit: `components/CenterText.tsx`

### Update navigation
Edit: `components/Navigation.tsx`

### Update metadata
Edit: `app/layout.tsx`

### Add new pages
1. Create: `app/newpage/page.tsx`
2. Add metadata in that file
3. Update sitemap: `app/sitemap.ts`

## Performance Tips

### Already Optimized
- ✅ Static export (fastest possible)
- ✅ Code splitting
- ✅ Dynamic imports
- ✅ Minimal dependencies
- ✅ Optimized Three.js rendering

### Further Optimizations
- Add images with Next.js Image component
- Implement service worker for offline support
- Add prefetching for navigation links
- Compress assets with Brotli

## Security

### Headers (add to `next.config.js`)
```javascript
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
      ],
    },
  ]
}
```

## Rollback

If you need to revert to the old version:

```bash
# Restore old HTML file
mv index.html.old index.html

# Or use git
git checkout HEAD~1 index.html
```

## Support

### Resources
- Next.js Docs: https://nextjs.org/docs
- Three.js Docs: https://threejs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs

### Common Commands
```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules
rm -rf node_modules && npm install

# Update dependencies
npm update

# Check for outdated packages
npm outdated
```

## Success Metrics

Track these after deployment:

### Technical
- Lighthouse Score: > 90 (all categories)
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Cumulative Layout Shift: < 0.1

### SEO
- Google Search Console impressions growing
- Pages indexed: All pages
- Mobile usability: No issues
- Core Web Vitals: All "Good"

### Business
- Increased organic traffic
- Lower bounce rate
- Higher engagement time
- More social shares

---

**🎉 Congratulations!** Your site is now powered by Next.js with world-class SEO.

**Need help?** Check the documentation or create an issue on GitHub.
