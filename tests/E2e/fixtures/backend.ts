import { expect, FrameLocator, Locator, Page } from '@playwright/test';

/**
 * Opening a record differs between TYPO3 versions in two ways:
 *
 * - TYPO3 14 answers a module or record URL without a token with the plain
 *   backend shell, and it renamed the list module to "records".
 * - A record form opens inside the shell iframe or standing alone, depending on
 *   version and on whether the URL carries a token.
 *
 * So the tokens are read from the backend itself and the editor is looked up in
 * both places.
 */
export type Scope = Page | FrameLocator;

const LIST_MODULE = '[data-modulemenu-identifier="records"], [data-modulemenu-identifier="web_list"]';
const EDITABLE = '.ck-editor__editable';

export async function openContentElement(
    page: Page,
    pageUid: string,
    contentUid: string
): Promise<{ scope: Scope; editable: Locator }> {
    await page.goto('/typo3');
    await expect(page.locator(LIST_MODULE).first()).toBeVisible({ timeout: 20000 });

    await page.goto(await recordEditUrl(page, pageUid, contentUid));

    const scope = await editorScope(page);
    await dismissLoadingBlocker(page);

    return { scope, editable: scope.locator(EDITABLE).first() };
}

/**
 * A record form opened outside the backend shell never receives the event that
 * hides this overlay, and it swallows every click.
 */
async function dismissLoadingBlocker(page: Page): Promise<void> {
    const blocker = page.locator('#t3js-ui-block');

    await blocker.waitFor({ state: 'hidden', timeout: 5000 }).catch(async () => {
        await page.evaluate(() => document.getElementById('t3js-ui-block')?.remove());
    });
}

async function recordEditUrl(page: Page, pageUid: string, contentUid: string): Promise<string> {
    const found = await page.evaluate(
        async ({ moduleSelector, pageUid, contentUid }) => {
            const element = document.querySelector(moduleSelector);
            const anchor = element?.closest('a') ?? element?.querySelector('a') ?? element;
            const moduleUrl = anchor?.getAttribute('href');

            if (!moduleUrl) {
                return { url: null, reason: 'no list module link in the module menu' };
            }

            const response = await fetch(`${moduleUrl}&id=${pageUid}`, { credentials: 'same-origin' });
            const html = await response.text();
            const match = html.match(
                new RegExp(`/typo3/record/edit\\?[^"']*tt_content%5D%5B${contentUid}%5D[^"']*`)
            );

            return { url: match ? match[0].replace(/&amp;/g, '&') : null, reason: `module page ${response.status}` };
        },
        { moduleSelector: LIST_MODULE, pageUid, contentUid }
    );

    if (found.url === null) {
        throw new Error(`No edit URL for tt_content ${contentUid}: ${found.reason}`);
    }

    return found.url;
}

async function editorScope(page: Page): Promise<Scope> {
    const candidates: Scope[] = [page, page.frameLocator('iframe')];

    for (let attempt = 0; attempt < 40; attempt++) {
        for (const candidate of candidates) {
            const editable = candidate.locator(EDITABLE).first();

            if ((await editable.count()) > 0 && (await editable.isVisible())) {
                return candidate;
            }
        }

        await page.waitForTimeout(500);
    }

    throw new Error('The record form shows no rich text editor');
}
