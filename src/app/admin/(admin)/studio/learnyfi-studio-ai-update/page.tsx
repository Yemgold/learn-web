


// "use client";

// import "./studio.css";

// import {
//   AudioLines, ChevronDown, CircleHelp, Clapperboard, Download, Film, FolderOpen,
//   Image as ImageIcon, Layers3, Maximize2, Music2, Pause, Play,
//   Plus, Settings2, SkipBack, SkipForward, Split, Trash2,
//   Upload, Volume2, WandSparkles
// } from "lucide-react";
// import React, { ChangeEvent, DragEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";

// type MediaKind = "video" | "image" | "audio";
// type TrackKind = "video" | "overlay" | "audio";
// type Asset = { id: string; name: string; kind: MediaKind; url: string; duration: number; file: File; width?: number; height?: number };
// type Clip = { id: string; assetId: string; track: TrackKind; start: number; duration: number; sourceStart: number; color: string };
// const TRACKS: { id: TrackKind; label: string; icon: React.ReactNode; color: string }[] = [
//   { id: "video", label: "Video", icon: <Film size={15}/>, color: "blue" },
//   { id: "overlay", label: "Overlay / BG", icon: <ImageIcon size={15}/>, color: "teal" },
//   { id: "audio", label: "Audio", icon: <Music2 size={15}/>, color: "purple" },
// ];
// const uid = () => Math.random().toString(36).slice(2, 10);
// const fmt = (n: number) => `${Math.floor(n / 60).toString().padStart(2,"0")}:${Math.floor(n % 60).toString().padStart(2,"0")}.${Math.floor((n % 1) * 10)}`;
// const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

// export default function Home() {
//   const [assets, setAssets] = useState<Asset[]>([]);
//   const [clips, setClips] = useState<Clip[]>([]);
//   const [selectedClipId, setSelectedClipId] = useState<string | null>(null);
//   const [playhead, setPlayhead] = useState(0);
//   const [playing, setPlaying] = useState(false);
//   const [activeTab, setActiveTab] = useState<"media" | "backgrounds" | "audio">("media");
//   const [projectName, setProjectName] = useState("Untitled project");
//   const [zoom, setZoom] = useState(48);
//   const [notice, setNotice] = useState("Import media to begin editing");
//   const [exporting, setExporting] = useState(false);
//   const [removingBackground, setRemovingBackground] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const previewVideoRef = useRef<HTMLVideoElement>(null);
//   const previewAudioRef = useRef<HTMLAudioElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const exportRecorderRef = useRef<MediaRecorder | null>(null);
//   const rafRef = useRef<number | null>(null);
//   const lastTickRef = useRef<number>(0);

//   const assetById = useMemo(() => new Map(assets.map(a => [a.id, a])), [assets]);
//   const selectedClip = clips.find(c => c.id === selectedClipId) ?? null;
//   const selectedAsset = selectedClip ? assetById.get(selectedClip.assetId) ?? null : null;
//   const duration = Math.max(30, ...clips.map(c => c.start + c.duration));
//   const currentVideoClip = useMemo(() => clips
//     .filter(c => c.track === "video" && playhead >= c.start && playhead < c.start + c.duration)
//     .sort((a,b) => b.start - a.start)[0], [clips, playhead]);
//   const currentOverlayClip = useMemo(() => clips
//     .filter(c => c.track === "overlay" && playhead >= c.start && playhead < c.start + c.duration)
//     .sort((a,b) => b.start - a.start)[0], [clips, playhead]);
//   const currentAudioClip = useMemo(() => clips
//     .filter(c => c.track === "audio" && playhead >= c.start && playhead < c.start + c.duration)
//     .sort((a,b) => b.start - a.start)[0], [clips, playhead]);
//   const videoAsset = currentVideoClip ? assetById.get(currentVideoClip.assetId) : undefined;
//   const overlayAsset = currentOverlayClip ? assetById.get(currentOverlayClip.assetId) : undefined;
//   const audioAsset = currentAudioClip ? assetById.get(currentAudioClip.assetId) : undefined;

