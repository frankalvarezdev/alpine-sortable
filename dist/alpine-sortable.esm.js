// src/index.ts
var sortable = (Alpine) => {
  const sortableState = Alpine.reactive({
    selecteIndex: null,
    clonedDragElement: null,
    originalDragElement: null
  });
  Alpine.directive(
    "sortable",
    (element, { expression, value }, { evaluate, evaluateLater, effect, cleanup }) => {
      const el = element;
      const items = evaluate(value);
      const swapElements = (index1, index2) => {
        const temp = items[index1];
        items[index1] = items[index2];
        items[index2] = temp;
      };
      let index = evaluate(expression);
      let getNewIndex = evaluateLater(expression);
      el.setAttribute("draggable", "true");
      const setIndex = (index2) => {
        el.setAttribute("data-draggable-index", String(index2));
      };
      const onDragStart = () => {
        sortableState.selecteIndex = index;
      };
      const onDragOver = (event) => {
        event.preventDefault();
      };
      const onDrop = () => {
        if (sortableState.selecteIndex === null)
          return;
        swapElements(sortableState.selecteIndex, index);
      };
      el.addEventListener("dragstart", onDragStart);
      el.addEventListener("dragover", onDragOver);
      el.addEventListener("drop", onDrop);
      const onTouchStart = () => {
        sortableState.selecteIndex = index;
        sortableState.originalDragElement = el;
        const clone = el.cloneNode(true);
        clone.setAttribute("x-ignore", "");
        clone.style.position = "fixed";
        clone.style.boxSizing = "border-box";
        clone.style.zIndex = "999999";
        clone.style.opacity = "0";
        clone.style.pointerEvents = "none";
        clone.style.transition = "none";
        clone.style.width = el.offsetWidth * 0.8 + "px";
        clone.style.height = el.offsetHeight * 0.8 + "px";
        document.body.appendChild(clone);
        sortableState.clonedDragElement = clone;
      };
      const onTouchMove = (event) => {
        event.preventDefault();
        if (!sortableState.clonedDragElement)
          return;
        const touch = event.changedTouches[0];
        const position = {
          left: touch.clientX - sortableState.clonedDragElement.offsetWidth / 2 + "px",
          top: touch.clientY - sortableState.clonedDragElement.offsetHeight / 2 + "px"
        };
        sortableState.clonedDragElement.style.left = position.left;
        sortableState.clonedDragElement.style.top = position.top;
        sortableState.clonedDragElement.style.opacity = "0.5";
      };
      const onTouchEnd = (event) => {
        if (sortableState.clonedDragElement) {
          sortableState.clonedDragElement.remove();
          sortableState.clonedDragElement = null;
        }
        let element2 = document.elementFromPoint(
          event.changedTouches[0].clientX,
          event.changedTouches[0].clientY
        );
        if (!element2)
          return;
        if (sortableState.selecteIndex === null)
          return;
        const hasDraggableAttribute = (element3) => {
          if (!element3)
            return false;
          return element3.getAttribute("draggable") === "true";
        };
        let draggableParent = null;
        for (let i = 0; i < 4; i++) {
          if (hasDraggableAttribute(element2)) {
            draggableParent = element2;
            break;
          }
          if (!element2.parentElement)
            break;
          element2 = element2.parentElement;
        }
        if (!draggableParent)
          return;
        if (draggableParent === sortableState.originalDragElement)
          return;
        let dropIndexData = draggableParent.getAttribute("data-draggable-index");
        if (!dropIndexData === null)
          return;
        const dropIndex = Number(dropIndexData);
        swapElements(sortableState.selecteIndex, dropIndex);
        sortableState.originalDragElement = null;
        sortableState.clonedDragElement = null;
      };
      el.addEventListener("touchstart", onTouchStart);
      el.addEventListener("touchmove", onTouchMove);
      el.addEventListener("touchend", onTouchEnd);
      effect(() => {
        getNewIndex((newIndex) => {
          index = newIndex;
          setIndex(index);
        });
      });
      cleanup(() => {
        el.removeEventListener("dragstart", onDragStart);
        el.removeEventListener("dragover", onDragOver);
        el.removeEventListener("drop", onDrop);
        el.removeEventListener("touchstart", onTouchStart);
        el.removeEventListener("touchmove", onTouchMove);
        el.removeEventListener("touchend", onTouchEnd);
      });
    }
  );
};
var src_default = sortable;
export {
  src_default as default
};
