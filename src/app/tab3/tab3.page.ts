import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabButton, 
         IonCard, IonModal, IonCheckbox, IonItem, IonIcon, IonInput, 
         IonLabel, IonButton, IonDatetime, IonSelect, IonSelectOption, IonButtons,
         IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/angular/standalone';
import { DatePipe, CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { trash } from 'ionicons/icons';
import { DatabaseService } from '../services/database.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonFab,
    IonFabButton, IonCard, IonModal, DatePipe, IonCheckbox, 
    IonItem, IonIcon, IonInput, IonLabel, IonButton, IonDatetime,
    FormsModule, IonSelect, IonSelectOption, CommonModule, IonButtons,
    IonCardHeader, IonCardTitle, IonCardContent
  ],
})
export class Tab3Page implements OnInit {
  @ViewChild('modalTarea') modal!: IonModal;
  
  fechaactual: Date = new Date();
  tareas: any[] = [];
  materias: any[] = [];
  
  // Datos de la nueva tarea
  nuevaDescripcion: string = '';
  nuevaFecha: string = '';
  nuevaHora: string = '';
  nuevaMateriaId: number = 0;

  constructor(
    private dbService: DatabaseService,
    private notificationService: NotificationService
  ) {
    addIcons({ trash });
  }

  async ngOnInit() {
    this.fechaactual = new Date();
    console.log('Inicializando BD desde Tab3...');
    await this.dbService.initializeDatabase();
    console.log('BD inicializada, cargando materias y tareas...');
    
    await this.notificationService.init();
    await this.cargarMaterias();
    await this.cargarTareas();
  }

  async cargarMaterias() {
    this.materias = await this.dbService.getSubjects();
    console.log('Materias cargadas:', this.materias);
  }

  async cargarTareas() {
    this.tareas = await this.dbService.obtenerTareas();
    console.log('Tareas cargadas:', this.tareas);
  }

  async aceptar() {
    console.log('Valores originales:', {
      descripcion: this.nuevaDescripcion,
      fecha: this.nuevaFecha,
      hora: this.nuevaHora,
      materiaId: this.nuevaMateriaId
    });

    // Validar que haya materias
    if (this.materias.length === 0) {
      alert('❌ Primero debe crear una materia antes de agregar una tarea');
      console.log('Error: No hay materias disponibles');
      return;
    }

    // Validar materia seleccionada
    if (!this.nuevaMateriaId || this.nuevaMateriaId === 0) {
      alert('❌ Por favor, selecciona una materia para la tarea');
      console.log('Error: Materia no seleccionada');
      return;
    }

    // Validar campos con mensajes de alerta
    if (!this.nuevaDescripcion || this.nuevaDescripcion.trim() === '') {
      alert('❌ Por favor, escribe una descripción para la tarea');
      console.log('Error: Descripción vacía');
      return;
    }
    
    if (!this.nuevaFecha) {
      alert('❌ Por favor, selecciona una fecha para la tarea');
      console.log('Error: Fecha no seleccionada');
      return;
    }
    
    if (!this.nuevaHora) {
      alert('❌ Por favor, selecciona una hora para la tarea');
      console.log('Error: Hora no seleccionada');
      return;
    }

    try {
      // Formatear fecha y hora
      let fechaSolo = this.nuevaFecha;
      if (fechaSolo.includes('T')) {
        fechaSolo = fechaSolo.split('T')[0];
      }
      
      let horaSolo = this.nuevaHora;
      if (horaSolo.includes('T')) {
        horaSolo = horaSolo.split('T')[1].substring(0, 5);
      }
      
      console.log('Valores formateados:', {
        fecha: fechaSolo,
        hora: horaSolo,
        materiaId: this.nuevaMateriaId
      });
      
      // Programar notificación
      const notificacionId = await this.notificationService.programar(
        '📋 Tarea Pendiente',
        this.nuevaDescripcion,
        fechaSolo,
        horaSolo
      );

      if (notificacionId === -1) {
        alert('⚠️ La fecha y hora deben ser futuras');
        return;
      }

      // Guardar en base de datos con subject_id
      await this.dbService.agregarTarea(
        this.nuevaDescripcion,
        fechaSolo,
        horaSolo,
        notificacionId,
        this.nuevaMateriaId
      );

      // Recargar tareas
      await this.cargarTareas();
      
      // Limpiar formulario
      this.nuevaDescripcion = '';
      this.nuevaFecha = '';
      this.nuevaHora = '';
      this.nuevaMateriaId = 0;
      
      // Cerrar modal
      this.modal.dismiss();
      
      console.log('Tarea guardada exitosamente');
      alert('✅ Tarea guardada correctamente');
      
    } catch (error) {
      console.error('Error al guardar tarea:', error);
      alert('❌ Error al guardar la tarea');
    }
  }

  cancelar() {
    this.modal.dismiss();
    this.nuevaDescripcion = '';
    this.nuevaFecha = '';
    this.nuevaHora = '';
    this.nuevaMateriaId = 0;
  }

  async eliminarTarea(tarea: any) {
    try {
      if (tarea.notificacion_id) {
        await this.notificationService.cancelar(tarea.notificacion_id);
      }
      
      await this.dbService.eliminarTarea(tarea.id);
      await this.cargarTareas();
      
      console.log('Tarea eliminada');
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
    }
  }

  async toggleCompletada(tarea: any) {
    const completada = tarea.completada === 1 ? 0 : 1;
    await this.dbService.actualizarTareaCompletada(tarea.id, completada);
    
    // Mostrar notificación si se marca como completada
    if (completada === 1) {
      await this.notificationService.programar(
        '✅ Tarea Completada',
        `La tarea "${tarea.descripcion}" ha sido marcada como completada`,
        new Date().toISOString().split('T')[0],
        new Date().toTimeString().split(' ')[0].substring(0, 5)
      );
      alert(`✅ ¡Excelente! Tarea "${tarea.descripcion}" completada`);
    }
    
    await this.cargarTareas();
  }

  async probarNotificacion() {
    console.log('🔔 Probando notificación en 5 segundos...');
    
    const dentroDe5Seg = new Date();
    dentroDe5Seg.setSeconds(dentroDe5Seg.getSeconds() + 5);
    
    const fecha = dentroDe5Seg.toISOString().split('T')[0];
    const hora = dentroDe5Seg.toTimeString().split(' ')[0].substring(0, 5);
    
    const id = await this.notificationService.programar(
      'PRUEBA',
      'Esta es una notificación de prueba',
      fecha,
      hora
    );
    
    if (id !== -1) {
      alert(`✅ Notificación programada ID: ${id}\n\nCierra la app y espera 5 segundos`);
    } else {
      alert('❌ Error: No se pudo programar la notificación');
    }
  }
}
