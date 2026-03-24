import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Alert, ScrollView,
} from 'react-native';
import { useAuthContext } from '../../context/AuthContext';

export default function SettingsScreen() {
  const { user, logout } = useAuthContext();

  const handleLogout = () => {
    Alert.alert('로그아웃', '정말 로그아웃 하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      { text: '로그아웃', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>설정</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* 프로필 카드 */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.displayName?.charAt(0).toUpperCase() ?? '?'}
            </Text>
          </View>
          <View>
            <Text style={styles.profileName}>{user?.displayName ?? '이름 없음'}</Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
          </View>
        </View>

        {/* 앱 정보 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>앱 정보</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>버전</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>위치 업데이트</Text>
            <Text style={styles.infoValue}>5m 이동 시 / 10초 간격</Text>
          </View>
        </View>

        {/* 개인정보 안내 */}
        <View style={styles.privacyCard}>
          <Text style={styles.privacyTitle}>🔒 개인정보 보호</Text>
          <Text style={styles.privacyText}>
            위치 정보는 같은 가족 그룹 구성원에게만 공유됩니다.
            Firebase Realtime Database에 암호화되어 저장됩니다.
          </Text>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>로그아웃</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F6FF' },
  header: {
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1A1A2E' },
  content: { flex: 1, padding: 16 },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  profileName: { fontSize: 18, fontWeight: '700', color: '#1A1A2E' },
  profileEmail: { fontSize: 14, color: '#888', marginTop: 2 },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#888', marginBottom: 12, textTransform: 'uppercase' },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoLabel: { fontSize: 15, color: '#333' },
  infoValue: { fontSize: 15, color: '#888' },
  privacyCard: {
    backgroundColor: '#E8F4FD',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  privacyTitle: { fontSize: 15, fontWeight: '700', color: '#1A1A2E', marginBottom: 8 },
  privacyText: { fontSize: 13, color: '#555', lineHeight: 20 },
  logoutBtn: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FF6B6B',
    marginBottom: 32,
  },
  logoutText: { color: '#FF6B6B', fontSize: 16, fontWeight: '700' },
});
