const range = document.getElementById("colorRange");
const colorText = document.getElementById("colorValue");

range.oninput = () => {
  colorText.textContent = range.value;
};

function convert() {
  const file = document.getElementById("fileInput").files[0];
  if (!file) return alert("ファイル選んで");

  const reader = new FileReader();

  reader.onload = function(e) {
    const img = new Image();
    img.src = e.target.result;

    img.onload = function() {

      const width = img.width;
      const height = img.height;

      const colors = parseInt(range.value);

      ImageTracer.imageToSVG(
        img.src,
        function(svg) {

          // SVGサイズを元画像に合わせる
          svg = svg.replace(
            "<svg",
            `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"`
          );

          // 表示（CSSでアスペクト比維持しつつ縮小）
          document.getElementById("preview").innerHTML = svg;

          // ダウンロード
          const blob = new Blob([svg], { type: "image/svg+xml" });
          const url = URL.createObjectURL(blob);

          const link = document.getElementById("download");
          link.href = url;
          link.download = "output.svg";
          link.style.display = "block";
          link.textContent = "SVGダウンロード";
        },

        {
          ltres: 1,
          qtres: 1,
          pathomit: 8,
          colorsampling: 2,
          numberofcolors: colors,
          mincolorratio: 0.02
        }
      );

    };
  };

  reader.readAsDataURL(file);
}
