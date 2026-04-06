const orders = [];

let selectedConsole = null;
let selectedRoom = { name: "Normal", percent: 0 };
let editIndex = -1;

function pickConsole(el, name, price) {
    document.querySelectorAll(".choices.console .opt")
        .forEach(o => o.classList.remove("active"));

    el.classList.add("active");
    selectedConsole = { name, price };

    calc();
}

function pickRoom(el, name, percent) {
    document.querySelectorAll(".choices.room .opt")
        .forEach(o => o.classList.remove("active"));

    el.classList.add("active");
    selectedRoom = { name, percent };

    calc();
}

function calc() {
    if (!selectedConsole) return;

    const dur = Number(document.getElementById("dur").value) || 0;
    const startVal = document.getElementById("start").value;

    const base = selectedConsole.price;
    const roomPrice = base * selectedRoom.percent;
    const total = (base + roomPrice) * dur;

    document.getElementById("total").innerText =
        "Rp " + total.toLocaleString("id-ID");

    if (startVal && dur > 0) {
        const start = new Date(startVal);
        const end = new Date(start);

        end.setHours(end.getHours() + dur);

        document.getElementById("end").innerText =
            "Ends at: " + end.toLocaleString("id-ID");
    }
}

function book() {
    const name = document.getElementById("name").value.trim();
    const age = document.getElementById("age").value;
    const dur = document.getElementById("dur").value;
    const total = document.getElementById("total").innerText;

    if (!name || !age || !selectedConsole) {
        alert("Lengkapi data dulu!");
        return;
    }

    const data = {
        name,
        age,
        console: selectedConsole.name,
        room: selectedRoom.name,
        duration: dur,
        total
    };

    if (editIndex === -1) {
        orders.push(data);
    } else {
        orders[editIndex] = data;
        editIndex = -1;
    }

    renderOrders();
    clearForm();
}

function renderOrders() {
    const cart = document.getElementById("cartList");

    if (orders.length === 0) {
        cart.innerHTML = `
        <div class="empty">
            <span class="empty-txt">Belum ada pemesanan</span>
        </div>`;
        return;
    }

    cart.innerHTML = orders.map((o, i) => `
    <div class="order-item">
        <p><b>${o.name}</b></p>
        <p>${o.console} - ${o.room}</p>
        <p>${o.duration} jam</p>
        <p>${o.total}</p>

        <div class="order-actions">
            <button class="btn-edit" onclick="edit(${i})">Edit</button>
            <button class="btn-no" onclick="removeOrder(${i})">Batal</button>
        </div>
    </div>
    `).join("");
}

function removeOrder(i) {
    orders.splice(i, 1);
    renderOrders();
}

function edit(i) {
    const o = orders[i];

    document.getElementById("name").value = o.name;
    document.getElementById("age").value = o.age;
    document.getElementById("dur").value = o.duration;

    editIndex = i;

    document.querySelectorAll(".choices.console .opt").forEach(opt => {
        if (opt.innerText.includes(o.console)) opt.click();
    });

    document.querySelectorAll(".choices.room .opt").forEach(opt => {
        if (opt.innerText.includes(o.room)) opt.click();
    });
}

function confirm() {
    if (orders.length === 0) return;

    const history = document.getElementById("orders");

    const newOrders = orders.map((o, i) => `
    <div class="order-item">
        <p><b>${o.name}</b></p>
        <p>${o.console} - ${o.room}</p>
        <p>${o.duration} jam</p>
        <p>${o.total}</p>

        <div class="order-actions">
            <button class="btn-done" onclick="finishOrder(this)">Selesai</button>
        </div>
    </div>
    `).join("");

    history.innerHTML += newOrders;

    orders.length = 0;
    renderOrders();
}

function finishOrder(btn) {
    const item = btn.parentElement.parentElement;

    item.style.transition = "0.3s";
    item.style.opacity = "0";
    item.style.transform = "translateX(50px)";

    setTimeout(() => {
        item.remove();
    }, 300);
}

function clearAll() {
    orders.length = 0;
    renderOrders();
}

function clearForm() {
    document.getElementById("name").value = "";
    document.getElementById("age").value = "";
    document.getElementById("dur").value = 2;

    document.getElementById("total").innerText = "Rp 0";
    document.getElementById("end").innerText = "Ends at: -";

    document.querySelectorAll(".choices.console .opt")
        .forEach(o => o.classList.remove("active"));

    document.querySelectorAll(".choices.room .opt")
        .forEach(o => o.classList.remove("active"));

    document.querySelector(".choices.room .opt").classList.add("active");

    selectedConsole = null;
    selectedRoom = { name: "Normal", percent: 0 };
}