//   const addFiles = useCallback((files: FileList | File[]) => {
//     const supported = Array.from(files).filter(f => f.type.startsWith("video/") || f.type.startsWith("image/") || f.type.startsWith("audio/"));
//     if (!supported.length) { setNotice("Choose a video, image, or audio file."); return; }
//     const newAssets: Asset[] = supported.map(file => ({
//       id: uid(), name: file.name, kind: file.type.startsWith("video/") ? "video" : file.type.startsWith("image/") ? "image" : "audio",
//       url: URL.createObjectURL(file), duration: file.type.startsWith("image/") ? 10 : 0, file
//     }));
//     setAssets(prev => [...prev, ...newAssets]);
//     setNotice(`${newAssets.length} media item${newAssets.length === 1 ? "" : "s"} imported`);
//     newAssets.forEach(asset => {
//       if (asset.kind === "video" || asset.kind === "audio") {
//         const el = document.createElement(asset.kind);
//         el.preload = "metadata";
//         el.src = asset.url;
//         el.onloadedmetadata = () => setAssets(prev => prev.map(a => a.id === asset.id ? { ...a, duration: Number.isFinite(el.duration) ? el.duration : 10, width: asset.kind === "video" ? (el as HTMLVideoElement).videoWidth : undefined, height: asset.kind === "video" ? (el as HTMLVideoElement).videoHeight : undefined } : a));
//         el.onerror = () => setAssets(prev => prev.map(a => a.id === asset.id ? { ...a, duration: 10 } : a));
//       }
//     });
//   }, []);

//   const addAssetToTimeline = (asset: Asset, requestedTrack?: TrackKind) => {
//     const track = requestedTrack ?? (asset.kind === "audio" ? "audio" : asset.kind === "image" ? "overlay" : "video");
//     const clip: Clip = { id: uid(), assetId: asset.id, track, start: playhead, duration: Math.max(1, asset.duration || 10), sourceStart: 0,
//       color: track === "video" ? "blue" : track === "overlay" ? "teal" : "purple" };
//     setClips(prev => [...prev, clip]);
//     setSelectedClipId(clip.id);
//     setNotice(`${asset.name} added to ${track} track`);
//   };

//   const onUpload = (e: ChangeEvent<HTMLInputElement>) => { if (e.target.files) addFiles(e.target.files); e.target.value = ""; };
//   const onDrop = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files); };

//   const updateClip = (id: string, patch: Partial<Clip>) => setClips(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c));
//   const deleteSelected = () => {
//     if (!selectedClipId) return;
//     setClips(prev => prev.filter(c => c.id !== selectedClipId));
//     setSelectedClipId(null);
//     setNotice("Clip removed from timeline");
//   };
//   const splitSelected = () => {
//     if (!selectedClip) { setNotice("Select a timeline clip first"); return; }
//     const local = playhead - selectedClip.start;
//     if (local < 0.25 || local > selectedClip.duration - 0.25) { setNotice("Move the playhead inside the selected clip to split it"); return; }
//     const first: Clip = { ...selectedClip, duration: local };
//     const second: Clip = { ...selectedClip, id: uid(), start: playhead, sourceStart: selectedClip.sourceStart + local, duration: selectedClip.duration - local };
//     setClips(prev => prev.flatMap(c => c.id === selectedClip.id ? [first, second] : [c]));
//     setSelectedClipId(second.id);
//     setNotice("Clip split at playhead");
//   };
//   const trimStart = (value: number) => {
//     if (!selectedClip) return;
//     const delta = value - selectedClip.start;
//     const newDuration = selectedClip.duration - delta;
//     if (newDuration < 0.25) return;
//     updateClip(selectedClip.id, { start: value, sourceStart: selectedClip.sourceStart + delta, duration: newDuration });
//   };
//   const removeSelectedBackground = async () => {
//     if (!selectedAsset) {
//       setNotice("Select an image clip on the timeline first.");
//       return;
//     }
//     if (selectedAsset.kind !== "image") {
//       setNotice("AI removal currently supports image clips. Video background removal needs a separate frame-by-frame processing pipeline.");
//       return;
//     }

