const dropArea=document.getElementById("dropArea"),fileInput=document.getElementById("fileInput"),
beforeImg=document.getElementById("before"),preview=document.getElementById("preview"),
downloadBtn=document.getElementById("download"),presets=document.querySelectorAll(".preset-btn"),
modes=document.querySelectorAll(".mode-btn"),toggleBtns=document.querySelectorAll(".toggle-btn");

let currentFile=null,currentPreset="custom";

dropArea.onclick=()=>fileInput.click();
dropArea.ondragover=e=>{ e.preventDefault(); dropArea.classList.add("hover"); };
dropArea.ondragleave=()=>dropArea.classList.remove("hover");
dropArea.ondrop=e=>{ e.preventDefault(); dropArea.classList.remove("hover"); loadFile(e.dataTransfer.files[0]); };
fileInput.onchange=()=>loadFile(fileInput.files[0]);

function loadFile(file){ currentFile=file; beforeImg.src=URL.createObjectURL(file); }

// プリセット選択
presets.forEach(btn=>{
  btn.addEventListener("click",()=>{
    presets.forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    setPreset(btn.dataset.preset);
  });
});

// カスタム自動切替
document.querySelectorAll('#advancedSettings input[type="range"]').forEach(sl=>{
  sl.addEventListener('input',()=>{
    if(currentPreset!=="custom"){ currentPreset="custom"; document.getElementById("customPreset").classList.add("active"); }
  });
});

// infoクリック
document.querySelectorAll('.info-icon').forEach(icon=>{ icon.addEventListener('click',()=>alert(icon.dataset.info)); });

// カラー/白黒切替
modes.forEach(btn=>{
  btn.addEventListener('click',()=>{
    modes.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// 比較切替
document.getElementById("showBefore").addEventListener('click',()=>{
  beforeImg.style.display="block"; preview.style.display="none";
  toggleBtns.forEach(b=>b.classList.remove("active")); document.getElementById("showBefore").classList.add("active");
});
document.getElementById("showAfter").addEventListener('click',()=>{
  beforeImg.style.display="none"; preview.style.display="block";
  toggleBtns.forEach(b=>b.classList.remove("active")); document.getElementById("showAfter").classList.add("active");
});

// スライダー値更新
document.querySelectorAll('#advancedSettings input[type="range"]').forEach(sl=>{
  const span=document.getElementById(sl.id+"Val"); if(span){ sl.addEventListener('input',()=>{ span.textContent=sl.value; }); }
});

// SVG最適化
function optimizeSVG(svg){ return svg.replace(/(\d+\.\d{2})\d+/g,"$1").replace(/\n/g,"").replace(/\s{2,}/g," ").replace(/<path d=""/g,""); }

// 変換
function convert(){
  if(!currentFile)return alert("画像入れて");
  const link=downloadBtn; preview.innerHTML="";
  const reader=new FileReader();
  reader.onload=function(e){
    const img=new Image(); img.src=e.target.result;
    img.onload=function(){
      const w=img.width,h=img.height;
      const options={
        ltres:parseFloat(ltres.value), qtres:parseFloat(qtres.value),
        pathomit:parseInt(pathomit.value),
        colorsampling:document.querySelector('.mode-btn.active').dataset.mode==="bw"?0:2,
        numberofcolors:parseInt(colors.value),
        mincolorratio:parseFloat(mincolorratio.value)
      };
      ImageTracer.imageToSVG(img.src,function(svg){
        svg=svg.replace("<svg",`<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"`);
        if(document.getElementById("optimize").checked) svg=optimizeSVG(svg);
        preview.innerHTML=svg;
        const blob=new Blob([svg],{type:"image/svg+xml"}),url=URL.createObjectURL(blob);
        link.href=url; link.download="output.svg";
      },options);
    };
  };
  reader.readAsDataURL(currentFile);
}

// プリセット初期値設定
function setPreset(type){
  currentPreset=type;
  if(type==="logo"){ colors.value=8; ltres.value=0.5; qtres.value=0.5; pathomit.value=10; }
  if(type==="photo"){ colors.value=32; ltres.value=1; qtres.value=1; pathomit.value=5; }
  if(type==="icon"){ colors.value=16; ltres.value=0.8; qtres.value=0.8; pathomit.value=12; }
}
