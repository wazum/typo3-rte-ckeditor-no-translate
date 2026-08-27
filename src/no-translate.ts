import { Plugin } from '@ckeditor/ckeditor5-core';
import type { Editor } from '@ckeditor/ckeditor5-core';
import { AttributeCommand } from '@ckeditor/ckeditor5-basic-styles';
import { findAttributeRange } from '@ckeditor/ckeditor5-typing';
import { ButtonView } from '@ckeditor/ckeditor5-ui';
import type { ViewElementDefinition } from '@ckeditor/ckeditor5-engine';

const MODEL_ATTRIBUTE = 'noTranslate';
const NO_TRANSLATE_CLASS = 'notranslate';
const ICON = `<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <g>
        <g stroke="currentColor" stroke-width="1.2">
            <path fill="none" d="M1.6 3a1.4 1.4 0 0 1 1.4-1.4h6.6A1.4 1.4 0 0 1 11 3v5.2a1.4 1.4 0 0 1-1.4 1.4H6.5l-2.3 2.1V9.6H3A1.4 1.4 0 0 1 1.6 8.2z"/>
            <path fill="none" d="M9 11.8a1.4 1.4 0 0 1 1.4-1.4H17a1.4 1.4 0 0 1 1.4 1.4V17a1.4 1.4 0 0 1-1.4 1.4h-6.6A1.4 1.4 0 0 1 9 17z"/>
        </g>
        <g transform="translate(3.35 2.05) scale(0.44)">
            <path d="M5.648.5c.414 0 .75.337.75.751v.95h4.35a.75.75 0 0 1 0 1.5H9.486c-.337 1.817-1.254 4.38-3.062 6.917.234.25.42.434.56.563a5 5 0 0 0 .293.253h.001a.75.75 0 0 1-.857 1.231H6.42l-.003-.002-.004-.003-.01-.008-.028-.02-.092-.072a7 7 0 0 1-.317-.278 12 12 0 0 1-.472-.463c-1.345 1.606-2.094 2.28-4.376 3.584a.75.75 0 0 1-.736-1.306c2.018-.997 2.852-1.878 4.11-3.42-.546-.738-.982-1.637-1.286-2.357a19 19 0 0 1-.563-1.516l-.008-.026-.002-.007-.001-.002-.019-.076A.75.75 0 0 1 4.04 6.26l.026.072.001.004.006.02.025.078.101.297c.09.255.22.61.388 1.005.233.553.525 1.152.852 1.67C6.86 7.313 7.63 5.146 7.953 3.7H.948a.75.75 0 0 1 0-1.5h3.95v-.949A.75.75 0 0 1 5.648.5"/>
        </g>
        <g transform="translate(7.85 8.6) scale(0.47)">
            <path d="M19 19h-1.486l-1.289-3.5h-5.85L8.989 19H7.501l4.957-12h1.586zm-8.13-4.7h4.76l-2.38-5.8z"/>
        </g>
    </g>
    <path d="M3.4 16.6 16.6 3.4" fill="none" stroke="var(--ck-color-base-background, #fff)" stroke-width="3.2" stroke-linecap="round"/>
    <path d="M3.4 16.6 16.6 3.4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
</svg>`;

type Mode = 'attribute' | 'class' | 'both';

declare module '@ckeditor/ckeditor5-core' {
    interface EditorConfig {
        noTranslate?: {
            mode?: Mode;
        };
    }
}

function isMode(value: unknown): value is Mode {
    return value === 'attribute' || value === 'class' || value === 'both';
}

function getMode(editor: Editor): Mode {
    const mode = editor.config.get('noTranslate.mode');

    return isMode(mode) ? mode : 'attribute';
}

function viewFor(mode: Mode): ViewElementDefinition {
    switch (mode) {
        case 'attribute':
            return { name: 'span', attributes: { translate: 'no' } };

        case 'class':
            return { name: 'span', classes: NO_TRANSLATE_CLASS };

        case 'both':
            return { name: 'span', classes: NO_TRANSLATE_CLASS, attributes: { translate: 'no' } };
    }
}

class NoTranslateCommand extends AttributeCommand {
    public override execute(options: { forceValue?: boolean } = {}): void {
        if (options.forceValue !== true && this.removeMarkAroundCursor()) {
            return;
        }

        super.execute(options);
    }

    /**
     * A cursor inside a mark removes the whole mark, the way unlink does.
     *
     * The state comes from the text node and not from `this.value`, because
     * `this.value` is also true right after the button armed the attribute for
     * the next keystroke, while no text carries the mark yet. Acting on that
     * state left the button stuck in the on position and, with the cursor at the
     * edge of a mark, deleted a mark the editor wanted to keep.
     */
    private removeMarkAroundCursor(): boolean {
        const model = this.editor.model;
        const selection = model.document.selection;
        const position = selection.getFirstPosition();

        if (!selection.isCollapsed || position === null) {
            return false;
        }

        if (position.textNode?.hasAttribute(this.attributeKey) !== true) {
            return false;
        }

        const range = findAttributeRange(position, this.attributeKey, true, model);
        model.change((writer) => {
            writer.removeAttribute(this.attributeKey, range);
            writer.removeSelectionAttribute(this.attributeKey);
        });

        return true;
    }
}

export class NoTranslate extends Plugin {
    public static get pluginName() {
        return 'NoTranslate' as const;
    }

    public init(): void {
        this.editor.config.define('noTranslate', { mode: 'attribute' });

        this.defineSchema();
        this.defineConverters();
        this.defineToolbarButton(this.defineCommand());
    }

    private defineSchema(): void {
        this.editor.model.schema.extend('$text', { allowAttributes: MODEL_ATTRIBUTE });
    }

    private defineConverters(): void {
        const conversion = this.editor.conversion;
        const dataView = viewFor(getMode(this.editor));

        conversion.for('dataDowncast').attributeToElement({
            model: MODEL_ATTRIBUTE,
            view: dataView,
        });

        conversion.for('editingDowncast').attributeToElement({
            model: MODEL_ATTRIBUTE,
            view: {
                name: 'span',
                classes: NO_TRANSLATE_CLASS,
                attributes: { title: this.editor.locale.t('Not translated') },
            },
        });

        conversion.for('upcast').elementToAttribute({
            model: { key: MODEL_ATTRIBUTE, value: true },
            view: { name: 'span', attributes: { translate: 'no' } },
        });

        conversion.for('upcast').elementToAttribute({
            model: { key: MODEL_ATTRIBUTE, value: true },
            view: { name: 'span', classes: NO_TRANSLATE_CLASS },
        });
    }

    private defineCommand(): NoTranslateCommand {
        const command = new NoTranslateCommand(this.editor, MODEL_ATTRIBUTE);
        this.editor.commands.add(MODEL_ATTRIBUTE, command);

        return command;
    }

    private defineToolbarButton(command: NoTranslateCommand): void {
        this.editor.ui.componentFactory.add(MODEL_ATTRIBUTE, (locale) => {
            const button = new ButtonView(locale);

            button.set({
                label: locale.t('Do not translate'),
                icon: ICON,
                tooltip: true,
                isToggleable: true,
            });
            button.bind('isOn', 'isEnabled').to(command, 'value', 'isEnabled');
            button.on('execute', () => {
                this.editor.execute(MODEL_ATTRIBUTE);
                this.editor.editing.view.focus();
            });

            return button;
        });
    }
}