//     setRemovingBackground(true);
//     setNotice("Loading the local browser AI model. The first run may take a while…");
//     try {
//       const { removeBackground } = await import("@imgly/background-removal");
//       const transparentBlob = await removeBackground(selectedAsset.file);
//       const outputFile = new File(
//         [transparentBlob],
//         `${selectedAsset.name.replace(/\.[^.]+$/, "")}-no-background.png`,
//         { type: "image/png" }
//       );
//       const outputAsset: Asset = {
//         id: uid(),
//         name: outputFile.name,
//         kind: "image",
//         url: URL.createObjectURL(outputFile),
//         duration: selectedClip?.duration ?? 10,
//         file: outputFile,
//       };
//       setAssets(prev => [...prev, outputAsset]);
//       const outputClip: Clip = {
//         id: uid(),
//         assetId: outputAsset.id,
//         track: "overlay",
//         start: playhead,
//         duration: Math.max(1, selectedClip?.duration ?? 10),
//         sourceStart: 0,
//         color: "teal",
//       };
//       setClips(prev => [...prev, outputClip]);
//       setSelectedClipId(outputClip.id);
//       setNotice("Background removed. Transparent PNG added to the Overlay / BG track.");
//     } catch (error) {
//       console.error("Background removal failed:", error);
//       setNotice("Background removal failed. Check your connection and try again; the AI model may need to download first.");
//     } finally {
//       setRemovingBackground(false);
//     }
//   };

//   const saveProject = () => {
//     const data = { version: 1, projectName, clips: clips.map(({id, assetId, track, start, duration, sourceStart, color}) => ({id, assetId, track, start, duration, sourceStart, color})), media: assets.map(a => ({id:a.id,name:a.name,kind:a.kind,duration:a.duration})) };
//     const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
//     const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `${projectName.replace(/[^a-z0-9-_]+/gi,"-") || "project"}.json`; a.click(); URL.revokeObjectURL(url);
//     setNotice("Project edit data saved. Keep your original media files with it.");
//   };

//   useEffect(() => {
//     const v = previewVideoRef.current;
//     if (!v) return;
//     if (videoAsset?.kind === "video") {
//       if (v.dataset.asset !== videoAsset.id) { v.src = videoAsset.url; v.dataset.asset = videoAsset.id; }
//       const localTime = Math.max(0, (currentVideoClip ? currentVideoClip.sourceStart : 0) + playhead - (currentVideoClip?.start ?? 0));
//       if (Math.abs(v.currentTime - localTime) > 0.35) { try { v.currentTime = localTime; } catch {} }
//       if (playing) v.play().catch(() => setPlaying(false)); else v.pause();
//     } else { v.pause(); }
//     const a = previewAudioRef.current;
//     if (a) {
//       if (audioAsset?.kind === "audio") {
//         if (a.dataset.asset !== audioAsset.id) { a.src = audioAsset.url; a.dataset.asset = audioAsset.id; }
//         const t = Math.max(0, (currentAudioClip?.sourceStart ?? 0) + playhead - (currentAudioClip?.start ?? 0));
//         if (Math.abs(a.currentTime - t) > 0.5) { try { a.currentTime = t; } catch {} }
//         if (playing) a.play().catch(() => {}); else a.pause();
//       } else { a.pause(); }
//     }
//   }, [videoAsset?.id, audioAsset?.id, playhead, playing, currentVideoClip?.id, currentAudioClip?.id]);

