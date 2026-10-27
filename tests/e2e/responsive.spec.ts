import { expect, test } from '@playwright/test';

const requiredViewports = [
  { width: 320, height: 568 },
  { width: 768, height: 1024 },
  { width: 1280, height: 800 },
  { width: 1920, height: 1080 },
];

test('keeps the search flow usable without horizontal page overflow at supported viewports', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'The mobile project uses a device-fixed viewport.');

  await page.goto('/');

  for (const viewport of requiredViewports) {
    await page.setViewportSize(viewport);

    await expect(page.getByRole('searchbox', { name: 'Nome da cidade' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Buscar' })).toBeVisible();

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(hasHorizontalOverflow, `horizontal overflow at ${viewport.width}px`).toBe(false);
  }
});
