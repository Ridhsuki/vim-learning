# ini kalimat pertama gw di vim.

## 4 Mode dasar vim
- normal: navigasi
- insert: mengetik
- visual: seleksi
- command-line: perintah

## Insert Mode
- masuk ke insert mode dengan shortcut `i`, typing mode akan ada sebeum cursor.
- masuk ke insert mode dengan shortcut `a`, typing mode akan ada setelah cursor.
- masuk ke insert mode dengan shortcut `o`, akan membuat baris baru.
- masuk ke insert mode dengan shortcut `shift + o`, maka akan membuat baris baru di atas typing mode.

## Navigation (H, J, K, L)
- `H`: Navigate to left
- `J`: Navigate to bottom 
- `K`: Navigate to top
- `L`: Navigate to right

- `W`: Navigasi ke Karakter pertama dari kata berikutnya.
- `B`: Navigasi ke karakter pertama dari kata sebelumnya.
- `E`: Navigasi ke karakter terakhir dari kata berikutnya.
- `G, E`: Navigasi ke karakter terakhir dari kata sebelumnya.

	ketika di read mode dan ketik `0` kursor akan berada di awal baris.
- `$` untuk shortcut ke akhir baris.
- `^` untuk shortcut ke character pertama pada line.
- `x` untuk delete 1 character di normal mode.

- `shift + g` untuk navigasi ke paling bawah
- `g`, `g` untuk navigasu ke paling atas.


## Operator-Motion (Motion baris, kata)
- `y`, `y` / yank untuk copy suatu line pada normal mode dan tersimpan di clipboard vim
- `p` untuk paste ke hasil `yank` baris baru
- `shift` + `p` untuk paste `yank` ke baris sebelumnya
- `d`,`d` untuk cut 1 line.
- `c`, `w` untuk delete satu kata dan langsung masuk ke insert mode 
- `c`, `c` untuk delete satu line dan langsung mauk ke insert mode.
- `u` untuk undo.
- `ctrl` + `r` untuk redo.

## Opretor-Motion Inner, around
- `c`, `i`, `(`, cut semua yg ada di dalam kurung dan masuk ke insert mdoe, pada typing ke 3 tergantung simbol pengurung kata nya (Motion Inner).
- `d`, `a`, `(`, cut semua kata termasuk pada simbol pengurung nya (Motion Arround)

## Visual Mode
- `v` untuk masuk ke visual mode.
- `shift` + `v` untuk visual Line.
- `ctrl` + `v` untuk visual block.

## Search Mode (find)
- `/` untuk mencari kata
- `n` untuk next
- `N` untuk previeous
- arahkan kursor ke kata yang mau dicari dan klik `*`.
- `#` untuk search tapi mundur.

## Experiments

My a9a9 Name is "Ridhsuki", (kakkoi)
My a9ay Name is "Ridhsuki", (kakkoi)
My a9ay Name is "Ridhsuki", (kakkoi)

