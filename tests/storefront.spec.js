import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('editorial homepage loads local imagery and links to the collection', async ({ page }) => {
  const errors = [];
  const external = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('request', (request) => {
    if (!request.url().startsWith('http://127.0.0.1:5173') && !request.url().startsWith('data:'))
      external.push(request.url());
  });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'The art of between.' })).toBeVisible();
  await expect(page.locator('.hero > img')).toHaveJSProperty('naturalWidth', 1536);
  await expect(page.locator('.product-card')).toHaveCount(4);
  await page.locator('.editorial-section').scrollIntoViewIfNeeded();
  await expect(page.locator('.editorial-image > img')).toHaveJSProperty('complete', true);
  expect(
    await page.locator('.editorial-image > img').evaluate((img) => img.naturalWidth),
  ).toBeGreaterThan(0);
  await page.getByRole('link', { name: 'Explore collection 01' }).click();
  await expect(page).toHaveURL(/#\/collection$/);
  await expect(page.locator('.product-card')).toHaveCount(7);
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});

test('category filtering and price sorting select the right garments', async ({ page }) => {
  await page.goto('/#/collection');
  await page.getByRole('button', { name: 'Outerwear', exact: true }).click();
  await expect(page.locator('.product-card')).toHaveCount(2);
  await expect(page.locator('.product-card').first()).toContainText('Han stand-collar jacket');
  await page.getByRole('button', { name: 'Bottoms', exact: true }).click();
  await expect(page.locator('.product-card')).toHaveCount(3);
  await page.getByLabel('Sort pieces').selectOption('high');
  await expect(page.locator('.product-card').first()).toContainText('Mei pleated skirt');
  await page.getByRole('button', { name: 'All pieces', exact: true }).click();
  await page.getByLabel('Sort pieces').selectOption('low');
  await expect(page.locator('.product-card').first()).toContainText('Liu silk wrap top');
});

