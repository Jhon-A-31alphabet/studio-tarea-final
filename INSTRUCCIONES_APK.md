# 📱 Instrucciones para Generar APK de Studio Tarea Final

## Paso 1: Aceptar Licencias de Android SDK

Ejecuta una de estas opciones según tu sistema operativo:

### Windows (PowerShell):
```powershell
powershell -ExecutionPolicy Bypass -Command "echo 'y' | & 'C:\Program Files\Android\Android Studio\tools\bin\sdkmanager.bat' --licenses"
```

### Windows (CMD):
```cmd
(echo y & echo y & echo y & echo y & echo y & echo y) | "C:\Program Files\Android\Android Studio\tools\bin\sdkmanager.bat" --licenses
```

### macOS / Linux:
```bash
yes | $ANDROID_HOME/tools/bin/sdkmanager --licenses
```

## Paso 2: Generar APK de Debug

Una vez aceptadas las licencias, ejecuta desde el directorio del proyecto:

### Para APK de Debug (recomendado para pruebas):
```bash
cd studio-tarea-final
npx cap sync android
cd android
./gradlew assembleDebug
```

El APK se generará en: `android/app/build/outputs/apk/debug/app-debug.apk`

### Para APK de Release (requiere firma):
```bash
cd studio-tarea-final/android
./gradlew assembleRelease
```

El APK se generará en: `android/app/build/outputs/apk/release/app-release-unsigned.apk`

## Paso 3: Instalar en Dispositivo

Una vez generado el APK, instálalo con:

```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

## ⚠️ Solución Rápida

Si tienes problemas con las licencias, puedes aceptarlas todas de una vez:

```bash
mkdir -p "$ANDROID_HOME/licenses" && echo "24333f8a63b6825ea9c5514f83c2829b004d1fee" > "$ANDROID_HOME/licenses/android-sdk-license"
```

Luego intenta nuevamente el build.

## 📝 Proyecto Build

El proyecto ya tiene compilado en modo producción:
- Build web: ✅ `www/` (1.09 MB)
- Android sync: ✅ Completado
- Gradle: En espera de aceptar licencias

---

Una vez que aceptes las licencias de Android SDK, el APK se generará correctamente.
