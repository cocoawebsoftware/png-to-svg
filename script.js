function convert() {
  const file = document.getElementById("fileInput").files[0];
  if (!file) return alert("ファイル選んで");

  const reader = new FileReader();

  reader.onload = function(e) {
    const img = new Image();
    img.src = e.target.result;

    img.onload = function() {

      ImageTracer.imageToSVG(
        img.src,
        function(svg) {

          document.getElementById("preview").innerHTML = svg;

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

          // 👇 ここが重要
          colorsampling: 2,   // 自動カラー検出
          numberofcolors: 16, // 色数（増やすとリアル）
          mincolorratio: 0.02 // 小さい色を無視
        }
      );

    };
  };

  reader.readAsDataURL(file);
}