//   useEffect(() => {
//     if (!playing) { if (rafRef.current) cancelAnimationFrame(rafRef.current); return; }
//     const tick = (now: number) => {
//       if (!lastTickRef.current) lastTickRef.current = now;
//       const delta = (now - lastTickRef.current) / 1000;
//       lastTickRef.current = now;
//       setPlayhead(prev => {
//         const next = prev + delta;
//         if (next >= duration) { setPlaying(false); return 0; }
//         return next;
//       });
//       rafRef.current = requestAnimationFrame(tick);
//     };
//     rafRef.current = requestAnimationFrame(tick);
//     return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); lastTickRef.current = 0; };
//   }, [playing, duration]);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;
//     const w = canvas.width, h = canvas.height;
//     ctx.fillStyle = "#10121a"; ctx.fillRect(0,0,w,h);
//     const drawCover = (source: CanvasImageSource, sw: number, sh: number) => {
//       const scale = Math.max(w / sw, h / sh); const dw = sw * scale, dh = sh * scale;
//       ctx.drawImage(source, (w-dw)/2, (h-dh)/2, dw, dh);
//     };
//     const drawOverlay = () => {
//       if (!overlayAsset) return;
//       if (overlayAsset.kind === "image") {
//         const img = new Image(); img.onload = () => { if (!videoAsset) { ctx.fillStyle="#10121a";ctx.fillRect(0,0,w,h); } drawCover(img, img.width, img.height); };
//         img.src = overlayAsset.url;
//       } else if (overlayAsset.kind === "video" && !videoAsset) {
//         const bg = document.createElement("video"); bg.muted = true; bg.src = overlayAsset.url; bg.currentTime = Math.max(0, playhead - (currentOverlayClip?.start ?? 0)); bg.onloadeddata = () => drawCover(bg, bg.videoWidth || w, bg.videoHeight || h);
//       }
//     };
//     if (videoAsset?.kind === "video" && previewVideoRef.current?.readyState && previewVideoRef.current.videoWidth) {
//       drawCover(previewVideoRef.current, previewVideoRef.current.videoWidth, previewVideoRef.current.videoHeight);
//     } else if (videoAsset?.kind === "image") {
//       const img = new Image(); img.onload = () => drawCover(img,img.width,img.height); img.src = videoAsset.url;
//     } else { ctx.fillStyle="#10121a";ctx.fillRect(0,0,w,h); }
//     drawOverlay();
//   }, [videoAsset?.id, overlayAsset?.id, playhead]);

//   const exportPreview = () => {
//     const canvas = canvasRef.current;
//     if (!canvas || !("captureStream" in canvas) || typeof MediaRecorder === "undefined") {
//       setNotice("This browser does not support canvas video export."); return;
//     }
//     try {
//       const stream = canvas.captureStream(30);
//       const mime = MediaRecorder.isTypeSupported("video/webm;codecs=vp9") ? "video/webm;codecs=vp9" : "video/webm";
//       const recorder = new MediaRecorder(stream, { mimeType: mime });
//       const chunks: BlobPart[] = [];
//       recorder.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
//       recorder.onstop = () => {
//         const blob = new Blob(chunks, { type: mime }); const url = URL.createObjectURL(blob);
//         const a = document.createElement("a"); a.href=url; a.download="learnyfi-preview.webm"; a.click(); URL.revokeObjectURL(url);
//         setExporting(false); setNotice("Preview export finished (WebM). For a final render, use the full export engine.");
//       };
//       exportRecorderRef.current = recorder; recorder.start(); setExporting(true); setNotice("Recording canvas preview for 8 seconds…");
//       const end = window.setTimeout(() => { if (recorder.state !== "inactive") recorder.stop(); }, 8000);
//       recorder.onerror = () => { window.clearTimeout(end); setExporting(false); setNotice("Export failed. Try another browser."); };
//     } catch { setNotice("Export could not start in this browser."); setExporting(false); }
//   };

//   const timelineWidth = Math.max(1200, duration * zoom);
//   const positionFromPointer = (e: React.MouseEvent<HTMLDivElement>) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     setPlayhead(clamp((e.clientX - rect.left) / zoom, 0, duration));
//   };

