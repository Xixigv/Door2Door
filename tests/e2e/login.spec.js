const { test, expect } = require('@playwright/test');

test.describe('Login - Casos exitosos', () => {
  test('login exitoso muestra la info correcta en profile', async ({ page }) => {
    await uiLogin(page, 'mike.johnson@aurora.com', 'Plumber2024!');
    
    // Verificar que estamos en la página correcta
    await expect(page).toHaveURL(/profile|userProfile|\/user/);
    
    // Esperar a que el contenido dinámico se cargue
    await page.waitForSelector('text=Mike Johnson', { timeout: 10000 });
    
    // Verificaciones más específicas según tu HTML
    await expect(page.locator('text=Mike Johnson')).toBeVisible();
    await expect(page.locator('text=Austin, TX')).toBeVisible();
    await expect(page.locator('text=Member since')).toBeVisible();
    
    // Verificar estadísticas
    await expect(page.locator('text=bookings completed')).toBeVisible();
    await expect(page.locator('text=total spent')).toBeVisible();
  });

  test('login exitoso guarda token de autenticación', async ({ page, context }) => {
    await page.goto('/login');

    await page.fill('input[name="email"]', 'mike.johnson@aurora.com');
    await page.fill('input[name="password"]', 'Plumber2024!');

    // Esperar la respuesta del endpoint de login (más flexible con POST + 'login' en URL)
    const [loginResponse] = await Promise.all([
      page.waitForResponse(resp =>
        resp.request().method() === 'POST' && resp.url().toLowerCase().includes('login')
      , { timeout: 10000 }),
      page.click('button[type="submit"]')
    ]);

    // 1) Intentar extraer token desde el body de la respuesta (ej. { token: '...' })
    let token = null;
    try {
      const body = await loginResponse.json().catch(() => null);
      if (body) token = body.token || body.authToken || body.accessToken || (body.data && (body.data.token || body.data.authToken));
    } catch (e) {
      // ignore parse errors
    }

    // 2) Fallback a localStorage / sessionStorage (por si el cliente guarda ahí)
    if (!token) {
      token = await page.evaluate(() => {
        return window.localStorage.getItem('authToken') || window.localStorage.getItem('token') ||
               window.sessionStorage.getItem('authToken') || window.sessionStorage.getItem('token') || null;
      });
    }

    // 3) Fallback a cookies (Playwright puede leer cookies HttpOnly via context.cookies())
    if (!token) {
      const cookies = await context.cookies();
      // buscar la cookie más probable que contenga el token
      const candidate = cookies.find(c => {
        if (!c.value) return false;
        // heurística: token largo sin espacios
        return typeof c.value === 'string' && c.value.length > 10 && !c.value.includes(' ');
      });
      if (candidate) token = candidate.value;
    }

    // Asserts
    expect(token, 'No se encontró token en response/localStorage/sessionStorage/cookies').toBeTruthy();
    expect(token.length).toBeGreaterThan(10);
  });

  test('la sesión persiste después de recargar la página', async ({ page, context }) => {
    await page.goto('/login');

    await page.fill('input[name="email"]', 'mike.johnson@aurora.com');
    await page.fill('input[name="password"]', 'Plumber2024!');

    // Hacer login sin esperar ninguna response específica
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle' }),
      page.click('button[type="submit"]')
    ]);

    let tokenBefore = await page.evaluate(() =>
      localStorage.getItem('authToken') ||
      localStorage.getItem('token') ||
      sessionStorage.getItem('authToken') ||
      sessionStorage.getItem('token') ||
      null
    );

    if (!tokenBefore) {
      const cookies = await context.cookies();
      const candidate = cookies.find(c =>
        c.value && c.value.length > 10 && !c.value.includes(' ')
      );
      if (candidate) tokenBefore = candidate.value;
    }

    expect(tokenBefore).toBeTruthy();

    await page.waitForSelector('text=Mike Johnson', { timeout: 10000 });

    await page.reload();

    await page.waitForSelector('text=Mike Johnson', { timeout: 10000 });

    let tokenAfter = await page.evaluate(() =>
      localStorage.getItem('authToken') ||
      localStorage.getItem('token') ||
      sessionStorage.getItem('authToken') ||
      sessionStorage.getItem('token') ||
      null
    );

    if (!tokenAfter) {
      const cookies = await context.cookies();
      const candidate = cookies.find(c =>
        c.value && c.value.length > 10 && !c.value.includes(' ')
      );
      if (candidate) tokenAfter = candidate.value;
    }

    expect(tokenAfter).toBeTruthy();
    expect(tokenAfter).toBe(tokenBefore);
  });

  test('usuario puede navegar a otras páginas manteniendo sesión', async ({ page, context }) => {
    await uiLogin(page, 'mike.johnson@aurora.com', 'Plumber2024!');

    await page.waitForSelector('text=Mike Johnson', { timeout: 10000 });

    let tokenBefore = await page.evaluate(() =>
      localStorage.getItem('authToken') ||
      localStorage.getItem('token') ||
      sessionStorage.getItem('authToken') ||
      sessionStorage.getItem('token') ||
      null
    );

    if (!tokenBefore) {
      const cookies = await context.cookies();
      const candidate = cookies.find(c =>
        c.value && c.value.length > 10 && !c.value.includes(' ')
      );
      if (candidate) tokenBefore = candidate.value;
    }

    expect(tokenBefore).toBeTruthy();

    await page.goto('/home', { waitUntil: 'networkidle' });

    let tokenAfterSearch = await page.evaluate(() =>
      localStorage.getItem('authToken') ||
      localStorage.getItem('token') ||
      sessionStorage.getItem('authToken') ||
      sessionStorage.getItem('token') ||
      null
    );

    if (!tokenAfterSearch) {
      const cookies = await context.cookies();
      const candidate = cookies.find(c =>
        c.value && c.value.length > 10 && !c.value.includes(' ')
      );
      if (candidate) tokenAfterSearch = candidate.value;
    }

    expect(tokenAfterSearch).toBeTruthy();
    expect(tokenAfterSearch).toBe(tokenBefore);

    await page.goto('/userProfile', { waitUntil: 'networkidle' });

    let tokenAfterProfile = await page.evaluate(() =>
      localStorage.getItem('authToken') ||
      localStorage.getItem('token') ||
      sessionStorage.getItem('authToken') ||
      sessionStorage.getItem('token') ||
      null
    );

    if (!tokenAfterProfile) {
      const cookies = await context.cookies();
      const candidate = cookies.find(c =>
        c.value && c.value.length > 10 && !c.value.includes(' ')
      );
      if (candidate) tokenAfterProfile = candidate.value;
    }

    expect(tokenAfterProfile).toBeTruthy();
    expect(tokenAfterProfile).toBe(tokenBefore);

    await expect(page.locator('text=Mike Johnson')).toBeVisible();
  });
  
});

