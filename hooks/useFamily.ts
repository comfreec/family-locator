import { useState, useEffect } from 'react';
import { ref, onValue, set, get, push, update } from 'firebase/database';
import { db } from '../lib/firebase';
import { FamilyMember, Family } from '../lib/types';

function generateInviteCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function useFamily(uid: string | null) {
  const [family, setFamily] = useState<Family | null>(null);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }

    // 사용자의 familyId 감시
    const userRef = ref(db, `users/${uid}/familyId`);
    const unsubUser = onValue(userRef, (snap) => {
      const familyId = snap.val();
      if (!familyId) {
        setFamily(null);
        setMembers([]);
        setLoading(false);
        return;
      }

      // 가족 정보 감시
      const familyRef = ref(db, `families/${familyId}`);
      const unsubFamily = onValue(familyRef, (fSnap) => {
        const familyData = fSnap.val();
        if (!familyData) return;
        setFamily({ id: familyId, ...familyData });

        // 멤버 위치 실시간 감시
        const memberIds = Object.keys(familyData.members || {});
        const memberList: FamilyMember[] = [];
        let loaded = 0;

        if (memberIds.length === 0) {
          setMembers([]);
          setLoading(false);
          return;
        }

        memberIds.forEach((memberId) => {
          const memberRef = ref(db, `users/${memberId}`);
          onValue(memberRef, (mSnap) => {
            const memberData = mSnap.val();
            if (memberData) {
              const idx = memberList.findIndex((m) => m.uid === memberId);
              if (idx >= 0) {
                memberList[idx] = memberData;
              } else {
                memberList.push(memberData);
              }
              setMembers([...memberList]);
            }
            loaded++;
            if (loaded === memberIds.length) setLoading(false);
          });
        });
      });

      return () => unsubFamily();
    });

    return () => unsubUser();
  }, [uid]);

  const createFamily = async (familyName: string) => {
    if (!uid) return;
    const inviteCode = generateInviteCode();
    const newFamilyRef = push(ref(db, 'families'));
    const familyId = newFamilyRef.key!;

    await set(newFamilyRef, {
      name: familyName,
      createdBy: uid,
      inviteCode,
      members: { [uid]: true },
    });

    await update(ref(db, `users/${uid}`), { familyId });
    // inviteCode를 역방향 조회용으로 저장
    await set(ref(db, `inviteCodes/${inviteCode}`), familyId);
  };

  const joinFamily = async (inviteCode: string) => {
    if (!uid) return;
    const codeSnap = await get(ref(db, `inviteCodes/${inviteCode.toUpperCase()}`));
    if (!codeSnap.exists()) throw new Error('유효하지 않은 초대 코드입니다.');

    const familyId = codeSnap.val();
    await update(ref(db, `families/${familyId}/members`), { [uid]: true });
    await update(ref(db, `users/${uid}`), { familyId });
  };

  const leaveFamily = async () => {
    if (!uid || !family) return;
    await update(ref(db, `families/${family.id}/members`), { [uid]: null });
    await update(ref(db, `users/${uid}`), { familyId: null });
  };

  return { family, members, loading, createFamily, joinFamily, leaveFamily };
}
