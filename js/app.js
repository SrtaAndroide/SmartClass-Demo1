/* =========================================================================
   SMARTCLASS — app.js
   Vanilla JS. Sin dependencias externas, sin backend.
   Estructura:
     1. Datos ficticios (fuente única de verdad para esta demo)
     2. Render de cursos, tareas, clases y actividad
     3. Interacciones: sidebar, dropdowns, filtros, checklist de tareas
   ========================================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ============================================================
     1. DATOS FICTICIOS
     ============================================================ */
  const student = { name: "Tamar Andrade", initials: "TA" };

  const courses = [
    {
      id: "mate",
      name: "Matemáticas",
      teacher: "Prof. Raúl Soto",
      progress: 68,
      status: "activo",
      accent: "var(--c-mate)",
      code: "MA"
    },
    {
      id: "prog",
      name: "Programación",
      teacher: "Prof. Daniela Ruiz",
      progress: 82,
      status: "activo",
      accent: "var(--c-prog)",
      code: "PR"
    },
    {
      id: "ingles",
      name: "Inglés",
      teacher: "Prof. Mark Owens",
      progress: 45,
      status: "activo",
      accent: "var(--c-ingles)",
      code: "IN"
    },
    {
      id: "ciencias",
      name: "Ciencias",
      teacher: "Prof. Elena Vidal",
      progress: 90,
      status: "completado",
      accent: "var(--c-ciencias)",
      code: "CI"
    }
  ];

  // id de tarea -> curso al que pertenece, para poder cruzar datos
  let tasks = [
    {
      id: "t1",
      title: "Entrega proyecto de Programación",
      courseId: "prog",
      due: "Hoy · 23:59",
      urgency: "danger",
      done: false
    },
    {
      id: "t2",
      title: "Prueba de Matemáticas",
      courseId: "mate",
      due: "En 2 días",
      urgency: "warning",
      done: false
    },
    {
      id: "t3",
      title: "Ensayo de Inglés",
      courseId: "ingles",
      due: "En 4 días",
      urgency: "neutral",
      done: false
    }
  ];

  const upcomingClasses = [
    { time: "14:00", ampm: "HOY", title: "Programación", sub: "Sala virtual · Prof. Ruiz", courseId: "prog" },
    { time: "10:00", ampm: "MAÑ", title: "Inglés", sub: "Sala 204 · Prof. Owens", courseId: "ingles" },
    { time: "09:00", ampm: "MIÉ", title: "Matemáticas", sub: "Sala virtual · Prof. Soto", courseId: "mate" }
  ];

  const activity = [
    { text: "Completaste el módulo 4 de <strong>Ciencias</strong>", time: "hace 2 horas" },
    { text: "Calificación recibida en <strong>Programación</strong>: 92/100", time: "ayer" },
    { text: "Nuevo material publicado en <strong>Matemáticas</strong>", time: "hace 2 días" }
  ];

  const courseById = Object.fromEntries(courses.map(c => [c.id, c]));

  // Minutos de estudio por día (ficticio) — "mié" marcado como hoy
  const weekActivity = [
    { day: "Lun", minutes: 40 },
    { day: "Mar", minutes: 65 },
    { day: "Mié", minutes: 30, isToday: true },
    { day: "Jue", minutes: 0 },
    { day: "Vie", minutes: 0 },
    { day: "Sáb", minutes: 0 },
    { day: "Dom", minutes: 0 }
  ];

  /* ============================================================
     2. RENDER
     ============================================================ */
  function renderCourses(filter = "todos") {
    const grid = document.getElementById("courseGrid");
    const visible = courses.filter(c => filter === "todos" || c.status === filter);

    grid.innerHTML = visible.map(c => `
      <div class="course-card">
        <div class="course-ring" style="--accent:${c.accent}; --pct:${c.progress}">
          <span>${c.code}</span>
        </div>
        <div class="course-card__body">
          <div class="course-card__top">
            <p class="course-card__title">${c.name}</p>
            <span class="course-card__status course-card__status--${c.status}">
              ${c.status === "activo" ? "Activo" : "Listo"}
            </span>
          </div>
          <p class="course-card__teacher">${c.teacher}</p>
          <div class="course-card__meta">
            <span>Avance</span>
            <strong>${c.progress}%</strong>
          </div>
        </div>
      </div>
    `).join("");
  }

  function renderTasks() {
    const list = document.getElementById("taskList");
    list.innerHTML = tasks.map(t => {
      const course = courseById[t.courseId];
      return `
        <li class="task-item ${t.done ? "is-done" : ""}" data-task="${t.id}">
          <button class="check" aria-label="Marcar tarea como completada" aria-pressed="${t.done}">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <div class="task-item__body">
            <p class="task-item__title">${t.title}</p>
            <p class="task-item__meta">
              <span class="task-item__course" style="color:${course.accent}">${course.name}</span>
              <span>·</span>
              <span>${t.due}</span>
            </p>
          </div>
          <span class="pill pill--${t.urgency}">${t.due.split(" ")[0]}</span>
        </li>
      `;
    }).join("");

    // KPI + badge + saludo se actualizan según tareas pendientes
    const pending = tasks.filter(t => !t.done).length;
    document.getElementById("kpiPending").textContent = pending;
    document.getElementById("navTaskBadge").textContent = pending;
    document.getElementById("navTaskBadge").style.display = pending === 0 ? "none" : "inline-flex";
    document.getElementById("greetTaskCount").textContent =
      pending === 1 ? "1 tarea" : `${pending} tareas`;
  }

  function renderClasses() {
    const list = document.getElementById("classList");
    list.innerHTML = upcomingClasses.map(cl => {
      const course = courseById[cl.courseId];
      return `
        <li class="class-item">
          <div class="class-item__time"><strong>${cl.time}</strong><span>${cl.ampm}</span></div>
          <span class="class-item__dot" style="background:${course.accent}"></span>
          <div>
            <p class="class-item__title">${cl.title}</p>
            <p class="class-item__sub">${cl.sub}</p>
          </div>
        </li>
      `;
    }).join("");
  }

  function renderActivity() {
    const list = document.getElementById("activityList");
    const icons = ["📘", "🏆", "📄"];
    list.innerHTML = activity.map((a, i) => `
      <li class="activity-item">
        <span class="activity-item__icon">${icons[i % icons.length]}</span>
        <div>
          <p>${a.text}</p>
          <span>${a.time}</span>
        </div>
      </li>
    `).join("");
  }

  function renderProgressLegend() {
    const legend = document.getElementById("progressLegend");
    legend.innerHTML = courses.map(c => `
      <li>
        <span class="progress-legend__dot" style="background:${c.accent}"></span>
        <span>${c.name}</span>
        <strong>${c.progress}%</strong>
      </li>
    `).join("");
  }

  function renderWeekChart() {
    const chart = document.getElementById("weekChart");
    const max = Math.max(...weekActivity.map(d => d.minutes), 60); // piso de 60 min para escala
    chart.innerHTML = weekActivity.map(d => `
      <div class="week-chart__col ${d.isToday ? "is-today" : ""}">
        <div class="week-chart__bar" style="height:100%">
          <div class="week-chart__bar-fill" style="height:${(d.minutes / max) * 100}%"></div>
        </div>
        <span class="week-chart__label">${d.day}</span>
      </div>
    `).join("");
  }

  function initialRender() {
    renderCourses();
    renderTasks();
    renderClasses();
    renderActivity();
    renderProgressLegend();
    renderWeekChart();
  }

  initialRender();

  /* ============================================================
     3. INTERACCIONES
     ============================================================ */

  /* --- Sidebar (móvil) --- */
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  const menuBtn = document.getElementById("menuBtn");
  const sidebarClose = document.getElementById("sidebarClose");

  function openSidebar() {
    sidebar.classList.add("is-open");
    overlay.classList.add("is-visible");
  }
  function closeSidebar() {
    sidebar.classList.remove("is-open");
    overlay.classList.remove("is-visible");
  }
  menuBtn.addEventListener("click", openSidebar);
  sidebarClose.addEventListener("click", closeSidebar);
  overlay.addEventListener("click", closeSidebar);

  /* --- Navegación activa (sidebar + mobile nav) --- */
  const allNavLinks = document.querySelectorAll("[data-nav]");
  allNavLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = link.dataset.nav;
      document.querySelectorAll(`[data-nav="${target}"]`).forEach(el => {
        // activa el link en ambos menús (sidebar y mobile-nav) a la vez
      });
      allNavLinks.forEach(l => l.classList.remove("is-active"));
      document.querySelectorAll(`[data-nav="${target}"]`).forEach(l => l.classList.add("is-active"));
      closeSidebar();
    });
  });

  /* --- Dropdowns genéricos (notificaciones / usuario) --- */
  function setupDropdown(btnId, panelId) {
    const btn = document.getElementById(btnId);
    const panel = document.getElementById(panelId);

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = panel.classList.contains("is-open");
      closeAllDropdowns();
      if (!isOpen) {
        panel.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  }

  function closeAllDropdowns() {
    document.querySelectorAll(".dropdown__panel").forEach(p => p.classList.remove("is-open"));
    document.querySelectorAll("[aria-expanded]").forEach(b => b.setAttribute("aria-expanded", "false"));
  }

  setupDropdown("notifBtn", "notifPanel");
  setupDropdown("userBtn", "userPanel");

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".dropdown")) closeAllDropdowns();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { closeAllDropdowns(); closeSidebar(); }
  });

  /* --- Marcar notificaciones como leídas --- */
  document.getElementById("markAllRead").addEventListener("click", () => {
    document.querySelectorAll(".notif-item").forEach(item => item.classList.remove("is-unread"));
    const dot = document.getElementById("notifDot");
    dot.classList.add("is-hidden");
  });

  /* --- Filtro de cursos (Todos / Activos / Completados) --- */
  document.getElementById("courseFilters").addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-chip");
    if (!btn) return;
    document.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("is-active"));
    btn.classList.add("is-active");
    renderCourses(btn.dataset.filter);
  });

  /* --- Toggle de tareas (marcar como completada) --- */
  document.getElementById("taskList").addEventListener("click", (e) => {
    const item = e.target.closest(".task-item");
    if (!item) return;
    const task = tasks.find(t => t.id === item.dataset.task);
    task.done = !task.done;
    renderTasks();
  });

  /* --- CTA "Continuar donde quedé" --- */
  document.getElementById("continueBtn").addEventListener("click", () => {
    document.querySelectorAll(`[data-nav="cursos"]`).forEach(l => l.click());
  });

});
