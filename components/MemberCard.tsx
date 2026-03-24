import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FamilyMember } from '../lib/types';

interface Props {
  member: FamilyMember;
  isCurrentUser?: boolean;
  onPress?: () => void;
}

function getTimeAgo(timestamp?: number): string {
  if (!timestamp) return '위치 없음';
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  return `${Math.floor(hours / 24)}일 전`;
}

export default function MemberCard({ member, isCurrentUser, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.avatar, { backgroundColor: member.color }]}>
        <Text style={styles.avatarText}>{member.name.charAt(0).toUpperCase()}</Text>
        <View style={[styles.statusDot, { backgroundColor: member.isOnline ? '#2ECC71' : '#ccc' }]} />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>
          {member.name} {isCurrentUser && <Text style={styles.meTag}>(나)</Text>}
        </Text>
        <Text style={styles.time}>
          {member.location
            ? `📍 ${getTimeAgo(member.location.timestamp)}`
            : '📍 위치 정보 없음'}
        </Text>
      </View>
      {member.isOnline && (
        <View style={styles.onlineBadge}>
          <Text style={styles.onlineText}>온라인</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statusDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  meTag: {
    fontSize: 13,
    color: '#888',
    fontWeight: '400',
  },
  time: {
    fontSize: 13,
    color: '#888',
    marginTop: 3,
  },
  onlineBadge: {
    backgroundColor: '#E8F8F0',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  onlineText: {
    color: '#2ECC71',
    fontSize: 12,
    fontWeight: '600',
  },
});
