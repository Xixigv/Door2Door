const { test, expect } = require('@playwright/test');

test.describe('Booking - Flujo básico', () => {

  test('flujo completo de booking hasta payment', async ({ page }) => {
    test.setTimeout(120000);

    // Login
    await page.goto('/login');
    await page.fill('input[name="email"]', 'mike.johnson@aurora.com');
    await page.fill('input[name="password"]', 'Plumber2024!');
    await page.click('button:has-text("Sign In")');
    await page.waitForURL('**/userProfile');

    // Ir a home
    await page.goto('/home');
    await page.waitForLoadState('networkidle');

    // Click en "Find Services Now"
    await page.click('button:has-text("Find Services Now")');
    await page.waitForLoadState('networkidle');

    // Click en "View Details"
    await page.click('button:has-text("View Details")');
    await page.waitForLoadState('networkidle');

    // Click en "Schedule Service"
    await page.click('button:has-text("Schedule Service")');
    await page.waitForURL('**/booking');
    await page.waitForLoadState('networkidle');

    // Esperar a que cargue la página de booking
    await page.waitForSelector('text=Schedule Your Service', { timeout: 20000 });
    await page.waitForSelector('.calendar-day:not(.disabled)', { timeout: 20000 });

    // Seleccionar fecha
    const firstDay = page.locator('.calendar-day:not(.disabled)').first();
    await firstDay.click();
    await page.waitForTimeout(1000);

    // Seleccionar tipo de servicio
    const firstType = page.locator('input[name="serviceType"]').first();
    await firstType.check();
    await page.waitForTimeout(1000);

    // Seleccionar hora disponible (sin opacity-40 en la clase)
    const allSlots = page.locator('button:has-text("AM"), button:has-text("PM")');
    const slotsCount = await allSlots.count();
    
    let clickedSlot = false;
    for (let i = 0; i < slotsCount; i++) {
      const slot = allSlots.nth(i);
      const className = await slot.getAttribute('class');
      const isDisabled = await slot.isDisabled();
      
      // Verificar que NO tenga opacity-40 en la clase y NO esté disabled
      if (!className.includes('opacity-40') && !isDisabled) {
        await slot.click();
        clickedSlot = true;
        break;
      }
    }
    
    if (!clickedSlot) {
      throw new Error('No hay time slots disponibles para reservar');
    }
    
    await page.waitForTimeout(1000);

    // Confirmar booking
    const confirmBtn = page.locator('button:has-text("Confirm Booking")');
    await confirmBtn.click();

    // Verificar que llegamos a payment
    await page.waitForURL('**/payment', { timeout: 15000 });
    expect(page.url()).toContain('/payment');
  });

});

test.describe('Booking - Validación de campos obligatorios', () => {

  test('no debe permitir confirmar booking sin seleccionar hora', async ({ page }) => {
    test.setTimeout(120000);

    // Login
    await page.goto('/login');
    await page.fill('input[name="email"]', 'mike.johnson@aurora.com');
    await page.fill('input[name="password"]', 'Plumber2024!');
    await page.click('button:has-text("Sign In")');
    await page.waitForURL('**/userProfile');

    // Ir a home
    await page.goto('/home');
    await page.waitForLoadState('networkidle');

    // Ir a servicios → view details → booking
    await page.click('button:has-text("Find Services Now")');
    await page.waitForLoadState('networkidle');

    await page.click('button:has-text("View Details")');
    await page.waitForLoadState('networkidle');

    await page.click('button:has-text("Schedule Service")');
    await page.waitForURL('**/booking');

    // Esperar carga booking
    await page.waitForSelector('text=Schedule Your Service');
    await page.waitForSelector('.calendar-day:not(.disabled)');

    //
    // Seleccionar solo FECHA
    //
    await page.locator('.calendar-day:not(.disabled)').first().click();

    //
    // Seleccionar solo SERVICE TYPE
    //
    const firstType = page.locator('input[name="serviceType"]').first();
    await firstType.check();

    //
    // NO seleccionar hora
    // Pero verificar que las horas ocupadas NO se puedan clickear
    //
    const blockedSlot = page.locator('button.opacity-40').first();
    await expect(blockedSlot).toBeDisabled();

    //
    // Verificar que CONFIRM BOOKING NO se activa
    //
    const confirmBtn = page.locator('button:has-text("Confirm Booking")');
    await expect(confirmBtn).toBeDisabled();
  });
});

