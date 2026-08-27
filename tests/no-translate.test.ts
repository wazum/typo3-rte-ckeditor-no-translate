import { expect } from '@open-wc/testing';
import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import type { ModelElement } from '@ckeditor/ckeditor5-engine';
import type { ButtonView } from '@ckeditor/ckeditor5-ui';
import { NoTranslate } from '#src/no-translate.js';

async function createEditor(config: Record<string, unknown> = {}): Promise<ClassicEditor> {
    const element = document.createElement('div');
    document.body.appendChild(element);

    return ClassicEditor.create(element, {
        licenseKey: 'GPL',
        plugins: [Paragraph, NoTranslate],
        ...config,
    });
}

async function destroyEditor(editor: ClassicEditor): Promise<void> {
    const element = editor.sourceElement;
    await editor.destroy();
    element?.remove();
}

function placeCursor(editor: ClassicEditor, offset: number): void {
    editor.model.change((writer) => {
        const paragraph = editor.model.document.getRoot()!.getChild(0) as ModelElement;
        writer.setSelection(writer.createPositionAt(paragraph, offset));
    });
}

function typeAtSelection(editor: ClassicEditor, text: string): void {
    editor.model.change((writer) => {
        const selection = editor.model.document.selection;
        editor.model.insertContent(
            writer.createText(text, selection.getAttributes()),
            selection.getFirstPosition()!,
        );
    });
}

function selectFirstParagraph(editor: ClassicEditor): void {
    editor.model.change((writer) => {
        const paragraph = editor.model.document.getRoot()!.getChild(0) as ModelElement;
        writer.setSelection(paragraph, 'in');
    });
}

