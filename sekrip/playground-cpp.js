// ================================================
//  playground-cpp.js
//  Letakkan file ini di: sekrip/playground-cpp.js
//  Menggunakan Wandbox API (wandbox.org)
//  TIDAK perlu API key atau daftar akun
// ================================================

const CPP_DEFAULT_CODE = `#include <iostream>
using namespace std;

int main() {
    cout << "Halo, dunia!" << endl;

    return 0;
}`;

// Isi editor saat halaman dimuat
document.addEventListener("DOMContentLoaded", function () {
    const editor = document.getElementById("cppEditor");
    if (editor) {
        editor.value = CPP_DEFAULT_CODE;
        editor.addEventListener("keydown", function (e) {
            // Tombol Tab = 2 spasi
            if (e.key === "Tab") {
                e.preventDefault();
                const s = this.selectionStart;
                this.value =
                    this.value.substring(0, s) + "  " + this.value.substring(this.selectionEnd);
                this.selectionStart = this.selectionEnd = s + 2;
            }
        });
    }
});

// Fungsi utama: kirim kode ke Wandbox dan tampilkan output
async function cppRun() {
    const code     = document.getElementById("cppEditor").value.trim();
    const stdin    = document.getElementById("cppStdin").value;
    const output   = document.getElementById("cppOutput");
    const runBtn   = document.getElementById("cppRunBtn");
    const statusEl = document.getElementById("cppStatus");
    const timeEl   = document.getElementById("cppTime");

    if (!code) {
        output.innerHTML = '<span class="cpp-out-error">Kode tidak boleh kosong.</span>';
        return;
    }

    // Tampilkan loading
    runBtn.disabled = true;
    runBtn.innerHTML = '<span class="cpp-spinner"></span>Mengompilasi...';
    statusEl.innerHTML = '<span class="cpp-dot cpp-dot-yellow"></span>Mengirim ke Wandbox...';
    output.innerHTML   = '<span class="cpp-out-muted">Mengirim kode ke server kompilasi...</span>';
    timeEl.textContent = "";

    const startTime = Date.now();

    try {
        const res = await fetch("https://wandbox.org/api/compile.json", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                compiler: "gcc-head",      // GCC versi terbaru
                code: code,
                stdin: stdin || "",
                options: "warning,gnu++17", // C++17 + warning
                "compiler-option-raw": "-std=c++17"
            })
        });

        if (!res.ok) throw new Error("Server error: " + res.status);

        const data    = await res.json();
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

        output.innerHTML = "";

        // Compile error
        if (data.compiler_error) {
            output.innerHTML =
                '<div class="cpp-out-error">── Compile Error ──\n' +
                escHtml(data.compiler_error) + '</div>';
            statusEl.innerHTML =
                '<span class="cpp-dot cpp-dot-red"></span>Compile error';

        // Runtime error / signal
        } else if (data.signal) {
            const stdoutPart = data.program_output
                ? '<div>' + escHtml(data.program_output) + '</div>'
                : "";
            output.innerHTML =
                stdoutPart +
                '<div class="cpp-out-error">\n── Runtime Error: ' +
                escHtml(data.signal) + ' ──\n' +
                escHtml(data.program_error || "") + '</div>';
            statusEl.innerHTML =
                '<span class="cpp-dot cpp-dot-red"></span>Runtime error';

        // Sukses
        } else {
            const out = data.program_output || "";
            const warn = data.compiler_output
                ? '\n<span class="cpp-out-muted">── Compiler warning ──\n' +
                  escHtml(data.compiler_output) + '</span>'
                : "";
            if (out) {
                output.innerHTML =
                    '<div>' + escHtml(out) + '</div>' +
                    warn +
                    '\n<div class="cpp-out-success">── Selesai (' + elapsed + 's) ──</div>';
            } else {
                output.innerHTML =
                    '<span class="cpp-out-muted">Program selesai tanpa output.</span>' + warn;
            }
            statusEl.innerHTML =
                '<span class="cpp-dot cpp-dot-green"></span>Berhasil';
        }

        timeEl.textContent = "Waktu: " + elapsed + "s";

    } catch (err) {
        output.innerHTML =
            '<div class="cpp-out-error">Gagal terhubung ke Wandbox.\n\n' +
            'Detail: ' + err.message + '\n\n' +
            'Pastikan koneksi internet aktif.</div>';
        statusEl.innerHTML =
            '<span class="cpp-dot cpp-dot-red"></span>Gagal terhubung';
    } finally {
        runBtn.disabled  = false;
        runBtn.innerHTML = "&#9654; Kompilasi &amp; Jalankan";
    }
}

// Reset ke kondisi awal
function cppReset() {
    document.getElementById("cppEditor").value = CPP_DEFAULT_CODE;
    document.getElementById("cppStdin").value  = "";
    document.getElementById("cppOutput").innerHTML =
        '<span class="cpp-out-muted">Tekan "Kompilasi &amp; Jalankan" untuk melihat hasil...</span>';
    document.getElementById("cppStatus").innerHTML =
        '<span class="cpp-dot cpp-dot-green"></span>Siap &mdash; Powered by Wandbox';
    document.getElementById("cppTime").textContent = "";
}

// Escape karakter HTML
function escHtml(text) {
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}