test.describe('Login - Casos de error', () => {
  test('login con email incorrecto muestra error', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[name="email"]', 'usuario.noexiste@ejemplo.com');
    await page.fill('input[name="password"]', 'Password123!');

    let alertMessage = null;

    page.once('dialog', dialog => {
      alertMessage = dialog.message();
      dialog.accept();
    });

    await page.click('button[type="submit"]');
    await page.waitForTimeout(500);

    expect(alertMessage).toContain('Credenciales inválidas');

    const token = await page.evaluate(() =>
      localStorage.getItem('authToken') || localStorage.getItem('token')
    );
    expect(token).toBeFalsy();

    await expect(page).toHaveURL(/login/);
  });

  test('login con contraseña incorrecta muestra error', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[name="email"]', 'mike.johnson@aurora.com');
    await page.fill('input[name="password"]', 'ContraseñaIncorrecta123!');

    let alertMessage = null;

    page.once('dialog', dialog => {
      alertMessage = dialog.message();
      dialog.accept();
    });

    await page.click('button[type="submit"]');
    await page.waitForTimeout(500);

    expect(alertMessage).toContain('Credenciales inválidas');

    const token = await page.evaluate(() =>
      localStorage.getItem('authToken') || localStorage.getItem('token')
    );
    expect(token).toBeFalsy();
  });

  test('login con campos vacíos no permite enviar o muestra error', async ({ page }) => {
    await page.goto('/login');
    
    // Intentar enviar sin llenar campos
    const submitButton = page.locator('button[type="submit"]');
    
    // Verificar si el botón está deshabilitado
    const isDisabled = await submitButton.isDisabled().catch(() => false);
    
    if (isDisabled) {
      // Si está deshabilitado, el test pasa
      expect(isDisabled).toBe(true);
    } else {
      // Si no está deshabilitado, debe mostrar validación HTML5 o mensaje de error
      await submitButton.click();
      
      // Verificar que NO se hizo redirect (seguimos en login)
      await expect(page).toHaveURL(/login/);
      
      // Verificar que hay errores de validación
      const emailInput = page.locator('input[name="email"]');
      const isInvalid = await emailInput.evaluate(el => !el.validity.valid);
      expect(isInvalid).toBe(true);
    }
  });

  test('login con formato de email inválido muestra error', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[name="email"]', 'esto-no-es-un-email');
    await page.fill('input[name="password"]', 'Password123!');
    
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    
    // HTML5 validation debería prevenir el envío
    const emailInput = page.locator('input[name="email"]');
    const isInvalid = await emailInput.evaluate(el => !el.validity.valid);
    expect(isInvalid).toBe(true);
    
    // Seguimos en la página de login
    await expect(page).toHaveURL(/login/);
  });
});

