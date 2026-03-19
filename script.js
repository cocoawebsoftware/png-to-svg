const dropArea = document.getElementById("dropArea");
const fileInput = document.getElementById("fileInput");
const beforeImg = document.getElementById("before");

let currentFile = null;

// ドロップ
dropArea.onclick = () => fileInput.click();

dropArea.ondragover = e => {
  e.preventDefault();
  dropArea.classList.add("hover");
};

dropArea.ondragleave = () => {
  dropArea.classList.remove("hover");
};

dropArea.ondrop = e => {
  e.preventDefault();
  dropArea.classList.remove("hover");

  const file = e.dataTransfer.files[0];
  if (file) loadFile(file);
};

fileInput.onchange = () => {
  if (fileInput.files[0]) loadFile(fileInput.files[0]);
};

function loadFile(file) {
  currentFile = file;
  const url = URL.createObjectURL(file);
  beforeImg.src = url;
}

// プリセット
function setPreset(type) {
  if (type === "logo") {
    colors.value = 8;
    ltres.value = 0.5;
    qtres.value = 0.5;
    pathomit.value = 10;
  }
  if (type === "photo") {
    colors.value = 32;
    ltres.value = 1;
    qtres.value = 1;
    pathomit.value = 5;
  }
  if (type === "icon") {
    colors.value = 16;
    ltres.value = 0.8;
    qtres.value = 0.8;
    pathomit.value = 12;
  }
}

function convert() {
  if (!currentFile) return alert("画像入れて");

  const loading = document.getElementById("loading");
  const preview = document.getElementById("preview");
  const link = document.getElementById("download");

  loading.style.display = "block";
  preview.innerHTML = "";
  link.style.display = "none";

  const reader = new FileReader();

  reader.onload = function(e) {
    const img = new Image();
    img.src = e.target.result;

    img.onload = function() {

      const width = img.width;
      const height = img.height;

      const options = {
        ltres: parseFloat(ltres.value),
        qtres: parseFloat(qtres.value),
        pathomit: parseInt(pathomit.value),
        colorsampling: mode.value === "bw" ? 0 : 2,
        numberofcolors: parseInt(colors.value),
        mincolorratio: parseFloat(mincolorratio.value)
      };

      ImageTracer.imageToSVG(img.src, function(svg) {

        svg = svg.replace(
          "<svg",
          `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"`
        );

        preview.innerHTML = svg;

        const blob = new Blob([svg], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);

        link.href = url;
        link.download = "output.svg";
        link.style.display = "block";

        loading.style.display = "none";

      }, options);

    };
  };

  reader.readAsDataURL(currentFile);
}
