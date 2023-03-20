import { Alpine } from 'alpinejs'

/**
 * Sort items in a list, using drag and drop in Alpine.js
 * @author frankalvarezdev
 */
const sortable = (Alpine: Alpine) => {
    const sortableState = Alpine.reactive({
        selecteIndex: null as number | null,
        clonedDragElement: null as HTMLElement | null,
        originalDragElement: null as HTMLElement | null,
    })

    Alpine.directive(
        'sortable',
        (element, { expression, value }, { evaluate, evaluateLater, effect, cleanup }) => {
            const el = element as HTMLElement

            const items = evaluate(value) as any[]
            // swaps the elements in the array of items
            const swapElements = (index1: number, index2: number) => {
                const temp = items[index1]
                items[index1] = items[index2]
                items[index2] = temp
            }

            let index = evaluate(expression) as number
            let getNewIndex = evaluateLater(expression)
            el.setAttribute('draggable', 'true')
            // inserts the index as an attribute of the element, for use on mobile devices, in the 'touchend' event
            const setIndex = (index: number) => {
                el.setAttribute('data-draggable-index', String(index))
            }

            const onDragStart = () => {
                sortableState.selecteIndex = index
            }
            const onDragOver = (event: DragEvent) => {
                event.preventDefault()
            }
            const onDrop = () => {
                if (sortableState.selecteIndex === null) return
                swapElements(sortableState.selecteIndex, index)
            }
            el.addEventListener('dragstart', onDragStart)
            el.addEventListener('dragover', onDragOver)
            el.addEventListener('drop', onDrop)

            // clones the element being dragged, so that it looks as if the original element is being dragged
            const onTouchStart = () => {
                sortableState.selecteIndex = index
                // the original element is saved, to make sure that it is not the same element where it was dropped
                sortableState.originalDragElement = el

                const clone = el.cloneNode(true) as HTMLElement
                clone.setAttribute('x-ignore', '')
                clone.style.position = 'fixed'
                clone.style.boxSizing = 'border-box'
                clone.style.zIndex = '999999'
                clone.style.opacity = '0'
                clone.style.pointerEvents = 'none'
                clone.style.transition = 'none'
                // downsize to 80% of the original size
                clone.style.width = el.offsetWidth * 0.8 + 'px'
                clone.style.height = el.offsetHeight * 0.8 + 'px'

                document.body.appendChild(clone)
                sortableState.clonedDragElement = clone
            }
            const onTouchMove = (event: TouchEvent) => {
                event.preventDefault()
                if (!sortableState.clonedDragElement) return

                // centers the cloned element under the finger
                const touch = event.changedTouches[0]
                const position = {
                    left: touch.clientX - sortableState.clonedDragElement.offsetWidth / 2 + 'px',
                    top: touch.clientY - sortableState.clonedDragElement.offsetHeight / 2 + 'px',
                }

                sortableState.clonedDragElement.style.left = position.left
                sortableState.clonedDragElement.style.top = position.top
                sortableState.clonedDragElement.style.opacity = '0.5'
            }
            const onTouchEnd = (event: TouchEvent) => {
                if (sortableState.clonedDragElement) {
                    sortableState.clonedDragElement.remove()
                    sortableState.clonedDragElement = null
                }

                // obtains the element on which the cloned element was dropped
                let element: HTMLElement | null = document.elementFromPoint(
                    event.changedTouches[0].clientX,
                    event.changedTouches[0].clientY
                ) as HTMLElement

                if (!element) return
                if (sortableState.selecteIndex === null) return

                const hasDraggableAttribute = (element: HTMLElement | null) => {
                    if (!element) return false
                    return element.getAttribute('draggable') === 'true'
                }

                // get parent element that has draggable=true, max 4 levels up
                let draggableParent: HTMLElement | null = null
                for (let i = 0; i < 4; i++) {
                    if (hasDraggableAttribute(element)) {
                        draggableParent = element
                        break
                    }
                    if (!element.parentElement) break
                    element = element.parentElement
                }
                if (!draggableParent) return
                if (draggableParent === sortableState.originalDragElement) return

                // get the index of the element on which the cloned element was dropped
                let dropIndexData = draggableParent.getAttribute('data-draggable-index')
                if (!dropIndexData === null) return
                const dropIndex = Number(dropIndexData)

                swapElements(sortableState.selecteIndex, dropIndex)

                // clear the data
                sortableState.originalDragElement = null
                sortableState.clonedDragElement = null
            }
            el.addEventListener('touchstart', onTouchStart)
            el.addEventListener('touchmove', onTouchMove)
            el.addEventListener('touchend', onTouchEnd)

            // listen for changes in the index, to update
            // @ts-ignore
            effect(() => {
                getNewIndex((newIndex: number) => {
                    index = newIndex
                    setIndex(index)
                })
            })

            // @ts-ignore
            cleanup(() => {
                el.removeEventListener('dragstart', onDragStart)
                el.removeEventListener('dragover', onDragOver)
                el.removeEventListener('drop', onDrop)
                el.removeEventListener('touchstart', onTouchStart)
                el.removeEventListener('touchmove', onTouchMove)
                el.removeEventListener('touchend', onTouchEnd)
            })
        }
    )
}

export default sortable
