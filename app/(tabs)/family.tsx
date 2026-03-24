import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, Alert, ScrollView, ActivityIndicator,
  Share, Modal,
} from 'react-native';
import { useAuthContext } from '../../context/AuthContext';
import { useFamily } from '../../hooks/useFamily';
import MemberCard from '../../components/MemberCard';

export default function FamilyScreen() {
  const { user } = useAuthContext();
  const { family, members, loading, createFamily, joinFamily, leaveFamily } = useFamily(user?.uid ?? null);
  const [familyName, setFamilyName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  const handleCreate = async () => {
    if (!familyName.trim()) {
      Alert.alert('오류', '가족 그룹 이름을 입력해주세요.');
      return;
    }
    setCreating(true);
    try {
      await createFamily(familyName.trim());
      setShowCreateModal(false);
      setFamilyName('');
    } catch (e: any) {
      Alert.alert('오류', e.message);
    } finally {
      setCreating(false);
    }
  };

  const handleJoin = async () => {
    if (!inviteCode.trim()) {
      Alert.alert('오류', '초대 코드를 입력해주세요.');
      return;
    }
    setJoining(true);
    try {
      await joinFamily(inviteCode.trim());
      setShowJoinModal(false);
      setInviteCode('');
    } catch (e: any) {
      Alert.alert('오류', e.message);
    } finally {
      setJoining(false);
    }
  };

  const handleShareInvite = async () => {
    if (!family) return;
    await Share.share({
      message: `가족 위치 공유 앱에 초대합니다!\n\n그룹명: ${family.name}\n초대 코드: ${family.inviteCode}\n\n앱을 설치하고 위 코드로 참여하세요 📍`,
    });
  };

  const handleLeave = () => {
    Alert.alert(
      '그룹 나가기',
      '정말 가족 그룹에서 나가시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '나가기',
          style: 'destructive',
          onPress: leaveFamily,
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  // 가족 그룹 없음
  if (!family) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>가족 그룹</Text>
        </View>
        <View style={styles.noFamilyContent}>
          <Text style={styles.noFamilyEmoji}>👨‍👩‍👧‍👦</Text>
          <Text style={styles.noFamilyTitle}>아직 가족 그룹이 없어요</Text>
          <Text style={styles.noFamilySubtitle}>새 그룹을 만들거나 초대 코드로 참여하세요</Text>

          <TouchableOpacity style={styles.primaryBtn} onPress={() => setShowCreateModal(true)}>
            <Text style={styles.primaryBtnText}>+ 새 그룹 만들기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} onPress={() => setShowJoinModal(true)}>
            <Text style={styles.secondaryBtnText}>초대 코드로 참여하기</Text>
          </TouchableOpacity>
        </View>

        {/* 그룹 만들기 모달 */}
        <Modal visible={showCreateModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modal}>
              <Text style={styles.modalTitle}>새 가족 그룹 만들기</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="그룹 이름 (예: 우리 가족)"
                value={familyName}
                onChangeText={setFamilyName}
                placeholderTextColor="#aaa"
              />
              <TouchableOpacity
                style={[styles.primaryBtn, creating && { opacity: 0.7 }]}
                onPress={handleCreate}
                disabled={creating}
              >
                {creating ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>만들기</Text>}
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowCreateModal(false)}>
                <Text style={styles.cancelBtnText}>취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* 참여 모달 */}
        <Modal visible={showJoinModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modal}>
              <Text style={styles.modalTitle}>초대 코드로 참여</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="초대 코드 6자리"
                value={inviteCode}
                onChangeText={setInviteCode}
                autoCapitalize="characters"
                maxLength={6}
                placeholderTextColor="#aaa"
              />
              <TouchableOpacity
                style={[styles.primaryBtn, joining && { opacity: 0.7 }]}
                onPress={handleJoin}
                disabled={joining}
              >
                {joining ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>참여하기</Text>}
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowJoinModal(false)}>
                <Text style={styles.cancelBtnText}>취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  // 가족 그룹 있음
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{family.name}</Text>
        <Text style={styles.memberCountText}>{members.length}명</Text>
      </View>

      {/* 초대 코드 카드 */}
      <View style={styles.inviteCard}>
        <View>
          <Text style={styles.inviteLabel}>초대 코드</Text>
          <Text style={styles.inviteCode}>{family.inviteCode}</Text>
        </View>
        <TouchableOpacity style={styles.shareBtn} onPress={handleShareInvite}>
          <Text style={styles.shareBtnText}>공유 📤</Text>
        </TouchableOpacity>
      </View>

      {/* 멤버 목록 */}
      <ScrollView style={styles.memberList} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>가족 구성원</Text>
        {members.map((member) => (
          <MemberCard
            key={member.uid}
            member={member}
            isCurrentUser={member.uid === user?.uid}
          />
        ))}

        <TouchableOpacity style={styles.leaveBtn} onPress={handleLeave}>
          <Text style={styles.leaveBtnText}>그룹 나가기</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F6FF' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  memberCountText: { fontSize: 14, color: '#4A90E2', fontWeight: '600' },
  noFamilyContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 12,
  },
  noFamilyEmoji: { fontSize: 72, marginBottom: 8 },
  noFamilyTitle: { fontSize: 20, fontWeight: 'bold', color: '#1A1A2E' },
  noFamilySubtitle: { fontSize: 15, color: '#666', textAlign: 'center', marginBottom: 16 },
  primaryBtn: {
    backgroundColor: '#4A90E2',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  secondaryBtn: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    width: '100%',
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  secondaryBtnText: { color: '#4A90E2', fontSize: 16, fontWeight: '700' },
  inviteCard: {
    margin: 16,
    backgroundColor: '#4A90E2',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inviteLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginBottom: 4 },
  inviteCode: { color: '#fff', fontSize: 28, fontWeight: 'bold', letterSpacing: 4 },
  shareBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  shareBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  memberList: { flex: 1, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A2E', marginBottom: 12, marginTop: 4 },
  leaveBtn: {
    marginTop: 16,
    marginBottom: 32,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#FF6B6B',
    alignItems: 'center',
  },
  leaveBtnText: { color: '#FF6B6B', fontSize: 15, fontWeight: '600' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    gap: 12,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#1A1A2E', marginBottom: 8 },
  modalInput: {
    backgroundColor: '#F0F6FF',
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    color: '#333',
  },
  cancelBtn: { padding: 14, alignItems: 'center' },
  cancelBtnText: { color: '#888', fontSize: 15 },
});
