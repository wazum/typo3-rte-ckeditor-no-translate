import { expect, Locator, Page, test } from '@playwright/test';
import { openContentElement, Scope } from '../fixtures/backend';

const pageUid = process.env.TYPO3_PAGE_UID || '1';
const contentUid = process.env.TYPO3_CONTENT_UID || '1';
const button = 'button[data-cke-tooltip-text="Do not translate"]';
const sourceButton = 'button[data-cke-tooltip-text="Source"]';

function openRecord(page: Page): Promise<{ scope: Scope; editable: Locator }> {
    return openContentElement(page, pageUid, contentUid);
}

async function save(page: Page, scope: Scope): Promise<void> {
    const saveButton = scope.locator('button[name="_savedok"]');

    // TYPO3 14 keeps the button disabled until it sees the form as changed, and
    // a change inside the editor does not always reach that check. Whether the
    // record really got saved is verified by reopening it.
    await saveButton.evaluate((button) => button.removeAttribute('disabled'));
    await saveButton.click();

    await expect(scope.locator('.ck-editor__editable').first()).toBeVisible({ timeout: 20000 });
    await page.waitForTimeout(500);
}

test.describe('Do not translate', () => {
    test('the button is in the toolbar', async ({ page }) => {
        const { scope } = await openRecord(page);

        await expect(scope.locator(button)).toBeVisible();
    });

    test('a marked selection reaches the database as translate="no"', async ({ page }) => {
        let { scope, editable } = await openRecord(page);

        await editable.click({ clickCount: 3 });
        await scope.locator(button).click();
        await expect(editable.locator('span.notranslate')).toHaveText('Ask for Bic Cristal pens');

        await save(page, scope);
        ({ scope, editable } = await openRecord(page));

        await expect(editable.locator('span.notranslate')).toHaveText('Ask for Bic Cristal pens');
        await scope.locator(sourceButton).click();
        await expect(scope.locator('.ck-source-editing-area textarea')).toHaveValue(
            /<span translate="no">Ask for Bic Cristal pens<\/span>/
        );

        await scope.locator(sourceButton).click();
        await editable.click({ clickCount: 3 });
        await scope.locator(button).click();
        await save(page, scope);

        ({ editable } = await openRecord(page));
        await expect(editable.locator('span.notranslate')).toHaveCount(0);
    });

    test('the button is active while the cursor sits in marked text', async ({ page }) => {
        const { scope, editable } = await openRecord(page);

        await editable.click({ clickCount: 3 });
        await scope.locator(button).click();
        await editable.locator('span.notranslate').click();

        await expect(scope.locator(button)).toHaveClass(/ck-on/);
    });

    test('a click with the cursor inside removes the whole mark', async ({ page }) => {
        const { scope, editable } = await openRecord(page);

        await editable.click({ clickCount: 3 });
        await scope.locator(button).click();
        await editable.locator('span.notranslate').click();
        await scope.locator(button).click();

        await expect(editable.locator('span.notranslate')).toHaveCount(0);
        await expect(editable).toHaveText('Ask for Bic Cristal pens');
    });
});
