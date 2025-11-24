import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import { useState } from 'react';
import { Heart, Check } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { StyledInput } from '@/components/StyledInput';

const CONDITIONS = [
  'Hipertensão',
  'Diabetes',
  'Asma',
  'Doença cardíaca',
  'Doença renal',
  'Obesidade',
  'Imunossupressão',
  'Alergia grave',
  'Fumante',
  'Gestante',
];

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<'Masculino' | 'Feminino' | 'Outro' | ''>('');
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggleCondition = (c: string) => {
    setSelectedConditions(prev =>
      prev.includes(c) ? prev.filter(i => i !== c) : [...prev, c]
    );
  };

  const handleSubmit = async () => {
    if (!fullName.trim() || !email.trim()) {
      Alert.alert('Erro', 'Preencha pelo menos Nome e Email.');
      return;
    }
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const resumo =
        `Nome: ${fullName}\n` +
        `Email: ${email}\n` +
        `Telefone: ${phone || '-'}\n` +
        `Nascimento: ${birthDate || '-'}\n` +
        `Gênero: ${gender || '-'}\n` +
        `Condições: ${selectedConditions.length ? selectedConditions.join(', ') : 'Nenhuma'}`;
      Alert.alert('Cadastro (demonstração)', resumo);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Heart size={48} color="#A294F9" strokeWidth={2} />
            </View>
            <Text style={styles.title}>CADASTRO</Text>
            <Text style={styles.subtitle}>Crie sua conta</Text>
            <Text style={styles.description}>
              Preencha seus dados pessoais e selecione condições pré‑existentes.
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <StyledInput
                  style={styles.input}
                  placeholder="Nome completo"
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <StyledInput
                  style={styles.input}
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <StyledInput
                  style={styles.input}
                  placeholder="Telefone"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <StyledInput
                  style={styles.input}
                  placeholder="Data de nascimento (DD/MM/AAAA)"
                  value={birthDate}
                  onChangeText={setBirthDate}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.sectionTitle}>Gênero</Text>
              <View style={styles.segmentContainer}>
                {(['Masculino', 'Feminino', 'Outro'] as const).map(opt => (
                  <TouchableOpacity
                    key={opt}
                    style={[
                      styles.segmentItem,
                      gender === opt && styles.segmentItemSelected,
                    ]}
                    onPress={() => setGender(opt)}
                  >
                    <Text
                      style={[
                        styles.segmentItemText,
                        gender === opt && styles.segmentItemTextSelected,
                      ]}
                    >
                      {opt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.sectionTitle}>Condições pré‑existentes</Text>
              <View style={styles.chipList}>
                {CONDITIONS.map(c => {
                  const selected = selectedConditions.includes(c);
                  return (
                    <TouchableOpacity
                      key={c}
                      style={[styles.chip, selected && styles.chipSelected]}
                      onPress={() => toggleCondition(c)}
                    >
                      {selected ? <Check size={16} color="#6B21A8" /> : null}
                      <Text
                        style={[
                          styles.chipText,
                          selected && styles.chipTextSelected,
                        ]}
                      >
                        {c}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.submitButtonText}>
                {loading ? 'Enviando...' : 'Cadastrar'}
              </Text>
            </TouchableOpacity>

            <View style={styles.linksRow}>
              <TouchableOpacity onPress={() => router.replace('/login')}>
                <Text style={styles.linkText}>Já tenho conta</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Esta é uma tela demonstrativa, sem persistência de dados.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  keyboardView: { flex: 1 },
  content: { padding: 24 },
  header: { alignItems: 'center', marginBottom: 32 },
  logoContainer: {
    width: 96, height: 96, backgroundColor: '#EFF6FF', borderRadius: 48,
    alignItems: 'center', justifyContent: 'center', marginBottom: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1,
    shadowRadius: 8, elevation: 4,
  },
  title: { fontSize: 32, fontWeight: '800', color: '#A294F9', marginBottom: 8 },
  subtitle: { fontSize: 18, fontWeight: '500', color: '#64748B', marginBottom: 12 },
  description: { fontSize: 16, color: '#64748B', textAlign: 'center', lineHeight: 24, paddingHorizontal: 20 },

  form: { gap: 20, marginBottom: 24 },
  inputContainer: { gap: 8 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB',
    paddingHorizontal: 16, paddingVertical: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05,
    shadowRadius: 4, elevation: 2,
  },
  input: { flex: 1, fontSize: 16, color: '#1E293B', paddingVertical: 16, paddingLeft: 4 },

  sectionTitle: { fontSize: 14, color: '#64748B', fontWeight: '600' },
  segmentContainer: { flexDirection: 'row', gap: 8 },
  segmentItem: {
    flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 8,
    borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF',
  },
  segmentItemSelected: { borderColor: '#A294F9', backgroundColor: '#EEF2FF' },
  segmentItemText: { fontSize: 14, color: '#334155', fontWeight: '500' },
  segmentItemTextSelected: { color: '#6B21A8', fontWeight: '700' },

  chipList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12,
    borderRadius: 999, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF',
    gap: 6,
  },
  chipSelected: { borderColor: '#A294F9', backgroundColor: '#EEF2FF' },
  chipText: { color: '#334155', fontSize: 13 },
  chipTextSelected: { color: '#6B21A8', fontWeight: '600' },

  submitButton: {
    backgroundColor: '#A294F9', borderRadius: 12, paddingVertical: 16, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1,
    shadowRadius: 8, elevation: 4, marginTop: 4,
  },
  submitButtonDisabled: { opacity: 0.7 },
  submitButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },

  linksRow: { alignItems: 'center', marginTop: 8 },
  linkText: { color: '#A294F9', fontSize: 14, fontWeight: '600' },

  footer: { alignItems: 'center' },
  footerText: { fontSize: 14, color: '#64748B', textAlign: 'center', lineHeight: 20 },
});