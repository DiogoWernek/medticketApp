import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function Scan() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if (!permission?.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionWrap}>
          <Text style={styles.permissionText}>Precisamos da sua permissão para acessar a câmera.</Text>
          <TouchableOpacity style={styles.allowButton} onPress={requestPermission}>
            <Text style={styles.allowButtonText}>Permitir câmera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backLink} onPress={() => router.back()}>
            <Text style={styles.backLinkText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Acrescenta os insets da área segura
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.container}>
      {/* Barra superior com botão Voltar */}
      <View style={[styles.topBar, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color="#FFFFFF" />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
      </View>

      <CameraView
        style={styles.camera}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={scanned ? undefined : (e) => {
          setScanned(true);
          const data = Array.isArray(e.data) ? JSON.stringify(e.data) : String(e.data);
          Alert.alert(
            'QR lido (demo)',
            data || 'Sem conteúdo',
            [
              { text: 'Fechar', onPress: () => setScanned(false) },
              { text: 'Voltar', style: 'cancel', onPress: () => router.back() },
            ]
          );
        }}
      />

      {/* Rodapé com ação para reescanear */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.actionBtn, scanned && styles.actionBtnActive]}
          onPress={() => setScanned(false)}
        >
          <Text style={styles.actionText}>{scanned ? 'Escanear novamente' : 'Pronto para escanear'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 12,
    paddingBottom: 8,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  backText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },

  camera: { flex: 1 },

  bottomBar: {
    position: 'absolute', bottom: 20, left: 16, right: 16, zIndex: 10,
    alignItems: 'center',
  },
  actionBtn: {
    backgroundColor: '#111827', opacity: 0.8, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16,
  },
  actionBtnActive: { backgroundColor: '#A294F9', opacity: 1 },
  actionText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },

  permissionWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  permissionText: { color: '#1E293B', fontSize: 16, textAlign: 'center', marginBottom: 12 },
  allowButton: { backgroundColor: '#A294F9', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16, marginBottom: 12 },
  allowButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  backLink: { marginTop: 10 },
  backLinkText: { color: '#A294F9', fontSize: 14, fontWeight: '600' },
});