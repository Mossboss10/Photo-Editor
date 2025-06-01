const upload = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let img = new Image();

upload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (evt) {
      img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
      }
      img.src = evt.target.result;
    }
    reader.readAsDataURL(file);
  }
});

function applyPreset(type) {
  if (!img.src) return;
  ctx.drawImage(img, 0, 0);
  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let data = imageData.data;

  if (type === 'normal') {
    // Brighten and increase contrast
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, data[i] * 1.08 + 24);     // R
      data[i+1] = Math.min(255, data[i+1] * 1.08 + 24); // G
      data[i+2] = Math.min(255, data[i+2] * 1.08 + 24); // B
    }
  } else if (type === 'insane') {
    // "Insane" effect: invert, shift, and saturate
    for (let i = 0; i < data.length; i += 4) {
      // Invert & strong channel swap
      let r = data[i], g = data[i+1], b = data[i+2];
      data[i] = 255 - b;        // R <- invert B
      data[i+1] = 255 - r;      // G <- invert R
      data[i+2] = 255 - g;      // B <- invert G
      // Optional: boost effect
      data[i] = Math.min(255, data[i] * 1.5);
      data[i+1] = Math.min(255, data[i+1] * 1.5);
      data[i+2] = Math.min(255, data[i+2] * 1.5);
    }
  }
  // More presets can be added

  ctx.putImageData(imageData, 0, 0);
}

function downloadImage() {
  if (!canvas.width || !canvas.height) return;
  const link = document.createElement('a');
  link.download = 'edited-image.png';
  link.href = canvas.toDataURL();
  link.click();
}
