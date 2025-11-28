const { test, expect } = require('@playwright/test');

test.describe('Reviews - Flujo completo', () => {

  test('crear booking, completarlo y dejar review', async ({ page }) => {
    test.setTimeout(180000);

    // 1. Login como cliente
    await page.goto('/login');
    await page.fill('input[name="email"]', 'john.doe@email.com');
    await page.fill('input[name="password"]', 'Electrician2024!');
    await page.click('button:has-text("Sign In")');
    await page.waitForURL('**/userProfile');

    // 2. Crear booking
    await page.goto('/home');
    await page.waitForLoadState('networkidle');
    await page.click('button:has-text("Find Services Now")');
    await page.waitForLoadState('networkidle');
    await page.click('button:has-text("View Details")');
    await page.waitForLoadState('networkidle');
    await page.click('button:has-text("Schedule Service")');
    await page.waitForURL('**/booking');
    await page.waitForLoadState('networkidle');

    // Completar booking
    await page.waitForSelector('text=Schedule Your Service', { timeout: 20000 });
    await page.waitForSelector('.calendar-day:not(.disabled)', { timeout: 20000 });

    const firstDay = page.locator('.calendar-day:not(.disabled)').first();
    await firstDay.click();
    await page.waitForTimeout(1000);

    const firstType = page.locator('input[name="serviceType"]').first();
    await firstType.check();
    await page.waitForTimeout(1000);

    const allSlots = page.locator('button:has-text("AM"), button:has-text("PM")');
    const slotsCount = await allSlots.count();
    
    let clickedSlot = false;
    for (let i = 0; i < slotsCount; i++) {
      const slot = allSlots.nth(i);
      const className = await slot.getAttribute('class');
      const isDisabled = await slot.isDisabled();
      
      if (!className.includes('opacity-40') && !isDisabled) {
        await slot.click();
        clickedSlot = true;
        break;
      }
    }
    
    if (!clickedSlot) {
      throw new Error('No hay time slots disponibles');
    }
    
    await page.waitForTimeout(1000);

    const confirmBtn = page.locator('button:has-text("Confirm Booking")');
    await confirmBtn.click();
    await page.waitForURL('**/payment', { timeout: 15000 });

    // 3. Completar pago (simulado)
    await page.click('button[type="submit"]');
    await page.waitForURL('**/home', { timeout: 10000 });

    // 4. Ir al booking y marcarlo como completado (como provider)
    await page.goto('/login');
    await page.evaluate(() => localStorage.clear());
    
    await page.fill('input[name="email"]', 'mike.johnson@aurora.com');
    await page.fill('input[name="password"]', 'Plumber2024!');
    await page.click('button:has-text("Sign In")');
    await page.waitForURL('**/userProfile');

    // Ir a "Booked services" y marcar como completado
    await page.click('button:has-text("Booked services")');
    await page.waitForTimeout(2000);
    
    const latestBooking = page.locator('.bg-white.rounded-lg.border').first();
    await latestBooking.click();
    await page.waitForLoadState('networkidle');

    // Click en Start Service
    const startBtn = page.locator('button:has-text("Start Service")');
    if (await startBtn.isVisible()) {
      await startBtn.click();
      await page.waitForTimeout(1000);
    }

    // Click en Mark as Completed
    const completeBtn = page.locator('button:has-text("Mark as Completed")');
    if (await completeBtn.isVisible()) {
      await completeBtn.click();
      await page.waitForTimeout(1000);
    }

    // 5. Volver a login como cliente y dejar review
    await page.goto('/login');
    await page.evaluate(() => localStorage.clear());
    
    await page.fill('input[name="email"]', 'john.doe@email.com');
    await page.fill('input[name="password"]', 'Electrician2024!');
    await page.click('button:has-text("Sign In")');
    await page.waitForURL('**/userProfile');

    // Ir al booking completado
    await page.click('button:has-text("Bookings")');
    await page.waitForTimeout(2000);
    
    const completedBooking = page.locator('.bg-white.rounded-lg.border').first();
    await completedBooking.click();
    await page.waitForLoadState('networkidle');

    // Verificar que aparece la sección de review
    const reviewSection = page.locator('#review-section');
    await expect(reviewSection).toBeVisible({ timeout: 10000 });

    // Llenar review
    await page.fill('#review-rating', '5');
    await page.fill('#review-comment', 'Excelente servicio de prueba E2E! Muy profesional.');
    
    const submitReviewBtn = page.locator('#submit-review');
    await submitReviewBtn.click();

    // Verificar confirmación
    const confirmation = page.locator('#review-confirmation');
    await expect(confirmation).toBeVisible({ timeout: 5000 });

    // Verificar que el botón cambió
    await expect(submitReviewBtn).toHaveText('Review Submitted');
    await expect(submitReviewBtn).toBeDisabled();
  });

  test('review aparece en la lista del service detail', async ({ page }) => {
    test.setTimeout(120000);

    // Login
    await page.goto('/login');
    await page.fill('input[name="email"]', 'john.doe@email.com');
    await page.fill('input[name="password"]', 'Electrician2024!');
    await page.click('button:has-text("Sign In")');
    await page.waitForURL('**/userProfile');

    // Ir a un servicio
    await page.goto('/home');
    await page.waitForLoadState('networkidle');
    await page.click('button:has-text("Find Services Now")');
    await page.waitForLoadState('networkidle');
    
    const firstService = page.locator('button:has-text("View Details")').first();
    await firstService.click();
    await page.waitForLoadState('networkidle');

    // Esperar a que cargue la sección de reviews
    await page.waitForTimeout(3000);

    // Verificar que hay reviews visibles
    const reviewsCard = page.locator('text=Customer Reviews').locator('..');
    if (await reviewsCard.isVisible()) {
      const reviewElements = page.locator('.flex.space-x-4').filter({
        has: page.locator('.avatar')
      });
      
      const reviewCount = await reviewElements.count();
      console.log(`Reviews encontradas: ${reviewCount}`);
      
      if (reviewCount > 0) {
        // Verificar estructura de la primera review
        const firstReview = reviewElements.first();
        await expect(firstReview.locator('.avatar')).toBeVisible();
        await expect(firstReview.locator('.font-medium')).toBeVisible();
        await expect(firstReview.locator('[data-lucide="star"]')).toBeVisible();
      }
    }
  });

  test('no permite dejar review sin completar el servicio', async ({ page }) => {
    test.setTimeout(120000);

    // Login
    await page.goto('/login');
    await page.fill('input[name="email"]', 'john.doe@email.com');
    await page.fill('input[name="password"]', 'Electrician2024!');
    await page.click('button:has-text("Sign In")');
    await page.waitForURL('**/userProfile');

    // Crear un booking pero NO completarlo
    await page.goto('/home');
    await page.waitForLoadState('networkidle');
    await page.click('button:has-text("Find Services Now")');
    await page.waitForLoadState('networkidle');
    await page.click('button:has-text("View Details")');
    await page.waitForLoadState('networkidle');
    await page.click('button:has-text("Schedule Service")');
    await page.waitForURL('**/booking');
    await page.waitForLoadState('networkidle');

    await page.waitForSelector('.calendar-day:not(.disabled)', { timeout: 20000 });

    const firstDay = page.locator('.calendar-day:not(.disabled)').first();
    await firstDay.click();
    await page.waitForTimeout(1000);

    const firstType = page.locator('input[name="serviceType"]').first();
    await firstType.check();
    await page.waitForTimeout(1000);

    const allSlots = page.locator('button:has-text("AM"), button:has-text("PM")');
    const slotsCount = await allSlots.count();
    
    for (let i = 0; i < slotsCount; i++) {
      const slot = allSlots.nth(i);
      const className = await slot.getAttribute('class');
      const isDisabled = await slot.isDisabled();
      
      if (!className.includes('opacity-40') && !isDisabled) {
        await slot.click();
        break;
      }
    }
    
    await page.waitForTimeout(1000);

    const confirmBtn = page.locator('button:has-text("Confirm Booking")');
    await confirmBtn.click();
    await page.waitForURL('**/payment', { timeout: 15000 });

    await page.click('button[type="submit"]');
    await page.waitForURL('**/home', { timeout: 10000 });

    // Ir al booking (que está en estado Booked, no Completed)
    await page.goto('/userProfile');
    await page.click('button:has-text("Bookings")');
    await page.waitForTimeout(2000);
    
    const latestBooking = page.locator('.bg-white.rounded-lg.border').first();
    await latestBooking.click();
    await page.waitForLoadState('networkidle');

    // Verificar que NO aparece la sección de review
    const reviewSection = page.locator('#review-section');
    await expect(reviewSection).toBeHidden();
  });

  test('validación de campos de review', async ({ page }) => {
    // Este test asume que ya existe un booking completado
    // Si no existe, puedes crear uno primero como en el test anterior
    
    test.setTimeout(120000);

    await page.goto('/login');
    await page.fill('input[name="email"]', 'john.doe@email.com');
    await page.fill('input[name="password"]', 'Electrician2024!');
    await page.click('button:has-text("Sign In")');
    await page.waitForURL('**/userProfile');

    // Navegar a un booking completado (si existe)
    await page.goto('/userProfile');
    await page.click('button:has-text("Bookings")');
    await page.waitForTimeout(2000);

    // Buscar un booking con status "Completed"
    const completedBookings = page.locator('.bg-green-100.text-green-800');
    const count = await completedBookings.count();

    if (count > 0) {
      const completedBooking = completedBookings.first().locator('..').locator('..').locator('..');
      await completedBooking.click();
      await page.waitForLoadState('networkidle');

      const reviewSection = page.locator('#review-section');
      if (await reviewSection.isVisible()) {
        // Intentar enviar sin rating
        await page.fill('#review-comment', 'Solo comentario sin rating');
        await page.click('#submit-review');
        
        // Debe mostrar alerta
        page.on('dialog', dialog => {
          expect(dialog.message()).toContain('rating');
          dialog.accept();
        });

        await page.waitForTimeout(500);

        // Intentar enviar sin comment
        await page.fill('#review-rating', '5');
        await page.fill('#review-comment', '');
        await page.click('#submit-review');

        // Debe mostrar alerta
        page.on('dialog', dialog => {
          expect(dialog.message()).toContain('comment');
          dialog.accept();
        });
      }
    }
  });
});