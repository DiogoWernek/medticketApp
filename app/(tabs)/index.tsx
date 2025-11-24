import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useEffect, useState } from 'react';
import { Clock, MapPin, Users, Activity } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function Dashboard() {
  const [userName, setUserName] = useState('');
  const [currentNumber, setCurrentNumber] = useState(47);
  const [userPosition, setUserPosition] = useState(12);
  const [estimatedTime, setEstimatedTime] = useState(35);
  const [hospital, setHospital] = useState('Hospital Hospital Dr. Léo Orsi Bernardes');
  const router = useRouter();

  useEffect(() => {
    checkAuthAndLoadData();
    // Simulate real-time updates
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setCurrentNumber(prev => prev + 1);
        setUserPosition(prev => Math.max(1, prev - 1));
        setEstimatedTime(prev => Math.max(5, prev - 2));
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const checkAuthAndLoadData = async () => {
    try {
      const storedUserName = await AsyncStorage.getItem('userName');
      if (!storedUserName) {
        router.replace('/login');
        return;
      }
      setUserName(storedUserName);
    } catch (error) {
      console.error('Error checking auth:', error);
      router.replace('/login');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header with greeting */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Olá, {userName}!</Text>
          <Text style={styles.subtitle}>Como está se sentindo hoje?</Text>
        </View>

        {/* Current ticket number */}
        <View style={styles.ticketCard}>
          <View style={styles.ticketHeader}>
            <Activity size={24} color="#A294F9" strokeWidth={2} />
            <Text style={styles.ticketTitle}>Sua Senha</Text>
          </View>
          <Text style={styles.currentNumber}>A{String(currentNumber).padStart(3, '0')}</Text>
          <Text style={styles.ticketSubtext}>Número atual sendo atendido</Text>
        </View>

        {/* Queue info cards */}
        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Users size={20} color="#059669" strokeWidth={2} />
              <Text style={styles.infoTitle}>Posição na Fila</Text>
            </View>
            <Text style={styles.infoValue}>{userPosition}ª</Text>
            <Text style={styles.infoSubtext}>{userPosition - 1} pessoas à sua frente</Text>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Clock size={20} color="#DC2626" strokeWidth={2} />
              <Text style={styles.infoTitle}>Tempo Estimado</Text>
            </View>
            <Text style={styles.infoValue}>{estimatedTime} min</Text>
            <Text style={styles.infoSubtext}>Baseado no histórico</Text>
          </View>
        </View>

        {/* Hospital info */}
        <View style={styles.hospitalCard}>
          <View style={styles.hospitalHeader}>
            <MapPin size={20} color="#7C3AED" strokeWidth={2} />
            <Text style={styles.hospitalTitle}>Local do Atendimento</Text>
          </View>
          <Text style={styles.hospitalName}>{hospital}</Text>
          <Text style={styles.hospitalAddress}>Setor de Emergências - Ala A</Text>
        </View>

        {/* Status indicator */}
        <View style={styles.statusCard}>
          <View style={styles.statusIndicator}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>
              {userPosition <= 3 ? 'Prepare-se! Você será chamado em breve' : 
               userPosition <= 8 ? 'Aguardando atendimento' : 
               'Tempo de espera normal'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
    paddingTop: 16,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '400',
  },
  ticketCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
  },
  ticketHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ticketTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#A294F9',
    marginLeft: 8,
  },
  currentNumber: {
    fontSize: 48,
    fontWeight: '800',
    color: '#A294F9',
    marginBottom: 8,
  },
  ticketSubtext: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 6,
  },
  infoValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  infoSubtext: {
    fontSize: 12,
    color: '#6B7280',
  },
  hospitalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  hospitalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  hospitalTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 8,
  },
  hospitalName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  hospitalAddress: {
    fontSize: 14,
    color: '#64748B',
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    backgroundColor: '#059669',
    borderRadius: 6,
    marginRight: 12,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
    flex: 1,
  },
});