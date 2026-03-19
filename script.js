const colorSlider = document.getElementById("colors");
const colorVal = document.getElementById("colorVal");

colorSlider.oninput = () => {
  colorVal.textContent = colorSlider.value;
};

function convert() {
  const file = document.getElementById("fileInput").files[0];
  if (!file) return alert("ファイル選択");

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
        ltres: parseFloat(document.getElementById("ltres").value),
        qtres: parseFloat(document.getElementById("qtres").value),
        pathomit: parseInt(document.getElementById("pathomit").value),
        colorsampling: document.getElementById("mode").value === "bw" ? 0 : 2,
        numberofcolors: parseInt(colorSlider.value),
        mincolorratio: parseFloat(document.getElementById("mincolorratio").value)
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

  reader.readAsDataURL(file);
}