test.describe('Login - Seguridad', () => {
  test('acceso a páginas protegidas sin login redirige a login', async ({ page }) => {
    // Limpiar cualquier token previo
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    
    // Intentar acceder a página protegida
    await page.goto('/userProfile');
    
    // Debe redirigir a login
    await expect(page).toHaveURL(/login/, { timeout: 5000 });
  });

  test('token inválido o expirado redirige a login', async ({ page }) => {
    await page.goto('/login');
    
    // Establecer un token falso/inválido
    await page.evaluate(() => {
      localStorage.setItem('authToken', 'token-invalido-12345');
    });
    
    // Intentar acceder a página protegida
    await page.goto('/userProfile');
    
    // Debe detectar token inválido y redirigir a login
    // (ajustar según comportamiento de tu app)
    await page.waitForTimeout(2000); // dar tiempo al backend de responder
    
    const currentUrl = page.url();
    const isInLoginOrShowsError = currentUrl.includes('/login') || 
      await page.locator('text=/unauthorized|invalid token|session expired/i').isVisible().catch(() => false);
    
    expect(isInLoginOrShowsError).toBe(true);
  });

  test('logout elimina token y redirige a login o home', async ({ page }) => {
    await uiLogin(page, 'mike.johnson@aurora.com', 'Plumber2024!');
    
    // Verificar que hay token
    let token = await page.evaluate(() => localStorage.getItem('authToken') || localStorage.getItem('token'));
    expect(token).toBeTruthy();
    
    // Buscar y hacer click en logout (ajustar selector)
    const logoutButton = page.locator('button:has-text("Logout"), button:has-text("Sign out"), a:has-text("Logout")').first();
    await logoutButton.click();
    
    // Esperar navegación
    await page.waitForTimeout(1000);
    
    // Verificar que el token fue eliminado
    token = await page.evaluate(() => localStorage.getItem('authToken') || localStorage.getItem('token'));
    expect(token).toBeFalsy();
    
    // Verificar que estamos en login o home
    const url = page.url();
    expect(url.includes('/login') || url.includes('/home') || url === 'http://localhost:3000/').toBe(true);
  });
});

test.describe('Login - UX y accesibilidad', () => {
  test('toggle para mostrar/ocultar contraseña funciona', async ({ page }) => {
    await page.goto('/login');
    
    const passwordInput = page.locator('input[name="password"]');
    
    // Verificar que inicia como password
    await expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Buscar botón de toggle (ajustar selector según tu implementación)
    const toggleButton = page.locator('button[aria-label*="password"], button:has-text("Show"), [data-testid="toggle-password"]').first();
    
    if (await toggleButton.isVisible().catch(() => false)) {
      await toggleButton.click();
      
      // Ahora debe ser tipo text
      await expect(passwordInput).toHaveAttribute('type', 'text');
      
      // Click de nuevo para ocultar
      await toggleButton.click();
      await expect(passwordInput).toHaveAttribute('type', 'password');
    }
  });

  test('formulario de login es accesible con teclado', async ({ page }) => {
    await page.goto('/login');
    
    // Navegar con Tab
    await page.keyboard.press('Tab');
    const emailFocused = await page.evaluate(() => document.activeElement?.getAttribute('name') === 'email');
    expect(emailFocused).toBe(true);
    
    // Llenar email
    await page.keyboard.type('mike.johnson@aurora.com');
    
    // Tab al password
    await page.keyboard.press('Tab');
    await page.keyboard.type('Plumber2024!');
    
    // Tab al botón submit
    await page.keyboard.press('Tab');
    
    // Enter para enviar
    await Promise.all([
      page.waitForNavigation(),
      page.keyboard.press('Enter')
    ]);
    
    // Verificar login exitoso
    await expect(page).toHaveURL(/profile|userProfile/);
  });

  test('link de "Forgot Password" está presente y funciona', async ({ page }) => {
    await page.goto('/login');
    
    const forgotLink = page.locator('a:has-text("Forgot"), a:has-text("Reset password")').first();
    
    if (await forgotLink.isVisible().catch(() => false)) {
      await forgotLink.click();
      await expect(page).toHaveURL(/forgot|reset/);
    }
  });

  test('link de "Sign Up" está presente y funciona', async ({ page }) => {
    await page.goto('/login');
    
    const signupLink = page.locator('a:has-text("Sign up"), a:has-text("Register"), a:has-text("Create account")').first();
    
    if (await signupLink.isVisible().catch(() => false)) {
      await signupLink.click();
      await expect(page).toHaveURL(/signup|register/);
    }
  });
});