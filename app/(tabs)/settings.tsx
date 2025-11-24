import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { User, Heart, LogOut, CreditCard as Edit, Check, X } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

interface UserData {
  name: string;
  email: string;
  phone: string;
  cpf: string;
}

interface MedicalCondition {
  id: string;
  name: string;
  active: boolean;
}

export default function Settings() {
  const [userName, setUserName] = useState('');
  const [userData, setUserData] = useState<UserData>({
    name: '',
    email: '',
    phone: '',
    cpf: '',
  });
  const [editingProfile, setEditingProfile] = useState(false);
  const [medicalConditions, setMedicalConditions] = useState<MedicalCondition[]>([
    { id: '1', name: 'Diabetes', active: false },
    { id: '2', name: 'Hipertensão', active: false },
    { id: '3', name: 'Asma', active: false },
    { id: '4', name: 'Problemas Cardíacos', active: false },
    { id: '5', name: 'Alergias Medicamentosas', active: false },
    { id: '6', name: 'Gravidez', active: false },
  ]);
  const router = useRouter();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const storedUserName = await AsyncStorage.getItem('userName');
      if (storedUserName) {
        setUserName(storedUserName);
        setUserData(prev => ({ ...prev, name: storedUserName }));
      }
      
      // Load mock user data (in real app, this would come from API)
      setUserData({
        name: storedUserName || '',
        email: 'usuario@email.com',
        phone: '(11) 99999-9999',
        cpf: '***.***.***-**',
      });

      // Load medical conditions from storage
      const storedConditions = await AsyncStorage.getItem('medicalConditions');
      if (storedConditions) {
        setMedicalConditions(JSON.parse(storedConditions));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const saveMedicalConditions = async (updatedConditions: MedicalCondition[]) => {
    try {
      await AsyncStorage.setItem('medicalConditions', JSON.stringify(updatedConditions));
      setMedicalConditions(updatedConditions);
      
      const activeConditions = updatedConditions.filter(c => c.active);
      if (activeConditions.length > 0) {
        Alert.alert(
          'Condições Médicas Atualizadas',
          'Suas condições pré-existentes foram salvas e podem ajudar na priorização do seu atendimento.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error saving medical conditions:', error);
      Alert.alert('Erro', 'Não foi possível salvar as informações.');
    }
  };

  const toggleMedicalCondition = (id: string) => {
    const updatedConditions = medicalConditions.map(condition =>
      condition.id === id ? { ...condition, active: !condition.active } : condition
    );
    saveMedicalConditions(updatedConditions);
  };

  const saveProfile = () => {
    setEditingProfile(false);
    Alert.alert('Perfil Atualizado', 'Suas informações foram salvas com sucesso!');
  };

  const logout = async () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('userName');
              router.replace('/login');
            } catch (error) {
              console.error('Error during logout:', error);
            }
          },
        },
      ]
    );
  };

  const activeConditionsCount = medicalConditions.filter(c => c.active).length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Configurações</Text>
          <Text style={styles.subtitle}>Gerencie seu perfil e preferências</Text>
        </View>

        {/* Profile section */}
        <View style={styles.profileCard}>
          <View style={styles.cardHeader}>
            <User size={20} color="#A294F9" strokeWidth={2} />
            <Text style={styles.cardTitle}>Dados Pessoais</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setEditingProfile(!editingProfile)}
            >
              {editingProfile ? (
                <Check size={18} color="#059669" strokeWidth={2} />
              ) : (
                <Edit size={18} color="#6B7280" strokeWidth={2} />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.profileForm}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nome Completo</Text>
              {editingProfile ? (
                <TextInput
                  style={styles.textInput}
                  value={userData.name}
                  onChangeText={(text) => setUserData(prev => ({ ...prev, name: text }))}
                  placeholder="Seu nome completo"
                />
              ) : (
                <Text style={styles.inputValue}>{userData.name}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>E-mail</Text>
              {editingProfile ? (
                <TextInput
                  style={styles.textInput}
                  value={userData.email}
                  onChangeText={(text) => setUserData(prev => ({ ...prev, email: text }))}
                  placeholder="seu@email.com"
                  keyboardType="email-address"
                />
              ) : (
                <Text style={styles.inputValue}>{userData.email}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Telefone</Text>
              {editingProfile ? (
                <TextInput
                  style={styles.textInput}
                  value={userData.phone}
                  onChangeText={(text) => setUserData(prev => ({ ...prev, phone: text }))}
                  placeholder="(11) 99999-9999"
                  keyboardType="phone-pad"
                />
              ) : (
                <Text style={styles.inputValue}>{userData.phone}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>CPF</Text>
              <Text style={styles.inputValue}>{userData.cpf}</Text>
            </View>

            {editingProfile && (
              <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
                <Check size={16} color="#FFFFFF" strokeWidth={2} />
                <Text style={styles.saveButtonText}>Salvar Alterações</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Medical conditions section */}
        <View style={styles.medicalCard}>
          <View style={styles.cardHeader}>
            <Heart size={20} color="#DC2626" strokeWidth={2} />
            <View style={styles.medicalTitleContainer}>
              <Text style={styles.cardTitle}>Condições Pré-existentes</Text>
              {activeConditionsCount > 0 && (
                <View style={styles.conditionsBadge}>
                  <Text style={styles.conditionsBadgeText}>{activeConditionsCount}</Text>
                </View>
              )}
            </View>
          </View>

          <Text style={styles.medicalDescription}>
            Informe suas condições médicas para receber atendimento prioritário quando necessário.
          </Text>

          <View style={styles.conditionsList}>
            {medicalConditions.map((condition) => (
              <TouchableOpacity
                key={condition.id}
                style={[
                  styles.conditionItem,
                  condition.active && styles.conditionItemActive
                ]}
                onPress={() => toggleMedicalCondition(condition.id)}
              >
                <View style={[
                  styles.conditionCheckbox,
                  condition.active && styles.conditionCheckboxActive
                ]}>
                  {condition.active && (
                    <Check size={14} color="#FFFFFF" strokeWidth={2} />
                  )}
                </View>
                <Text style={[
                  styles.conditionText,
                  condition.active && styles.conditionTextActive
                ]}>
                  {condition.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Logout button */}
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <LogOut size={18} color="#DC2626" strokeWidth={2} />
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>
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
  profileCard: {
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
    flex: 1,
  },
  editButton: {
    padding: 8,
  },
  profileForm: {
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  inputValue: {
    fontSize: 16,
    color: '#1E293B',
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
  },
  textInput: {
    fontSize: 16,
    color: '#1E293B',
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    gap: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  medicalCard: {
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
  medicalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 8,
  },
  conditionsBadge: {
    backgroundColor: '#DC2626',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  conditionsBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  medicalDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 20,
  },
  conditionsList: {
    gap: 12,
  },
  conditionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  conditionItemActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#A294F9',
  },
  conditionCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  conditionCheckboxActive: {
    backgroundColor: '#A294F9',
    borderColor: '#A294F9',
  },
  conditionText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  conditionTextActive: {
    color: '#A294F9',
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    gap: 8,
  },
  logoutText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '600',
  },
});