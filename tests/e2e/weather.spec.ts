import { expect, test } from '@playwright/test';

test('renders the local weather sample and derives the selected temperature unit', async ({
  page,
}) => {
  const externalRequests: string[] = [];
  page.on('request', (request) => {
    if (request.url().includes('open-meteo.com')) {
      externalRequests.push(request.url());
    }
  });

  await page.goto('/');
  await page.getByRole('searchbox', { name: 'Nome da cidade' }).fill('São Paulo');
  await page.getByRole('button', { name: 'Buscar' }).click();

  await expect(page.getByRole('heading', { name: 'São Paulo' })).toBeVisible();
  await expect(page.getByText('22 °C', { exact: true })).toBeVisible();
  await expect(page.getByRole('listitem')).toHaveCount(5);

  await page.getByRole('button', { name: '°F' }).click();
  await expect(page.getByText('72 °F', { exact: true })).toBeVisible();
  expect(externalRequests).toEqual([]);
});

test('renders local empty and error states and allows retry', async ({ page }) => {
  const externalRequests: string[] = [];
  page.on('request', (request) => {
    if (request.url().includes('open-meteo.com')) {
      externalRequests.push(request.url());
    }
  });

  await page.goto('/');
  const search = page.getByRole('searchbox', { name: 'Nome da cidade' });

  await search.fill('Rio de Janeiro');
  await page.getByRole('button', { name: 'Buscar' }).click();
  await expect(page.getByRole('heading', { name: 'Cidade não encontrada' })).toBeVisible();

  await search.fill('falha');
  await page.getByRole('button', { name: 'Buscar' }).click();
  await expect(page.getByRole('alert')).toContainText(
    'Não foi possível consultar os dados meteorológicos.',
  );

  await page.getByRole('button', { name: 'Tentar novamente' }).click();
  await expect(page.getByRole('alert')).toBeVisible();
  expect(externalRequests).toEqual([]);
});
