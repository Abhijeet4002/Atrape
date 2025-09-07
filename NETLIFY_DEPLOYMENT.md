# Netlify Deployment Guide for Atrape

This guide will help you deploy the Atrape project to Netlify with full functionality.

## Overview

The project has been configured for Netlify deployment with:
- **Frontend**: React SPA deployed as static files
- **Backend**: Express API routes converted to Netlify Functions
- **Routing**: Proper SPA routing with fallback to index.html
- **API**: All `/api/*` routes handled by serverless functions

## Quick Deployment Steps

### Option 1: Direct Git Integration (Recommended)

1. **Push your code to GitHub** (if not already done)

2. **Connect to Netlify:**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub account
   - Select the `Atrape` repository

3. **Configure Build Settings:**
   - **Build command**: `npm run build:client`
   - **Publish directory**: `dist/spa`
   - **Functions directory**: `netlify/functions`

4. **Deploy:**
   - Click "Deploy site"
   - Netlify will automatically build and deploy your site

### Option 2: Manual Deploy

1. **Build the project locally:**
   ```bash
   npm install
   npm run build:client
   ```

2. **Deploy to Netlify:**
   - Go to [Netlify](https://netlify.com)
   - Drag and drop the `dist/spa` folder to deploy
   - Manually upload functions if needed

## Configuration Files

The following files have been configured for Netlify deployment:

### `netlify.toml`
- Configures build settings
- Sets up API route redirects to Netlify Functions
- Enables SPA routing with fallback to `index.html`

### `vite.config.ts`
- Base path updated from `/Atrape/` to `/` for Netlify
- Optimized for static site generation

## Netlify Functions

The backend Express routes have been converted to Netlify Functions:

- **`/api/ping`** → `netlify/functions/ping.ts`
- **`/api/demo`** → `netlify/functions/demo.ts`
- **`/api/items`** → `netlify/functions/items.ts`
- **`/api/auth/*`** → `netlify/functions/auth.ts`
- **`/api/cart/*`** → `netlify/functions/cart.ts`

### Function Features

- **CORS enabled** for all functions
- **Mock authentication** system for demo purposes
- **Static product data** for showcase
- **In-memory cart** functionality (resets on function restart)

## Environment Variables

If you need to set environment variables:

1. Go to your Netlify site dashboard
2. Navigate to "Site settings" → "Environment variables"
3. Add any required variables (e.g., `PING_MESSAGE`)

## Domain Configuration

After deployment:
- Netlify provides a random subdomain (e.g., `amazing-app-123456.netlify.app`)
- You can customize the subdomain in site settings
- Add a custom domain if desired

## Testing the Deployment

Once deployed, test these endpoints:
- `https://your-site.netlify.app/` - Main app
- `https://your-site.netlify.app/api/ping` - API health check
- `https://your-site.netlify.app/api/items` - Product list
- `https://your-site.netlify.app/products` - Products page
- `https://your-site.netlify.app/login` - Login page

## Troubleshooting

### Common Issues

1. **Functions not working:**
   - Check that `@netlify/functions` is installed
   - Verify function files are in `netlify/functions/`
   - Check Netlify function logs in the dashboard

2. **SPA routing issues:**
   - Ensure `netlify.toml` has the correct redirect rules
   - Check that the publish directory is `dist/spa`

3. **API calls failing:**
   - Verify API routes in `netlify.toml`
   - Check CORS configuration in functions
   - Inspect network tab in browser dev tools

### Build Errors

If the build fails:
1. Check Node.js version (should be 18+)
2. Ensure all dependencies are installed
3. Check the build logs in Netlify dashboard

## Limitations of Current Setup

Due to the conversion to Netlify Functions, some limitations apply:

1. **Data persistence**: Cart and user data is stored in memory and will reset
2. **Authentication**: Uses mock JWT tokens for demo purposes
3. **File uploads**: Not configured (would need additional setup)

## Next Steps for Production

For a production deployment, consider:

1. **Database integration**: Use Netlify's database add-ons or external services
2. **Real authentication**: Implement proper JWT with secure secret management
3. **Payment processing**: Add Stripe or similar payment integration
4. **Admin functionality**: Secure admin routes and data management

## Support

If you encounter issues:
1. Check Netlify's deployment logs
2. Review the function logs in Netlify dashboard
3. Test locally with `npm run dev` first
4. Refer to [Netlify Functions documentation](https://docs.netlify.com/functions/overview/)