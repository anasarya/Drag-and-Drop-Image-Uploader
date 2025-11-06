const dropArea = document.getElementById("drop-area");
const fileInput = document.getElementById("fileInput");
const progressBar = document.getElementById("progressBar");
const errorMsg = document.getElementById("errorMsg");
const imageList = document.getElementById("imageList");
const clearBtn = document.getElementById("clearBtn");

// Load stored images on page load
window.addEventListener("DOMContentLoaded", () => {
  const savedImages = JSON.parse(localStorage.getItem("uploadedImages")) || [];
  savedImages.forEach(src => displayImage(src));
});

// Drag and drop events
dropArea.addEventListener("click", () => fileInput.click());

dropArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropArea.classList.add("dragover");
});

dropArea.addEventListener("dragleave", () => {
  dropArea.classList.remove("dragover");
});

dropArea.addEventListener("drop", (e) => {
  e.preventDefault();
  dropArea.classList.remove("dragover");
  const file = e.dataTransfer.files[0];
  handleFile(file);
});

fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  handleFile(file);
});

function handleFile(file) {
  errorMsg.textContent = "";
  if (!file) return;

  const validTypes = ["image/jpeg", "image/png", "image/gif"];
  if (!validTypes.includes(file.type)) {
    errorMsg.textContent = "❌ Invalid file type. Only JPG, PNG, GIF allowed.";
    return;
  }

  simulateUpload(file);
}

function simulateUpload(file) {
  progressBar.style.width = "0%";
  let progress = 0;

  const interval = setInterval(() => {
    progress += 10;
    progressBar.style.width = progress + "%";

    if (progress >= 100) {
      clearInterval(interval);
      previewImage(file);
    }
  }, 100);
}

function previewImage(file) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const src = e.target.result;
    displayImage(src);

    const savedImages = JSON.parse(localStorage.getItem("uploadedImages")) || [];
    savedImages.push(src);
    localStorage.setItem("uploadedImages", JSON.stringify(savedImages));
  };
  reader.readAsDataURL(file);
}

function displayImage(src) {
  const img = document.createElement("img");
  img.src = src;
  imageList.appendChild(img);
}

// Clear all stored images
clearBtn.addEventListener("click", () => {
  localStorage.removeItem("uploadedImages");
  imageList.innerHTML = "";
  alert("🧹 All images cleared successfully!");
});
