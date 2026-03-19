function convert() {
  const file = document.getElementById("fileInput").files[0];
  if (!file) return alert("ファイル選んで");

  const reader = new FileReader();

  reader.onload = function(e) {
    const img = new Image();
    img.src = e.target.result;

    img.onload = function() {

      // 🔥 ここが本物ベクター化
      ImageTracer.imageToSVG(
        img.src,
        function(svg) {

          // プレビュー表示
          document.getElementById("preview").innerHTML = svg;

          // ダウンロード用
          const blob = new Blob([svg], { type: "image/svg+xml" });
          const url = URL.createObjectURL(blob);

          const link = document.getElementById("download");
          link.href = url;
          link.download = "output.svg";
          link.style.display = "block";
          link.textContent = "SVGダウンロード";
        },

        {
          // 🔥 ここ調整すると品質変わる
          ltres: 1,   // 線の精度
          qtres: 1,   // 曲線の滑らかさ
          pathomit: 8, // 小さいノイズ除去
          colorsampling: 0, // 0=白黒
          numberofcolors: 2
        }
      );

    };
  };

  reader.readAsDataURL(file);
}
