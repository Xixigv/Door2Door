
# Instrucciones para ejecutar las pruebas E2E (Playwright)

Requisitos previos:
- Desde la raíz del proyecto:
  - npm install --save-dev @playwright/test
  - npx playwright install
- (Opcional) Ajustar BASE_URL: exportar variable de entorno BASE_URL o editar playwright.config.js.

Comandos disponibles:
- npm run test:e2e
  - Ejecutar todas las pruebas
- npm run test:e2e:ui
  - Ejecutar con interfaz gráfica (modo headed / depuración)
- npm run test:e2e:report
  - Ver reporte de la última ejecución (HTML)
- npm run test:e2e:debug
  - Modo debug paso a paso (PWDEBUG)

Comandos útiles adicionales:
- Ejecutar un spec concreto:
  - npx playwright test tests/e2e/login.spec.js
- Ejecutar en modo no headless (debug):
  - set PWDEBUG=1 & npx playwright test
- Mostrar reporte generado:
  - npx playwright show-report

Notas:
- Asegúrate de que el servidor de la aplicación está corriendo (ej. npm start) y BASE_URL apunta a él.
- Ajusta selectores / credenciales en tests bajo tests/e2e/helpers/ y en los archivos .spec.js según la aplicación.
- Para acelerar tests, considera guardar el storage state tras login y reutilizarlo en playwright.config.js.
```// filepath: c:\Users\r0609\OneDrive\Documents\Documents\7mo Semestre\Diseño de Sistemas Escalables\Proyecto\Door2Door\tests\e2e\TESTS.md
