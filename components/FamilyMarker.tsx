import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Marker, Callout } from 'react-native-maps';
import { FamilyMember } from '../lib/types';

interface Props {
  member: FamilyMember;
  isCurrentUser?: boolean;
}

function getTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  return `${Math.floor(hours / 24)}일 전`;
}

export default function FamilyMarker({ member, isCurrentUser }: Props) {
  if (!member.location) return null;

  return (
    <Marker
      coordinate={{
        latitude: member.location.latitude,
        longitude: member.location.longitude,
      }}
      anchor={{ x: 0.5, y: 1 }}
    >
      <View style={styles.markerContainer}>
        <View style={[styles.bubble, { backgroundColor: member.color }]}>
          <Text style={styles.initial}>
            {member.name.charAt(0).toUpperCase()}
          </Text>
          {isCurrentUser && <View style={styles.selfDot} />}
        </View>
        <View style={[styles.arrow, { borderTopColor: member.color }]} />
        <Text style={styles.nameLabel}>{isCurrentUser ? '나' : member.name}</Text>
      </View>

      <Callout tooltip>
        <View style={styles.callout}>
          <Text style={styles.calloutName}>{member.name}</Text>
          <Text style={styles.calloutTime}>
            {getTimeAgo(member.location.timestamp)}
          </Text>
          {member.isOnline && (
            <View style={styles.onlineBadge}>
              <Text style={styles.onlineText}>온라인</Text>
            </View>
          )}
        </View>
      </Callout>
    </Marker>
  );
}

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
  },
  bubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  initial: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  selfDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2ECC71',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  arrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -1,
  },
  nameLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 8,
    marginTop: 2,
    overflow: 'hidden',
  },
  callout: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    alignItems: 'center',
  },
  calloutName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  calloutTime: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  onlineBadge: {
    marginTop: 6,
    backgroundColor: '#2ECC71',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  onlineText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
});
