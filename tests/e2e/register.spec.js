const { test, expect } = require('@playwright/test');

test.describe('Register - Registro de usuarios', () => {

  // Helper para generar email único
  function generateUniqueEmail() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `test.user.${timestamp}.${random}@testmail.com`;
  }

  test('registro exitoso con todos los campos válidos', async ({ page }) => {
    test.setTimeout(120000);

    await page.goto('/register');
    await page.waitForLoadState('networkidle');

    const uniqueEmail = generateUniqueEmail();

    // Llenar formulario
    await page.fill('#firstName', 'Test');
    await page.fill('#lastName', 'User');
    await page.fill('#phoneNumber', '555-123-4567');
    await page.fill('#email', uniqueEmail);
    await page.fill('#location', '123 Test Street, Test City');
    await page.fill('#password', 'TestPass123!');
    await page.fill('#confirmPassword', 'TestPass123!');

    // Enviar formulario
    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();

    // Esperar mensaje de éxito
    await page.waitForSelector('.alert-message.success', { timeout: 10000 });
    
    const successMessage = page.locator('.alert-message.success');
    await expect(successMessage).toBeVisible();
    await expect(successMessage).toContainText('successfully');

    // Verificar redirección a login
    await page.waitForURL('**/login', { timeout: 5000 });
    expect(page.url()).toContain('/login');
  });

  test('contraseñas no coinciden muestra error', async ({ page }) => {
    await page.goto('/register');
    await page.waitForLoadState('networkidle');

    await page.fill('#firstName', 'Test');
    await page.fill('#lastName', 'User');
    await page.fill('#phoneNumber', '555-123-4567');
    await page.fill('#email', generateUniqueEmail());
    await page.fill('#location', '123 Test Street');
    await page.fill('#password', 'TestPass123!');
    await page.fill('#confirmPassword', 'DifferentPass123!');

    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();

    // Verificar mensaje de error
    await page.waitForSelector('.alert-message.error', { timeout: 5000 });
    
    const errorMessage = page.locator('.alert-message.error');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText(/password.*match/i);

    // Verificar que NO redirige
    expect(page.url()).toContain('/register');
  });

  test('email inválido muestra error', async ({ page }) => {
    await page.goto('/register');
    await page.waitForLoadState('networkidle');

    await page.fill('#firstName', 'Test');
    await page.fill('#lastName', 'User');
    await page.fill('#phoneNumber', '555-123-4567');
    await page.fill('#email', 'esto-no-es-un-email');
    await page.fill('#location', '123 Test Street');
    await page.fill('#password', 'TestPass123!');
    await page.fill('#confirmPassword', 'TestPass123!');

    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();

    // Verificar mensaje de error
    const errorMessage = page.locator('.alert-message.error');
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
    await expect(errorMessage).toContainText(/email/i);
  });

  test('contraseña corta muestra error', async ({ page }) => {
    await page.goto('/register');
    await page.waitForLoadState('networkidle');

    await page.fill('#firstName', 'Test');
    await page.fill('#lastName', 'User');
    await page.fill('#phoneNumber', '555-123-4567');
    await page.fill('#email', generateUniqueEmail());
    await page.fill('#location', '123 Test Street');
    await page.fill('#password', '123');
    await page.fill('#confirmPassword', '123');

    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();

    // Verificar mensaje de error
    const errorMessage = page.locator('.alert-message.error');
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
    await expect(errorMessage).toContainText(/6 characters/i);
  });

  test('campos vacíos muestran error', async ({ page }) => {
    await page.goto('/register');
    await page.waitForLoadState('networkidle');

    // Intentar enviar sin llenar nada
    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();

    // Verificar mensaje de error
    const errorMessage = page.locator('.alert-message.error');
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
    await expect(errorMessage).toContainText(/fill.*all fields/i);
  });

  test('campos parciales muestran error', async ({ page }) => {
    await page.goto('/register');
    await page.waitForLoadState('networkidle');

    // Llenar solo algunos campos
    await page.fill('#firstName', 'Test');
    await page.fill('#lastName', 'User');
    // Dejar los demás vacíos

    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();

    // Verificar mensaje de error
    const errorMessage = page.locator('.alert-message.error');
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
    await expect(errorMessage).toContainText(/fill.*all fields/i);
  });

  test('email duplicado muestra error', async ({ page }) => {
    test.setTimeout(120000);

    // Primero crear un usuario
    await page.goto('/register');
    await page.waitForLoadState('networkidle');

    const duplicateEmail = generateUniqueEmail();

    await page.fill('#firstName', 'First');
    await page.fill('#lastName', 'User');
    await page.fill('#phoneNumber', '555-111-1111');
    await page.fill('#email', duplicateEmail);
    await page.fill('#location', '123 First Street');
    await page.fill('#password', 'TestPass123!');
    await page.fill('#confirmPassword', 'TestPass123!');

    await page.locator('button[type="submit"]').click();
    await page.waitForURL('**/login', { timeout: 10000 });

    // Intentar crear otro usuario con el mismo email
    await page.goto('/register');
    await page.waitForLoadState('networkidle');

    await page.fill('#firstName', 'Second');
    await page.fill('#lastName', 'User');
    await page.fill('#phoneNumber', '555-222-2222');
    await page.fill('#email', duplicateEmail);
    await page.fill('#location', '456 Second Street');
    await page.fill('#password', 'TestPass123!');
    await page.fill('#confirmPassword', 'TestPass123!');

    await page.locator('button[type="submit"]').click();

    // Verificar error
    const errorMessage = page.locator('.alert-message.error');
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
    
    // No debe redirigir
    expect(page.url()).toContain('/register');
  });

  test('formato de teléfono válido acepta varios formatos', async ({ page }) => {
    await page.goto('/register');
    await page.waitForLoadState('networkidle');

    const phoneFormats = [
      '555-123-4567',
      '5551234567',
      '(555) 123-4567',
      '+1 555 123 4567'
    ];

    for (const phone of phoneFormats) {
      await page.fill('#firstName', 'Test');
      await page.fill('#lastName', 'User');
      await page.fill('#phoneNumber', phone);
      await page.fill('#email', generateUniqueEmail());
      await page.fill('#location', '123 Test Street');
      await page.fill('#password', 'TestPass123!');
      await page.fill('#confirmPassword', 'TestPass123!');

      const submitBtn = page.locator('button[type="submit"]');
      await submitBtn.click();

      // Verificar que no hay error de teléfono
      await page.waitForTimeout(1000);
      
      // Si muestra error, no debe ser por el teléfono
      const errorMessage = page.locator('.alert-message.error');
      const isVisible = await errorMessage.isVisible().catch(() => false);
      
      if (isVisible) {
        const errorText = await errorMessage.textContent();
        expect(errorText.toLowerCase()).not.toContain('phone');
      }

      // Recargar para probar el siguiente formato
      if (phoneFormats.indexOf(phone) < phoneFormats.length - 1) {
        await page.goto('/register');
        await page.waitForLoadState('networkidle');
      }
    }
  });

  test('mensaje de éxito se muestra y auto-desaparece', async ({ page }) => {
    test.setTimeout(120000);

    await page.goto('/register');
    await page.waitForLoadState('networkidle');

    await page.fill('#firstName', 'Test');
    await page.fill('#lastName', 'User');
    await page.fill('#phoneNumber', '555-123-4567');
    await page.fill('#email', generateUniqueEmail());
    await page.fill('#location', '123 Test Street');
    await page.fill('#password', 'TestPass123!');
    await page.fill('#confirmPassword', 'TestPass123!');

    await page.locator('button[type="submit"]').click();

    // Verificar que aparece
    const successMessage = page.locator('.alert-message.success');
    await expect(successMessage).toBeVisible({ timeout: 5000 });

    // Esperar redirección (debería ocurrir en ~2 segundos)
    await page.waitForURL('**/login', { timeout: 5000 });
  });

  test('botón se deshabilita durante envío', async ({ page }) => {
    await page.goto('/register');
    await page.waitForLoadState('networkidle');

    await page.fill('#firstName', 'Test');
    await page.fill('#lastName', 'User');
    await page.fill('#phoneNumber', '555-123-4567');
    await page.fill('#email', generateUniqueEmail());
    await page.fill('#location', '123 Test Street');
    await page.fill('#password', 'TestPass123!');
    await page.fill('#confirmPassword', 'TestPass123!');

    const submitBtn = page.locator('button[type="submit"]');
    
    // Verificar texto inicial
    await expect(submitBtn).toContainText(/create account/i);

    // Click
    await submitBtn.click();

    // Verificar que cambia durante el envío
    await page.waitForTimeout(200);
    await expect(submitBtn).toBeDisabled();
    
    const buttonText = await submitBtn.textContent();
    expect(buttonText.toLowerCase()).toContain('creating');
  });

  test('formulario se limpia después de registro exitoso', async ({ page }) => {
    test.setTimeout(120000);

    await page.goto('/register');
    await page.waitForLoadState('networkidle');

    await page.fill('#firstName', 'Test');
    await page.fill('#lastName', 'User');
    await page.fill('#phoneNumber', '555-123-4567');
    await page.fill('#email', generateUniqueEmail());
    await page.fill('#location', '123 Test Street');
    await page.fill('#password', 'TestPass123!');
    await page.fill('#confirmPassword', 'TestPass123!');

    await page.locator('button[type="submit"]').click();

    // Esperar un momento antes de la redirección para verificar que se limpió
    await page.waitForTimeout(500);

    // Verificar que los campos están vacíos (antes de redirigir)
    const firstName = page.locator('#firstName');
    const email = page.locator('#email');
    
    const firstNameValue = await firstName.inputValue();
    const emailValue = await email.inputValue();
    
    expect(firstNameValue).toBe('');
    expect(emailValue).toBe('');
  });
});