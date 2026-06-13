// ==UserScript==
// @name         TM File Store
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Upload, list, and delete files stored as Base64 in Tampermonkey storage
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_registerMenuCommand
// ==/UserScript==

function setup_tm_file_utils() {
  const TM_FILE_PREFIX = "tmfile::";

  // ─── Core utils ───────────────────────────────────────────────────────────────

  async function upload_tm_file() {
    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.multiple = true;

      input.onchange = async () => {
        const files = Array.from(input.files);
        if (!files.length) {
          console.log("[TM File Store] No files selected.");
          return resolve([]);
        }

        const results = await Promise.all(
          files.map((file) => {
            return new Promise((res, rej) => {
              const reader = new FileReader();
              reader.onload = () => {
                const b64 = reader.result.split(",")[1];
                const key = TM_FILE_PREFIX + file.name;
                GM_setValue(key, b64);
                console.log(
                  `[TM File Store] Stored: "${file.name}" (${(file.size / 1024).toFixed(1)} KB)`,
                );
                res(file.name);
              };
              reader.onerror = () =>
                rej(new Error(`Failed to read: ${file.name}`));
              reader.readAsDataURL(file);
            });
          }),
        );

        console.log(
          `[TM File Store] Done. ${results.length} file(s) stored:`,
          results,
        );
        _renderFileList();
        resolve(results);
      };

      input.click();
    });
  }

  function list_tm_files() {
    const keys = GM_listValues().filter((k) => k.startsWith(TM_FILE_PREFIX));
    if (!keys.length) {
      console.log("[TM File Store] No files stored.");
      return [];
    }
    const names = keys.map((k) => k.replace(TM_FILE_PREFIX, ""));
    console.log(`[TM File Store] ${names.length} file(s) stored:`);
    names.forEach((name, i) => console.log(`  ${i + 1}. ${name}`));
    return names;
  }

  function delete_tm_file(filename) {
    if (!filename) {
      console.warn("[TM File Store] delete_tm_file() requires a filename.");
      return false;
    }
    const key = TM_FILE_PREFIX + filename;
    const exists = GM_listValues().includes(key);
    if (!exists) {
      console.warn(`[TM File Store] File not found: "${filename}"`);
      return false;
    }
    GM_deleteValue(key);
    console.log(`[TM File Store] Deleted: "${filename}"`);
    return true;
  }

  // ─── Floating UI ──────────────────────────────────────────────────────────────

  function _renderFileList() {
    const listEl = document.getElementById("_tmfs_list");
    if (!listEl) return;
    const names = GM_listValues()
      .filter((k) => k.startsWith(TM_FILE_PREFIX))
      .map((k) => k.replace(TM_FILE_PREFIX, ""));

    if (!names.length) {
      listEl.innerHTML =
        '<div style="color:#999;font-size:11px;">No files stored</div>';
      return;
    }

    listEl.innerHTML = names
      .map(
        (name) => `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:4px 0;border-bottom:1px solid #eee;">
      <span style="font-size:11px;color:#222;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:260px;" title="${name}">📄 ${name}</span>
      <button onclick="delete_tm_file('${name}')"
        style="background:#e74c3c;border:none;color:white;font-size:10px;padding:2px 6px;border-radius:3px;cursor:pointer;flex-shrink:0;margin-left:6px;">✕</button>
    </div>
  `,
      )
      .join("");
  }

  function _showPanel() {
    const panel = document.getElementById("_tmfs_panel");
    if (panel) {
      panel.style.display = "block";
      _renderFileList();
    }
  }

  function _injectUI() {
    if (document.getElementById("_tmfs_panel")) return;

    const panel = document.createElement("div");
    panel.id = "_tmfs_panel";
    panel.innerHTML = `
    <div id="_tmfs_header" style="display:flex;align-items:center;justify-content:space-between;cursor:move;user-select:none;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid #ddd;">
      <span style="font-size:13px;font-weight:600;color:#111;">🗂 TM File Store</span>
      <button id="_tmfs_close" style="background:none;border:none;color:#999;font-size:18px;cursor:pointer;padding:0;line-height:1;">×</button>
    </div>
    <div id="_tmfs_body">
      <button id="_tmfs_upload"
        style="width:100%;padding:6px;background:#2980b9;border:none;color:white;border-radius:4px;cursor:pointer;font-size:12px;margin-bottom:8px;">
        ＋ Upload file(s)
      </button>
      <div id="_tmfs_list"></div>
    </div>
  `;

    Object.assign(panel.style, {
      position: "fixed",
      bottom: "20px",
      right: "40px",
      zIndex: "999999",
      background: "#fff",
      border: "1px solid #ccc",
      borderRadius: "8px",
      padding: "16px 20px",
      width: "360px",
      boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
      fontFamily: "sans-serif",
      display: "none",
    });

    document.body.appendChild(panel);

    // Upload button — direct user click satisfies activation requirement
    document
      .getElementById("_tmfs_upload")
      .addEventListener("click", upload_tm_file);

    // Close button
    document.getElementById("_tmfs_close").addEventListener("click", () => {
      panel.style.display = "none";
    });

    // Draggable
    const header = document.getElementById("_tmfs_header");
    let dragging = false,
      ox = 0,
      oy = 0;
    header.addEventListener("mousedown", (e) => {
      dragging = true;
      ox = e.clientX - panel.getBoundingClientRect().left;
      oy = e.clientY - panel.getBoundingClientRect().top;
    });
    document.addEventListener("mousemove", (e) => {
      if (!dragging) return;
      panel.style.left = e.clientX - ox + "px";
      panel.style.top = e.clientY - oy + "px";
      panel.style.right = "auto";
      panel.style.bottom = "auto";
    });
    document.addEventListener("mouseup", () => (dragging = false));
  }

  // ─── Expose globally ──────────────────────────────────────────────────────────

  window.upload_tm_file = upload_tm_file;
  window.list_tm_files = list_tm_files;
  window.delete_tm_file = (filename) => {
    const result = delete_tm_file(filename);
    _renderFileList();
    return result;
  };

  window.addEventListener("load", () => {
    _injectUI();
    GM_registerMenuCommand("🗂 Show File Manager", _showPanel);
  });
}

setup_tm_file_utils();