//   return (
//     <main className="studio" onDrop={onDrop} onDragOver={e => e.preventDefault()}>
//       <header className="topbar">
//         <div className="brand"><div className="brand-icon"><Clapperboard size={21}/></div><div><strong>Learnyfi <span>Studio</span></strong><small>VIDEO EDITOR</small></div></div>
//         <div className="project-title"><input aria-label="Project name" value={projectName} onChange={e=>setProjectName(e.target.value)}/><span className="saved-dot"/> <small>Local project</small></div>
//         <div className="top-actions"><button className="button subtle" onClick={saveProject}><FolderOpen size={16}/> Save project</button><button className="button primary" onClick={exportPreview} disabled={exporting}><Download size={16}/>{exporting ? "Exporting…" : "Export preview"}</button></div>
//       </header>

//       <section className="workspace">
//         <aside className="media-panel panel">
//           <div className="panel-heading"><div><h2>Project media</h2><p>Import and organize your assets</p></div><button className="icon-button" title="Upload media" onClick={()=>fileInputRef.current?.click()}><Plus size={18}/></button></div>
//           <input ref={fileInputRef} type="file" accept="video/*,image/*,audio/*" multiple hidden onChange={onUpload}/>
//           <button className="upload-zone" onClick={()=>fileInputRef.current?.click()}><Upload size={22}/><strong>Import media</strong><span>Video, images and audio</span><small>or drag files into the studio</small></button>
//           <div className="tab-row">
//             <button className={activeTab==="media"?"active":""} onClick={()=>setActiveTab("media")}>All media</button>
//             <button className={activeTab==="backgrounds"?"active":""} onClick={()=>setActiveTab("backgrounds")}>Backgrounds</button>
//             <button className={activeTab==="audio"?"active":""} onClick={()=>setActiveTab("audio")}>Audio</button>
//           </div>
//           <div className="asset-list">
//             {assets.filter(a => activeTab==="media" || (activeTab==="backgrounds" ? a.kind==="image" || a.kind==="video" : a.kind==="audio")).map(asset => (
//               <div className="asset-card" key={asset.id}>
//                 <button className="asset-thumb" onClick={()=>addAssetToTimeline(asset)} title="Add to timeline">
//                   {asset.kind==="image" ? <img src={asset.url} alt=""/> : asset.kind==="video" ? <video src={asset.url} muted preload="metadata"/> : <div className="audio-thumb"><AudioLines size={23}/></div>}
//                   <span className="asset-kind">{asset.kind==="video" ? <Film size={11}/> : asset.kind==="image" ? <ImageIcon size={11}/> : <Music2 size={11}/>}</span>
//                 </button>
//                 <div className="asset-info"><strong title={asset.name}>{asset.name}</strong><small>{asset.kind.toUpperCase()} · {asset.duration ? fmt(asset.duration) : "Reading…"}</small></div>
//                 <button className="mini-add" title="Add to timeline" onClick={()=>addAssetToTimeline(asset)}><Plus size={15}/></button>
//               </div>
//             ))}
//             {!assets.length && <div className="empty-assets"><ImageIcon size={25}/><span>Your media will appear here</span><small>Start by importing a file</small></div>}
//           </div>
//           <div className="panel-footer"><span>{assets.length} assets</span><span>Stored in this browser session</span></div>
//         </aside>

