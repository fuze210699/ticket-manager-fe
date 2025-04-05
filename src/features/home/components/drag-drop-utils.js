/**
 * Adds visual styling when an element is being dragged over
 * @param {Event} event - The drag over event
 * @param {Boolean} isEditMode - Whether the dashboard is in edit mode
 */
export const handleDragOver = (event, isEditMode) => {
  if (!isEditMode) return;
  event.preventDefault();

  // Add drop-target class to the element being dragged over
  const element = event.currentTarget;
  element.classList.add('drop-target');

  // Add visual feedback for drop zones
  const dropZone = element.querySelector('.drop-zone');
  if (dropZone) {
    dropZone.classList.add('drop-zone-active');
  }
};

/**
 * Removes visual styling when dragging leaves an element
 * @param {Event} event - The drag leave event
 * @param {Boolean} isEditMode - Whether the dashboard is in edit mode
 */
export const handleDragLeave = (event, isEditMode) => {
  if (!isEditMode) return;

  // Remove drop-target class when leaving the element
  const element = event.currentTarget;
  element.classList.remove('drop-target');

  // Remove visual feedback for drop zones
  const dropZone = element.querySelector('.drop-zone');
  if (dropZone) {
    dropZone.classList.remove('drop-zone-active');
  }
};

/**
 * Cleans up all drag-related visual styling
 * @param {Event} event - The drag end event
 */
export const handleDragEnd = () => {
  // Remove dragging class from all elements
  document.querySelectorAll('.dragging').forEach(el => {
    el.classList.remove('dragging');
    el.style.opacity = '1';
    el.style.transform = 'scale(1)';
  });

  // Remove drop-target class from all elements
  document.querySelectorAll('.drop-target').forEach(el => {
    el.classList.remove('drop-target');
  });

  // Remove visual feedback from all drop zones
  document.querySelectorAll('.drop-zone-active').forEach(el => {
    el.classList.remove('drop-zone-active');
  });
};

/**
 * Sets up a drag operation for a widget
 * @param {Event} event - The drag start event
 * @param {Object} widget - The widget being dragged
 * @param {Boolean} isEditMode - Whether the dashboard is in edit mode
 */
export const handleWidgetDragStart = (event, widget, isEditMode) => {
  if (!isEditMode) return;

  event.dataTransfer.setData('text/plain', widget.name);

  // Add dragging class to the dragged element
  const element = event.target;
  element.classList.add('dragging');
  element.style.opacity = '0.5';
  element.style.transform = 'scale(1.05)';
};

/**
 * Sets up a drag operation for reordering widgets
 * @param {Number} index - The index of the widget being dragged
 * @param {Boolean} isEditMode - Whether the dashboard is in edit mode
 */
export const startWidgetDrag = (index, isEditMode) => {
  if (!isEditMode) return;

  const element = document.querySelector(`[data-index="${index}"]`);
  if (element) {
    element.setAttribute('draggable', true);
    if (event) {
      event.dataTransfer.setData('text/plain', 'reorder');
    }
  }
};
