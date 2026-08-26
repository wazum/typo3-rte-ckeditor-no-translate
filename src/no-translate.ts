import { Plugin } from '@ckeditor/ckeditor5-core';

export class NoTranslate extends Plugin {
    public static get pluginName() {
        return 'NoTranslate' as const;
    }
}