//         <section className="center-panel">
//           <div className="preview-header"><div><span className="eyebrow">CANVAS PREVIEW</span><h2>Composition</h2></div><div className="preview-tools"><span className="resolution">16:9 · 720p preview</span><button className="icon-button" title="Preview settings"><Settings2 size={17}/></button><button className="icon-button" title="Maximize preview"><Maximize2 size={17}/></button></div></div>
//           <div className="preview-stage">
//             <div className="preview-frame">
//               <canvas ref={canvasRef} width={1280} height={720} aria-label="Composition preview"/>
//               <video ref={previewVideoRef} className="hidden-video" playsInline muted/>
//               <audio ref={previewAudioRef} className="hidden-video"/>
//               {!videoAsset && !overlayAsset && <div className="preview-empty"><div className="empty-mark"><Clapperboard size={28}/></div><strong>Your story starts here</strong><span>Import media, then add a clip to your timeline.</span><button className="button primary" onClick={()=>fileInputRef.current?.click()}><Upload size={15}/> Import your first clip</button></div>}
//             </div>
//           </div>
//           <div className="transport">
//             <div className="time-readout"><strong>{fmt(playhead)}</strong><span>/ {fmt(duration)}</span></div>
//             <div className="transport-buttons"><button title="Jump to start" onClick={()=>setPlayhead(0)}><SkipBack size={17}/></button><button className="play-button" title={playing?"Pause":"Play"} onClick={()=>setPlaying(v=>!v)}>{playing?<Pause size={18} fill="currentColor"/>:<Play size={18} fill="currentColor"/>}</button><button title="Jump to end" onClick={()=>setPlayhead(duration)}><SkipForward size={17}/></button></div>
//             <div className="transport-right"><Volume2 size={16}/><span>Preview audio</span></div>
//           </div>
//           <div className="timeline-panel">
//             <div className="timeline-top"><div><h2>Timeline</h2><p>Arrange clips and control timing</p></div><div className="timeline-actions"><button className="button small subtle" onClick={splitSelected}><Split size={14}/> Split</button><button className="icon-button" title="Delete selected clip" onClick={deleteSelected}><Trash2 size={16}/></button><div className="zoom-control"><span>−</span><input aria-label="Timeline zoom" type="range" min="20" max="100" value={zoom} onChange={e=>setZoom(Number(e.target.value))}/><span>+</span></div></div></div>
//             <div className="timeline-scroll">
//               <div className="timeline-inner" style={{width:timelineWidth}}>
//                 <div className="ruler-row"><div className="track-label-spacer">TIME</div><div className="ruler" onClick={positionFromPointer}>{Array.from({length:Math.ceil(duration/5)+1},(_,i)=><span key={i} style={{left:i*5*zoom}}>{fmt(i*5)}</span>)}</div></div>
//                 {TRACKS.map(track => <div className="track-row" key={track.id}>
//                   <div className="track-label"><span className={`track-icon ${track.color}`}>{track.icon}</span><span>{track.label}</span><button title={`Add ${track.label} clip`} onClick={()=>fileInputRef.current?.click()}><Plus size={13}/></button></div>
//                   <div className="track-lane" onClick={positionFromPointer}>
//                     {clips.filter(c=>c.track===track.id).map(clip => {
//                       const asset=assetById.get(clip.assetId); if(!asset) return null;
//                       return <div key={clip.id} className={`timeline-clip ${clip.color} ${selectedClipId===clip.id?"selected":""}`} style={{left:clip.start*zoom,width:Math.max(30,clip.duration*zoom)}} onClick={e=>{e.stopPropagation();setSelectedClipId(clip.id);setPlayhead(clip.start)}} title={`${asset.name} · ${fmt(clip.duration)}`}>
//                         <span className="trim-handle left" onMouseDown={e=>{e.stopPropagation();e.preventDefault();const startX=e.clientX;const original=clip;const move=(ev:MouseEvent)=>{const delta=(ev.clientX-startX)/zoom;const newStart=clamp(original.start+delta,0,original.start+original.duration-.25);updateClip(original.id,{start:newStart,sourceStart:original.sourceStart+newStart-original.start,duration:original.duration-(newStart-original.start)});};const up=()=>{window.removeEventListener("mousemove",move);window.removeEventListener("mouseup",up)};window.addEventListener("mousemove",move);window.addEventListener("mouseup",up)}}/>
//                         <span className="clip-symbol">{track.id==="audio"?<AudioLines size={13}/>:track.id==="overlay"?<ImageIcon size={13}/>:<Film size={13}/>}</span><span className="clip-name">{asset.name}</span>
//                         <span className="trim-handle right" onMouseDown={e=>{e.stopPropagation();e.preventDefault();const startX=e.clientX;const original=clip;const move=(ev:MouseEvent)=>updateClip(original.id,{duration:Math.max(.25,original.duration+(ev.clientX-startX)/zoom)});const up=()=>{window.removeEventListener("mousemove",move);window.removeEventListener("mouseup",up)};window.addEventListener("mousemove",move);window.addEventListener("mouseup",up)}}/>
//                       </div>;
//                     })}
//                   </div>
//                 </div>)}
//                 <div className="playhead" style={{left: 84 + playhead*zoom}}><div className="playhead-cap"/></div>
//               </div>
//             </div>
//             <div className="timeline-bottom"><span><span className="live-dot"/> {notice}</span><span>{clips.length} clips · {fmt(duration)} sequence</span></div>
//           </div>
//         </section>

