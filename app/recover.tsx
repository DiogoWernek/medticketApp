import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useState } from 'react';
import { StyledInput } from '@/components/StyledInput';
import { useRouter } from 'expo-router';
import { Lock, Mail, IdCard } from 'lucide-react-native';

export default function Recover() {
  const [identifier, setIdentifier] = useState('');
  const router = useRouter();

  const handleRecover = async () => {
    if (!identifier.trim()) {
      Alert.alert('Erro', 'Digite seu email ou CPF.');
      return;
    }
    await new Promise(r => setTimeout(r, 700));
    Alert.alert(
      'Recuperação de Senha (demo)',
      `Se existirem dados, enviaremos instruções para:\n${identifier}`
    );
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.logo}>
              <Lock size={40} color="#A294F9" />
            </View>
            <Text style={styles.title}>Recuperar Senha</Text>
            <Text style={styles.subtitle}>Informe seu e‑mail ou CPF para receber instruções</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputWrapper}>
              <Mail size={18} color="#6B7280" />
              <StyledInput
                style={styles.input}
                placeholder="Email ou CPF"
                value={identifier}
                onChangeText={setIdentifier}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleRecover}>
              <Text style={styles.submitButtonText}>Enviar instruções</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backLink} onPress={() => router.replace('/login')}>
              <Text style={styles.backLinkText}>Voltar ao login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  keyboardView: { flex: 1 },
  content: { flex: 1, padding: 24, justifyContent: 'center' },

  header: { alignItems: 'center', marginBottom: 32 },
  logo: {
    width: 80, height: 80, backgroundColor: '#EFF6FF', borderRadius: 40,
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4,
  },
  title: { fontSize: 28, fontWeight: '800', color: '#A294F9' },
  subtitle: { fontSize: 14, color: '#64748B', textAlign: 'center', marginTop: 6 },

  form: { gap: 16 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 16, paddingVertical: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  input: { flex: 1, fontSize: 16, color: '#1E293B', paddingVertical: 16, paddingLeft: 12 },

  submitButton: {
    backgroundColor: '#A294F9', borderRadius: 12, paddingVertical: 16, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4,
  },
  submitButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },

  backLink: { alignItems: 'center' },
  backLinkText: { color: '#A294F9', fontSize: 14, fontWeight: '600', marginTop: 8 },
});