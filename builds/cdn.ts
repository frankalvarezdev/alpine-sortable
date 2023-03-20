import sortable from '../src/index'

// @ts-ignore
document.addEventListener('alpine:init', () => {
    // @ts-ignore
    window.Alpine.plugin(sortable)
})
