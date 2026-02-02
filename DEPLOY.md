# Despliegue en GitHub Pages

## Configuración en GitHub

1. **Habilita GitHub Pages** en el repositorio:
   - Ve a **Settings** → **Pages**
   - En **Build and deployment** → **Source** elige **GitHub Actions**

2. **Sube los cambios** y haz push a la rama `main` o `baseSPA`. El workflow se ejecutará y desplegará automáticamente.

3. La app quedará publicada en:
   ```
   https://<tu-usuario>.github.io/hidroponia/
   ```

## Build local (opcional)

Para generar la carpeta estática localmente (por ejemplo para probar):

```bash
npm run build:gh-pages
```

La salida estará en `dist/hidroponia/browser`.

## Nota

Si el nombre del repositorio no es `hidroponia`, cambia el `--base-href` en:
- **package.json**: script `build:gh-pages`
- **.github/workflows/deploy-gh-pages.yml**: el workflow usa `${{ github.event.repository.name }}` y ya se adapta al nombre del repo.
