import{Plugin as l}from"@ckeditor/ckeditor5-core";import{AttributeCommand as c}from"@ckeditor/ckeditor5-basic-styles";import{findAttributeRange as d}from"@ckeditor/ckeditor5-typing";import{ButtonView as u}from"@ckeditor/ckeditor5-ui";const e="noTranslate",r="notranslate",m=`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <mask id="no-translate-slash">
        <rect width="20" height="20" fill="#fff"/>
        <path d="M2.6 17.4 17.4 2.6" fill="none" stroke="#000" stroke-width="3.2" stroke-linecap="round"/>
    </mask>
    <g mask="url(#no-translate-slash)">
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
    <path d="M3.4 16.6 16.6 3.4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
</svg>`;function h(o){return o==="class"?{name:"span",classes:r}:o==="both"?{name:"span",classes:r,attributes:{translate:"no"}}:{name:"span",attributes:{translate:"no"}}}class f extends c{execute(t={}){const n=this.editor.model,s=n.document.selection;if(s.isCollapsed&&this.value&&t.forceValue===void 0){const a=d(s.getFirstPosition(),this.attributeKey,!0,n);n.change(i=>i.removeAttribute(this.attributeKey,a));return}super.execute(t)}}class w extends l{static get pluginName(){return"NoTranslate"}init(){const t=this.editor;t.config.define("noTranslate",{mode:"attribute"}),t.model.schema.extend("$text",{allowAttributes:e}),t.conversion.for("dataDowncast").attributeToElement({model:e,view:h(t.config.get("noTranslate.mode"))}),t.conversion.for("editingDowncast").attributeToElement({model:e,view:{name:"span",classes:r,attributes:{title:"Not translated"}}}),t.conversion.for("upcast").elementToAttribute({model:e,view:{name:"span",attributes:{translate:"no"}}}),t.conversion.for("upcast").elementToAttribute({model:e,view:{name:"span",classes:r}});const n=new f(t,e);t.commands.add(e,n),t.ui.componentFactory.add(e,s=>{const a=new u(s);return a.set({label:"Do not translate",icon:m,tooltip:!0,isToggleable:!0}),a.bind("isOn","isEnabled").to(n,"value","isEnabled"),a.on("execute",()=>{t.execute(e),t.editing.view.focus()}),a})}}export{w as NoTranslate};
//# sourceMappingURL=no-translate.js.map