test('product sizes, bag quantities and persistence work together', async ({ page }) => {
  await page.goto('/#/product/han-jacket');
  await page.getByRole('button', { name: 'Add to bag' }).click();
  await expect(page.getByRole('alert')).toContainText('Please choose a size');
  await page.getByRole('button', { name: 'Size guide' }).click();
  await expect(page.getByRole('dialog')).toContainText('Body measurements (cm)');
  await page.getByRole('button', { name: 'Close FIND YOUR FIT' }).click();
  await page.getByRole('button', { name: 'M', exact: true }).click();
  await page.getByRole('button', { name: 'Add to bag' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toContainText('Size M');
  await expect(dialog).toContainText('€340');
  await page.getByRole('button', { name: 'Increase quantity of Han stand-collar jacket' }).click();
  await expect(dialog).toContainText('€680');
  await page.reload();
  await page.getByRole('button', { name: 'Open bag, 2 items' }).click();
  await expect(page.getByRole('dialog')).toContainText('€680');
  await page.getByRole('button', { name: 'Decrease quantity of Han stand-collar jacket' }).click();
  await expect(page.getByRole('dialog')).toContainText('€340');
  await page.getByRole('button', { name: 'Remove', exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText('Your bag is currently empty.');
});

test('search includes materials and saved pieces survive a reload', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Search pieces' }).click();
  await page.getByRole('searchbox', { name: 'Search the collection' }).fill('jade');
  await expect(page.locator('.search-results > a')).toHaveCount(1);
  await page.locator('.search-results > a').click();
  await expect(page).toHaveURL(/yun-shirt$/);
  await page.getByRole('button', { name: 'Save this piece' }).click();
  await page.goto('/#/saved');
  await expect(page.locator('.product-card')).toHaveCount(1);
  await page.reload();
  await expect(page.locator('.product-card')).toContainText('Yun cotton shirt');
  await page.getByRole('button', { name: 'Unsave Yun cotton shirt' }).click();
  await expect(page.locator('.empty-state')).toContainText('Your edit is waiting');
  await page.getByRole('button', { name: 'Search pieces' }).click();
  await page.getByRole('searchbox').fill('unfindable garment');
  await expect(page.getByRole('dialog')).toContainText('No pieces found');
});

test('preview checkout validates details and never requests payment', async ({ page }) => {
  await page.goto('/#/product/liu-top');
  await page.getByRole('button', { name: 'S', exact: true }).click();
  await page.getByRole('button', { name: 'Add to bag' }).click();
  await page.getByRole('button', { name: 'Continue to checkout' }).click();
  await expect(page.getByRole('dialog')).toContainText('no payment or real order');
  await expect(page.locator('.checkout-total')).toContainText('€200');
  await page.getByRole('button', { name: 'Complete preview order' }).click();
  await expect(page.locator('.order-confirmation')).toHaveCount(0);
  await page.getByLabel('Full name').fill('Alex Designer');
  await page
    .getByRole('dialog')
    .getByLabel('Email address', { exact: true })
    .fill('alex@example.com');
  await page.getByLabel('Address', { exact: true }).fill('10 Studio Street');
  await page.getByLabel('City', { exact: true }).fill('Copenhagen');
  await page.getByLabel('Postal code').fill('1000');
  await page.getByLabel('Country').selectOption('Denmark');
  await page.getByRole('button', { name: 'Complete preview order' }).click();
  await expect(page.locator('.order-confirmation')).toContainText('No payment was taken');
  await page.getByRole('button', { name: 'Close YOUR JIAN PREVIEW' }).click();
  await expect(page.getByRole('button', { name: 'Open bag, 0 items' })).toBeVisible();
});

test('keyboard dismissal restores focus and skip link stays on homepage', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Skip to content' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  await expect(page.getByRole('heading', { name: 'The art of between.' })).toBeVisible();
  await page.getByRole('button', { name: 'Search pieces' }).click();
  await expect(page.getByRole('searchbox', { name: 'Search the collection' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Search pieces' })).toBeFocused();
});

test('story, philosophy and product pages fit the viewport', async ({ page }) => {
  for (const route of ['/', '/collection', '/campaign', '/about', '/product/mo-jacket', '/saved']) {
    await page.goto(`/#${route}`);
    await expect(page.locator('h1')).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
  }
  await page.goto('/#/missing');
  await expect(page.locator('h1')).toContainText('This page has');
});

test('newsletter form validates email and shows a preview confirmation', async ({ page }) => {
  await page.goto('/');
  await page.locator('.newsletter').scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: 'Subscribe to letters from JIAN' }).click();
  await expect(page.locator('.newsletter-success')).toHaveCount(0);
  await page.getByLabel('Email address', { exact: true }).fill('reader@example.com');
  await page.getByRole('button', { name: 'Subscribe to letters from JIAN' }).click();
  await expect(page.getByRole('status')).toContainText('You’re on the list for this preview');
});

test('mobile menu opens and navigates into the campaign', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Mobile-specific navigation');
  await page.goto('/');
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.getByRole('dialog').getByRole('link', { name: 'Campaign' }).click();
  await expect(page).toHaveURL(/#\/campaign$/);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.locator('h1')).toContainText('A quieter kind');
});

test('pages and the search drawer pass automated accessibility checks', async ({ page }) => {
  test.setTimeout(60000);
  for (const route of ['/', '/collection', '/product/han-jacket', '/campaign', '/about']) {
    await page.goto(`/#${route}`);
    await page.evaluate(() => document.fonts.ready);
    for (const section of await page.locator('.reveal').all()) {
      await section.scrollIntoViewIfNeeded();
      await expect(section).toHaveCSS('opacity', '1');
    }
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(result.violations, `Accessibility issues on ${route}`).toEqual([]);
  }
  await page.getByRole('button', { name: 'Search pieces' }).click();
  await page
    .locator('.modal-backdrop')
    .evaluate((element) =>
      Promise.all(element.getAnimations({ subtree: true }).map((animation) => animation.finished)),
    );
  const drawerResult = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(drawerResult.violations).toEqual([]);
});

test('studio form confirms a preview and privacy can clear saved preferences', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Save Han stand-collar jacket' }).click();
  await page.getByRole('button', { name: 'Contact the studio' }).click();
  await page.getByRole('dialog').getByLabel('Email address').fill('studio@example.com');
  await page.getByLabel('Your note').fill('A question about the Han jacket.');
  await page.getByRole('button', { name: 'Leave a note', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Your preview note is complete');
  await page.getByRole('button', { name: 'Privacy', exact: true }).click();
  await page.getByRole('button', { name: 'Clear saved preferences' }).click();
  await page.getByRole('button', { name: 'Close YOUR PRIVACY' }).click();
  await page.goto('/#/saved');
  await expect(page.locator('.empty-state')).toContainText('Your edit is waiting');
});
