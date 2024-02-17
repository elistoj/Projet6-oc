// Declaration of the index of the media currently displayed in the lightbox
let currentMediaIndex = 0;

// Function to open the lightbox
function openLightbox(media, mediaList, photographerName) {
  // Retrieve the lightbox element by its ID
  const lightbox = document.getElementById('lightbox');
  // Retrieve the content of the lightbox
  const lightboxContent = lightbox.querySelector('.lightbox-content');
  // Retrieve the element to display the media title in the lightbox
  const mediaTitle = lightbox.querySelector('#mediaTitle');

  // Display the title of the current media
  mediaTitle.textContent = media.title;

  // Clear previous content of the lightbox
  lightboxContent.innerHTML = '';

  // Create the image or video in the lightbox
  const mediaInstance = MediaFactory.createMedia(media, photographerName);
  const mediaElement = mediaInstance.render();
  lightboxContent.appendChild(mediaElement);

  // Display the lightbox
  lightbox.style.display = 'block';

  // Add event listener for Enter key press to close lightbox
  document.addEventListener('keydown', handleKeyboardNavigation);

  // Set tabindex for close button
  const closeButton = document.querySelector('.close-btn');
  closeButton.setAttribute('tabindex', '0');
  closeButton.focus();

  // Add event listener for closing lightbox with Enter key
  closeButton.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      closeLightbox();
    }
  });

  // Add event listeners for previous and next buttons
  const prevMediaButton = document.getElementById('prevMediaButton');
  const nextMediaButton = document.getElementById('nextMediaButton');
  prevMediaButton.addEventListener('click', () => showPreviousMedia(mediaList, photographerName));
  nextMediaButton.addEventListener('click', () => showNextMedia(mediaList, photographerName));

  // Add tabindex for previous and next media buttons
  prevMediaButton.setAttribute('tabindex', '0');
  nextMediaButton.setAttribute('tabindex', '0');
}

// Function to close the lightbox
function closeLightbox() {
  // Retrieve the lightbox element by its ID
  const lightbox = document.getElementById('lightbox');
  // Hide the lightbox by setting its display style to 'none'
  lightbox.style.display = 'none';

  // Remove event listener for keyboard navigation
  document.removeEventListener('keydown', handleKeyboardNavigation);
}

// Function to handle keyboard navigation
function handleKeyboardNavigation(event) {
  if (event.key === 'Escape') {
    closeLightbox();
  }
}

// Add event listener for Escape key press to close lightbox
document.addEventListener('keydown', handleKeyboardNavigation);

// Add event listener for closing lightbox with close button
document.querySelector('.close-btn').addEventListener('click', closeLightbox);

// Function to show the previous media in the lightbox
function showPreviousMedia(mediaList, photographerName) {
  // Calculate the index of the previous media
  currentMediaIndex = (currentMediaIndex - 1 + mediaList.length) % mediaList.length;
  // Display the media with the calculated index
  displayMedia(mediaList, currentMediaIndex, photographerName);
}

// Function to show the next media in the lightbox
function showNextMedia(mediaList, photographerName) {
  // Calculate the index of the next media
  currentMediaIndex = (currentMediaIndex + 1) % mediaList.length;
  // Display the media with the calculated index
  displayMedia(mediaList, currentMediaIndex, photographerName);
}

// Function to display a specific media in the lightbox
function displayMedia(mediaList, index, photographerName) {
  // Retrieve the content of the lightbox
  const lightboxContent = document.querySelector('.lightbox-content');
  // Retrieve the element to display the title of the media in the lightbox
  const mediaTitle = document.querySelector('#mediaTitle');
  // Retrieve the media at the specified index
  const media = mediaList[index];

  // Display the title of the media
  mediaTitle.textContent = media.title;

  // Clear previous content of the lightbox
  lightboxContent.innerHTML = '';

  // Create the image or video in the lightbox
  const mediaInstance = MediaFactory.createMedia(media, photographerName);
  const mediaElement = mediaInstance.render();
  lightboxContent.appendChild(mediaElement);

  // Display the lightbox
  lightbox.style.display = 'block';
}
