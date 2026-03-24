export interface FamilyMember {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  location?: {
    latitude: number;
    longitude: number;
    timestamp: number;
    accuracy?: number;
  };
  isOnline: boolean;
  familyId?: string;
  color: string; // 지도 마커 색상
}

export interface Family {
  id: string;
  name: string;
  members: Record<string, boolean>;
  createdBy: string;
  inviteCode: string;
}
