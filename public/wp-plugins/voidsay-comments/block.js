// VoidSay Gutenberg Block
const { registerBlockType } = wp.blocks;
const { TextControl, InspectorControls } = wp.blockEditor || wp.editor;
const { createElement: el } = wp.element;

registerBlockType('voidsay/comments', {
    title: 'VoidSay Comments',
    icon: 'format-chat',
    category: 'embed',
    description: 'Embed VoidSay — the universal, ad-free commenting platform.',
    keywords: ['comments', 'voidsay', 'discussion', 'community'],
    attributes: {
        url: { type: 'string', default: '' },
        width: { type: 'string', default: '100%' },
        height: { type: 'string', default: '400px' },
    },

    edit: function (props) {
        const { attributes, setAttributes } = props;

        return el('div', { style: { padding: '20px', background: '#1a1a2e', borderRadius: '8px', color: '#e2e8f0' } },
            el('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' } },
                el('span', { style: { fontSize: '24px' } }, '💬'),
                el('h3', { style: { margin: 0, fontWeight: 600, fontSize: '16px' } }, 'VoidSay Comments')
            ),
            el('p', { style: { margin: '0 0 12px', fontSize: '13px', color: '#94a3b8' } },
                'Comments will appear here. Leave URL blank to use the current page URL.'
            ),
            el(InspectorControls, null,
                el('div', { style: { padding: '16px' } },
                    el(TextControl, {
                        label: 'Custom URL (optional)',
                        value: attributes.url,
                        onChange: function (val) { setAttributes({ url: val }); },
                        help: 'Leave empty to use the current page URL.',
                    })
                )
            ),
            el('div', {
                style: {
                    padding: '30px',
                    textAlign: 'center',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '6px',
                    border: '1px dashed rgba(255,255,255,0.2)',
                }
            },
                el('p', { style: { margin: 0, fontSize: '14px', color: '#64748b' } },
                    '💬 VoidSay comments will be embedded here on the frontend.'
                )
            )
        );
    },

    save: function () {
        // Dynamic block — rendered server-side via PHP shortcode
        return null;
    },
});
