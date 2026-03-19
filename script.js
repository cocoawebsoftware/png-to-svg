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

      ImageTracer.imageToSVG(
        img.src,
        function(svg) {

          // 🔥 SVGにサイズを強制追加
          svg = svg.replace(
            "<svg",
            `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"`
          );

          // プレビュー表示
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
          numberofcolors: 16
        }
      );

    };
  };

  reader.readAsDataURL(file);
}
