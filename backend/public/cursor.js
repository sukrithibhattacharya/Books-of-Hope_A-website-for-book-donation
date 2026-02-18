// Select the custom cursor element
const customCursor = document.querySelector('.custom-cursor');

// Track mouse movement and position the custom cursor
document.addEventListener('mousemove', (e) => {
  customCursor.style.left = `${e.pageX}px`;
  customCursor.style.top = `${e.pageY}px`;
});
