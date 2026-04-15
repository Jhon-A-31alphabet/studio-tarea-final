import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() {
    this.init();
  }

  async init() {
    if (Capacitor.getPlatform() !== 'android') return;
    
    console.log('🔔 Inicializando notificaciones...');
    
    // Crear canal
    try {
      await LocalNotifications.createChannel({
        id: 'tareas',
        name: 'Tareas',
        description: 'Notificaciones de tareas pendientes',
        importance: 4,
        visibility: 1
      });
      console.log('✅ Canal creado');
    } catch(e) { console.log('Canal ya existe'); }
    
    // Pedir permiso
    const permiso = await LocalNotifications.checkPermissions();
    if (permiso.display !== 'granted') {
      const result = await LocalNotifications.requestPermissions();
      console.log('Permiso:', result.display);
    } else {
      console.log('✅ Permiso ya concedido');
    }
  }

  async programar(
    titulo: string,
    texto: string,
    fecha: string,
    hora: string
  ): Promise<number> {
    
    console.log('📝 Programando:', fecha, hora);
    
    // Parsear fecha
    const [year, month, day] = fecha.split('-');
    const [hours, minutes] = hora.split(':');
    
    const fechaHora = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hours),
      parseInt(minutes)
    );
    
    // Validar que sea futura
    if (fechaHora <= new Date()) {
      console.log('❌ Fecha pasada');
      return -1;
    }
    
    const id = Math.floor(Math.random() * 1000000);
    
    await LocalNotifications.schedule({
      notifications: [{
        id: id,
        title: titulo,
        body: texto,
        schedule: { at: fechaHora },
        channelId: 'tareas'
      }]
    });
    
    console.log('✅ Programada ID:', id);
    
    // Verificar
    const pending = await LocalNotifications.getPending();
    console.log('Pendientes:', pending.notifications.length);
    
    return id;
  }

  async cancelar(id: number) {
    if (!id || id === -1) return;
    await LocalNotifications.cancel({ notifications: [{ id: id }] });
    console.log('❌ Cancelada:', id);
  }
}