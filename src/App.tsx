import React, { useState } from 'react';
import {
  Monitor,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  LogOut,
  ArrowLeft,
  Search,
  PlusCircle,
  FileText,
  AlertTriangle,
  Building2,
  GraduationCap,
  Download,
  Copy,
  Check,
  ChevronRight,
  Info
} from 'lucide-react';

// Tipos para el sistema
export type ViewState = 'login' | 'menu' | 'disponibilidad' | 'registrar' | 'mis-reservas';

export interface ReservaItem {
  id: string;
  fecha: string;
  laboratorio: string;
  capacidadLab: number;
  horario: string;
  curso: string;
  estudiantes: number;
  motivo: string;
  estado: 'Confirmada' | 'Cancelada';
  fechaCreacion: string;
}

export interface LabDisponibilidad {
  id: string;
  nombre: string;
  capacidad: number;
  horario: string;
  estado: 'Disponible' | 'Ocupado';
  motivoOcupado?: string;
  equipamiento: string;
}

export default function App() {
  // Estado de navegación
  const [currentView, setCurrentView] = useState<ViewState>('login');
  
  // Usuario actual
  const [usuario, setUsuario] = useState('docente');
  const [password, setPassword] = useState('••••••••');
  const [nombreDocente] = useState('Prof. Docente');

  // Filtros de búsqueda de disponibilidad
  const [searchFecha, setSearchFecha] = useState('2026-10-15');
  const [searchHoraInicio, setSearchHoraInicio] = useState('10:00');
  const [searchHoraFin, setSearchHoraFin] = useState('12:00');
  const [searchCapacidad, setSearchCapacidad] = useState('25');
  const [hasSearched, setHasSearched] = useState(true);

  // Lista de laboratorios simulados
  const laboratoriosDisponibles: LabDisponibilidad[] = [
    {
      id: 'lab-01',
      nombre: 'Lab. 01',
      capacidad: 30,
      horario: `${searchHoraInicio}–${searchHoraFin}`,
      estado: 'Disponible',
      equipamiento: '30 PCs Intel i7, Proyector HD, Red Gigabit',
    },
    {
      id: 'lab-02',
      nombre: 'Lab. 02',
      capacidad: 25,
      horario: `${searchHoraInicio}–${searchHoraFin}`,
      estado: 'Ocupado',
      motivoOcupado: 'En uso: Algoritmos y Estructuras de Datos',
      equipamiento: '25 PCs Intel i5, Proyector, Pizarra táctil',
    },
    {
      id: 'lab-03',
      nombre: 'Lab. 03',
      capacidad: 40,
      horario: `${searchHoraInicio}–${searchHoraFin}`,
      estado: 'Disponible',
      equipamiento: '40 PCs Workstation GPU, Climatización, Servidor local',
    },
  ];

  // Formulario de Registro de Reserva
  const [formLab, setFormLab] = useState('Lab. 01');
  const [formFecha, setFormFecha] = useState('2026-10-15');
  const [formHorario, setFormHorario] = useState('10:00–12:00');
  const [formCurso, setFormCurso] = useState('Sistemas Distribuidos y Redes');
  const [formEstudiantes, setFormEstudiantes] = useState('28');
  const [formMotivo, setFormMotivo] = useState('Sesión práctica calificada con simuladores de red');

  // Lista inicial de reservas
  const [reservas, setReservas] = useState<ReservaItem[]>([
    {
      id: 'RES-001',
      fecha: '15/10/2026',
      laboratorio: 'Lab. 02',
      capacidadLab: 25,
      horario: '08:00–10:00',
      curso: 'Fundamentos de Programación',
      estudiantes: 24,
      motivo: 'Laboratorio de sintaxis y estructuras de control en C++',
      estado: 'Confirmada',
      fechaCreacion: '10/10/2026',
    },
    {
      id: 'RES-002',
      fecha: '16/10/2026',
      laboratorio: 'Lab. 01',
      capacidadLab: 30,
      horario: '14:00–16:00',
      curso: 'Base de Datos II',
      estudiantes: 28,
      motivo: 'Taller de optimización de índices y consultas SQL',
      estado: 'Confirmada',
      fechaCreacion: '11/10/2026',
    },
    {
      id: 'RES-003',
      fecha: '18/10/2026',
      laboratorio: 'Lab. 03',
      capacidadLab: 40,
      horario: '10:00–12:00',
      curso: 'Inteligencia Artificial',
      estudiantes: 35,
      motivo: 'Entrenamiento de modelos con librerías Python',
      estado: 'Confirmada',
      fechaCreacion: '12/10/2026',
    },
  ]);

  // Modales
  const [cancelModal, setCancelModal] = useState<{ isOpen: boolean; reserva: ReservaItem | null }>({
    isOpen: false,
    reserva: null,
  });

  const [confirmSuccessModal, setConfirmSuccessModal] = useState<{
    isOpen: boolean;
    reserva: ReservaItem | null;
  }>({
    isOpen: false,
    reserva: null,
  });

  const [showCodeModal, setShowCodeModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Manejador de inicio de sesión
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentView('menu');
  };

  // Manejador para pre-seleccionar lab desde la búsqueda
  const handleReservarDesdeConsulta = (labNombre: string) => {
    setFormLab(labNombre);
    setFormFecha(searchFecha);
    setFormHorario(`${searchHoraInicio}–${searchHoraFin}`);
    setCurrentView('registrar');
  };

  // Manejador para registrar nueva reserva
  const handleConfirmarReserva = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevaReserva: ReservaItem = {
      id: `RES-${String(reservas.length + 1).padStart(3, '0')}`,
      fecha: formFecha.includes('-')
        ? formFecha.split('-').reverse().join('/')
        : formFecha,
      laboratorio: formLab,
      capacidadLab: formLab.includes('01') ? 30 : formLab.includes('02') ? 25 : 40,
      horario: formHorario,
      curso: formCurso || 'Curso Académico',
      estudiantes: parseInt(formEstudiantes) || 25,
      motivo: formMotivo || 'Práctica de laboratorio',
      estado: 'Confirmada',
      fechaCreacion: '15/10/2026',
    };

    setReservas([nuevaReserva, ...reservas]);
    setConfirmSuccessModal({ isOpen: true, reserva: nuevaReserva });
  };

  // Confirmar cancelación
  const handleEjecutarCancelacion = () => {
    if (!cancelModal.reserva) return;
    setReservas((prev) =>
      prev.map((r) =>
        r.id === cancelModal.reserva?.id ? { ...r, estado: 'Cancelada' } : r
      )
    );
    setCancelModal({ isOpen: false, reserva: null });
  };

  // Generar código HTML standalone para exportar / ver
  const generateStandaloneHTML = () => {
    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SRLC - Sistema de Reserva de Laboratorios de Cómputo</title>
  <style>
    /* ESTILOS INSTITUCIONALES UNIVERSITARIOS - SRLC */
    :root {
      --azul-primario: #1e3a8a;
      --azul-hover: #172554;
      --azul-claro: #eff6ff;
      --gris-fondo: #f8fafc;
      --gris-borde: #e2e8f0;
      --gris-texto: #334155;
      --gris-muted: #64748b;
      --verde-exito: #16a34a;
      --verde-fondo: #f0fdf4;
      --rojo-alerta: #dc2626;
      --rojo-fondo: #fef2f2;
      --blanco: #ffffff;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    body { background-color: var(--gris-fondo); color: var(--gris-texto); line-height: 1.5; min-height: 100vh; display: flex; flex-direction: column; }
    
    /* ENCABEZADO SUPERIOR */
    header { background-color: var(--blanco); border-bottom: 2px solid var(--azul-primario); padding: 0.85rem 1.5rem; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
    .brand { display: flex; align-items: center; gap: 0.75rem; }
    .brand-logo { background-color: var(--azul-primario); color: var(--blanco); font-weight: 800; font-size: 1.1rem; padding: 0.4rem 0.75rem; border-radius: 4px; letter-spacing: 0.5px; }
    .brand-info h1 { font-size: 1.05rem; font-weight: 700; color: var(--azul-primario); line-height: 1.2; }
    .brand-info p { font-size: 0.8rem; color: var(--gris-muted); }
    .header-user { display: flex; align-items: center; gap: 1rem; font-size: 0.85rem; }
    .user-badge { color: var(--gris-muted); font-weight: 500; }
    .user-badge strong { color: var(--gris-texto); }
    
    /* BOTONES */
    .btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.4rem; padding: 0.55rem 1rem; border-radius: 4px; font-size: 0.875rem; font-weight: 600; cursor: pointer; border: 1px solid transparent; text-decoration: none; transition: all 0.15s ease; }
    .btn-primary { background-color: var(--azul-primario); color: var(--blanco); }
    .btn-primary:hover { background-color: var(--azul-hover); }
    .btn-secondary { background-color: var(--blanco); color: var(--gris-texto); border-color: var(--gris-borde); }
    .btn-secondary:hover { background-color: #f1f5f9; }
    .btn-danger { background-color: var(--rojo-fondo); color: var(--rojo-alerta); border-color: #fecaca; }
    .btn-danger:hover { background-color: #fee2e2; }
    .btn-sm { padding: 0.35rem 0.65rem; font-size: 0.8rem; }
    .btn-block { width: 100%; }

    /* CONTENEDOR PRINCIPAL */
    main { flex: 1; max-width: 1050px; width: 100%; margin: 1.5rem auto; padding: 0 1rem; }
    .screen { display: none; }
    .screen.active { display: block; }

    /* PANTALLA 1: INICIO DE SESIÓN */
    .login-wrapper { min-height: calc(100vh - 120px); display: flex; align-items: center; justify-content: center; padding: 1rem; }
    .login-card { background: var(--blanco); width: 100%; max-width: 420px; border-radius: 8px; border: 1px solid var(--gris-borde); padding: 2.2rem 2rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
    .login-card .header { text-align: center; margin-bottom: 1.5rem; }
    .login-card .sigla { display: inline-block; background: var(--azul-claro); color: var(--azul-primario); font-weight: 800; font-size: 1.25rem; padding: 0.35rem 1rem; border-radius: 6px; margin-bottom: 0.75rem; }
    .login-card h2 { font-size: 1.2rem; color: var(--azul-primario); font-weight: 700; margin-bottom: 0.3rem; }
    .login-card .subtitle { font-size: 0.85rem; color: var(--gris-muted); line-height: 1.4; }
    .form-group { margin-bottom: 1.1rem; }
    .form-group label { display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.35rem; color: var(--gris-texto); }
    .form-control { width: 100%; padding: 0.6rem 0.75rem; border: 1px solid var(--gris-borde); border-radius: 4px; font-size: 0.9rem; outline: none; background: #fff; }
    .form-control:focus { border-color: var(--azul-primario); box-shadow: 0 0 0 2px rgba(30, 58, 138, 0.15); }
    .helper-text { font-size: 0.8rem; color: var(--gris-muted); text-align: center; margin-top: 1.2rem; }

    /* TARJETA GENERAL DE CONTENIDO */
    .panel { background: var(--blanco); border-radius: 8px; border: 1px solid var(--gris-borde); padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.03); }
    .panel-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--gris-borde); padding-bottom: 1rem; margin-bottom: 1.25rem; }
    .panel-header h2 { font-size: 1.25rem; color: var(--azul-primario); font-weight: 700; }
    .panel-header p { font-size: 0.85rem; color: var(--gris-muted); margin-top: 0.2rem; }

    /* PANTALLA 2: DASHBOARD MENU */
    .welcome-banner { background: linear-gradient(to right, #1e3a8a, #1e40af); color: #fff; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem; }
    .welcome-banner h2 { font-size: 1.4rem; font-weight: 700; margin-bottom: 0.25rem; }
    .welcome-banner p { font-size: 0.9rem; opacity: 0.9; }
    .menu-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
    .menu-card { background: var(--blanco); border: 1px solid var(--gris-borde); border-radius: 8px; padding: 1.5rem 1.25rem; text-align: left; cursor: pointer; transition: all 0.2s ease; display: flex; flex-direction: column; justify-content: space-between; min-height: 140px; }
    .menu-card:hover { border-color: var(--azul-primario); transform: translateY(-2px); box-shadow: 0 4px 8px rgba(30, 58, 138, 0.08); }
    .menu-card .num { font-size: 0.8rem; font-weight: 700; color: var(--azul-primario); background: var(--azul-claro); width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 0.75rem; }
    .menu-card h3 { font-size: 1.05rem; font-weight: 700; color: var(--gris-texto); margin-bottom: 0.35rem; }
    .menu-card p { font-size: 0.8rem; color: var(--gris-muted); }
    .card-footer { margin-top: 1rem; font-size: 0.8rem; font-weight: 600; color: var(--azul-primario); display: flex; align-items: center; gap: 0.25rem; }

    /* FORMULARIOS GRID */
    .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.25rem; }
    
    /* TABLAS */
    .table-responsive { width: 100%; overflow-x: auto; border: 1px solid var(--gris-borde); border-radius: 6px; }
    table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.875rem; }
    th { background: #f8fafc; color: var(--gris-texto); font-weight: 600; padding: 0.75rem 1rem; border-bottom: 1px solid var(--gris-borde); }
    td { padding: 0.85rem 1rem; border-bottom: 1px solid var(--gris-borde); vertical-align: middle; }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background-color: #fafbfc; }

    /* ESTADOS VISUALES */
    .badge { display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.25rem 0.6rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600; }
    .badge-success { background: var(--verde-fondo); color: var(--verde-exito); border: 1px solid #bbf7d0; }
    .badge-danger { background: var(--rojo-fondo); color: var(--rojo-alerta); border: 1px solid #fecaca; }
    .badge-canceled { background: #f1f5f9; color: #94a3b8; text-decoration: line-through; border: 1px solid #e2e8f0; }

    /* MODAL */
    .modal-backdrop { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.45); display: none; align-items: center; justify-content: center; z-index: 999; padding: 1rem; }
    .modal-backdrop.active { display: flex; }
    .modal-box { background: #fff; width: 100%; max-width: 450px; border-radius: 8px; border: 1px solid var(--gris-borde); padding: 1.75rem; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
    .modal-box h3 { font-size: 1.15rem; color: var(--azul-primario); font-weight: 700; margin-bottom: 0.5rem; }
    .modal-box p { font-size: 0.875rem; color: var(--gris-texto); margin-bottom: 1.25rem; line-height: 1.5; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 0.75rem; }

    /* FOOTER */
    footer { text-align: center; padding: 1.25rem; font-size: 0.8rem; color: var(--gris-muted); border-top: 1px solid var(--gris-borde); background: #fff; margin-top: auto; }
  </style>
</head>
<body>

  <!-- ENCABEZADO SUPERIOR -->
  <header>
    <div class="brand">
      <div class="brand-logo">SRLC</div>
      <div class="brand-info">
        <h1>SRLC</h1>
        <p>Sistema de Reserva de Laboratorios de Cómputo</p>
      </div>
    </div>
    <div class="header-user" id="userSection" style="display: none;">
      <span class="user-badge">Docente: <strong>Prof. Universitario</strong></span>
      <button class="btn btn-secondary btn-sm" onclick="navigateTo('login')">Cerrar sesión</button>
    </div>
  </header>

  <main>
    <!-- ==================== PANTALLA 1: INICIO DE SESIÓN ==================== -->
    <section id="view-login" class="screen active">
      <div class="login-wrapper">
        <div class="login-card">
          <div class="header">
            <div class="sigla">SRLC</div>
            <h2>Sistema de Reserva de Laboratorios de Cómputo</h2>
            <p class="subtitle">Plataforma Académica Universitaria</p>
          </div>
          <form onsubmit="handleLoginSubmit(event)">
            <div class="form-group">
              <label for="usuario">Usuario</label>
              <input type="text" id="usuario" class="form-control" value="docente" required placeholder="Ingrese su código o correo institucional">
            </div>
            <div class="form-group">
              <label for="password">Contraseña</label>
              <input type="password" id="password" class="form-control" value="123456" required placeholder="••••••••">
            </div>
            <button type="submit" class="btn btn-primary btn-block">Ingresar</button>
            <p class="helper-text">Acceso para docentes y responsables de laboratorio.</p>
          </form>
        </div>
      </div>
    </section>

    <!-- ==================== PANTALLA 2: MENÚ PRINCIPAL ==================== -->
    <section id="view-menu" class="screen">
      <div class="welcome-banner">
        <h2>Bienvenido al SRLC</h2>
        <p>Sistema institucional de gestión y reserva de laboratorios de cómputo para actividades académicas.</p>
      </div>

      <div class="menu-grid">
        <div class="menu-card" onclick="navigateTo('disponibilidad')">
          <div>
            <div class="num">1</div>
            <h3>Consultar laboratorios</h3>
            <p>Verifique los horarios y la disponibilidad en tiempo real por fecha y capacidad.</p>
          </div>
          <div class="card-footer">Acceder &rarr;</div>
        </div>

        <div class="menu-card" onclick="navigateTo('registrar')">
          <div>
            <div class="num">2</div>
            <h3>Realizar reserva</h3>
            <p>Registre una nueva reserva para clases, prácticas dirigidas o evaluaciones.</p>
          </div>
          <div class="card-footer">Acceder &rarr;</div>
        </div>

        <div class="menu-card" onclick="navigateTo('mis-reservas')">
          <div>
            <div class="num">3</div>
            <h3>Mis reservas</h3>
            <p>Revise el historial y el estado de sus reservas académicas activas.</p>
          </div>
          <div class="card-footer">Acceder &rarr;</div>
        </div>

        <div class="menu-card" onclick="navigateTo('mis-reservas')">
          <div>
            <div class="num">4</div>
            <h3>Cancelar reserva</h3>
            <p>Anule solicitudes o reservas programadas de manera inmediata.</p>
          </div>
          <div class="card-footer">Gestionar &rarr;</div>
        </div>
      </div>
    </section>

    <!-- ==================== PANTALLA 3: CONSULTA DE DISPONIBILIDAD ==================== -->
    <section id="view-disponibilidad" class="screen">
      <div class="panel">
        <div class="panel-header">
          <div>
            <h2>Consultar disponibilidad de laboratorios</h2>
            <p>Filtre por fecha, rango de horas y número de alumnos requeridos</p>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="navigateTo('menu')">Volver al menú</button>
        </div>

        <form onsubmit="handleBuscarDisponibilidad(event)">
          <div class="form-grid">
            <div class="form-group">
              <label>Fecha</label>
              <input type="date" id="filtroFecha" class="form-control" value="2026-10-15" required>
            </div>
            <div class="form-group">
              <label>Hora de inicio</label>
              <input type="time" id="filtroHoraInicio" class="form-control" value="10:00" required>
            </div>
            <div class="form-group">
              <label>Hora de término</label>
              <input type="time" id="filtroHoraFin" class="form-control" value="12:00" required>
            </div>
            <div class="form-group">
              <label>Capacidad requerida</label>
              <input type="number" id="filtroCapacidad" class="form-control" value="25" min="1" max="50" required>
            </div>
          </div>
          <button type="submit" class="btn btn-primary">Buscar</button>
        </form>

        <div style="margin-top: 1.5rem;">
          <h3 style="font-size: 1rem; color: var(--gris-texto); margin-bottom: 0.75rem; font-weight: 600;">Resultados de búsqueda:</h3>
          <div class="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Laboratorio</th>
                  <th>Capacidad</th>
                  <th>Horario</th>
                  <th>Estado</th>
                  <th style="text-align: right;">Acción</th>
                </tr>
              </thead>
              <tbody id="tablaDisponibilidad">
                <tr>
                  <td><strong>Lab. 01</strong></td>
                  <td>30</td>
                  <td id="horarioLab1">10:00–12:00</td>
                  <td><span class="badge badge-success">Disponible</span></td>
                  <td style="text-align: right;"><button class="btn btn-primary btn-sm" onclick="seleccionarParaReserva('Lab. 01')">Reservar</button></td>
                </tr>
                <tr>
                  <td><strong>Lab. 02</strong></td>
                  <td>25</td>
                  <td id="horarioLab2">10:00–12:00</td>
                  <td><span class="badge badge-danger">Ocupado</span></td>
                  <td style="text-align: right;"><button class="btn btn-secondary btn-sm" disabled style="opacity: 0.6; cursor: not-allowed;">No disponible</button></td>
                </tr>
                <tr>
                  <td><strong>Lab. 03</strong></td>
                  <td>40</td>
                  <td id="horarioLab3">10:00–12:00</td>
                  <td><span class="badge badge-success">Disponible</span></td>
                  <td style="text-align: right;"><button class="btn btn-primary btn-sm" onclick="seleccionarParaReserva('Lab. 03')">Reservar</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== PANTALLA 4: REGISTRAR RESERVA ==================== -->
    <section id="view-registrar" class="screen">
      <div class="panel">
        <div class="panel-header">
          <div>
            <h2>Registrar nueva reserva</h2>
            <p>Complete los datos solicitados para programar el laboratorio de cómputo</p>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="navigateTo('menu')">Volver al menú</button>
        </div>

        <form onsubmit="handleGuardarReserva(event)">
          <div class="form-grid">
            <div class="form-group">
              <label>Laboratorio</label>
              <select id="regLab" class="form-control" required>
                <option value="Lab. 01">Lab. 01 (Capacidad: 30 alumnos)</option>
                <option value="Lab. 02">Lab. 02 (Capacidad: 25 alumnos)</option>
                <option value="Lab. 03">Lab. 03 (Capacidad: 40 alumnos)</option>
              </select>
            </div>
            <div class="form-group">
              <label>Fecha</label>
              <input type="date" id="regFecha" class="form-control" value="2026-10-15" required>
            </div>
            <div class="form-group">
              <label>Horario</label>
              <input type="text" id="regHorario" class="form-control" value="10:00–12:00" placeholder="Ej: 10:00–12:00" required>
            </div>
            <div class="form-group">
              <label>Curso</label>
              <input type="text" id="regCurso" class="form-control" value="Sistemas Operativos" required placeholder="Nombre de la asignatura">
            </div>
            <div class="form-group">
              <label>Número de estudiantes</label>
              <input type="number" id="regEstudiantes" class="form-control" value="28" min="1" max="50" required>
            </div>
            <div class="form-group" style="grid-column: 1 / -1;">
              <label>Motivo</label>
              <input type="text" id="regMotivo" class="form-control" value="Práctica calificada de concurrencia e hilos" required placeholder="Describa el objetivo académico">
            </div>
          </div>

          <div style="display: flex; gap: 0.75rem; margin-top: 1rem;">
            <button type="submit" class="btn btn-primary">Confirmar reserva</button>
            <button type="button" class="btn btn-secondary" onclick="navigateTo('menu')">Cancelar</button>
          </div>
        </form>
      </div>
    </section>

    <!-- ==================== PANTALLA 5: MIS RESERVAS ==================== -->
    <section id="view-mis-reservas" class="screen">
      <div class="panel">
        <div class="panel-header">
          <div>
            <h2>Mis reservas</h2>
            <p>Listado de reservas solicitadas y su estado actual en el sistema</p>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-primary btn-sm" onclick="navigateTo('registrar')">+ Nueva reserva</button>
            <button class="btn btn-secondary btn-sm" onclick="navigateTo('menu')">Volver al menú</button>
          </div>
        </div>

        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Laboratorio</th>
                <th>Horario</th>
                <th>Estado</th>
                <th style="text-align: right;">Acción</th>
              </tr>
            </thead>
            <tbody id="tablaMisReservas">
              <!-- Se puebla dinámicamente con JavaScript -->
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </main>

  <!-- MODAL DE CANCELACIÓN -->
  <div class="modal-backdrop" id="modalCancelar">
    <div class="modal-box">
      <h3>Confirmar cancelación</h3>
      <p id="textoModalCancelar">¿Está seguro de cancelar esta reserva?</p>
      <div class="modal-actions">
        <button class="btn btn-secondary" onclick="cerrarModalCancelar()">No, regresar</button>
        <button class="btn btn-danger" onclick="confirmarCancelacionReserva()">Sí, cancelar reserva</button>
      </div>
    </div>
  </div>

  <!-- MODAL DE ÉXITO DE REGISTRO -->
  <div class="modal-backdrop" id="modalExito">
    <div class="modal-box">
      <h3 style="color: var(--verde-exito);">Reserva registrada correctamente</h3>
      <p id="textoModalExito">La reserva ha sido procesada de manera exitosa en el sistema académico.</p>
      <div class="modal-actions">
        <button class="btn btn-secondary" onclick="irAMenuDesdeExito()">Menú Principal</button>
        <button class="btn btn-primary" onclick="irAMisReservasDesdeExito()">Visualizar Mis reservas</button>
      </div>
    </div>
  </div>

  <footer>
    <p>SRLC - Sistema de Reserva de Laboratorios de Cómputo &copy; 2026 | Prototipo Académico Universitario</p>
  </footer>

  <script>
    // DATOS SIMULADOS EN MEMORIA
    let listaReservas = [
      { id: '1', fecha: '15/10/2026', laboratorio: 'Lab. 02', horario: '08:00–10:00', estado: 'Confirmada' },
      { id: '2', fecha: '16/10/2026', laboratorio: 'Lab. 01', horario: '14:00–16:00', estado: 'Confirmada' },
      { id: '3', fecha: '18/10/2026', laboratorio: 'Lab. 03', horario: '10:00–12:00', estado: 'Confirmada' }
    ];

    let reservaSeleccionadaParaCancelar = null;

    // NAVEGACIÓN ENTRE PANTALLAS
    function navigateTo(screenId) {
      document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
      const target = document.getElementById('view-' + screenId);
      if (target) target.classList.add('active');

      const userSection = document.getElementById('userSection');
      if (screenId === 'login') {
        userSection.style.display = 'none';
      } else {
        userSection.style.display = 'flex';
      }

      if (screenId === 'mis-reservas') {
        renderizarTablaMisReservas();
      }
    }

    // LOGIN
    function handleLoginSubmit(e) {
      e.preventDefault();
      navigateTo('menu');
    }

    // BÚSQUEDA DE DISPONIBILIDAD
    function handleBuscarDisponibilidad(e) {
      e.preventDefault();
      const inicio = document.getElementById('filtroHoraInicio').value;
      const fin = document.getElementById('filtroHoraFin').value;
      const horario = inicio + '–' + fin;
      document.getElementById('horarioLab1').textContent = horario;
      document.getElementById('horarioLab2').textContent = horario;
      document.getElementById('horarioLab3').textContent = horario;
    }

    // PRE-SELECCIONAR LAB DESDE DISPONIBILIDAD
    function seleccionarParaReserva(labNombre) {
      document.getElementById('regLab').value = labNombre;
      const fecha = document.getElementById('filtroFecha').value;
      const inicio = document.getElementById('filtroHoraInicio').value;
      const fin = document.getElementById('filtroHoraFin').value;
      if (fecha) document.getElementById('regFecha').value = fecha;
      if (inicio && fin) document.getElementById('regHorario').value = inicio + '–' + fin;
      navigateTo('registrar');
    }

    // REGISTRAR RESERVA
    function handleGuardarReserva(e) {
      e.preventDefault();
      const lab = document.getElementById('regLab').value;
      const fechaInput = document.getElementById('regFecha').value;
      const partes = fechaInput.split('-');
      const fechaFormateada = partes.length === 3 ? partes[2] + '/' + partes[1] + '/' + partes[0] : fechaInput;
      const horario = document.getElementById('regHorario').value;

      const nueva = {
        id: String(Date.now()),
        fecha: fechaFormateada,
        laboratorio: lab,
        horario: horario,
        estado: 'Confirmada'
      };

      listaReservas.unshift(nueva);

      document.getElementById('textoModalExito').textContent = 
        'Reserva confirmada para ' + lab + ' el ' + fechaFormateada + ' en horario ' + horario + '.';
      document.getElementById('modalExito').classList.add('active');
    }

    function irAMenuDesdeExito() {
      document.getElementById('modalExito').classList.remove('active');
      navigateTo('menu');
    }

    function irAMisReservasDesdeExito() {
      document.getElementById('modalExito').classList.remove('active');
      navigateTo('mis-reservas');
    }

    // RENDERIZAR TABLA MIS RESERVAS
    function renderizarTablaMisReservas() {
      const tbody = document.getElementById('tablaMisReservas');
      tbody.innerHTML = '';

      listaReservas.forEach(res => {
        const tr = document.createElement('tr');
        
        const tdFecha = document.createElement('td');
        tdFecha.textContent = res.fecha;

        const tdLab = document.createElement('td');
        tdLab.innerHTML = '<strong>' + res.laboratorio + '</strong>';

        const tdHorario = document.createElement('td');
        tdHorario.textContent = res.horario;

        const tdEstado = document.createElement('td');
        if (res.estado === 'Confirmada') {
          tdEstado.innerHTML = '<span class="badge badge-success">Confirmada</span>';
        } else {
          tdEstado.innerHTML = '<span class="badge badge-canceled">Cancelada</span>';
        }

        const tdAccion = document.createElement('td');
        tdAccion.style.textAlign = 'right';
        if (res.estado === 'Confirmada') {
          tdAccion.innerHTML = '<button class="btn btn-danger btn-sm" onclick="abrirModalCancelar(\\'' + res.id + '\\')">Cancelar</button>';
        } else {
          tdAccion.innerHTML = '<span style="font-size: 0.8rem; color: var(--gris-muted); font-style: italic;">Cancelada</span>';
        }

        tr.appendChild(tdFecha);
        tr.appendChild(tdLab);
        tr.appendChild(tdHorario);
        tr.appendChild(tdEstado);
        tr.appendChild(tdAccion);
        tbody.appendChild(tr);
      });
    }

    // CANCELACIÓN DE RESERVA
    function abrirModalCancelar(id) {
      reservaSeleccionadaParaCancelar = listaReservas.find(r => r.id === id);
      if (reservaSeleccionadaParaCancelar) {
        document.getElementById('textoModalCancelar').textContent = 
          '¿Está seguro de cancelar la reserva de ' + reservaSeleccionadaParaCancelar.laboratorio + ' para el ' + reservaSeleccionadaParaCancelar.fecha + ' (' + reservaSeleccionadaParaCancelar.horario + ')?';
        document.getElementById('modalCancelar').classList.add('active');
      }
    }

    function cerrarModalCancelar() {
      reservaSeleccionadaParaCancelar = null;
      document.getElementById('modalCancelar').classList.remove('active');
    }

    function confirmarCancelacionReserva() {
      if (reservaSeleccionadaParaCancelar) {
        reservaSeleccionadaParaCancelar.estado = 'Cancelada';
        cerrarModalCancelar();
        renderizarTablaMisReservas();
      }
    }

    // INICIALIZACIÓN
    window.onload = function() {
      navigateTo('login');
    };
  </script>
</body>
</html>`;
  };

  const downloadStandaloneHTML = () => {
    const content = generateStandaloneHTML();
    const blob = new Blob([content], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'srlc_prototipo_completo.html');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const copyStandaloneHTML = async () => {
    try {
      await navigator.clipboard.writeText(generateStandaloneHTML());
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* BARRA SUPERIOR INSTITUCIONAL (SRLC) */}
      <header className="bg-white border-b-2 border-blue-900 shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Marca / Identificador */}
          <div className="flex items-center gap-3">
            <div className="bg-blue-900 text-white font-bold text-lg px-2.5 py-1 rounded tracking-wider shadow-xs">
              SRLC
            </div>
            <div>
              <div className="text-blue-950 font-bold text-base leading-tight tracking-tight">
                SRLC
              </div>
              <div className="text-slate-500 text-xs hidden sm:block">
                Sistema de Reserva de Laboratorios de Cómputo
              </div>
            </div>
          </div>

          {/* Navegación rápida y usuario */}
          <div className="flex items-center gap-3">
            {currentView !== 'login' && (
              <>
                {/* Accesos rápidos de navegación para exposición */}
                <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-md text-xs font-medium text-slate-600">
                  <button
                    onClick={() => setCurrentView('menu')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      currentView === 'menu' ? 'bg-white text-blue-900 shadow-xs font-semibold' : 'hover:text-slate-900'
                    }`}
                  >
                    Menú
                  </button>
                  <button
                    onClick={() => setCurrentView('disponibilidad')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      currentView === 'disponibilidad' ? 'bg-white text-blue-900 shadow-xs font-semibold' : 'hover:text-slate-900'
                    }`}
                  >
                    Disponibilidad
                  </button>
                  <button
                    onClick={() => setCurrentView('registrar')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      currentView === 'registrar' ? 'bg-white text-blue-900 shadow-xs font-semibold' : 'hover:text-slate-900'
                    }`}
                  >
                    Registrar
                  </button>
                  <button
                    onClick={() => setCurrentView('mis-reservas')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      currentView === 'mis-reservas' ? 'bg-white text-blue-900 shadow-xs font-semibold' : 'hover:text-slate-900'
                    }`}
                  >
                    Mis reservas
                  </button>
                </div>

                {/* Perfil de Docente */}
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-900 font-bold text-xs flex items-center justify-center">
                    CD
                  </div>
                  <div className="hidden lg:block text-left">
                    <span className="block text-xs font-semibold text-slate-900 leading-none">
                      {nombreDocente}
                    </span>
                    <span className="text-[11px] text-slate-500">Docente</span>
                  </div>
                </div>

                {/* Botón Cerrar sesión */}
                <button
                  onClick={() => setCurrentView('login')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 transition-colors"
                  title="Cerrar sesión actual"
                >
                  <LogOut className="w-3.5 h-3.5 text-slate-600" />
                  <span className="hidden sm:inline">Cerrar sesión</span>
                </button>
              </>
            )}

            {/* Botón universitario para obtener el archivo HTML único */}
            <button
              onClick={() => setShowCodeModal(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded transition-colors"
              title="Ver / Descargar archivo index.html independiente"
            >
              <Download className="w-3.5 h-3.5 text-blue-700" />
              <span className="hidden sm:inline">Descargar HTML único</span>
            </button>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL DINÁMICO */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* ========================================================= */}
        {/* PANTALLA 1: INICIO DE SESIÓN                              */}
        {/* ========================================================= */}
        {currentView === 'login' && (
          <div className="min-h-[75vh] flex items-center justify-center py-6">
            <div className="w-full max-w-md bg-white border border-slate-200 rounded-lg shadow-sm p-6 sm:p-8">
              {/* Encabezado del login */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-900 text-white font-bold text-xl mb-3 shadow-xs">
                  <Monitor className="w-6 h-6" />
                </div>
                <h1 className="text-xl font-bold text-blue-950 tracking-tight">
                  Sistema de Reserva de Laboratorios de Cómputo
                </h1>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  SRLC · Portal Universitario Institucional
                </p>
              </div>

              {/* Formulario */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label
                    htmlFor="login-usuario"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Usuario
                  </label>
                  <input
                    id="login-usuario"
                    type="text"
                    required
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    placeholder="Ingrese su usuario o correo universitario"
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded focus:border-blue-800 focus:ring-1 focus:ring-blue-800 outline-none transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="login-password"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Contraseña
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded focus:border-blue-800 focus:ring-1 focus:ring-blue-800 outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-sm rounded transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Ingresar</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </form>

              {/* Texto de pie de formulario */}
              <div className="mt-5 pt-4 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-500">
                  Acceso para docentes y responsables de laboratorio.
                </p>
                <div className="mt-3 p-2.5 bg-slate-50 rounded border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between text-left">
                  <span>Modo prototipo activo: credenciales simuladas preparadas.</span>
                  <button
                    type="button"
                    onClick={() => {
                      setUsuario('docente');
                      setPassword('123456');
                      setCurrentView('menu');
                    }}
                    className="text-blue-900 font-bold hover:underline shrink-0 ml-2"
                  >
                    Ingreso rápido
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* PANTALLA 2: MENÚ PRINCIPAL (DASHBOARD)                    */}
        {/* ========================================================= */}
        {currentView === 'menu' && (
          <div className="space-y-6">
            {/* Banner de Bienvenida Institucional */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-900 bg-blue-50 px-2.5 py-1 rounded mb-2 border border-blue-100">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Facultad de Ingeniería y Sistemas</span>
                  </div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Bienvenido al SRLC
                  </h1>
                  <p className="text-sm text-slate-600 mt-1">
                    Seleccione una de las siguientes opciones para gestionar el uso de los laboratorios de cómputo.
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 shrink-0">
                  <div className="text-right">
                    <div className="text-xs text-slate-500">Sesión iniciada como</div>
                    <div className="text-sm font-bold text-slate-800">Docente</div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-blue-900 text-white font-bold text-sm flex items-center justify-center">
                    DOC
                  </div>
                </div>
              </div>
            </div>

            {/* Las Cuatro Opciones Principales Solicitadas */}
            <div>
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Operaciones del Sistema
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Consultar laboratorios */}
                <button
                  onClick={() => setCurrentView('disponibilidad')}
                  className="bg-white border border-slate-200 hover:border-blue-900 hover:shadow-md transition-all rounded-lg p-5 text-left flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center mb-4 group-hover:bg-blue-900 group-hover:text-white transition-colors">
                      <Search className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-semibold text-blue-900 mb-1">Opción 1</div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
                      Consultar laboratorios
                    </h3>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      Verifique disponibilidad en tiempo real por fecha, horario y capacidad requerida.
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-blue-900">
                    <span>Acceder a consulta</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>

                {/* 2. Realizar reserva */}
                <button
                  onClick={() => setCurrentView('registrar')}
                  className="bg-white border border-slate-200 hover:border-blue-900 hover:shadow-md transition-all rounded-lg p-5 text-left flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center mb-4 group-hover:bg-blue-900 group-hover:text-white transition-colors">
                      <PlusCircle className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-semibold text-blue-900 mb-1">Opción 2</div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
                      Realizar reserva
                    </h3>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      Registre una nueva reserva para sesiones de laboratorio, cursos y prácticas.
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-blue-900">
                    <span>Registrar reserva</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>

                {/* 3. Mis reservas */}
                <button
                  onClick={() => setCurrentView('mis-reservas')}
                  className="bg-white border border-slate-200 hover:border-blue-900 hover:shadow-md transition-all rounded-lg p-5 text-left flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center mb-4 group-hover:bg-blue-900 group-hover:text-white transition-colors">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-semibold text-blue-900 mb-1">Opción 3</div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
                      Mis reservas
                    </h3>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      Consulte todas las reservas vigentes asociadas a su cuenta y su estado actual.
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-blue-900">
                    <span>Ver mis reservas</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>

                {/* 4. Cancelar reserva */}
                <button
                  onClick={() => setCurrentView('mis-reservas')}
                  className="bg-white border border-slate-200 hover:border-red-600 hover:shadow-md transition-all rounded-lg p-5 text-left flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-red-50 text-red-700 flex items-center justify-center mb-4 group-hover:bg-red-700 group-hover:text-white transition-colors">
                      <XCircle className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-semibold text-red-700 mb-1">Opción 4</div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-red-700 transition-colors">
                      Cancelar reserva
                    </h3>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      Anule o cancele reservas confirmadas en caso de reprogramación de clases.
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-red-700">
                    <span>Gestionar cancelaciones</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              </div>
            </div>

            {/* Resumen de Estado de los 3 Laboratorios */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-900" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Estado Actual de los Laboratorios del Pabellón
                  </h3>
                </div>
                <span className="text-xs text-slate-500">Semestre 2026-II</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs">
                  <div className="flex justify-between items-center font-bold text-slate-800">
                    <span>Lab. 01</span>
                    <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 text-[11px]">
                      Operativo
                    </span>
                  </div>
                  <p className="text-slate-500 mt-1">Capacidad: 30 máquinas</p>
                  <p className="text-slate-500">Ubicación: 2do Piso, Pabellón C</p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs">
                  <div className="flex justify-between items-center font-bold text-slate-800">
                    <span>Lab. 02</span>
                    <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 text-[11px]">
                      Operativo
                    </span>
                  </div>
                  <p className="text-slate-500 mt-1">Capacidad: 25 máquinas</p>
                  <p className="text-slate-500">Ubicación: 2do Piso, Pabellón C</p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs">
                  <div className="flex justify-between items-center font-bold text-slate-800">
                    <span>Lab. 03</span>
                    <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 text-[11px]">
                      Operativo
                    </span>
                  </div>
                  <p className="text-slate-500 mt-1">Capacidad: 40 máquinas</p>
                  <p className="text-slate-500">Ubicación: 3er Piso, Pabellón C</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* PANTALLA 3: CONSULTA DE DISPONIBILIDAD                    */}
        {/* ========================================================= */}
        {currentView === 'disponibilidad' && (
          <div className="space-y-6">
            {/* Cabecera con botón de retorno */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 mb-5">
                <div>
                  <h1 className="text-xl font-bold text-blue-950">
                    Consultar disponibilidad de laboratorios
                  </h1>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Ingrese los parámetros para consultar el estado de ocupación de los laboratorios.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentView('menu')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 transition-colors self-start sm:self-auto cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Volver al menú</span>
                </button>
              </div>

              {/* Formulario de Consulta */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setHasSearched(true);
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Fecha */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Fecha
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        required
                        value={searchFecha}
                        onChange={(e) => setSearchFecha(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded focus:border-blue-900 focus:ring-1 focus:ring-blue-900 outline-none"
                      />
                    </div>
                  </div>

                  {/* Hora de inicio */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Hora de inicio
                    </label>
                    <input
                      type="time"
                      required
                      value={searchHoraInicio}
                      onChange={(e) => setSearchHoraInicio(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded focus:border-blue-900 focus:ring-1 focus:ring-blue-900 outline-none"
                    />
                  </div>

                  {/* Hora de término */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Hora de término
                    </label>
                    <input
                      type="time"
                      required
                      value={searchHoraFin}
                      onChange={(e) => setSearchHoraFin(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded focus:border-blue-900 focus:ring-1 focus:ring-blue-900 outline-none"
                    />
                  </div>

                  {/* Capacidad requerida */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Capacidad requerida
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="50"
                      value={searchCapacidad}
                      onChange={(e) => setSearchCapacidad(e.target.value)}
                      placeholder="Ej. 25"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded focus:border-blue-900 focus:ring-1 focus:ring-blue-900 outline-none"
                    />
                  </div>
                </div>

                {/* Botón Buscar */}
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs rounded transition-colors shadow-xs cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Buscar</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Tabla de Resultados Solicitada */}
            {hasSearched && (
              <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      Disponibilidad encontrada para el {searchFecha}
                    </h2>
                    <p className="text-xs text-slate-500">
                      Horario consultado: {searchHoraInicio}–{searchHoraFin} · Capacidad solicitada: {searchCapacidad} estudiantes
                    </p>
                  </div>
                  <span className="text-xs font-medium text-slate-500">
                    3 laboratorios evaluados
                  </span>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-md">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-100 text-slate-700 text-xs uppercase font-semibold border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3">Laboratorio</th>
                        <th className="px-4 py-3 text-center">Capacidad</th>
                        <th className="px-4 py-3">Horario</th>
                        <th className="px-4 py-3">Estado</th>
                        <th className="px-4 py-3 text-right">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {laboratoriosDisponibles.map((lab) => {
                        const isDisponible = lab.estado === 'Disponible';
                        return (
                          <tr key={lab.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3.5 font-bold text-slate-900">
                              <div className="flex items-center gap-2">
                                <Monitor className="w-4 h-4 text-blue-900 shrink-0" />
                                <span>{lab.nombre}</span>
                              </div>
                              <span className="text-[11px] text-slate-500 font-normal block pl-6">
                                {lab.equipamiento}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-center font-mono font-medium text-slate-800">
                              {lab.capacidad}
                            </td>
                            <td className="px-4 py-3.5 font-mono text-xs text-slate-700">
                              {lab.horario}
                            </td>
                            <td className="px-4 py-3.5">
                              {isDisponible ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Disponible</span>
                                </span>
                              ) : (
                                <div>
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                                    <XCircle className="w-3.5 h-3.5" />
                                    <span>Ocupado</span>
                                  </span>
                                  {lab.motivoOcupado && (
                                    <span className="block text-[11px] text-slate-500 mt-1">
                                      {lab.motivoOcupado}
                                    </span>
                                  )}
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-3.5 text-right">
                              {isDisponible ? (
                                <button
                                  onClick={() => handleReservarDesdeConsulta(lab.nombre)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-blue-900 hover:bg-blue-800 text-white rounded transition-colors shadow-xs cursor-pointer"
                                >
                                  <span>Reservar</span>
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              ) : (
                                <button
                                  disabled
                                  className="px-3 py-1.5 text-xs font-medium text-slate-400 bg-slate-100 rounded border border-slate-200 cursor-not-allowed"
                                >
                                  No disponible
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-slate-400" />
                    Haga clic en <strong>"Reservar"</strong> para autocompletar el laboratorio en el formulario de registro.
                  </span>
                  <button
                    onClick={() => setCurrentView('menu')}
                    className="text-blue-900 font-semibold hover:underline"
                  >
                    Volver al menú principal
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* PANTALLA 4: REGISTRAR RESERVA                             */}
        {/* ========================================================= */}
        {currentView === 'registrar' && (
          <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs max-w-2xl mx-auto">
            {/* Encabezado */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-5">
              <div>
                <h1 className="text-xl font-bold text-blue-950">
                  Registrar nueva reserva
                </h1>
                <p className="text-xs text-slate-600 mt-0.5">
                  Complete los datos académicos para programar la sesión en el laboratorio.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCurrentView('menu')}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 rounded border border-slate-200"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Volver</span>
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleConfirmarReserva} className="space-y-4">
              {/* Laboratorio */}
              <div>
                <label
                  htmlFor="reg-laboratorio"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Laboratorio
                </label>
                <select
                  id="reg-laboratorio"
                  required
                  value={formLab}
                  onChange={(e) => setFormLab(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded focus:border-blue-900 focus:ring-1 focus:ring-blue-900 outline-none"
                >
                  <option value="Lab. 01">Lab. 01 (Capacidad: 30 máquinas)</option>
                  <option value="Lab. 02">Lab. 02 (Capacidad: 25 máquinas)</option>
                  <option value="Lab. 03">Lab. 03 (Capacidad: 40 máquinas)</option>
                </select>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Seleccione uno de los 3 laboratorios habilitados.
                </span>
              </div>

              {/* Fila Fecha y Horario */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="reg-fecha"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Fecha
                  </label>
                  <input
                    id="reg-fecha"
                    type="date"
                    required
                    value={formFecha}
                    onChange={(e) => setFormFecha(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded focus:border-blue-900 focus:ring-1 focus:ring-blue-900 outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="reg-horario"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Horario
                  </label>
                  <input
                    id="reg-horario"
                    type="text"
                    required
                    value={formHorario}
                    onChange={(e) => setFormHorario(e.target.value)}
                    placeholder="Ej. 10:00–12:00"
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded focus:border-blue-900 focus:ring-1 focus:ring-blue-900 outline-none font-mono"
                  />
                </div>
              </div>

              {/* Fila Curso y Estudiantes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="reg-curso"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Curso
                  </label>
                  <input
                    id="reg-curso"
                    type="text"
                    required
                    value={formCurso}
                    onChange={(e) => setFormCurso(e.target.value)}
                    placeholder="Ej. Redes y Comunicaciones II"
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded focus:border-blue-900 focus:ring-1 focus:ring-blue-900 outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="reg-estudiantes"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Número de estudiantes
                  </label>
                  <input
                    id="reg-estudiantes"
                    type="number"
                    min="1"
                    max="50"
                    required
                    value={formEstudiantes}
                    onChange={(e) => setFormEstudiantes(e.target.value)}
                    placeholder="25"
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded focus:border-blue-900 focus:ring-1 focus:ring-blue-900 outline-none font-mono"
                  />
                </div>
              </div>

              {/* Motivo */}
              <div>
                <label
                  htmlFor="reg-motivo"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Motivo
                </label>
                <textarea
                  id="reg-motivo"
                  required
                  rows={3}
                  value={formMotivo}
                  onChange={(e) => setFormMotivo(e.target.value)}
                  placeholder="Detalle el objetivo académico de la práctica..."
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded focus:border-blue-900 focus:ring-1 focus:ring-blue-900 outline-none resize-none"
                />
              </div>

              {/* Botones de Acción */}
              <div className="pt-4 border-t border-slate-200 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentView('menu')}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded border border-slate-300 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Confirmar reserva</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* PANTALLA 5: MIS RESERVAS                                  */}
        {/* ========================================================= */}
        {currentView === 'mis-reservas' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 mb-4">
                <div>
                  <h1 className="text-xl font-bold text-blue-950">
                    Mis reservas
                  </h1>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Historial y estado de las reservas de laboratorio registradas para el docente.
                  </p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    onClick={() => setCurrentView('registrar')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded shadow-xs transition-colors cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Nueva reserva</span>
                  </button>
                  <button
                    onClick={() => setCurrentView('menu')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Volver al menú</span>
                  </button>
                </div>
              </div>

              {/* Tabla de Reservas */}
              <div className="overflow-x-auto border border-slate-200 rounded-md">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-100 text-slate-700 text-xs uppercase font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Fecha</th>
                      <th className="px-4 py-3">Laboratorio</th>
                      <th className="px-4 py-3">Horario</th>
                      <th className="px-4 py-3">Estado</th>
                      <th className="px-4 py-3 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {reservas.map((item) => {
                      const isConfirmada = item.estado === 'Confirmada';
                      return (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3.5 font-mono text-xs font-medium text-slate-800">
                            {item.fecha}
                          </td>
                          <td className="px-4 py-3.5 font-bold text-slate-900">
                            <div className="flex items-center gap-1.5">
                              <span>{item.laboratorio}</span>
                            </div>
                            <span className="text-[11px] text-slate-500 font-normal block">
                              {item.curso} · {item.estudiantes} alumnos
                            </span>
                          </td>
                          <td className="px-4 py-3.5 font-mono text-xs text-slate-700">
                            {item.horario}
                          </td>
                          <td className="px-4 py-3.5">
                            {isConfirmada ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Confirmada</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200 line-through">
                                <XCircle className="w-3 h-3 text-slate-400" />
                                <span>Cancelada</span>
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            {isConfirmada ? (
                              <button
                                onClick={() => setCancelModal({ isOpen: true, reserva: item })}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded transition-colors cursor-pointer"
                              >
                                <XCircle className="w-3 h-3" />
                                <span>Cancelar</span>
                              </button>
                            ) : (
                              <span className="text-xs text-slate-400 italic">
                                Cancelada
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Botón Volver al menú al pie */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Total de reservas registradas: {reservas.length} (
                  {reservas.filter((r) => r.estado === 'Confirmada').length} activas)
                </span>
                <button
                  onClick={() => setCurrentView('menu')}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-900 hover:text-blue-950 hover:bg-blue-50 rounded transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Volver al menú</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* PIE DE PÁGINA INSTITUCIONAL */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong>SRLC</strong> · Sistema de Reserva de Laboratorios de Cómputo &copy; 2026
          </div>
          <div className="text-slate-400">
            Prototipo Académico de Media Fidelidad · Universidad Nacional
          </div>
        </div>
      </footer>

      {/* ========================================================= */}
      {/* MODAL DE CONFIRMACIÓN DE CANCELACIÓN                     */}
      {/* ========================================================= */}
      {cancelModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  ¿Está seguro de cancelar esta reserva?
                </h3>
                <p className="text-xs text-slate-500">
                  Esta acción anulará el horario reservado y lo dejará disponible para otros docentes.
                </p>
              </div>
            </div>

            {cancelModal.reserva && (
              <div className="bg-slate-50 p-3.5 rounded border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Laboratorio:</span>
                  <span className="font-bold text-slate-900">{cancelModal.reserva.laboratorio}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Fecha:</span>
                  <span className="font-mono text-slate-900">{cancelModal.reserva.fecha}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Horario:</span>
                  <span className="font-mono text-slate-900">{cancelModal.reserva.horario}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Curso:</span>
                  <span className="text-slate-900">{cancelModal.reserva.curso}</span>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                onClick={() => setCancelModal({ isOpen: false, reserva: null })}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded transition-colors cursor-pointer"
              >
                No, mantener reserva
              </button>
              <button
                onClick={handleEjecutarCancelacion}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded transition-colors shadow-xs cursor-pointer"
              >
                Sí, cancelar reserva
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL DE RESERVA REGISTRADA CON ÉXITO                     */}
      {/* ========================================================= */}
      {confirmSuccessModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 border border-emerald-200">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Reserva registrada correctamente.
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                La solicitud ha sido registrada en el sistema del laboratorio universitario.
              </p>
            </div>

            {confirmSuccessModal.reserva && (
              <div className="bg-slate-50 p-3.5 rounded border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Laboratorio:</span>
                  <span className="font-bold text-blue-900">
                    {confirmSuccessModal.reserva.laboratorio}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Fecha:</span>
                  <span className="font-mono text-slate-900">
                    {confirmSuccessModal.reserva.fecha}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Horario:</span>
                  <span className="font-mono text-slate-900">
                    {confirmSuccessModal.reserva.horario}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Curso:</span>
                  <span className="text-slate-900">
                    {confirmSuccessModal.reserva.curso}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Estudiantes:</span>
                  <span className="text-slate-900">
                    {confirmSuccessModal.reserva.estudiantes} alumnos
                  </span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                onClick={() => {
                  setConfirmSuccessModal({ isOpen: false, reserva: null });
                  setCurrentView('menu');
                }}
                className="w-full py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 transition-colors text-center cursor-pointer"
              >
                Volver al Menú
              </button>
              <button
                onClick={() => {
                  setConfirmSuccessModal({ isOpen: false, reserva: null });
                  setCurrentView('mis-reservas');
                }}
                className="w-full py-2 px-3 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded transition-colors shadow-xs text-center cursor-pointer"
              >
                Ver Mis Reservas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL DE EXPORTACIÓN: PROTOTIPO INDEPENDIENTE EN 1 ARCHIVO*/}
      {/* ========================================================= */}
      {showCodeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-3">
              <div>
                <h3 className="text-base font-bold text-blue-950">
                  Prototipo en un solo archivo (index.html independiente)
                </h3>
                <p className="text-xs text-slate-500">
                  Código puro completo con HTML, CSS y JavaScript sin dependencias para ejecutar con doble clic.
                </p>
              </div>
              <button
                onClick={() => setShowCodeModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={downloadStandaloneHTML}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded transition-colors shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar archivo .html</span>
              </button>
              <button
                onClick={copyStandaloneHTML}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded transition-colors cursor-pointer"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">¡Copiado al portapapeles!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-600" />
                    <span>Copiar código completo</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex-1 overflow-auto bg-slate-900 rounded p-3 text-slate-100 text-xs font-mono border border-slate-800">
              <pre className="whitespace-pre">{generateStandaloneHTML()}</pre>
            </div>

            <div className="mt-4 pt-2 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowCodeModal(false)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