//         <aside className="inspector panel">
//           <div className="panel-heading"><div><h2>Inspector</h2><p>Selected clip settings</p></div><Settings2 size={18} className="muted-icon"/></div>
//           {selectedClip && selectedAsset ? <>
//             <div className="inspector-preview">{selectedAsset.kind==="image"?<img src={selectedAsset.url} alt=""/>:selectedAsset.kind==="video"?<video src={selectedAsset.url} muted/>:<AudioLines size={30}/>}</div>
//             <div className="selected-file"><span className={`file-type ${selectedClip.color}`}>{selectedAsset.kind==="video"?<Film size={14}/>:selectedAsset.kind==="image"?<ImageIcon size={14}/>:<Music2 size={14}/>}</span><div><strong>{selectedAsset.name}</strong><small>{selectedClip.track} track</small></div></div>
//             <label className="field-label">Clip start <span>seconds</span></label><input className="number-field" type="number" min="0" step=".1" value={Number(selectedClip.start.toFixed(2))} onChange={e=>updateClip(selectedClip.id,{start:Math.max(0,Number(e.target.value)||0)})}/>
//             <label className="field-label">Duration <span>seconds</span></label><input className="number-field" type="number" min=".25" step=".1" value={Number(selectedClip.duration.toFixed(2))} onChange={e=>updateClip(selectedClip.id,{duration:Math.max(.25,Number(e.target.value)||.25)})}/>
//             <label className="field-label">Source in <span>seconds</span></label><input className="number-field" type="number" min="0" step=".1" value={Number(selectedClip.sourceStart.toFixed(2))} onChange={e=>updateClip(selectedClip.id,{sourceStart:Math.max(0,Number(e.target.value)||0)})}/>
//             <div className="inspector-divider"/>
//             <div className="inspector-section"><h3>Quick actions</h3><button className="inspector-action" onClick={()=>{setPlayhead(selectedClip.start);setNotice("Playhead moved to selected clip")}}><Play size={15}/> Jump to clip</button><button className="inspector-action danger" onClick={deleteSelected}><Trash2 size={15}/> Remove from timeline</button></div>
//           </> : <div className="inspector-empty"><Layers3 size={28}/><strong>No clip selected</strong><span>Select a clip on the timeline to adjust its position and duration.</span></div>}
//           <div className="ai-card"><div className="ai-icon"><WandSparkles size={17}/></div><div><strong>AI Background Remover</strong><p>Remove an image background in your browser. First use downloads the AI model; no paid API.</p><button disabled={removingBackground} onClick={removeSelectedBackground}>{removingBackground ? "Removing background…" : "Remove selected image background"} <ChevronDown size={13}/></button></div></div>
//           <div className="tips"><CircleHelp size={15}/><span><b>Tip:</b> Drag media onto the timeline. Select a clip, then use Split at the playhead.</span></div>
//         </aside>
//       </section>
//       <footer className="statusbar"><span><span className="status-dot"/> Ready</span><span>Browser-first editing · Media stays on your device during this session</span><span>v0.1 starter</span></footer>
//     </main>
//   );
// }
