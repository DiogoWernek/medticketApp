import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { TrendingUp, Clock, Users, Calendar } from 'lucide-react-native';

export default function Estimates() {
  const queueData = [
    { position: 1, status: 'current', time: '0 min' },
    { position: 2, status: 'next', time: '8 min' },
    { position: 3, status: 'next', time: '16 min' },
    { position: 4, status: 'waiting', time: '24 min' },
    { position: 5, status: 'waiting', time: '32 min' },
    { position: 12, status: 'you', time: '35 min' },
  ];

  const averageStats = {
    avgWaitTime: 42,
    totalPeople: 28,
    avgServiceTime: 8,
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Estimativas da Fila</Text>
          <Text style={styles.subtitle}>Informações em tempo real</Text>
        </View>

        {/* Queue position visualization */}
        <View style={styles.queueCard}>
          <View style={styles.cardHeader}>
            <Users size={20} color="#A294F9" strokeWidth={2} />
            <Text style={styles.cardTitle}>Sua Posição na Fila</Text>
          </View>
          
          <View style={styles.queueVisualization}>
            {queueData.map((item, index) => (
              <View key={item.position} style={styles.queueItem}>
                <View style={[
                  styles.queueDot,
                  item.status === 'current' && styles.currentDot,
                  item.status === 'next' && styles.nextDot,
                  item.status === 'you' && styles.yourDot,
                  item.status === 'waiting' && styles.waitingDot,
                ]} />
                <View style={styles.queueInfo}>
                  <Text style={[
                    styles.queuePosition,
                    item.status === 'you' && styles.yourPosition
                  ]}>
                    {item.status === 'you' ? `${item.position}ª (Você)` : `${item.position}ª`}
                  </Text>
                  <Text style={styles.queueTime}>{item.time}</Text>
                </View>
                {index < queueData.length - 1 && item.position !== 5 && (
                  <View style={styles.queueLine} />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Statistics cards */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Clock size={18} color="#059669" strokeWidth={2} />
              <Text style={styles.statLabel}>Tempo Médio</Text>
            </View>
            <Text style={styles.statValue}>{averageStats.avgWaitTime} min</Text>
            <Text style={styles.statSubtext}>de espera total</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Users size={18} color="#DC2626" strokeWidth={2} />
              <Text style={styles.statLabel}>Total na Fila</Text>
            </View>
            <Text style={styles.statValue}>{averageStats.totalPeople}</Text>
            <Text style={styles.statSubtext}>pessoas aguardando</Text>
          </View>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <TrendingUp size={18} color="#7C3AED" strokeWidth={2} />
            <Text style={styles.statLabel}>Tempo por Atendimento</Text>
          </View>
          <Text style={styles.statValue}>{averageStats.avgServiceTime} min</Text>
          <Text style={styles.statSubtext}>média de consulta</Text>
        </View>

        {/* Time prediction */}
        <View style={styles.predictionCard}>
          <View style={styles.cardHeader}>
            <Calendar size={20} color="#F59E0B" strokeWidth={2} />
            <Text style={styles.cardTitle}>Previsão de Atendimento</Text>
          </View>
          
          <View style={styles.predictionContent}>
            <Text style={styles.predictionText}>
              Baseado no fluxo atual, você deve ser atendido às:
            </Text>
            <Text style={styles.predictionTime}>14:35</Text>
            <Text style={styles.predictionSubtext}>
              ± 10 minutos de variação
            </Text>
          </View>
        </View>

        {/* Tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Dicas</Text>
          <Text style={styles.tipsText}>
            • Mantenha-se próximo à recepção{'\n'}
            • Tenha seus documentos em mãos{'\n'}
            • Informe condições especiais na configuração
          </Text>
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  queueCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginLeft: 8,
  },
  queueVisualization: {
    paddingLeft: 12,
  },
  queueItem: {
    position: 'relative',
    marginBottom: 16,
  },
  queueDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: 'absolute',
    left: 0,
    top: 4,
  },
  currentDot: {
    backgroundColor: '#059669',
  },
  nextDot: {
    backgroundColor: '#F59E0B',
  },
  yourDot: {
    backgroundColor: '#A294F9',
    width: 16,
    height: 16,
    borderRadius: 8,
    top: 2,
  },
  waitingDot: {
    backgroundColor: '#6B7280',
  },
  queueInfo: {
    marginLeft: 24,
  },
  queuePosition: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 2,
  },
  yourPosition: {
    color: '#A294F9',
    fontWeight: '600',
  },
  queueTime: {
    fontSize: 14,
    color: '#64748B',
  },
  queueLine: {
    position: 'absolute',
    left: 5.5,
    top: 16,
    width: 1,
    height: 20,
    backgroundColor: '#E5E7EB',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
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
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 6,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  statSubtext: {
    fontSize: 12,
    color: '#6B7280',
  },
  predictionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBlock: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  predictionContent: {
    alignItems: 'center',
    paddingTop: 8,
  },
  predictionText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 12,
  },
  predictionTime: {
    fontSize: 32,
    fontWeight: '700',
    color: '#F59E0B',
    marginBottom: 4,
  },
  predictionSubtext: {
    fontSize: 12,
    color: '#6B7280',
  },
  tipsCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 14,
    color: '#78350F',
    lineHeight: 20,
  },
});