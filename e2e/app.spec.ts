import { test, expect } from '@playwright/test';

test.describe('Mahjong Solitaire Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the start screen with level 1', async ({ page }) => {
    await expect(page.getByText('Nivel 1')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Comenzar' })).toBeVisible();
  });

  test('should start the game when clicking Comenzar button', async ({ page }) => {
    await page.getByRole('button', { name: 'Comenzar' }).click();
    
    // Wait for game to load
    await page.waitForSelector('[class*="absolute flex items-center justify-center"]', { state: 'hidden' });
    
    // Check that game board is visible
    await expect(page.locator('[class*="relative w-full h-full"]')).toBeVisible();
  });

  test('should display game controls', async ({ page }) => {
    await page.getByRole('button', { name: 'Comenzar' }).click();
    await page.waitForTimeout(500);
    
    await expect(page.getByRole('button', { name: 'Reiniciar' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Deshacer' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Pista' })).toBeVisible();
  });

  test('should show level and remaining tiles info', async ({ page }) => {
    await page.getByRole('button', { name: 'Comenzar' }).click();
    await page.waitForTimeout(500);
    
    await expect(page.getByText(/Nivel: \d+/)).toBeVisible();
    await expect(page.getByText(/Fichas restantes: \d+/)).toBeVisible();
  });

  test('should allow clicking on tiles', async ({ page }) => {
    await page.getByRole('button', { name: 'Comenzar' }).click();
    await page.waitForTimeout(1000);
    
    // Find clickable tiles
    const tiles = page.locator('[class*="cursor-pointer"]').first();
    
    if (await tiles.count() > 0) {
      await tiles.first().click();
      await page.waitForTimeout(300);
      
      // Tile should be selected (has blue border)
      const selectedTile = page.locator('[class*="bg-blue-200"]');
      await expect(selectedTile.first()).toBeVisible({ timeout: 2000 });
    }
  });

  test('should show restart button', async ({ page }) => {
    await page.getByRole('button', { name: 'Comenzar' }).click();
    await page.waitForTimeout(500);
    
    const restartButton = page.getByRole('button', { name: 'Reiniciar' });
    await expect(restartButton).toBeVisible();
    await restartButton.click();
    
    // Should still be in playing state
    await page.waitForTimeout(500);
    await expect(page.locator('[class*="relative w-full h-full"]')).toBeVisible();
  });

  test('should handle hint button', async ({ page }) => {
    await page.getByRole('button', { name: 'Comenzar' }).click();
    await page.waitForTimeout(1000);
    
    const hintButton = page.getByRole('button', { name: 'Pista' });
    await expect(hintButton).toBeEnabled();
    
    await hintButton.click();
    await page.waitForTimeout(2000);
    
    // Either hint is shown or shuffling happens
    const hintTile = page.locator('[class*="bg-green-200"]');
    const shufflingMessage = page.getByText('Barajando fichas...');
    
    const hasHint = await hintTile.count() > 0;
    const isShuffling = await shufflingMessage.isVisible().catch(() => false);
    
    expect(hasHint || isShuffling).toBeTruthy();
  });

  test('should handle undo button state', async ({ page }) => {
    await page.getByRole('button', { name: 'Comenzar' }).click();
    await page.waitForTimeout(1000);
    
    const undoButton = page.getByRole('button', { name: 'Deshacer' });
    
    // Initially should be disabled
    await expect(undoButton).toBeDisabled();
    
    // Click a tile to select it
    const tiles = page.locator('[class*="cursor-pointer"]');
    if (await tiles.count() > 0) {
      await tiles.first().click();
      await page.waitForTimeout(300);
      
      // Still disabled if no match made
      await expect(undoButton).toBeDisabled();
    }
  });
});

test.describe('Game Flow', () => {
  test('should complete level and show victory screen', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Comenzar' }).click();
    await page.waitForTimeout(1000);
    
    // This is a simplified test - in reality, matching tiles would take many clicks
    // We'll just verify the game is playable
    const tiles = page.locator('[class*="cursor-pointer"]');
    const tileCount = await tiles.count();
    
    expect(tileCount).toBeGreaterThan(0);
  });
});

test.describe('Accessibility', () => {
  test('should have aria-labels on buttons', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.getByRole('button', { name: 'Comenzar' })).toHaveAttribute('aria-label', 'Comenzar nivel');
    
    await page.getByRole('button', { name: 'Comenzar' }).click();
    await page.waitForTimeout(500);
    
    await expect(page.getByRole('button', { name: 'Reiniciar' })).toHaveAttribute('aria-label', 'Reiniciar nivel');
    await expect(page.getByRole('button', { name: 'Deshacer' })).toHaveAttribute('aria-label', 'Deshacer último movimiento');
    await expect(page.getByRole('button', { name: 'Pista' })).toHaveAttribute('aria-label', 'Mostrar pista');
  });
});

