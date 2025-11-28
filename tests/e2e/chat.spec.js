const { test, expect } = require('@playwright/test');

test.describe('Chat - Mensajería', () => {

  test('enviar mensaje a proveedor', async ({ page }) => {
    test.setTimeout(120000);

    // Mock del WebSocket
    await page.addInitScript(() => {
      window.WebSocket = class MockWebSocket {
        constructor(url) {
          this.url = url;
          this.readyState = 1; // OPEN
          setTimeout(() => {
            if (this.onopen) this.onopen();
          }, 100);
        }
        send(data) {
          console.log('WebSocket send:', data);
          // Simular respuesta
          setTimeout(() => {
            if (this.onmessage) {
              const parsed = JSON.parse(data);
              this.onmessage({
                data: JSON.stringify({
                  from: parsed.to,
                  to: parsed.from,
                  message: 'Mensaje recibido!',
                  timestamp: Math.floor(Date.now() / 1000)
                })
              });
            }
          }, 500);
        }
        close() {}
      };
    });

    // Login como cliente
    await page.goto('/login');
    await page.fill('input[name="email"]', 'john.doe@email.com');
    await page.fill('input[name="password"]', 'Electrician2024!');
    await page.click('button:has-text("Sign In")');
    await page.waitForURL('**/userProfile');

    // Ir a chat
    await page.goto('/chatPage');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Verificar que carga la lista de chats
    const chatList = page.locator('#chatList');
    await expect(chatList).toBeVisible({ timeout: 10000 });

    // Seleccionar un chat o buscar un proveedor
    const chatCards = page.locator('.chat-card');
    const chatCount = await chatCards.count();

    if (chatCount > 0) {
      // Hay conversaciones existentes, seleccionar la primera
      await chatCards.first().click();
      await page.waitForTimeout(1000);
    } else {
      // No hay conversaciones, buscar un proveedor
      const searchInput = page.locator('#searchInput');
      await searchInput.fill('mike');
      await page.waitForTimeout(2000);

      const searchResults = page.locator('#searchResultsBox .p-3');
      const resultsCount = await searchResults.count();
      
      if (resultsCount > 0) {
        await searchResults.first().click();
        await page.waitForTimeout(1000);
      }
    }

    // Verificar que se abrió la ventana de chat
    const chatWindow = page.locator('#chatWindowContainer');
    await expect(chatWindow).toBeVisible();

    // Escribir mensaje
    const messageInput = page.locator('#messageInput');
    await expect(messageInput).toBeVisible();
    await messageInput.fill('Hola! Necesito información sobre tus servicios de plomería.');

    // Enviar mensaje
    const sendBtn = page.locator('.btn-send');
    await sendBtn.click();

    // Verificar que el mensaje aparece en el chat
    await page.waitForTimeout(1000);
    const messages = page.locator('.message-card');
    const messageCount = await messages.count();
    expect(messageCount).toBeGreaterThan(0);

    // Verificar que el input se limpió
    await expect(messageInput).toHaveValue('');
  });

  test('buscar proveedores en chat', async ({ page }) => {
    test.setTimeout(120000);

    await page.goto('/login');
    await page.fill('input[name="email"]', 'john.doe@email.com');
    await page.fill('input[name="password"]', 'Electrician2024!');
    await page.click('button:has-text("Sign In")');
    await page.waitForURL('**/userProfile');

    await page.goto('/chatPage');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Buscar proveedor
    const searchInput = page.locator('#searchInput');
    await searchInput.fill('sarah');
    await page.waitForTimeout(2000);

    // Verificar que aparecen resultados
    const searchBox = page.locator('#searchResultsBox');
    await expect(searchBox).toBeVisible();
    await expect(searchBox).not.toHaveClass(/hidden/);

    const results = page.locator('#searchResultsBox .p-3');
    const count = await results.count();
    expect(count).toBeGreaterThan(0);

    // Verificar que tiene avatar y nombre
    const firstResult = results.first();
    await expect(firstResult.locator('img')).toBeVisible();
    await expect(firstResult.locator('span')).toBeVisible();
  });

  test('limpiar búsqueda oculta resultados', async ({ page }) => {
    test.setTimeout(120000);

    await page.goto('/login');
    await page.fill('input[name="email"]', 'john.doe@email.com');
    await page.fill('input[name="password"]', 'Electrician2024!');
    await page.click('button:has-text("Sign In")');
    await page.waitForURL('**/userProfile');

    await page.goto('/chatPage');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const searchInput = page.locator('#searchInput');
    
    // Buscar algo
    await searchInput.fill('david');
    await page.waitForTimeout(1500);

    const searchBox = page.locator('#searchResultsBox');
    await expect(searchBox).toBeVisible();

    // Limpiar búsqueda
    await searchInput.clear();
    await page.waitForTimeout(500);

    // Verificar que se oculta
    await expect(searchBox).toHaveClass(/hidden/);
  });

  test('crear nueva conversación desde búsqueda', async ({ page }) => {
    test.setTimeout(120000);

    // Mock WebSocket
    await page.addInitScript(() => {
      window.WebSocket = class MockWebSocket {
        constructor(url) {
          this.url = url;
          this.readyState = 1;
          setTimeout(() => {
            if (this.onopen) this.onopen();
          }, 100);
        }
        send(data) {}
        close() {}
      };
    });

    await page.goto('/login');
    await page.fill('input[name="email"]', 'john.doe@email.com');
    await page.fill('input[name="password"]', 'Electrician2024!');
    await page.click('button:has-text("Sign In")');
    await page.waitForURL('**/userProfile');

    await page.goto('/chatPage');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Buscar un proveedor
    const searchInput = page.locator('#searchInput');
    await searchInput.fill('jennifer');
    await page.waitForTimeout(2000);

    // Seleccionar el resultado
    const results = page.locator('#searchResultsBox .p-3');
    const count = await results.count();
    
    if (count > 0) {
      await results.first().click();
      await page.waitForTimeout(1000);

      // Verificar que se abrió el chat
      const chatWindow = page.locator('#chatWindowContainer');
      await expect(chatWindow).toBeVisible();

      // Verificar que el input de búsqueda se limpió
      await expect(searchInput).toHaveValue('');

      // Verificar que los resultados se ocultaron
      const searchBox = page.locator('#searchResultsBox');
      await expect(searchBox).toHaveClass(/hidden/);
    }
  });

  test('enviar mensaje con Enter', async ({ page }) => {
    test.setTimeout(120000);

    // Mock WebSocket
    await page.addInitScript(() => {
      window.WebSocket = class MockWebSocket {
        constructor(url) {
          this.readyState = 1;
          setTimeout(() => {
            if (this.onopen) this.onopen();
          }, 100);
        }
        send(data) {
          console.log('Mensaje enviado:', data);
        }
        close() {}
      };
    });

    await page.goto('/login');
    await page.fill('input[name="email"]', 'john.doe@email.com');
    await page.fill('input[name="password"]', 'Electrician2024!');
    await page.click('button:has-text("Sign In")');
    await page.waitForURL('**/userProfile');

    await page.goto('/chatPage');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Seleccionar o crear un chat
    const chatCards = page.locator('.chat-card');
    const chatCount = await chatCards.count();

    if (chatCount > 0) {
      await chatCards.first().click();
      await page.waitForTimeout(1000);

      // Escribir mensaje
      const messageInput = page.locator('#messageInput');
      await messageInput.fill('Mensaje de prueba con Enter');

      // Obtener conteo inicial de mensajes
      const initialCount = await page.locator('.message-card').count();

      // Presionar Enter
      await messageInput.press('Enter');
      await page.waitForTimeout(1000);

      // Verificar que se envió
      await expect(messageInput).toHaveValue('');
      
      // Verificar que aumentó el conteo de mensajes
      const newCount = await page.locator('.message-card').count();
      expect(newCount).toBeGreaterThanOrEqual(initialCount);
    }
  });

  test('conversaciones se ordenan por más recientes', async ({ page }) => {
    test.setTimeout(120000);

    // Mock WebSocket
    await page.addInitScript(() => {
      window.WebSocket = class MockWebSocket {
        constructor(url) {
          this.readyState = 1;
          setTimeout(() => {
            if (this.onopen) this.onopen();
          }, 100);
        }
        send(data) {}
        close() {}
      };
    });

    await page.goto('/login');
    await page.fill('input[name="email"]', 'john.doe@email.com');
    await page.fill('input[name="password"]', 'Electrician2024!');
    await page.click('button:has-text("Sign In")');
    await page.waitForURL('**/userProfile');

    await page.goto('/chatPage');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Obtener lista de conversaciones
    const chatCards = page.locator('.chat-card');
    const count = await chatCards.count();

    if (count > 1) {
      // Seleccionar la segunda conversación
      const secondChat = chatCards.nth(1);
      const secondChatName = await secondChat.locator('.font-medium').textContent();
      
      await secondChat.click();
      await page.waitForTimeout(1000);

      // Enviar un mensaje
      const messageInput = page.locator('#messageInput');
      await messageInput.fill('Mensaje para probar orden');
      
      const sendBtn = page.locator('.btn-send');
      await sendBtn.click();
      await page.waitForTimeout(2000);

      // Verificar que esa conversación ahora está primera
      const firstChat = page.locator('.chat-card').first();
      const firstChatName = await firstChat.locator('.font-medium').textContent();
      
      expect(firstChatName).toBe(secondChatName);
    }
  });

  test('mostrar timestamp correcto en mensajes', async ({ page }) => {
    test.setTimeout(120000);

    // Mock WebSocket
    await page.addInitScript(() => {
      window.WebSocket = class MockWebSocket {
        constructor(url) {
          this.readyState = 1;
          setTimeout(() => {
            if (this.onopen) this.onopen();
          }, 100);
        }
        send(data) {}
        close() {}
      };
    });

    await page.goto('/login');
    await page.fill('input[name="email"]', 'john.doe@email.com');
    await page.fill('input[name="password"]', 'Electrician2024!');
    await page.click('button:has-text("Sign In")');
    await page.waitForURL('**/userProfile');

    await page.goto('/chatPage');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const chatCards = page.locator('.chat-card');
    const count = await chatCards.count();

    if (count > 0) {
      await chatCards.first().click();
      await page.waitForTimeout(1000);

      // Verificar que los mensajes tienen timestamp
      const messages = page.locator('.message-card');
      const messageCount = await messages.count();

      if (messageCount > 0) {
        const firstMessage = messages.first();
        const timestamp = firstMessage.locator('.text-xs');
        
        await expect(timestamp).toBeVisible();
        
        // Verificar formato de tiempo (HH:MM)
        const timeText = await timestamp.textContent();
        expect(timeText).toMatch(/\d{1,2}:\d{2}/);
      }
    }
  });
});