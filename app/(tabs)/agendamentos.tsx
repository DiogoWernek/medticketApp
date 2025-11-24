import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useMemo, useState } from 'react';
import { CalendarDays, MapPin, Clock, Building2 } from 'lucide-react-native';
import { StyledInput } from '@/components/StyledInput';

type Clinic = {
  id: string;
  name: string;
  address: string;
  specialties: string[];
  distanceKm?: number;
};

const CLINICS: Clinic[] = [
  { id: 'c1', name: 'Clínica Vida Plena', address: 'Av. Saúde, 123 - Centro', specialties: ['Clínico Geral', 'Cardiologia'], distanceKm: 1.2 },
  { id: 'c2', name: 'Instituto Bem-Estar', address: 'Rua Vital, 45 - Jardim', specialties: ['Pediatria', 'Dermatologia'], distanceKm: 3.8 },
  { id: 'c3', name: 'CardioCare', address: 'Al. Coração, 777 - Sul', specialties: ['Cardiologia', 'Exames'], distanceKm: 5.1 },
  { id: 'c4', name: 'Respira Mais', address: 'Av. Pulmão, 90 - Norte', specialties: ['Pneumologia', 'Clínico Geral'], distanceKm: 2.5 },
];

const ALL_TIMESLOTS = [
  '08:00','08:30','09:00','09:30','10:00','10:30','11:00',
  '13:00','13:30','14:00','14:30','15:00','15:30',
];

function nextDays(count = 5) {
  const days: Date[] = [];
  const today = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
}

function formatDay(d: Date) {
  return d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' }).replace('.', '');
}

export default function Agendamentos() {
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const days = useMemo(() => nextDays(7), []);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const filteredClinics = useMemo(() => {
    const q = query.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (!q) return CLINICS;
    const matches = (s: string) =>
      s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(q);
    return CLINICS.filter(c =>
      matches(c.name) || matches(c.address) || c.specialties.some(sp => matches(sp))
    );
  }, [query]);
  const handleBook = () => {
    if (!selectedClinic || !selectedSlot) {
      Alert.alert('Selecione', 'Escolha uma clínica, um dia e um horário.');
      return;
    }
    const d = days[selectedDayIndex];
    const dateStr = d.toLocaleDateString('pt-BR');
    Alert.alert(
      'Agendamento confirmado (demo)',
      `${selectedClinic.name}\n${selectedClinic.address}\n\nData: ${dateStr}\nHorário: ${selectedSlot}`
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <CalendarDays size={24} color="#A294F9" />
          <Text style={styles.title}>Agendamentos</Text>
          <Text style={styles.subtitle}>Escolha uma clínica e reserve um horário</Text>
        </View>

        {/* Lista de clínicas */}
        <View style={styles.card}>
          {/* Busca acima do título */}
          <View style={styles.searchWrapper}>
            <StyledInput
              style={styles.searchInput}
              placeholder="Buscar clínica, endereço ou especialidade"
              value={query}
              onChangeText={setQuery}
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="always"
            />
          </View>

          <View style={styles.cardHeader}>
            <Building2 size={20} color="#7C3AED" />
            <Text style={styles.cardTitle}>Clínicas Disponíveis</Text>
          </View>

          <View style={styles.clinicList}>
            {filteredClinics.map(c => (
              <TouchableOpacity
                key={c.id}
                style={[
                  styles.clinicItem,
                  selectedClinic?.id === c.id && styles.clinicItemSelected,
                ]}
                onPress={() => {
                  setSelectedClinic(c);
                  setSelectedSlot(null);
                }}
              >
                <View style={styles.clinicHeader}>
                  <Text style={styles.clinicName}>{c.name}</Text>
                  {typeof c.distanceKm === 'number' && (
                    <Text style={styles.clinicDistance}>{c.distanceKm.toFixed(1)} km</Text>
                  )}
                </View>
                <View style={styles.clinicRow}>
                  <MapPin size={16} color="#6B7280" />
                  <Text style={styles.clinicAddress}>{c.address}</Text>
                </View>
                <Text style={styles.clinicSpecs}>{c.specialties.join(' • ')}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Seleção de dia e horário */}
        {selectedClinic && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Clock size={20} color="#059669" />
              <Text style={styles.cardTitle}>Selecione dia e horário</Text>
            </View>

            <View style={styles.dayList}>
              {days.map((d, idx) => {
                const selected = idx === selectedDayIndex;
                return (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.dayChip, selected && styles.dayChipSelected]}
                    onPress={() => {
                      setSelectedDayIndex(idx);
                      setSelectedSlot(null);
                    }}
                  >
                    <Text style={[styles.dayChipText, selected && styles.dayChipTextSelected]}>
                      {formatDay(d)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.slotList}>
              {ALL_TIMESLOTS.map(t => {
                const selected = t === selectedSlot;
                return (
                  <TouchableOpacity
                    key={t}
                    style={[styles.slotChip, selected && styles.slotChipSelected]}
                    onPress={() => setSelectedSlot(t)}
                  >
                    <Text style={[styles.slotChipText, selected && styles.slotChipTextSelected]}>{t}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={[styles.bookButton, (!selectedSlot) && styles.bookButtonDisabled]}
              onPress={handleBook}
              disabled={!selectedSlot}
            >
              <Text style={styles.bookButtonText}>
                {selectedSlot ? 'Agendar' : 'Selecione um horário'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 16, paddingBottom: 32 },
  header: { alignItems: 'center', marginBottom: 16, gap: 6 },
  title: { fontSize: 22, fontWeight: '700', color: '#1E293B' },
  subtitle: { fontSize: 14, color: '#64748B', textAlign: 'center' },

  card: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#374151' },

  clinicList: { gap: 12 },
  clinicItem: {
    borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 12, gap: 6, backgroundColor: '#F8FAFC',
  },
  clinicItemSelected: { borderColor: '#A294F9', backgroundColor: '#EEF2FF' },
  clinicHeader: { flexDirection: 'row', alignItems: 'center' },
  clinicName: { flex: 1, fontSize: 16, fontWeight: '700', color: '#1E293B' },
  clinicDistance: { fontSize: 12, color: '#6B7280', fontWeight: '600' },
  clinicRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  clinicAddress: { fontSize: 13, color: '#6B7280', flex: 1 },
  clinicSpecs: { fontSize: 13, color: '#64748B' },

  dayList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  dayChip: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, backgroundColor: '#FFFFFF' },
  dayChipSelected: { borderColor: '#A294F9', backgroundColor: '#EEF2FF' },
  dayChipText: { color: '#334155', fontSize: 13, fontWeight: '500' },
  dayChipTextSelected: { color: '#6B21A8', fontWeight: '700' },

  slotList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  slotChip: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#FFFFFF' },
  slotChipSelected: { borderColor: '#A294F9', backgroundColor: '#EEF2FF' },
  slotChipText: { color: '#334155', fontSize: 13 },
  slotChipTextSelected: { color: '#6B21A8', fontWeight: '600' },

  bookButton: {
    backgroundColor: '#A294F9', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4,
  },
  bookButtonDisabled: { opacity: 0.7 },
  bookButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  searchWrapper: {
    marginBottom: 12,
  },
  searchInput: {
    fontSize: 16,
    color: '#1E293B',
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
});