describe('NoTranslate', () => {
    let editor: ClassicEditor;

    afterEach(async () => {
        await destroyEditor(editor);
    });

    it('wraps the selected text in a span with translate="no"', async () => {
        editor = await createEditor();
        editor.setData('<p>Bic Cristal</p>');

        selectFirstParagraph(editor);
        editor.execute('noTranslate');

        expect(editor.getData()).to.equal('<p><span translate="no">Bic Cristal</span></p>');
    });

    it('removes the mark when the command runs twice', async () => {
        editor = await createEditor();
        editor.setData('<p>Bic Cristal</p>');

        selectFirstParagraph(editor);
        editor.execute('noTranslate');
        editor.execute('noTranslate');

        expect(editor.getData()).to.equal('<p>Bic Cristal</p>');
    });

    it('keeps a span with translate="no" that is already in the content', async () => {
        editor = await createEditor();

        editor.setData('<p>Ask for <span translate="no">Bic Cristal</span> pens</p>');

        expect(editor.getData()).to.equal('<p>Ask for <span translate="no">Bic Cristal</span> pens</p>');
    });

    it('reads a span with class notranslate as the same mark', async () => {
        editor = await createEditor();

        editor.setData('<p><span class="notranslate">Bic Cristal</span></p>');

        expect(editor.getData()).to.equal('<p><span translate="no">Bic Cristal</span></p>');
    });

    it('writes only the class in mode class', async () => {
        editor = await createEditor({ noTranslate: { mode: 'class' } });
        editor.setData('<p>Bic Cristal</p>');

        selectFirstParagraph(editor);
        editor.execute('noTranslate');

        expect(editor.getData()).to.equal('<p><span class="notranslate">Bic Cristal</span></p>');
    });

    it('writes attribute and class in mode both', async () => {
        editor = await createEditor({ noTranslate: { mode: 'both' } });
        editor.setData('<p>Bic Cristal</p>');

        selectFirstParagraph(editor);
        editor.execute('noTranslate');

        expect(editor.getData()).to.equal('<p><span class="notranslate" translate="no">Bic Cristal</span></p>');
    });

    it('marks the text with the class in the editor view in every mode', async () => {
        editor = await createEditor();
        editor.setData('<p>Bic Cristal</p>');

        selectFirstParagraph(editor);
        editor.execute('noTranslate');

        expect(editor.editing.view.getDomRoot()!.innerHTML).to.contain('class="notranslate"');
        expect(editor.getData()).to.equal('<p><span translate="no">Bic Cristal</span></p>');
    });

    it('removes the whole mark when only the cursor sits inside it', async () => {
        editor = await createEditor();
        editor.setData('<p>Ask for <span translate="no">Bic Cristal</span> pens</p>');

        editor.model.change((writer) => {
            const paragraph = editor.model.document.getRoot()!.getChild(0) as ModelElement;
            writer.setSelection(writer.createPositionAt(paragraph, 12));
        });
        editor.execute('noTranslate');

        expect(editor.getData()).to.equal('<p>Ask for Bic Cristal pens</p>');
    });

    it('turns the mark off again for a cursor in unmarked text', async () => {
        editor = await createEditor();
        editor.setData('<p>Bic Cristal</p>');

        editor.model.change((writer) => {
            const paragraph = editor.model.document.getRoot()!.getChild(0) as ModelElement;
            writer.setSelection(writer.createPositionAt(paragraph, 3));
        });
        editor.execute('noTranslate');
        editor.execute('noTranslate');
        typeAtSelection(editor, 'X');

        expect(editor.getData()).to.equal('<p>BicX Cristal</p>');
    });

    it('keeps the mark when the cursor sits at its edge', async () => {
        editor = await createEditor();
        editor.setData('<p>Ask for <span translate="no">Bic Cristal</span> pens</p>');

        editor.model.change((writer) => {
            const paragraph = editor.model.document.getRoot()!.getChild(0) as ModelElement;
            writer.setSelection(writer.createPositionAt(paragraph, 19));
        });
        editor.execute('noTranslate');

        expect(editor.getData()).to.equal('<p>Ask for <span translate="no">Bic Cristal</span> pens</p>');
    });

    it('removes the whole mark for a cursor inside it when the value is forced off', async () => {
        editor = await createEditor();
        editor.setData('<p>Ask for <span translate="no">Bic Cristal</span> pens</p>');

        placeCursor(editor, 12);
        editor.execute('noTranslate', { forceValue: false });

        expect(editor.getData()).to.equal('<p>Ask for Bic Cristal pens</p>');
    });

    it('keeps the mark for a cursor inside it when the value is forced on', async () => {
        editor = await createEditor();
        editor.setData('<p>Ask for <span translate="no">Bic Cristal</span> pens</p>');

        placeCursor(editor, 12);
        editor.execute('noTranslate', { forceValue: true });

        expect(editor.getData()).to.equal('<p>Ask for <span translate="no">Bic Cristal</span> pens</p>');
    });

    it('explains the mark with a tooltip in the editor view', async () => {
        editor = await createEditor();
        editor.setData('<p><span translate="no">Bic Cristal</span></p>');

        expect(editor.editing.view.getDomRoot()!.innerHTML).to.contain('title="Not translated"');
    });

    it('shows the button as active when marked text is selected', async () => {
        editor = await createEditor();
        editor.setData('<p>Ask for <span translate="no">Bic Cristal</span> pens</p>');

        const button = editor.ui.componentFactory.create('noTranslate') as ButtonView;
        editor.model.change((writer) => {
            const paragraph = editor.model.document.getRoot()!.getChild(0) as ModelElement;
            writer.setSelection(writer.createRange(
                writer.createPositionAt(paragraph, 8),
                writer.createPositionAt(paragraph, 19),
            ));
        });

        expect(button.isOn).to.equal(true);
    });

    it('registers a toolbar button that follows the command state', async () => {
        editor = await createEditor();
        editor.setData('<p>Bic Cristal</p>');
        selectFirstParagraph(editor);

        const button = editor.ui.componentFactory.create('noTranslate') as ButtonView;
        expect(button.isOn).to.equal(false);

        editor.execute('noTranslate');

        expect(button.isOn).to.equal(true);
    });
});
